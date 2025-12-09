/**
 * BASIC STATISTICS MODULE
 *
 * This module calculates fundamental text metrics that provide context
 * for other analyses. These statistics help users understand basic
 * properties of their essays and check compliance with word limits.
 *
 * Key metrics:
 * - Word count: Total number of word tokens
 * - Sentence count: Number of sentences
 * - Paragraph count: Number of paragraphs
 * - Average sentence length: Words per sentence (readability indicator)
 * - Average word length: Characters per word (vocabulary complexity indicator)
 * - Character counts: With and without spaces
 * - Length status: Compliance with Common App word limits
 *
 * Common App essay limits: 250-650 words
 * This is the most common target, so we use it as our default reference.
 */

import { BasicStatistics, LengthStatus } from '../types';

/**
 * Calculates comprehensive statistics for the given text
 *
 * @param words - Array of tokenized words
 * @param sentences - Array of tokenized sentences
 * @param paragraphs - Array of tokenized paragraphs
 * @param rawText - The original raw text (for character counting)
 * @returns BasicStatistics object with all calculated metrics
 */
export function calculateStatistics(
  words: string[],
  sentences: string[],
  paragraphs: string[],
  rawText: string
): BasicStatistics {
  const wordCount = words.length;
  const sentenceCount = sentences.length;
  const paragraphCount = paragraphs.length;

  // Calculate average sentence length (words per sentence)
  // Handle edge case of 0 sentences to avoid division by zero
  const avgSentenceLength = sentenceCount > 0
    ? Math.round((wordCount / sentenceCount) * 10) / 10
    : 0;

  // Calculate average word length (characters per word)
  // Sum up all word lengths and divide by word count
  const totalWordCharacters = words.reduce((sum, word) => sum + word.length, 0);
  const avgWordLength = wordCount > 0
    ? Math.round((totalWordCharacters / wordCount) * 10) / 10
    : 0;

  // Character counts
  const charactersWithSpaces = rawText.length;
  const charactersWithoutSpaces = rawText.replace(/\s/g, '').length;

  // Get length status based on Common App limits
  const lengthStatus = getLengthStatus(wordCount);

  return {
    wordCount,
    sentenceCount,
    paragraphCount,
    avgSentenceLength,
    avgWordLength,
    charactersWithSpaces,
    charactersWithoutSpaces,
    lengthStatus
  };
}

/**
 * Determines the length status of an essay based on Common App requirements
 *
 * Standard essay targets:
 * - Common App: 250-650 words (our default)
 * - Coalition App: 500-650 words
 * - UC PIQs: 350 words max each
 *
 * Status categories:
 * - too-short (< 200): Very short, needs significant expansion
 * - short (200-249): Slightly under, room for development
 * - good (250-650): Within Common App range
 * - long (651-700): Slightly over, consider trimming
 * - too-long (> 700): Significantly over limit, must cut
 *
 * @param wordCount - Number of words in the essay
 * @returns LengthStatus object with status, message, and target info
 */
export function getLengthStatus(wordCount: number): LengthStatus {
  const targetMin = 250;
  const targetMax = 650;

  if (wordCount < 200) {
    return {
      status: 'too-short',
      message: `Your essay is very short at ${wordCount} words. Most college essays should be 250-650 words. You have room to develop your ideas further and add specific details.`,
      wordCount,
      targetMin,
      targetMax
    };
  }

  if (wordCount < 250) {
    return {
      status: 'short',
      message: `At ${wordCount} words, your essay is slightly under the Common App minimum of 250 words. Consider expanding on key moments or adding more sensory details.`,
      wordCount,
      targetMin,
      targetMax
    };
  }

  if (wordCount <= 650) {
    return {
      status: 'good',
      message: `Great length! Your essay is ${wordCount} words, within the Common App range of 250-650 words.`,
      wordCount,
      targetMin,
      targetMax
    };
  }

  if (wordCount <= 700) {
    return {
      status: 'long',
      message: `Your essay is ${wordCount} words, slightly over the 650-word limit. Consider cutting redundant phrases or less essential details.`,
      wordCount,
      targetMin,
      targetMax
    };
  }

  return {
    status: 'too-long',
    message: `At ${wordCount} words, your essay significantly exceeds the 650-word limit. You'll need to cut ${wordCount - 650} words. Focus on removing repetitive ideas and tightening your prose.`,
    wordCount,
    targetMin,
    targetMax
  };
}

/**
 * Calculates the reading level based on average sentence length
 * This is a simplified version of readability metrics
 *
 * General guidelines:
 * - < 12 words/sentence: Simple, possibly too choppy
 * - 12-18 words/sentence: Clear and readable
 * - 18-25 words/sentence: Moderately complex
 * - > 25 words/sentence: Complex, may be hard to follow
 *
 * @param avgSentenceLength - Average words per sentence
 * @returns Description of the reading level
 */
export function getReadingLevel(avgSentenceLength: number): string {
  if (avgSentenceLength < 12) {
    return 'Simple - Your sentences are quite short. Consider varying length for better flow.';
  }
  if (avgSentenceLength <= 18) {
    return 'Clear and readable - Good sentence length for college essays.';
  }
  if (avgSentenceLength <= 25) {
    return 'Moderately complex - Watch for run-on sentences.';
  }
  return 'Complex - Some sentences may be too long. Consider breaking them up.';
}

/**
 * Provides feedback on word length patterns
 *
 * Average word length indicators:
 * - < 4.0: Very simple vocabulary
 * - 4.0-4.5: Simple to moderate vocabulary
 * - 4.5-5.5: Good vocabulary variety
 * - > 5.5: Complex/academic vocabulary
 *
 * @param avgWordLength - Average characters per word
 * @returns Description of vocabulary complexity
 */
export function getVocabularyComplexity(avgWordLength: number): string {
  if (avgWordLength < 4.0) {
    return 'Very simple vocabulary - Consider using more varied and specific words.';
  }
  if (avgWordLength < 4.5) {
    return 'Simple to moderate vocabulary - Room to incorporate more descriptive words.';
  }
  if (avgWordLength <= 5.5) {
    return 'Good vocabulary variety - You are using a mix of simple and complex words.';
  }
  return 'Complex vocabulary - Make sure your word choices feel natural, not forced.';
}
