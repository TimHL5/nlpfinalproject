/**
 * TYPE DEFINITIONS FOR ESSAY INSIGHT
 *
 * This file contains all TypeScript interfaces used throughout the application.
 * These types define the structure of analysis results from our NLP modules.
 */

// ============================================================================
// TOKENIZATION TYPES
// ============================================================================

export interface TokenizationResult {
  words: string[];           // Cleaned, lowercase words (tokens)
  rawWords: string[];        // Original words with punctuation preserved
  sentences: string[];       // Complete sentences
  paragraphs: string[];      // Paragraphs (split on double newline)
}

// ============================================================================
// STATISTICS TYPES
// ============================================================================

export interface BasicStatistics {
  wordCount: number;
  sentenceCount: number;
  paragraphCount: number;
  avgSentenceLength: number;      // words per sentence
  avgWordLength: number;          // characters per word
  charactersWithSpaces: number;
  charactersWithoutSpaces: number;
  lengthStatus: LengthStatus;
}

export interface LengthStatus {
  status: 'too-short' | 'short' | 'good' | 'long' | 'too-long';
  message: string;
  wordCount: number;
  targetMin: number;
  targetMax: number;
}

// ============================================================================
// VOCABULARY TYPES
// ============================================================================

export interface VocabularyAnalysis {
  totalWords: number;           // Total tokens
  uniqueWords: number;          // Total types (unique words)
  vocabularyRichness: number;   // types/tokens ratio (0-1)
  wordFrequencies: Map<string, number>;
  overusedWords: OverusedWord[];
}

export interface OverusedWord {
  word: string;
  count: number;
  suggestion: string;  // Alternative word suggestion
}

// ============================================================================
// SENTENCE STARTERS TYPES (N-gram Analysis)
// ============================================================================

export interface SentenceStarterAnalysis {
  totalSentences: number;
  starterFrequencies: Map<string, number>;
  iStartCount: number;
  iStartPercentage: number;
  repetitiveStarters: RepetitiveStarter[];
  variety: 'good' | 'moderate' | 'poor';
  suggestions: string[];
}

export interface RepetitiveStarter {
  word: string;
  count: number;
  percentage: number;
}

// ============================================================================
// CLICHÉ DETECTION TYPES (Regex Analysis)
// ============================================================================

export interface ClicheMatch {
  pattern: string;      // The cliché pattern that was matched
  match: string;        // The actual text that matched
  index: number;        // Position in text
  suggestion: string;   // How to improve
}

export interface ClicheAnalysis {
  totalCliches: number;
  matches: ClicheMatch[];
  severity: 'none' | 'minor' | 'major';  // 0, 1-2, 3+ clichés
}

// ============================================================================
// SHOW VS TELL TYPES (Simplified POS Analysis)
// ============================================================================

export interface ShowTellAnalysis {
  tellCount: number;
  showCount: number;
  tellPhrases: TellPhrase[];
  showVerbs: string[];
  ratio: number;  // show / (show + tell), 0-1
  rating: 'excellent' | 'good' | 'needs-work' | 'poor';
  feedback: string;
}

export interface TellPhrase {
  phrase: string;
  index: number;
  suggestion: string;
}

// ============================================================================
// MARKOV CHAIN TYPES
// ============================================================================

export interface MarkovModel {
  bigramFrequencies: Map<string, Map<string, number>>;
  startWords: string[];
  wordCounts: Map<string, number>;
}

export interface GeneratedSentence {
  text: string;
  probability: number;  // Product of transition probabilities
}

// ============================================================================
// OVERALL ANALYSIS TYPES
// ============================================================================

export interface OverallScore {
  score: number;  // 0-100
  grade: 'A' | 'B' | 'C' | 'D' | 'F';
  strengths: string[];
  improvements: string[];
}

export interface EssayAnalysis {
  essay: {
    text: string;
    wordCount: number;
  };
  statistics: BasicStatistics;
  vocabulary: VocabularyAnalysis;
  sentenceStarters: SentenceStarterAnalysis;
  cliches: ClicheAnalysis;
  showTell: ShowTellAnalysis;
  generatedOpenings: GeneratedSentence[];
  overallScore: OverallScore;
  timestamp: string;
}

// ============================================================================
// PATTERN TYPES
// ============================================================================

export interface ClichePattern {
  pattern: RegExp;
  name: string;
  suggestion: string;
}

export interface TellPattern {
  pattern: RegExp;
  suggestion: string;
}
