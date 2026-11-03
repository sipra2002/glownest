import { Request, Response, NextFunction } from 'express';
import { z } from 'zod';
import { AnalysisService } from '../services/analysis.service';
import { sendSuccess } from '../utils/response';
import { AppError } from '../utils/AppError';
import { ALL_CONCERNS, ConcernType } from '../config/constants';

export class AnalysisController {
  public static async analyzeImage(req: Request, res: Response, next: NextFunction) {
    try {
      if (!req.file) {
        throw new AppError('No facial image provided. Please upload a clear photo.', 400, 'MISSING_IMAGE');
      }

      let selectedConcerns: ConcernType[] = [];
      if (req.body.selectedConcerns) {
        try {
          const parsed = typeof req.body.selectedConcerns === 'string'
            ? JSON.parse(req.body.selectedConcerns)
            : req.body.selectedConcerns;
          selectedConcerns = parsed.filter((c: any) => ALL_CONCERNS.includes(c));
        } catch {
          selectedConcerns = [];
        }
      }

      const report = await AnalysisService.analyzeImage({
        userId: req.user?.userId,
        fileBuffer: req.file.buffer,
        mimeType: req.file.mimetype,
        selectedConcerns,
        retention: req.body.retention,
      });

      return sendSuccess(res, report, 201);
    } catch (error) {
      next(error);
    }
  }

  public static async analyzeQuiz(req: Request, res: Response, next: NextFunction) {
    try {
      const schema = z.object({
        quizAnswers: z.record(z.any()),
        selectedConcerns: z.array(z.string()).default([]),
      });

      const validated = schema.parse(req.body);
      const filteredConcerns = validated.selectedConcerns.filter((c: any): c is ConcernType =>
        ALL_CONCERNS.includes(c)
      );

      const report = await AnalysisService.analyzeQuiz({
        userId: req.user?.userId,
        quizAnswers: validated.quizAnswers,
        selectedConcerns: filteredConcerns,
      });

      return sendSuccess(res, report, 201);
    } catch (error) {
      next(error);
    }
  }

  public static async getById(req: Request, res: Response, next: NextFunction) {
    try {
      const report = await AnalysisService.getById(req.params.id, req.user?.userId);
      return sendSuccess(res, report);
    } catch (error) {
      next(error);
    }
  }

  public static async listMine(req: Request, res: Response, next: NextFunction) {
    try {
      const reports = await AnalysisService.listByUser(req.user!.userId);
      return sendSuccess(res, reports);
    } catch (error) {
      next(error);
    }
  }

  public static async compare(req: Request, res: Response, next: NextFunction) {
    try {
      const { a, b } = req.query;
      if (!a || !b) {
        throw new AppError('Both "a" and "b" analysis IDs are required for comparison.', 400, 'INVALID_PARAMS');
      }

      const comparison = await AnalysisService.compareAnalyses(
        String(a),
        String(b),
        req.user?.userId
      );

      return sendSuccess(res, comparison);
    } catch (error) {
      next(error);
    }
  }

  public static async getProgress(req: Request, res: Response, next: NextFunction) {
    try {
      const progress = await AnalysisService.getProgress(req.user!.userId);
      return sendSuccess(res, progress);
    } catch (error) {
      next(error);
    }
  }

  public static async delete(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await AnalysisService.deleteAnalysis(req.params.id, req.user!.userId);
      return sendSuccess(res, result);
    } catch (error) {
      next(error);
    }
  }
}

