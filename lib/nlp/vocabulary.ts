/**
 * VOCABULARY ANALYSIS MODULE
 *
 * This module analyzes vocabulary usage patterns in essays. From CSCI 3310,
 * we learned about word frequency distributions and Heap's Law.
 *
 * Key concepts from class:
 * - Types: Unique words in the text (vocabulary size)
 * - Tokens: Total word occurrences
 * - Type-Token Ratio (TTR): types/tokens - indicates vocabulary richness
 * - Heap's Law: |V| = kN^β where β ≈ 0.5 (vocabulary grows sublinearly)
 * - Stop words: High-frequency, low-information words (the, a, is, etc.)
 *
 * This analysis helps identify:
 * - Vocabulary richness (are you using varied words?)
 * - Overused words (excluding stop words)
 * - Repetitive patterns that could be improved
 *
 * Implementation uses a bag-of-words approach where we count frequency
 * of each word, which is foundational for text classification methods
 * like Naive Bayes (mentioned in class).
 */

import { VocabularyAnalysis, OverusedWord } from '../types';
import { STOP_WORDS } from '../constants/stopWords';

// Suggestions for commonly overused words in essays
const WORD_SUGGESTIONS: Record<string, string[]> = {
  'really': ['genuinely', 'truly', 'remarkably', 'exceptionally'],
  'very': ['extremely', 'incredibly', 'remarkably', 'particularly'],
  'good': ['excellent', 'outstanding', 'remarkable', 'valuable'],
  'bad': ['detrimental', 'harmful', 'unfortunate', 'challenging'],
  'important': ['crucial', 'essential', 'significant', 'vital'],
  'interesting': ['fascinating', 'compelling', 'engaging', 'intriguing'],
  'different': ['distinct', 'unique', 'diverse', 'varied'],
  'experience': ['encounter', 'journey', 'adventure', 'episode'],
  'thing': ['aspect', 'element', 'factor', 'component'],
  'things': ['aspects', 'elements', 'factors', 'components'],
  'stuff': ['material', 'content', 'items', 'elements'],
  'help': ['assist', 'support', 'guide', 'enable'],
  'helped': ['assisted', 'supported', 'guided', 'enabled'],
  'big': ['significant', 'substantial', 'considerable', 'major'],
  'nice': ['pleasant', 'delightful', 'wonderful', 'admirable'],
  'great': ['exceptional', 'remarkable', 'outstanding', 'extraordinary'],
  'amazing': ['remarkable', 'extraordinary', 'impressive', 'astounding'],
  'awesome': ['impressive', 'remarkable', 'outstanding', 'magnificent'],
  'wonderful': ['remarkable', 'extraordinary', 'delightful', 'magnificent'],
  'incredible': ['remarkable', 'extraordinary', 'astounding', 'phenomenal'],
  'hard': ['challenging', 'difficult', 'demanding', 'arduous'],
  'easy': ['simple', 'straightforward', 'effortless', 'uncomplicated'],
  'lot': ['considerable amount', 'great deal', 'abundance', 'numerous'],
  'lots': ['many', 'numerous', 'abundant', 'plentiful'],
  'many': ['numerous', 'countless', 'myriad', 'various'],
  'always': ['consistently', 'invariably', 'perpetually', 'constantly'],
  'never': ['rarely', 'seldom', 'at no time', 'not once'],
  'sometimes': ['occasionally', 'periodically', 'intermittently', 'at times'],
  'people': ['individuals', 'community', 'peers', 'colleagues'],
  'person': ['individual', 'figure', 'character', 'someone'],
  'world': ['society', 'community', 'environment', 'sphere'],
  'life': ['journey', 'existence', 'path', 'experience'],
  'everyone': ['all individuals', 'the entire community', 'every person', 'all people'],
  'everything': ['all aspects', 'every element', 'the entirety', 'all components']
};

/**
 * Analyzes vocabulary usage in the given word array
 *
 * Process:
 * 1. Build frequency map (bag-of-words representation)
 * 2. Calculate vocabulary richness (Type-Token Ratio)
 * 3. Identify overused words (excluding stop words)
 * 4. Generate improvement suggestions
 *
 * @param words - Array of cleaned, lowercase word tokens
 * @returns VocabularyAnalysis with metrics and suggestions
 */
export function analyzeVocabulary(words: string[]): VocabularyAnalysis {
  if (words.length === 0) {
    return {
      totalWords: 0,
      uniqueWords: 0,
      vocabularyRichness: 0,
      wordFrequencies: new Map(),
      overusedWords: []
    };
  }

  // Build frequency map (bag-of-words approach from class)
  // This counts how many times each word appears in the text
  const wordFrequencies = new Map<string, number>();
  for (const word of words) {
    wordFrequencies.set(word, (wordFrequencies.get(word) || 0) + 1);
  }

  // Calculate vocabulary metrics
  const totalWords = words.length;          // Total tokens
  const uniqueWords = wordFrequencies.size; // Total types (unique words)

  // Type-Token Ratio (TTR) - measures vocabulary richness
  // Higher ratio = more varied vocabulary
  // Typical range: 0.4-0.7 for natural text
  const vocabularyRichness = totalWords > 0 ? uniqueWords / totalWords : 0;

  // Find overused words (excluding stop words)
  const overusedWords = findOverusedWords(wordFrequencies, totalWords);

  return {
    totalWords,
    uniqueWords,
    vocabularyRichness,
    wordFrequencies,
    overusedWords
  };
}

/**
 * Identifies words that are used too frequently in the essay
 *
 * Criteria for "overused":
 * 1. Not a stop word (common words like "the", "is", "and")
 * 2. Not too short (length > 3 characters)
 * 3. Appears 4+ times OR > 1.5% of total words
 *
 * This helps writers identify repetitive patterns and diversify vocabulary
 *
 * @param wordFrequencies - Map of word to frequency count
 * @param totalWords - Total number of words
 * @returns Array of overused words with suggestions
 */
function findOverusedWords(
  wordFrequencies: Map<string, number>,
  totalWords: number
): OverusedWord[] {
  const overused: OverusedWord[] = [];
  const threshold = Math.max(4, Math.floor(totalWords * 0.015)); // 1.5% or minimum 4

  for (const [word, count] of wordFrequencies) {
    // Skip stop words - they're expected to be frequent
    if (STOP_WORDS.has(word)) continue;

    // Skip very short words (usually not meaningful)
    if (word.length <= 3) continue;

    // Check if word is overused
    if (count >= threshold) {
      overused.push({
        word,
        count,
        suggestion: getSuggestion(word)
      });
    }
  }

  // Sort by frequency (most overused first)
  return overused.sort((a, b) => b.count - a.count);
}

/**
 * Gets a suggestion for replacing an overused word
 *
 * @param word - The overused word
 * @returns Suggestion string with alternatives
 */
function getSuggestion(word: string): string {
  const alternatives = WORD_SUGGESTIONS[word];

  if (alternatives && alternatives.length > 0) {
    // Pick 2-3 random alternatives to suggest
    const shuffled = [...alternatives].sort(() => 0.5 - Math.random());
    const suggestions = shuffled.slice(0, 3).join('", "');
    return `Consider using "${suggestions}" instead`;
  }

  return 'Try using more specific or varied alternatives';
}

/**
 * Gets a rating for vocabulary richness
 *
 * Type-Token Ratio (TTR) interpretation:
 * - > 0.6: Excellent vocabulary variety
 * - 0.5-0.6: Good vocabulary
 * - 0.4-0.5: Average, could improve
 * - < 0.4: Limited vocabulary, repetitive
 *
 * Note: TTR naturally decreases as text length increases (Heap's Law)
 * so longer essays will have lower TTR. We adjust expectations accordingly.
 *
 * @param vocabularyRichness - Type-Token Ratio (0-1)
 * @param wordCount - Total word count (for length adjustment)
 * @returns Rating and feedback message
 */
export function getVocabularyRating(
  vocabularyRichness: number,
  wordCount: number
): { rating: 'excellent' | 'good' | 'average' | 'poor'; message: string } {
  // Adjust thresholds for longer texts (TTR naturally decreases with length)
  const lengthFactor = Math.min(1, 300 / Math.max(wordCount, 100));
  const adjustedRichness = vocabularyRichness / lengthFactor;

  if (adjustedRichness >= 0.55) {
    return {
      rating: 'excellent',
      message: 'Excellent vocabulary variety! You use diverse and engaging language.'
    };
  }
  if (adjustedRichness >= 0.45) {
    return {
      rating: 'good',
      message: 'Good vocabulary variety. Your language is varied and engaging.'
    };
  }
  if (adjustedRichness >= 0.35) {
    return {
      rating: 'average',
      message: 'Average vocabulary variety. Consider using more specific and varied words.'
    };
  }
  return {
    rating: 'poor',
    message: 'Limited vocabulary variety. Try replacing repeated words with synonyms.'
  };
}

/**
 * Gets the most frequent content words (excluding stop words)
 * Useful for identifying the main topics/themes of the essay
 *
 * @param wordFrequencies - Map of word to frequency
 * @param limit - Maximum number of words to return
 * @returns Array of [word, count] pairs
 */
export function getTopContentWords(
  wordFrequencies: Map<string, number>,
  limit: number = 10
): Array<[string, number]> {
  const contentWords: Array<[string, number]> = [];

  for (const [word, count] of wordFrequencies) {
    if (!STOP_WORDS.has(word) && word.length > 2) {
      contentWords.push([word, count]);
    }
  }

  return contentWords
    .sort((a, b) => b[1] - a[1])
    .slice(0, limit);
}
