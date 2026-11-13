/**
 * Fuzzy matching utility for finding similar items
 * Uses Levenshtein distance algorithm
 */

export function fuzzyMatch(
  searchTerm,
  items,
  searchFields = ["title", "description"],
) {
  if (!searchTerm || searchTerm.trim() === "") {
    return items;
  }

  const term = searchTerm.toLowerCase().trim();

  return items
    .map((item) => {
      let maxScore = 0;

      searchFields.forEach((field) => {
        const fieldValue = item[field]?.toLowerCase() || "";

        // 1. Exact substring match → highest priority
        if (fieldValue.includes(term)) {
          maxScore = Math.max(maxScore, 1.0);
          return;
        }

        // 2. Field starts with search term → high priority
        if (fieldValue.startsWith(term)) {
          maxScore = Math.max(maxScore, 0.9);
          return;
        }

        // 3. Any word in the field starts with search term
        const words = fieldValue.split(/\s+/);
        if (words.some((w) => w.startsWith(term))) {
          maxScore = Math.max(maxScore, 0.8);
          return;
        }

        // 4. Levenshtein fallback for typo tolerance
        const score = calculateSimilarity(term, fieldValue);
        maxScore = Math.max(maxScore, score);
      });

      return { item, score: maxScore };
    })
    .filter((result) => result.score > 0.3)
    .sort((a, b) => b.score - a.score)
    .map((result) => result.item);
}

/**
 * Calculate similarity between two strings using Levenshtein distance
 * Returns a value between 0 and 1 (1 = exact match)
 */
function calculateSimilarity(str1, str2) {
  const distance = levenshteinDistance(str1, str2);
  const maxLength = Math.max(str1.length, str2.length);

  if (maxLength === 0) return 1.0;
  return 1 - distance / maxLength;
}

/**
 * Calculate Levenshtein distance between two strings
 */
function levenshteinDistance(str1, str2) {
  const matrix = [];

  // Initialize first row
  for (let i = 0; i <= str2.length; i++) {
    matrix[i] = [i];
  }

  // Initialize first column
  for (let j = 0; j <= str1.length; j++) {
    matrix[0][j] = j;
  }

  // Fill in the rest of the matrix
  for (let i = 1; i <= str2.length; i++) {
    for (let j = 1; j <= str1.length; j++) {
      if (str2.charAt(i - 1) === str1.charAt(j - 1)) {
        matrix[i][j] = matrix[i - 1][j - 1];
      } else {
        matrix[i][j] = Math.min(
          matrix[i - 1][j - 1] + 1, // substitution
          matrix[i][j - 1] + 1, // insertion
          matrix[i - 1][j] + 1, // deletion
        );
      }
    }
  }

  return matrix[str2.length][str1.length];
}
