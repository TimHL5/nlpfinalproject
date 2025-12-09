/**
 * TOKENIZATION MODULE
 *
 * This module implements text tokenization, which is the process of breaking
 * text into smaller units (tokens). From CSCI 3310 (Week 5), we learned that
 * tokenization is the first step in most NLP pipelines.
 *
 * Key concepts from class:
 * - Word tokenization: Breaking text into individual words
 * - Sentence tokenization: Breaking text into sentences
 * - Challenges: contractions (don't → do + n't), punctuation, abbreviations
 * - Heap's Law: Vocabulary grows as O(N^β) where β ≈ 0.5
 *
 * Our approach:
 * - Keep contractions as single tokens for simplicity (e.g., "don't" stays as "don't")
 * - Remove punctuation from word boundaries but preserve for sentence detection
 * - Handle multiple spaces and newlines
 * - Split on sentence-ending punctuation (. ! ?)
 *
 * The regex /\s+/ matches one or more whitespace characters (spaces, tabs, newlines)
 * This is more robust than splitting on single space characters.
 */

import { TokenizationResult } from '../types';

/**
 * Main tokenization function that performs word, sentence, and paragraph tokenization
 * @param text - The input text to tokenize
 * @returns TokenizationResult with words, rawWords, sentences, and paragraphs
 */
export function tokenize(text: string): TokenizationResult {
  // Trim the text and handle empty input
  const trimmedText = text.trim();

  if (!trimmedText) {
    return {
      words: [],
      rawWords: [],
      sentences: [],
      paragraphs: []
    };
  }

  return {
    words: tokenizeWords(trimmedText),
    rawWords: tokenizeRawWords(trimmedText),
    sentences: tokenizeSentences(trimmedText),
    paragraphs: tokenizeParagraphs(trimmedText)
  };
}

/**
 * Tokenizes text into cleaned, lowercase words (tokens)
 *
 * Process:
 * 1. Split on whitespace using \s+ regex
 * 2. Clean each word by removing leading/trailing punctuation
 * 3. Convert to lowercase for normalization
 * 4. Filter out empty strings
 *
 * The regex for cleaning: /^[^a-zA-Z']+|[^a-zA-Z']+$/g
 * - ^[^a-zA-Z']+ : Matches non-letter/apostrophe characters at the START
 * - [^a-zA-Z']+$ : Matches non-letter/apostrophe characters at the END
 * - We keep apostrophes to preserve contractions like "don't", "I'm", "we've"
 *
 * @param text - The input text
 * @returns Array of cleaned, lowercase word tokens
 */
export function tokenizeWords(text: string): string[] {
  if (!text.trim()) return [];

  return text
    .split(/\s+/)
    .map(word => {
      // Remove punctuation from start and end, but keep apostrophes for contractions
      const cleaned = word.replace(/^[^a-zA-Z']+|[^a-zA-Z']+$/g, '');
      return cleaned.toLowerCase();
    })
    .filter(word => word.length > 0); // Remove empty strings
}

/**
 * Tokenizes text into raw words, preserving original case and some punctuation
 * This is useful for display purposes and certain analyses
 *
 * @param text - The input text
 * @returns Array of raw word tokens (with original casing)
 */
export function tokenizeRawWords(text: string): string[] {
  if (!text.trim()) return [];

  return text
    .split(/\s+/)
    .map(word => {
      // Remove leading/trailing punctuation but preserve original case
      return word.replace(/^[^a-zA-Z']+|[^a-zA-Z']+$/g, '');
    })
    .filter(word => word.length > 0);
}

/**
 * Tokenizes text into sentences
 *
 * Uses lookbehind regex: /(?<=[.!?])\s+/
 * - (?<=[.!?]) is a "lookbehind assertion" - it checks that the position
 *   is preceded by one of these punctuation marks WITHOUT consuming it
 * - \s+ matches one or more whitespace characters
 * - This keeps the punctuation WITH the sentence (before the split point)
 *
 * Limitations (acceptable for this project scope):
 * - May incorrectly split on abbreviations like "Dr." or "U.S."
 * - Handles ellipses (...) but may produce quirky results
 * - Multiple punctuation (Really?!) works correctly
 *
 * @param text - The input text
 * @returns Array of complete sentences
 */
export function tokenizeSentences(text: string): string[] {
  if (!text.trim()) return [];

  // Split on sentence-ending punctuation followed by whitespace
  // The lookbehind (?<=[.!?]) keeps the punctuation with the sentence
  const sentences = text
    .split(/(?<=[.!?])\s+/)
    .map(s => s.trim())
    .filter(s => s.length > 0);

  // If no splits occurred (single sentence without ending punctuation),
  // return the whole text as one sentence
  if (sentences.length === 0 && text.trim()) {
    return [text.trim()];
  }

  return sentences;
}

/**
 * Tokenizes text into paragraphs
 *
 * Splits on double newlines (with optional whitespace between)
 * Regex: /\n\s*\n/
 * - \n matches a newline character
 * - \s* matches zero or more whitespace characters (spaces, tabs)
 * - \n matches another newline character
 *
 * This handles various paragraph separations:
 * - Two newlines: \n\n
 * - Newline, spaces, newline: \n   \n
 * - Mixed whitespace: \n \t \n
 *
 * @param text - The input text
 * @returns Array of paragraphs
 */
export function tokenizeParagraphs(text: string): string[] {
  if (!text.trim()) return [];

  return text
    .split(/\n\s*\n/)
    .map(p => p.trim())
    .filter(p => p.length > 0);
}

/**
 * Counts the number of words in text
 * Utility function for quick word count
 *
 * @param text - The input text
 * @returns Number of words
 */
export function countWords(text: string): number {
  return tokenizeWords(text).length;
}

/**
 * Counts the number of sentences in text
 * Utility function for quick sentence count
 *
 * @param text - The input text
 * @returns Number of sentences
 */
export function countSentences(text: string): number {
  return tokenizeSentences(text).length;
}

/**
 * Counts the number of paragraphs in text
 * Utility function for quick paragraph count
 *
 * @param text - The input text
 * @returns Number of paragraphs
 */
export function countParagraphs(text: string): number {
  return tokenizeParagraphs(text).length;
}
