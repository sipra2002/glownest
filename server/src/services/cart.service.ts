import { prisma } from '../prisma/client';
import { AppError } from '../utils/AppError';

export class CartService {
  public static async getCart(userId: string) {
    let cart = await prisma.cart.findUnique({
      where: { userId },
      include: {
        items: {
          include: {
            product: {
              include: { category: true },
            },
          },
        },
      },
    });

    if (!cart) {
      cart = await prisma.cart.create({
        data: { userId },
        include: {
          items: {
            include: {
              product: {
                include: { category: true },
              },
            },
          },
        },
      });
    }

    const formattedItems = cart.items.map((item) => {
      let images: string[] = [];
      try {
        images = JSON.parse(item.product.imageUrls);
      } catch {
        images = [item.product.imageUrls];
      }

      return {
        id: item.id,
        productId: item.productId,
        quantity: item.quantity,
        product: {
          id: item.product.id,
          name: item.product.name,
          slug: item.product.slug,
          brand: item.product.brand,
          priceCents: item.product.priceCents,
          currency: item.product.currency,
          imageUrls: images,
          stock: item.product.stock,
        },
      };
    });

    const subtotalCents = formattedItems.reduce(
      (sum, item) => sum + item.product.priceCents * item.quantity,
      0
    );

    return {
      id: cart.id,
      items: formattedItems,
      subtotalCents,
      itemCount: formattedItems.reduce((sum, item) => sum + item.quantity, 0),
    };
  }

  public static async addItem(userId: string, productId: string, quantity = 1) {
    const product = await prisma.product.findUnique({ where: { id: productId } });
    if (!product || !product.isActive) {
      throw new AppError('Product not found or inactive', 404, 'NOT_FOUND');
    }

    let cart = await prisma.cart.findUnique({ where: { userId } });
    if (!cart) {
      cart = await prisma.cart.create({ data: { userId } });
    }

    const existing = await prisma.cartItem.findUnique({
      where: {
        cartId_productId: {
          cartId: cart.id,
          productId,
        },
      },
    });

    if (existing) {
      await prisma.cartItem.update({
        where: { id: existing.id },
        data: { quantity: existing.quantity + quantity },
      });
    } else {
      await prisma.cartItem.create({
        data: {
          cartId: cart.id,
          productId,
          quantity,
        },
      });
    }

    return this.getCart(userId);
  }

  public static async updateItem(userId: string, itemId: string, quantity: number) {
    const cart = await prisma.cart.findUnique({ where: { userId } });
    if (!cart) throw new AppError('Cart not found', 404, 'NOT_FOUND');

    const item = await prisma.cartItem.findUnique({ where: { id: itemId } });
    if (!item || item.cartId !== cart.id) {
      throw new AppError('Cart item not found', 404, 'NOT_FOUND');
    }

    if (quantity <= 0) {
      await prisma.cartItem.delete({ where: { id: itemId } });
    } else {
      await prisma.cartItem.update({
        where: { id: itemId },
        data: { quantity },
      });
    }

    return this.getCart(userId);
  }

  public static async removeItem(userId: string, itemId: string) {
    return this.updateItem(userId, itemId, 0);
  }

  public static async mergeCart(userId: string, guestItems: { productId: string; quantity: number }[]) {
    for (const item of guestItems) {
      await this.addItem(userId, item.productId, item.quantity);
    }
    return this.getCart(userId);
  }

  public static async clearCart(userId: string) {
    const cart = await prisma.cart.findUnique({ where: { userId } });
    if (cart) {
      await prisma.cartItem.deleteMany({ where: { cartId: cart.id } });
    }
  }
}

