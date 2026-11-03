import { env } from '../config/env';
import { AnalysisInput, AnalysisProvider, ProviderResult } from './providers/AnalysisProvider';
import { DemoProvider } from './providers/DemoProvider';

export class AnalysisPipeline {
  private provider: AnalysisProvider;

  constructor() {
    // Default to DemoProvider in Phase 1
    this.provider = new DemoProvider();
  }

  public getProviderName(): string {
    return this.provider.name;
  }

  public getProviderMode(): 'demo' | 'real' {
    return this.provider.mode;
  }

  public async run(input: AnalysisInput): Promise<ProviderResult> {
    return this.provider.analyze(input);
  }

  public static classifySeverity(score: number): 'mild' | 'moderate' | 'high' {
    if (score >= 65) return 'high';
    if (score >= 40) return 'moderate';
    return 'mild';
  }
}

export const analysisPipeline = new AnalysisPipeline();

