import { ConcernType, SkinType } from '../../config/constants';

export interface RawConcernEstimate {
  concern: ConcernType;
  score: number; // 0 - 100
  confidence?: number;
  note?: string;
}

export interface ProviderResult {
  mode: 'demo' | 'real';
  provider: string;
  skinTypeEstimate: SkinType;
  estimates: RawConcernEstimate[];
  summary: string;
}

export interface AnalysisInput {
  imageBuffer?: Buffer;
  mimeType?: string;
  quizAnswers?: Record<string, unknown>;
  selectedConcerns: ConcernType[];
}

export interface AnalysisProvider {
  readonly name: string;
  readonly mode: 'demo' | 'real';
  analyze(input: AnalysisInput): Promise<ProviderResult>;
}

