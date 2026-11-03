import { prisma } from '../prisma/client';
import { AppError } from '../utils/AppError';
import { CartService } from './cart.service';

export interface CreateOrderInput {
  userId?: string;
  items: { productId: string; quantity: number }[];
  shippingAddress: {
    fullName: string;
    street: string;
    city: string;
    state: string;
    postalCode: string;
    country: string;
    phone: string;
  };
  idempotencyKey?: string;
}

export class OrderService {
  public static async createOrder(data: CreateOrderInput) {
    if (!data.items || data.items.length === 0) {
      throw new AppError('Order cannot be empty', 400, 'EMPTY_ORDER');
    }

    // Check idempotency if key provided
    if (data.idempotencyKey) {
      const existing = await prisma.order.findUnique({
        where: { idempotencyKey: data.idempotencyKey },
        include: { items: true },
      });
      if (existing) return existing;
    }

    // 1. Fetch current product prices and verify stock
    const productIds = data.items.map((i) => i.productId);
    const products = await prisma.product.findMany({
      where: { id: { in: productIds }, isActive: true },
    });

    if (products.length !== productIds.length) {
      throw new AppError('One or more selected products are unavailable.', 400, 'UNAVAILABLE_PRODUCTS');
    }

    const productMap = new Map(products.map((p) => [p.id, p]));

    let subtotalCents = 0;
    const orderItemsData = data.items.map((item) => {
      const prod = productMap.get(item.productId)!;
      if (prod.stock < item.quantity) {
        throw new AppError(`Insufficient stock for ${prod.name}. Only ${prod.stock} left.`, 400, 'OUT_OF_STOCK');
      }
      const itemTotal = prod.priceCents * item.quantity;
      subtotalCents += itemTotal;
      return {
        productId: prod.id,
        productName: prod.name,
        priceCents: prod.priceCents,
        quantity: item.quantity,
      };
    });

    const shippingCents = subtotalCents >= 99900 ? 0 : 9900; // Free shipping over ₹999, else ₹99
    const totalCents = subtotalCents + shippingCents;
    const orderNumber = `GN-${Date.now().toString(36).toUpperCase()}-${Math.floor(1000 + Math.random() * 9000)}`;

    // Execute in transaction: decrement stock and create order
    const order = await prisma.$transaction(async (tx) => {
      for (const item of data.items) {
        await tx.product.update({
          where: { id: item.productId },
          data: { stock: { decrement: item.quantity } },
        });
      }

      const createdOrder = await tx.order.create({
        data: {
          orderNumber,
          userId: data.userId || null,
          status: 'confirmed',
          subtotalCents,
          shippingCents,
          totalCents,
          currency: 'INR',
          paymentMode: 'demo',
          shippingAddress: JSON.stringify(data.shippingAddress),
          idempotencyKey: data.idempotencyKey || null,
          items: {
            create: orderItemsData,
          },
        },
        include: { items: true },
      });

      return createdOrder;
    });

    // Clear cart if logged in
    if (data.userId) {
      await CartService.clearCart(data.userId).catch(() => {});
    }

    return order;
  }

  public static async getUserOrders(userId: string) {
    const orders = await prisma.order.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      include: { items: true },
    });

    return orders.map((o) => ({
      ...o,
      shippingAddress: JSON.parse(o.shippingAddress),
    }));
  }

  public static async getOrderById(orderId: string, userId?: string) {
    const order = await prisma.order.findUnique({
      where: { id: orderId },
      include: { items: true },
    });

    if (!order) throw new AppError('Order not found', 404, 'NOT_FOUND');
    if (order.userId && userId && order.userId !== userId) {
      throw new AppError('Forbidden', 403, 'FORBIDDEN');
    }

    return {
      ...order,
      shippingAddress: JSON.parse(order.shippingAddress),
    };
  }
}

