import crypto from 'crypto';
import { ALL_CONCERNS, ConcernType, SkinType } from '../../config/constants';
import { AnalysisInput, AnalysisProvider, ProviderResult, RawConcernEstimate } from './AnalysisProvider';

export class DemoProvider implements AnalysisProvider {
  public readonly name = 'demo';
  public readonly mode = 'demo' as const;

  public async analyze(input: AnalysisInput): Promise<ProviderResult> {
    // Generate a pseudo-random seed from image buffer or selected concerns for deterministic output
    let seed = 42;
    if (input.imageBuffer && input.imageBuffer.length > 0) {
      const hash = crypto.createHash('md5').update(input.imageBuffer).digest('hex');
      seed = parseInt(hash.substring(0, 6), 16);
    } else if (input.quizAnswers) {
      const serialized = JSON.stringify(input.quizAnswers);
      const hash = crypto.createHash('md5').update(serialized).digest('hex');
      seed = parseInt(hash.substring(0, 6), 16);
    }

    // Determine estimated skin type based on selected concerns or seed
    let skinTypeEstimate: SkinType = 'combination';
    if (input.selectedConcerns.includes('oiliness') && input.selectedConcerns.includes('acne')) {
      skinTypeEstimate = 'oily';
    } else if (input.selectedConcerns.includes('dryness')) {
      skinTypeEstimate = 'dry';
    } else if (input.selectedConcerns.includes('redness')) {
      skinTypeEstimate = 'sensitive';
    } else {
      const types: SkinType[] = ['combination', 'oily', 'dry', 'normal', 'sensitive'];
      skinTypeEstimate = types[seed % types.length];
    }

    // Generate scores for all 7 concerns
    const estimates: RawConcernEstimate[] = ALL_CONCERNS.map((concern, idx) => {
      const isSelected = input.selectedConcerns.includes(concern);
      const variance = ((seed + idx * 17) % 25);
      // Selected concerns get higher visibility scores (55 - 85), unselected get lower (15 - 45)
      const base = isSelected ? 60 : 20;
      const score = Math.min(100, Math.max(10, base + variance));

      let note = '';
      if (score >= 70) {
        note = `Noticeable signs of ${concern} observed in key facial zones.`;
      } else if (score >= 45) {
        note = `Moderate indication of ${concern}. Targeted barrier support recommended.`;
      } else {
        note = `Low visibility of ${concern}. Well balanced.`;
      }

      return {
        concern,
        score,
        confidence: 0.88,
        note,
      };
    });

    const highConcerns = estimates
      .filter((e) => e.score >= 55)
      .map((e) => e.concern)
      .join(', ');

    const summary = highConcerns.length > 0
      ? `Sample demo assessment indicates an estimated ${skinTypeEstimate} profile with focal points in ${highConcerns}. Targeted hydration and active botanical care are suggested.`
      : `Sample demo assessment indicates a balanced ${skinTypeEstimate} profile with mild maintenance needs.`;

    return {
      mode: 'demo',
      provider: 'demo',
      skinTypeEstimate,
      estimates,
      summary,
    };
  }
}

