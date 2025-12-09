/**
 * SENTENCE STARTER ANALYSIS MODULE (N-gram Analysis)
 *
 * This module uses n-gram concepts from CSCI 3310 (Week 12) to analyze
 * sentence variety in essays.
 *
 * N-gram concepts from class:
 * - N-grams are sequences of N consecutive items
 * - Unigrams (N=1): Single words
 * - Bigrams (N=2): Word pairs
 * - Trigrams (N=3): Word triples
 * - We use n-grams for language modeling, spell checking, and text generation
 *
 * In this module, we use UNIGRAMS of sentence starters (the first word of
 * each sentence) to analyze variety. This is a simplified n-gram application
 * that helps identify:
 *
 * - Monotonous patterns: Starting too many sentences the same way
 * - "I" overuse: A common problem in personal essays
 * - Lack of variety: All sentences starting with similar structures
 *
 * Good writing varies sentence starters to create rhythm and maintain
 * reader interest. Starting every sentence with "I" makes writing feel
 * self-centered and monotonous.
 */

import { SentenceStarterAnalysis, RepetitiveStarter } from '../types';

/**
 * Alternative sentence starters that can add variety to writing
 * These are organized by type to help writers choose appropriate alternatives
 */
export const ALTERNATIVE_STARTERS = {
  // Temporal/sequence starters
  temporal: ['When', 'After', 'Before', 'While', 'During', 'Throughout',
             'Meanwhile', 'Eventually', 'Finally', 'Initially', 'Suddenly'],

  // Contrast/transition starters
  contrast: ['Although', 'Despite', 'However', 'Yet', 'Nevertheless',
             'Conversely', 'Instead', 'Rather', 'Otherwise', 'Still'],

  // Causal starters
  causal: ['Because', 'Since', 'Therefore', 'Thus', 'Consequently',
           'As a result', 'Hence', 'Accordingly'],

  // Demonstrative starters
  demonstrative: ['This', 'That', 'These', 'Those', 'Such', 'Here', 'There'],

  // Participial starters (action-oriented)
  participial: ['Standing', 'Walking', 'Looking', 'Thinking', 'Feeling',
                'Running', 'Holding', 'Watching', 'Sitting', 'Knowing',
                'Having', 'Being', 'Seeing', 'Hearing', 'Realizing'],

  // Descriptive starters
  descriptive: ['The', 'My', 'Our', 'Every', 'Each', 'Some', 'Many', 'Few'],

  // Question starters
  questions: ['What', 'Why', 'How', 'Where', 'Who', 'Which', 'When']
};

/**
 * Analyzes sentence starters to evaluate variety
 *
 * Process:
 * 1. Extract the first word (unigram) from each sentence
 * 2. Build frequency map of starters
 * 3. Calculate "I" percentage (specific concern for personal essays)
 * 4. Identify any starter used 3+ times
 * 5. Generate variety rating and suggestions
 *
 * @param sentences - Array of complete sentences
 * @returns SentenceStarterAnalysis with frequencies and suggestions
 */
export function analyzeSentenceStarters(sentences: string[]): SentenceStarterAnalysis {
  if (sentences.length === 0) {
    return {
      totalSentences: 0,
      starterFrequencies: new Map(),
      iStartCount: 0,
      iStartPercentage: 0,
      repetitiveStarters: [],
      variety: 'good',
      suggestions: []
    };
  }

  // Extract first word from each sentence (unigram of sentence start)
  const starters: string[] = sentences
    .map(sentence => getFirstWord(sentence))
    .filter(word => word.length > 0);

  // Build frequency map of starters
  const starterFrequencies = new Map<string, number>();
  for (const starter of starters) {
    const lowerStarter = starter.toLowerCase();
    starterFrequencies.set(lowerStarter, (starterFrequencies.get(lowerStarter) || 0) + 1);
  }

  // Calculate "I" statistics
  const iStartCount = starterFrequencies.get('i') || 0;
  const totalSentences = sentences.length;
  const iStartPercentage = totalSentences > 0
    ? Math.round((iStartCount / totalSentences) * 100)
    : 0;

  // Find repetitive starters (any word used 3+ times)
  const repetitiveStarters = findRepetitiveStarters(starterFrequencies, totalSentences);

  // Calculate variety rating
  const variety = calculateVariety(iStartPercentage, repetitiveStarters);

  // Generate suggestions
  const suggestions = generateSuggestions(iStartPercentage, repetitiveStarters);

  return {
    totalSentences,
    starterFrequencies,
    iStartCount,
    iStartPercentage,
    repetitiveStarters,
    variety,
    suggestions
  };
}

/**
 * Extracts the first word from a sentence
 *
 * @param sentence - A complete sentence
 * @returns The first word, cleaned of punctuation
 */
function getFirstWord(sentence: string): string {
  const trimmed = sentence.trim();
  if (!trimmed) return '';

  // Split on whitespace and take first element
  const words = trimmed.split(/\s+/);
  const firstWord = words[0] || '';

  // Clean the word (remove leading punctuation, quotes, etc.)
  return firstWord.replace(/^[^a-zA-Z']+/, '');
}

/**
 * Finds starters that are used too frequently
 *
 * @param frequencies - Map of starter word to frequency
 * @param total - Total number of sentences
 * @returns Array of repetitive starters with counts and percentages
 */
function findRepetitiveStarters(
  frequencies: Map<string, number>,
  total: number
): RepetitiveStarter[] {
  const repetitive: RepetitiveStarter[] = [];

  for (const [word, count] of frequencies) {
    // Flag if used 3+ times
    if (count >= 3) {
      repetitive.push({
        word,
        count,
        percentage: Math.round((count / total) * 100)
      });
    }
  }

  // Sort by count (most frequent first)
  return repetitive.sort((a, b) => b.count - a.count);
}

/**
 * Calculates the variety rating based on "I" percentage and repetitive starters
 *
 * Rating criteria:
 * - good: < 25% "I" starts AND no starter used > 3 times
 * - moderate: 25-40% "I" starts OR some repetition
 * - poor: > 40% "I" starts OR significant repetition
 *
 * @param iPercentage - Percentage of sentences starting with "I"
 * @param repetitive - Array of repetitive starters
 * @returns Variety rating
 */
function calculateVariety(
  iPercentage: number,
  repetitive: RepetitiveStarter[]
): 'good' | 'moderate' | 'poor' {
  // Check for severe repetition (any single starter > 40%)
  const hasHighRepetition = repetitive.some(r => r.percentage > 40);

  if (iPercentage > 40 || hasHighRepetition) {
    return 'poor';
  }

  if (iPercentage > 25 || repetitive.length > 2) {
    return 'moderate';
  }

  return 'good';
}

/**
 * Generates suggestions for improving sentence variety
 *
 * @param iPercentage - Percentage of sentences starting with "I"
 * @param repetitive - Array of repetitive starters
 * @returns Array of suggestion strings
 */
function generateSuggestions(
  iPercentage: number,
  repetitive: RepetitiveStarter[]
): string[] {
  const suggestions: string[] = [];

  // "I" overuse suggestions
  if (iPercentage > 40) {
    suggestions.push(
      `${iPercentage}% of your sentences start with "I" - this can make your essay feel self-centered. Try starting with actions, descriptions, or other subjects.`
    );
    suggestions.push(
      'Example: Instead of "I walked into the room," try "The door creaked as I walked into the room" or "Walking into the room, I noticed..."'
    );
  } else if (iPercentage > 25) {
    suggestions.push(
      `${iPercentage}% of your sentences start with "I." Consider varying your sentence starters to create better rhythm.`
    );
  }

  // Repetitive starter suggestions
  const nonIRepetitive = repetitive.filter(r => r.word !== 'i');
  if (nonIRepetitive.length > 0) {
    const examples = nonIRepetitive.slice(0, 2).map(r => `"${r.word}" (${r.count} times)`);
    suggestions.push(
      `You start multiple sentences with the same words: ${examples.join(', ')}. Try using temporal starters (When, After, Before) or participial phrases.`
    );
  }

  // General suggestions for variety
  if (suggestions.length > 0) {
    const starterExamples = getRandomStarters(3);
    suggestions.push(
      `Try these alternative starters: ${starterExamples.join(', ')}`
    );
  }

  return suggestions;
}

/**
 * Gets random alternative starters from different categories
 *
 * @param count - Number of starters to get
 * @returns Array of starter words
 */
function getRandomStarters(count: number): string[] {
  const categories = Object.values(ALTERNATIVE_STARTERS);
  const allStarters: string[] = [];

  // Pick one from each category
  for (const category of categories) {
    const randomIndex = Math.floor(Math.random() * category.length);
    allStarters.push(category[randomIndex]);
  }

  // Shuffle and return requested count
  return allStarters
    .sort(() => 0.5 - Math.random())
    .slice(0, count);
}

/**
 * Gets feedback message based on sentence starter analysis
 *
 * @param analysis - The SentenceStarterAnalysis result
 * @returns Feedback message string
 */
export function getSentenceStarterFeedback(analysis: SentenceStarterAnalysis): string {
  switch (analysis.variety) {
    case 'good':
      return 'Great sentence variety! Your writing has good rhythm with varied sentence starters.';

    case 'moderate':
      return 'Your sentence variety is acceptable, but could be improved. Consider varying how you begin sentences to create better flow.';

    case 'poor':
      return 'Your sentences often start the same way, making the writing feel repetitive. Focus on varying your sentence structure for better reader engagement.';

    default:
      return '';
  }
}
