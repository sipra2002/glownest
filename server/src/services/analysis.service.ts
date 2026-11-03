import path from 'path';
import fs from 'fs';
import crypto from 'crypto';
import sharp from 'sharp';
import { prisma } from '../prisma/client';
import { AppError } from '../utils/AppError';
import { analysisPipeline, AnalysisPipeline } from '../analysis/pipeline';
import { generateRoutineRecommendation } from '../analysis/recommend';
import { ConcernType, DISCLAIMER_TEXT, DISCLAIMER_VERSION, SkinType } from '../config/constants';
import { env } from '../config/env';

export class AnalysisService {
  public static async analyzeImage(data: {
    userId?: string;
    fileBuffer: Buffer;
    mimeType: string;
    selectedConcerns: ConcernType[];
    retention?: 'delete_after_analysis' | 'keep_for_progress';
  }) {
    // 1. Sanitize image with sharp (strips metadata by default)
    let sanitizedBuffer: Buffer;
    try {
      sanitizedBuffer = await sharp(data.fileBuffer)
        .rotate() // auto-orient based on EXIF before stripping
        .toBuffer();
    } catch {
      throw new AppError('Failed to process image. File may be corrupted or invalid.', 400, 'CORRUPT_IMAGE');
    }

    const sha256 = crypto.createHash('sha256').update(sanitizedBuffer).digest('hex');
    const storageKey = `img_${Date.now()}_${sha256.substring(0, 8)}.jpg`;
    const retention = data.retention || 'delete_after_analysis';

    let storedPath: string | null = null;
    if (retention === 'keep_for_progress') {
      storedPath = path.join(env.UPLOAD_DIR, storageKey);
      await fs.promises.writeFile(storedPath, sanitizedBuffer);
    }

    // 2. Run Analysis Pipeline (Demo Provider in Phase 1)
    const result = await analysisPipeline.run({
      imageBuffer: sanitizedBuffer,
      mimeType: data.mimeType,
      selectedConcerns: data.selectedConcerns,
    });

    // 3. Save UploadedImage record if keeping
    let uploadedImageId: string | undefined;
    if (retention === 'keep_for_progress' && data.userId) {
      const uploadedImage = await prisma.uploadedImage.create({
        data: {
          userId: data.userId,
          storageKey,
          filename: storageKey,
          mime: 'image/jpeg',
          sizeBytes: sanitizedBuffer.length,
          sha256,
          retention,
        },
      });
      uploadedImageId = uploadedImage.id;
    }

    // 4. Save SkinAnalysis
    const highConcerns = result.estimates
      .filter((e) => e.score >= 50)
      .map((e) => e.concern);

    const routineDefinitions = await generateRoutineRecommendation(result.skinTypeEstimate, highConcerns);

    const analysis = await prisma.skinAnalysis.create({
      data: {
        userId: data.userId || null,
        source: 'image',
        mode: result.mode,
        provider: result.provider,
        imageId: uploadedImageId || null,
        selectedConcerns: JSON.stringify(data.selectedConcerns),
        skinTypeEstimate: result.skinTypeEstimate,
        summary: result.summary,
        disclaimerVersion: DISCLAIMER_VERSION,
        status: 'completed',
        scores: {
          create: result.estimates.map((est) => ({
            concern: est.concern,
            score: est.score,
            severity: AnalysisPipeline.classifySeverity(est.score),
            note: est.note,
          })),
        },
        routine: {
          create: {
            userId: data.userId || null,
            title: `Custom Routine for ${result.skinTypeEstimate.toUpperCase()} Skin`,
            steps: {
              create: routineDefinitions.map((step) => ({
                period: step.period,
                stepOrder: step.stepOrder,
                stepType: step.stepType,
                instructions: step.instructions,
                productId: step.product?.id || null,
              })),
            },
          },
        },
      },
      include: {
        scores: true,
        routine: {
          include: {
            steps: {
              include: {
                product: {
                  include: {
                    category: true,
                    ingredients: true,
                  },
                },
              },
            },
          },
        },
      },
    });

    return this.formatAnalysisReport(analysis);
  }

  public static async analyzeQuiz(data: {
    userId?: string;
    quizAnswers: Record<string, any>;
    selectedConcerns: ConcernType[];
  }) {
    const result = await analysisPipeline.run({
      quizAnswers: data.quizAnswers,
      selectedConcerns: data.selectedConcerns,
    });

    const highConcerns = result.estimates
      .filter((e) => e.score >= 50)
      .map((e) => e.concern);

    const routineDefinitions = await generateRoutineRecommendation(result.skinTypeEstimate, highConcerns);

    const analysis = await prisma.skinAnalysis.create({
      data: {
        userId: data.userId || null,
        source: 'quiz',
        mode: result.mode,
        provider: result.provider,
        selectedConcerns: JSON.stringify(data.selectedConcerns),
        skinTypeEstimate: result.skinTypeEstimate,
        summary: result.summary,
        disclaimerVersion: DISCLAIMER_VERSION,
        status: 'completed',
        quizResponse: {
          create: {
            answers: JSON.stringify(data.quizAnswers),
          },
        },
        scores: {
          create: result.estimates.map((est) => ({
            concern: est.concern,
            score: est.score,
            severity: AnalysisPipeline.classifySeverity(est.score),
            note: est.note,
          })),
        },
        routine: {
          create: {
            userId: data.userId || null,
            title: `Quiz-Based Routine (${result.skinTypeEstimate.toUpperCase()})`,
            steps: {
              create: routineDefinitions.map((step) => ({
                period: step.period,
                stepOrder: step.stepOrder,
                stepType: step.stepType,
                instructions: step.instructions,
                productId: step.product?.id || null,
              })),
            },
          },
        },
      },
      include: {
        scores: true,
        routine: {
          include: {
            steps: {
              include: {
                product: {
                  include: {
                    category: true,
                    ingredients: true,
                  },
                },
              },
            },
          },
        },
      },
    });

    return this.formatAnalysisReport(analysis);
  }

  public static async getById(id: string, userId?: string) {
    const analysis = await prisma.skinAnalysis.findUnique({
      where: { id },
      include: {
        scores: true,
        routine: {
          include: {
            steps: {
              include: {
                product: {
                  include: {
                    category: true,
                    ingredients: true,
                  },
                },
              },
            },
          },
        },
      },
    });

    if (!analysis) {
      throw new AppError('Analysis report not found', 404, 'NOT_FOUND');
    }

    if (analysis.userId && userId && analysis.userId !== userId) {
      throw new AppError('Access denied', 403, 'FORBIDDEN');
    }

    return this.formatAnalysisReport(analysis);
  }

  public static async listByUser(userId: string) {
    const analyses = await prisma.skinAnalysis.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      include: {
        scores: true,
      },
    });

    return analyses.map((a) => ({
      id: a.id,
      source: a.source,
      mode: a.mode,
      skinTypeEstimate: a.skinTypeEstimate,
      createdAt: a.createdAt,
      selectedConcerns: JSON.parse(a.selectedConcerns),
      scores: a.scores,
    }));
  }

  public static async compareAnalyses(analysisIdA: string, analysisIdB: string, userId?: string) {
    const [reportA, reportB] = await Promise.all([
      this.getById(analysisIdA, userId),
      this.getById(analysisIdB, userId),
    ]);

    const deltas = reportA.scores.map((scoreA: any) => {
      const scoreB = reportB.scores.find((s: any) => s.concern === scoreA.concern);
      const valB = scoreB ? scoreB.score : scoreA.score;
      const difference = scoreB ? scoreB.score - scoreA.score : 0;
      return {
        concern: scoreA.concern,
        reportAScore: scoreA.score,
        reportBScore: valB,
        delta: difference,
        improved: difference < 0, // In skin concerns, lower score = less concern = improved!
      };
    });

    return {
      reportA,
      reportB,
      deltas,
    };
  }

  public static async getProgress(userId: string) {
    const analyses = await prisma.skinAnalysis.findMany({
      where: { userId },
      orderBy: { createdAt: 'asc' },
      include: { scores: true },
    });

    return analyses.map((a) => {
      const scoresMap: Record<string, number> = {};
      a.scores.forEach((s) => {
        scoresMap[s.concern] = s.score;
      });

      return {
        id: a.id,
        date: a.createdAt.toISOString().split('T')[0],
        timestamp: a.createdAt,
        skinType: a.skinTypeEstimate,
        ...scoresMap,
      };
    });
  }

  public static async deleteAnalysis(id: string, userId: string) {
    const analysis = await prisma.skinAnalysis.findUnique({
      where: { id },
      include: { image: true },
    });

    if (!analysis) throw new AppError('Analysis not found', 404, 'NOT_FOUND');
    if (analysis.userId !== userId) throw new AppError('Forbidden', 403, 'FORBIDDEN');

    // If there is an uploaded image file on disk, remove it
    if (analysis.image?.storageKey) {
      const filePath = path.join(env.UPLOAD_DIR, analysis.image.storageKey);
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
    }

    await prisma.skinAnalysis.delete({ where: { id } });
    return { success: true, message: 'Analysis and data permanently deleted.' };
  }

  private static formatAnalysisReport(analysis: any) {
    let selectedConcerns: string[] = [];
    try {
      selectedConcerns = JSON.parse(analysis.selectedConcerns);
    } catch {
      selectedConcerns = [];
    }

    return {
      id: analysis.id,
      source: analysis.source,
      mode: analysis.mode,
      provider: analysis.provider,
      skinTypeEstimate: analysis.skinTypeEstimate,
      summary: analysis.summary,
      selectedConcerns,
      disclaimer: DISCLAIMER_TEXT,
      disclaimerVersion: analysis.disclaimerVersion,
      createdAt: analysis.createdAt,
      scores: analysis.scores.map((s: any) => ({
        id: s.id,
        concern: s.concern,
        score: s.score,
        severity: s.severity,
        note: s.note,
      })),
      routine: analysis.routine
        ? {
            id: analysis.routine.id,
            title: analysis.routine.title,
            steps: analysis.routine.steps.map((st: any) => {
              let images: string[] = [];
              if (st.product?.imageUrls) {
                try {
                  images = JSON.parse(st.product.imageUrls);
                } catch {
                  images = [st.product.imageUrls];
                }
              }
              return {
                id: st.id,
                period: st.period,
                stepOrder: st.stepOrder,
                stepType: st.stepType,
                instructions: st.instructions,
                product: st.product
                  ? {
                      id: st.product.id,
                      name: st.product.name,
                      slug: st.product.slug,
                      brand: st.product.brand,
                      priceCents: st.product.priceCents,
                      currency: st.product.currency,
                      imageUrls: images,
                      ratingAvg: st.product.ratingAvg,
                      ingredients: st.product.ingredients,
                    }
                  : null,
              };
            }),
          }
        : null,
    };
  }
}
