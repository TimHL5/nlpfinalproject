/**
 * MARKOV CHAIN TEXT GENERATOR MODULE
 *
 * This module implements a bigram-based Markov chain for generating
 * essay opening sentence suggestions. From CSCI 3310 (Week 12), we learned
 * about Markov chains for text generation.
 *
 * Markov Chain concepts from class:
 * - A Markov chain models sequences where the probability of each item
 *   depends only on the previous item(s) - the "Markov property"
 * - Unigram model: P(word) - context-independent, each word equally likely
 * - Bigram model: P(word | previous word) - depends on one previous word
 * - Trigram model: P(word | previous two words) - more context, more coherent
 *
 * Probability estimation from training corpus:
 * P(w2 | w1) = count(w1, w2) / count(w1)
 *
 * Generation algorithm:
 * 1. Start with a random sentence-starting word
 * 2. Look up possible next words based on current word
 * 3. Sample next word based on frequency distribution
 * 4. Repeat until sentence ends or max length reached
 *
 * Trade-off: More context (trigrams+) = more coherent but less creative
 * With small training corpus, bigrams provide good balance
 *
 * We train on strong college essay openings to generate suggestions
 * that can inspire students while maintaining originality.
 */

import { MarkovModel, GeneratedSentence } from '../types';
import { ESSAY_OPENINGS_CORPUS } from '../constants/trainingCorpus';

// Pre-trained model (lazy initialization)
let trainedModel: MarkovModel | null = null;

/**
 * Trains a bigram Markov model from the training corpus
 *
 * Process:
 * 1. Split corpus into sentences
 * 2. For each sentence:
 *    a. Tokenize into words
 *    b. Add first word to startWords (for sentence generation)
 *    c. For each adjacent word pair (w1, w2), record the transition
 *
 * Data structure:
 * bigramFrequencies: Map<word, Map<nextWord, count>>
 * Example: { "the": { "old": 3, "summer": 2 }, "old": { "man": 1, "pond": 2 } }
 * This represents: After "the", we saw "old" 3 times, "summer" 2 times, etc.
 *
 * @param corpus - Training text with multiple sentences
 * @returns MarkovModel with bigram frequencies and start words
 */
export function trainMarkovModel(corpus: string): MarkovModel {
  const bigramFrequencies = new Map<string, Map<string, number>>();
  const startWords: string[] = [];
  const wordCounts = new Map<string, number>();

  // Split corpus into sentences
  // Using regex that splits on sentence-ending punctuation
  const sentences = corpus
    .split(/[.!?]+/)
    .map(s => s.trim())
    .filter(s => s.length > 0);

  for (const sentence of sentences) {
    // Tokenize sentence into words
    const words = sentence
      .split(/\s+/)
      .map(word => word.replace(/^[^a-zA-Z']+|[^a-zA-Z']+$/g, ''))
      .filter(word => word.length > 0);

    if (words.length === 0) continue;

    // Add first word to startWords (for sentence generation)
    // Keep original case for first word to maintain capitalization
    startWords.push(words[0]);

    // Build bigram frequencies
    for (let i = 0; i < words.length - 1; i++) {
      const current = words[i].toLowerCase();
      const next = words[i + 1];

      // Initialize inner map if needed
      if (!bigramFrequencies.has(current)) {
        bigramFrequencies.set(current, new Map());
      }

      // Increment count for this bigram
      const nextWords = bigramFrequencies.get(current)!;
      nextWords.set(next, (nextWords.get(next) || 0) + 1);

      // Track total count for each word (for probability calculation)
      wordCounts.set(current, (wordCounts.get(current) || 0) + 1);
    }

    // Handle last word -> sentence end (optional: add punctuation)
    if (words.length > 0) {
      const lastWord = words[words.length - 1].toLowerCase();
      wordCounts.set(lastWord, (wordCounts.get(lastWord) || 0) + 1);
    }
  }

  return {
    bigramFrequencies,
    startWords,
    wordCounts
  };
}

/**
 * Generates a single sentence using the trained Markov model
 *
 * Generation algorithm:
 * 1. Pick random start word from model.startWords
 * 2. Loop until maxWords or no continuation available:
 *    a. Look up bigramFrequencies[currentWord]
 *    b. If no continuations, end sentence
 *    c. Sample next word using weighted random selection
 *    d. Append to sentence
 * 3. Add ending punctuation
 * 4. Return generated sentence
 *
 * Weighted random selection:
 * Given frequencies like {"cat": 3, "dog": 1, "bird": 2}, total = 6
 * Pick random number 0-6, then iterate:
 * - random=4: 4-3=1 (skip cat), 1-1=0 (select dog)
 *
 * @param model - Trained MarkovModel
 * @param maxWords - Maximum words in generated sentence (default 15)
 * @returns GeneratedSentence with text and probability
 */
export function generateSentence(
  model: MarkovModel,
  maxWords: number = 15
): GeneratedSentence {
  if (model.startWords.length === 0) {
    return { text: '', probability: 0 };
  }

  // Pick random start word
  const startIndex = Math.floor(Math.random() * model.startWords.length);
  let currentWord = model.startWords[startIndex];

  const sentence: string[] = [currentWord];
  let probability = 1;

  // Generate words until max length
  for (let i = 1; i < maxWords; i++) {
    // Look up possible next words (use lowercase for lookup)
    const nextWords = model.bigramFrequencies.get(currentWord.toLowerCase());

    // If no continuations found, end sentence
    if (!nextWords || nextWords.size === 0) {
      break;
    }

    // Sample next word using weighted random selection
    const { word: nextWord, prob } = weightedRandomSample(nextWords);

    sentence.push(nextWord);
    probability *= prob;
    currentWord = nextWord;

    // Check for natural ending (word ends with punctuation or is a common ending)
    // We'll add punctuation at the end anyway, so this is optional
  }

  // Build the sentence text
  let text = sentence.join(' ');

  // Capitalize first letter
  text = text.charAt(0).toUpperCase() + text.slice(1);

  // Add ending punctuation if not present
  if (!/[.!?]$/.test(text)) {
    text += '.';
  }

  return { text, probability };
}

/**
 * Performs weighted random sampling from a frequency map
 *
 * @param frequencies - Map of word to frequency count
 * @returns Selected word and its probability
 */
function weightedRandomSample(
  frequencies: Map<string, number>
): { word: string; prob: number } {
  // Calculate total weight
  let total = 0;
  for (const count of frequencies.values()) {
    total += count;
  }

  // Generate random number between 0 and total
  let random = Math.random() * total;

  // Iterate through options, subtracting weights
  for (const [word, count] of frequencies) {
    random -= count;
    if (random <= 0) {
      return { word, prob: count / total };
    }
  }

  // Fallback (shouldn't reach here)
  const firstWord = frequencies.keys().next().value as string | undefined;
  return { word: firstWord || '', prob: 1 / frequencies.size };
}

/**
 * Generates multiple unique sentences
 *
 * Attempts to generate 'count' unique sentences by:
 * 1. Tracking seen sentences in a Set
 * 2. Generating until we have enough unique ones
 * 3. Limiting attempts to avoid infinite loop
 *
 * @param model - Trained MarkovModel
 * @param count - Number of unique sentences to generate
 * @returns Array of GeneratedSentence objects
 */
export function generateSentences(
  model: MarkovModel,
  count: number
): GeneratedSentence[] {
  const seen = new Set<string>();
  const results: GeneratedSentence[] = [];
  const maxAttempts = count * 10; // Limit attempts to avoid infinite loop

  let attempts = 0;
  while (results.length < count && attempts < maxAttempts) {
    const sentence = generateSentence(model);
    attempts++;

    // Skip empty sentences
    if (!sentence.text) continue;

    // Check for uniqueness
    if (!seen.has(sentence.text)) {
      seen.add(sentence.text);
      results.push(sentence);
    }
  }

  return results;
}

/**
 * Gets or creates the trained model (singleton pattern)
 * The model is trained once and cached for subsequent uses
 *
 * @returns Trained MarkovModel
 */
export function getTrainedModel(): MarkovModel {
  if (!trainedModel) {
    trainedModel = trainMarkovModel(ESSAY_OPENINGS_CORPUS);
  }
  return trainedModel;
}

/**
 * Generates opening sentence suggestions using the pre-trained model
 * This is the main function used by the analysis API
 *
 * @param count - Number of suggestions to generate (default 5)
 * @returns Array of GeneratedSentence objects
 */
export function generateOpeningSuggestions(count: number = 5): GeneratedSentence[] {
  const model = getTrainedModel();
  return generateSentences(model, count);
}

/**
 * Gets statistics about the trained model
 * Useful for debugging and understanding the model
 *
 * @param model - MarkovModel to analyze
 * @returns Model statistics
 */
export function getModelStats(model: MarkovModel): {
  vocabularySize: number;
  totalBigrams: number;
  averageTransitions: number;
  startWordsCount: number;
} {
  let totalBigrams = 0;
  for (const nextWords of model.bigramFrequencies.values()) {
    for (const count of nextWords.values()) {
      totalBigrams += count;
    }
  }

  const vocabularySize = model.bigramFrequencies.size;
  const averageTransitions = vocabularySize > 0
    ? Math.round((totalBigrams / vocabularySize) * 10) / 10
    : 0;

  return {
    vocabularySize,
    totalBigrams,
    averageTransitions,
    startWordsCount: model.startWords.length
  };
}
