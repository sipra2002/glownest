export const DISCLAIMER_TEXT =
  'AI-generated cosmetic assessment, not a medical diagnosis. GlowNest does not detect diseases. Consult a dermatologist for medical concerns.';

export const DISCLAIMER_VERSION = '1.0';

export const ALL_CONCERNS = [
  'acne',
  'pigmentation',
  'texture',
  'pores',
  'redness',
  'dryness',
  'oiliness',
] as const;

export type ConcernType = typeof ALL_CONCERNS[number];

export const SKIN_TYPES = [
  'oily',
  'dry',
  'combination',
  'normal',
  'sensitive',
] as const;

export type SkinType = typeof SKIN_TYPES[number];

export const ROUTINE_STEPS_ORDER = [
  'cleanser',
  'toner',
  'serum',
  'moisturizer',
  'sunscreen',
] as const;

