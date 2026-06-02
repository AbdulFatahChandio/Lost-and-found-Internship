import { PostTextSnapshot } from '../interfaces/match-job.interface';

const STOP_WORDS = new Set([
  'the', 'a', 'an', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for',
  'of', 'with', 'by', 'from', 'is', 'was', 'are', 'were', 'be', 'been',
  'my', 'your', 'his', 'her', 'its', 'our', 'their', 'this', 'that',
  'i', 'me', 'we', 'you', 'he', 'she', 'it', 'they', 'lost', 'found',
]);

function tokenize(text: string): Set<string> {
  return new Set(
    text
      .toLowerCase()
      .split(/\W+/)
      .filter((token) => token.length > 2 && !STOP_WORDS.has(token)),
  );
}

/** Jaccard similarity on title + description tokens, scaled to 0–100 */
export function computeSimilarity(
  lost: PostTextSnapshot,
  found: PostTextSnapshot,
): number {
  const lostTokens = tokenize(`${lost.title} ${lost.description}`);
  const foundTokens = tokenize(`${found.title} ${found.description}`);

  if (lostTokens.size === 0 || foundTokens.size === 0) {
    return 0;
  }

  let intersection = 0;
  for (const token of lostTokens) {
    if (foundTokens.has(token)) {
      intersection++;
    }
  }

  const union = new Set([...lostTokens, ...foundTokens]).size;
  const jaccard = intersection / union;

  // Boost when titles share significant overlap
  const titleLost = tokenize(lost.title);
  const titleFound = tokenize(found.title);
  let titleOverlap = 0;
  for (const token of titleLost) {
    if (titleFound.has(token)) {
      titleOverlap++;
    }
  }
  const titleBoost =
    titleLost.size > 0 && titleFound.size > 0
      ? (titleOverlap / Math.max(titleLost.size, titleFound.size)) * 15
      : 0;

  return Math.round(Math.min(100, jaccard * 85 + titleBoost) * 100) / 100;
}

export function chunkArray<T>(items: T[], size: number): T[][] {
  const chunks: T[][] = [];
  for (let i = 0; i < items.length; i += size) {
    chunks.push(items.slice(i, i + size));
  }
  return chunks;
}
