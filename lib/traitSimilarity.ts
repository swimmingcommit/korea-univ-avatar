export interface Traits {
  sociability: number;
  activity: number;
  creativity: number;
  leadership: number;
  expertise: number;
}

export const TRAIT_KEYS: (keyof Traits)[] = [
  "sociability",
  "activity",
  "creativity",
  "leadership",
  "expertise",
];

// 5 individual trait axes on 1 to 5 scale -> max difference per axis is 4 (5 - 1).
// Max Euclidean distance in 5D space = sqrt(5 * (4^2)) = sqrt(80) ≈ 8.9442719
export const NUM_TRAIT_AXES = 5;
export const MAX_TRAIT_AXIS_DIFF = 4;
export const MAX_TRAIT_EUCLIDEAN_DISTANCE = Math.sqrt(
  NUM_TRAIT_AXES * Math.pow(MAX_TRAIT_AXIS_DIFF, 2)
);

/**
 * Calculates the Euclidean distance between two 5D trait vectors.
 */
export function computeEuclideanDistance(a: Traits, b: Traits): number {
  let sumSq = 0;
  for (const key of TRAIT_KEYS) {
    const valA = a[key] ?? 3;
    const valB = b[key] ?? 3;
    const diff = valA - valB;
    sumSq += diff * diff;
  }
  return Math.sqrt(sumSq);
}

/**
 * Computes a normalized trait similarity between 0.0 (maximum distance) and 1.0 (identical vectors).
 * Formula: 1 - (distance / maxDistance)
 */
export function computeTraitSimilarity(a: Traits, b: Traits): number {
  const distance = computeEuclideanDistance(a, b);
  const similarity = 1 - distance / MAX_TRAIT_EUCLIDEAN_DISTANCE;
  return Math.max(0, Math.min(1, similarity));
}
