/**
 * NLP MODULE INDEX
 *
 * This file exports all NLP functions and provides the main analysis function
 * that combines all individual analyses into a comprehensive result.
 *
 * All NLP logic is implemented from scratch without external libraries,
 * demonstrating understanding of concepts from CSCI 3310:
 * - Tokenization (Week 5)
 * - Frequency Analysis / Bag of Words (Week 5)
 * - Part-of-Speech concepts (Week 6)
 * - Regular Expressions (Week 11)
 * - N-grams and Markov Chains (Week 12)
 */

// Export all tokenization functions
export {
  tokenize,
  tokenizeWords,
  tokenizeSentences,
  tokenizeParagraphs,
  countWords,
  countSentences,
  countParagraphs
} from './tokenizer';

// Export all statistics functions
export {
  calculateStatistics,
  getLengthStatus,
  getReadingLevel,
  getVocabularyComplexity
} from './statistics';

// Export all vocabulary functions
export {
  analyzeVocabulary,
  getVocabularyRating,
  getTopContentWords
} from './vocabulary';

// Export all cliché detection functions
export {
  detectCliches,
  getClicheFeedback,
  highlightCliches,
  groupClichesByCategory
} from './clicheDetector';

// Export all sentence starter functions
export {
  analyzeSentenceStarters,
  getSentenceStarterFeedback,
  ALTERNATIVE_STARTERS
} from './sentenceStarters';

// Export all show vs tell functions
export {
  analyzeShowTell,
  getShowTellSuggestions,
  groupShowVerbsByCategory
} from './showTell';

// Export all Markov chain functions
export {
  trainMarkovModel,
  generateSentence,
  generateSentences,
  getTrainedModel,
  generateOpeningSuggestions,
  getModelStats
} from './markovChain';

// Import types
import { EssayAnalysis, OverallScore } from '../types';

// Import individual analysis functions
import { tokenize } from './tokenizer';
import { calculateStatistics } from './statistics';
import { analyzeVocabulary } from './vocabulary';
import { detectCliches } from './clicheDetector';
import { analyzeSentenceStarters } from './sentenceStarters';
import { analyzeShowTell } from './showTell';
import { generateOpeningSuggestions } from './markovChain';

/**
 * Main analysis function that performs comprehensive essay analysis
 *
 * This is the primary function called by the API endpoint.
 * It orchestrates all individual analyses and combines them
 * into a single EssayAnalysis result.
 *
 * @param text - The essay text to analyze
 * @returns Complete EssayAnalysis object
 */
export function analyzeEssay(text: string): EssayAnalysis {
  // Step 1: Tokenize the text
  const tokens = tokenize(text);

  // Step 2: Calculate basic statistics
  const statistics = calculateStatistics(
    tokens.words,
    tokens.sentences,
    tokens.paragraphs,
    text
  );

  // Step 3: Analyze vocabulary
  const vocabulary = analyzeVocabulary(tokens.words);

  // Step 4: Detect clichés
  const cliches = detectCliches(text);

  // Step 5: Analyze sentence starters
  const sentenceStarters = analyzeSentenceStarters(tokens.sentences);

  // Step 6: Analyze show vs tell
  const showTell = analyzeShowTell(text, tokens.words);

  // Step 7: Generate opening suggestions
  const generatedOpenings = generateOpeningSuggestions(5);

  // Step 8: Calculate overall score
  const overallScore = calculateOverallScore({
    statistics,
    vocabulary,
    cliches,
    sentenceStarters,
    showTell
  });

  return {
    essay: {
      text,
      wordCount: tokens.words.length
    },
    statistics,
    vocabulary,
    sentenceStarters,
    cliches,
    showTell,
    generatedOpenings,
    overallScore,
    timestamp: new Date().toISOString()
  };
}

/**
 * Calculates an overall score based on all analysis components
 *
 * Scoring breakdown (100 points total):
 * - Length (appropriate for Common App): 15 points
 * - Vocabulary richness (types/tokens ratio): 20 points
 * - Sentence variety (varied starters, low "I" %): 20 points
 * - Clichés (fewer is better): 25 points
 * - Show vs Tell (higher show ratio): 20 points
 *
 * @param analysis - Object containing all individual analyses
 * @returns OverallScore with numerical score, grade, and feedback
 */
function calculateOverallScore(analysis: {
  statistics: EssayAnalysis['statistics'];
  vocabulary: EssayAnalysis['vocabulary'];
  cliches: EssayAnalysis['cliches'];
  sentenceStarters: EssayAnalysis['sentenceStarters'];
  showTell: EssayAnalysis['showTell'];
}): OverallScore {
  let score = 0;
  const strengths: string[] = [];
  const improvements: string[] = [];

  // Length score (15 points)
  const lengthStatus = analysis.statistics.lengthStatus.status;
  if (lengthStatus === 'good') {
    score += 15;
    strengths.push('Appropriate essay length');
  } else if (lengthStatus === 'short' || lengthStatus === 'long') {
    score += 10;
    improvements.push(lengthStatus === 'short'
      ? 'Consider expanding to reach 250 words'
      : 'Consider trimming to stay under 650 words');
  } else {
    score += 5;
    improvements.push(lengthStatus === 'too-short'
      ? 'Essay is very short - develop your ideas more'
      : 'Essay is significantly over the word limit');
  }

  // Vocabulary richness score (20 points)
  // Type-token ratio: higher is better, but adjust for essay length
  const ttr = analysis.vocabulary.vocabularyRichness;
  const wordCount = analysis.vocabulary.totalWords;
  // Adjust expectation for longer texts (TTR naturally decreases)
  const adjustedTTR = ttr * Math.min(1, 300 / Math.max(wordCount, 100));

  if (adjustedTTR >= 0.5) {
    score += 20;
    strengths.push('Excellent vocabulary variety');
  } else if (adjustedTTR >= 0.4) {
    score += 15;
    strengths.push('Good vocabulary variety');
  } else if (adjustedTTR >= 0.3) {
    score += 10;
    improvements.push('Consider using more varied vocabulary');
  } else {
    score += 5;
    improvements.push('Vocabulary is repetitive - use more synonyms');
  }

  // Sentence variety score (20 points)
  const iPercentage = analysis.sentenceStarters.iStartPercentage;
  const variety = analysis.sentenceStarters.variety;

  if (variety === 'good') {
    score += 20;
    strengths.push('Good sentence variety');
  } else if (variety === 'moderate') {
    score += 12;
    if (iPercentage > 25) {
      improvements.push(`${iPercentage}% of sentences start with "I" - vary your starters`);
    } else {
      improvements.push('Consider varying your sentence starters more');
    }
  } else {
    score += 5;
    improvements.push(`Too many sentences start the same way (${iPercentage}% with "I")`);
  }

  // Cliché score (25 points)
  const clicheCount = analysis.cliches.totalCliches;

  if (clicheCount === 0) {
    score += 25;
    strengths.push('No clichés detected - original language');
  } else if (clicheCount <= 2) {
    score += 15;
    improvements.push(`${clicheCount} cliché${clicheCount > 1 ? 's' : ''} found - consider revising`);
  } else if (clicheCount <= 4) {
    score += 8;
    improvements.push(`${clicheCount} clichés make your essay feel less original`);
  } else {
    score += 3;
    improvements.push(`${clicheCount} clichés - major issue, essay may blend in with thousands of others`);
  }

  // Show vs Tell score (20 points)
  const showRatio = analysis.showTell.ratio;
  const showRating = analysis.showTell.rating;

  if (showRating === 'excellent') {
    score += 20;
    strengths.push('Excellent use of vivid, showing language');
  } else if (showRating === 'good') {
    score += 15;
    strengths.push('Good balance of showing vs telling');
  } else if (showRating === 'needs-work') {
    score += 10;
    improvements.push('More "showing" through action would strengthen your writing');
  } else {
    score += 5;
    improvements.push('Too much "telling" - show emotions through actions and details');
  }

  // Calculate grade
  const grade = getGrade(score);

  return {
    score,
    grade,
    strengths: strengths.slice(0, 3), // Top 3 strengths
    improvements: improvements.slice(0, 3) // Top 3 improvements
  };
}

/**
 * Converts numerical score to letter grade
 *
 * @param score - Numerical score (0-100)
 * @returns Letter grade
 */
function getGrade(score: number): 'A' | 'B' | 'C' | 'D' | 'F' {
  if (score >= 90) return 'A';
  if (score >= 80) return 'B';
  if (score >= 70) return 'C';
  if (score >= 60) return 'D';
  return 'F';
}
