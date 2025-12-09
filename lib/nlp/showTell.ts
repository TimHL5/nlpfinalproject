/**
 * SHOW VS TELL ANALYSIS MODULE (Simplified POS Analysis)
 *
 * This module analyzes the balance between "showing" and "telling" in essays.
 * It uses simplified Part-of-Speech concepts from CSCI 3310 (Week 6).
 *
 * POS Tagging concepts from class:
 * - POS tagging assigns grammatical labels to words (noun, verb, adjective, etc.)
 * - Penn Treebank uses 45 tags, Universal Dependencies uses 17
 * - Ambiguity is challenging: "flies" can be noun or verb
 * - Modern taggers achieve ~97% accuracy
 *
 * For this project, we use a SIMPLIFIED "pseudo-POS" approach:
 * - Instead of a full tagger, we use curated word lists and patterns
 * - "Tell" patterns: Regex patterns matching statements like "I was nervous"
 * - "Show" verbs: A set of action verbs that demonstrate rather than state
 *
 * "Show don't tell" is fundamental writing advice:
 * - TELL: "I was nervous" (states emotion directly)
 * - SHOW: "My hands trembled as I stepped onto the stage" (demonstrates through action)
 *
 * From a POS perspective:
 * - "Tell" phrases typically follow: PRONOUN + BE-VERB + ADJECTIVE
 * - "Show" phrases use: strong ACTION-VERB constructions
 *
 * This simplified approach is appropriate for the course scope while
 * still demonstrating understanding of POS concepts.
 */

import { ShowTellAnalysis, TellPhrase } from '../types';
import { TELL_PATTERNS, SHOW_VERBS } from '../constants/showTellWords';

/**
 * Analyzes the show vs tell balance in the given text
 *
 * Process:
 * 1. Find "tell" phrases using regex patterns
 * 2. Count "show" verbs by checking against the SHOW_VERBS set
 * 3. Calculate the show ratio: show / (show + tell)
 * 4. Generate a rating and feedback
 *
 * @param text - The original essay text (for regex matching)
 * @param words - Array of cleaned, lowercase word tokens
 * @returns ShowTellAnalysis with counts, ratio, and feedback
 */
export function analyzeShowTell(text: string, words: string[]): ShowTellAnalysis {
  if (!text.trim() || words.length === 0) {
    return {
      tellCount: 0,
      showCount: 0,
      tellPhrases: [],
      showVerbs: [],
      ratio: 0,
      rating: 'needs-work',
      feedback: 'Not enough text to analyze.'
    };
  }

  // Find "tell" phrases using regex patterns
  const tellPhrases = findTellPhrases(text);
  const tellCount = tellPhrases.length;

  // Count "show" verbs from the word list
  const showVerbs = findShowVerbs(words);
  const showCount = showVerbs.length;

  // Calculate the show ratio
  // Handle division by zero when both counts are 0
  const total = showCount + tellCount;
  const ratio = total > 0 ? showCount / total : 0;

  // Generate rating and feedback
  const rating = getRating(ratio);
  const feedback = generateFeedback(ratio, tellCount, showCount, tellPhrases);

  return {
    tellCount,
    showCount,
    tellPhrases,
    showVerbs,
    ratio,
    rating,
    feedback
  };
}

/**
 * Finds "tell" phrases in the text using regex patterns
 *
 * "Tell" phrases are passive statements about internal states.
 * They follow patterns like:
 * - "I am/was [adjective]"
 * - "I feel/felt [something]"
 * - "I think/believe [that...]"
 *
 * These make essays feel distant and unconvincing.
 *
 * @param text - The original essay text
 * @returns Array of TellPhrase objects with match details
 */
function findTellPhrases(text: string): TellPhrase[] {
  const phrases: TellPhrase[] = [];

  for (const { pattern, suggestion } of TELL_PATTERNS) {
    // Reset lastIndex for each pattern (important for global regex)
    pattern.lastIndex = 0;

    let match: RegExpExecArray | null;
    while ((match = pattern.exec(text)) !== null) {
      phrases.push({
        phrase: match[0],
        index: match.index,
        suggestion
      });

      // Safety check to prevent infinite loop
      if (match.index === pattern.lastIndex) {
        pattern.lastIndex++;
      }
    }
  }

  // Sort by position in text
  return phrases.sort((a, b) => a.index - b.index);
}

/**
 * Finds "show" verbs in the word list
 *
 * "Show" verbs are strong action verbs that demonstrate rather than state.
 * Examples: grabbed, whispered, trembled, dashed, created
 *
 * We check each word against our curated SHOW_VERBS set, which includes
 * verbs in multiple tenses (ran, run, running).
 *
 * @param words - Array of cleaned, lowercase word tokens
 * @returns Array of show verbs found in the text
 */
function findShowVerbs(words: string[]): string[] {
  const found: string[] = [];

  for (const word of words) {
    if (SHOW_VERBS.has(word)) {
      found.push(word);
    }
  }

  return found;
}

/**
 * Determines the rating based on the show ratio
 *
 * Rating criteria:
 * - excellent: > 75% showing (mostly vivid, active writing)
 * - good: 60-75% showing (solid balance)
 * - needs-work: 40-60% showing (too much telling)
 * - poor: < 40% showing (heavy telling, distant writing)
 *
 * @param ratio - Show ratio (0-1)
 * @returns Rating string
 */
function getRating(ratio: number): 'excellent' | 'good' | 'needs-work' | 'poor' {
  if (ratio >= 0.75) return 'excellent';
  if (ratio >= 0.60) return 'good';
  if (ratio >= 0.40) return 'needs-work';
  return 'poor';
}

/**
 * Generates feedback based on the show/tell analysis
 *
 * @param ratio - Show ratio (0-1)
 * @param tellCount - Number of tell phrases
 * @param showCount - Number of show verbs
 * @param tellPhrases - Array of TellPhrase objects
 * @returns Feedback message string
 */
function generateFeedback(
  ratio: number,
  tellCount: number,
  showCount: number,
  tellPhrases: TellPhrase[]
): string {
  const percentage = Math.round(ratio * 100);

  if (ratio >= 0.75) {
    return `Excellent showing! ${percentage}% of your emotional content uses action and detail rather than direct statements. Your writing is vivid and engaging.`;
  }

  if (ratio >= 0.60) {
    return `Good balance of showing vs telling (${percentage}% showing). Your writing has vivid moments. Consider converting a few more "tell" phrases to demonstrate through action.`;
  }

  if (ratio >= 0.40) {
    const examples = getTopTellExamples(tellPhrases, 2);
    let feedback = `Your show/tell ratio needs improvement (${percentage}% showing). `;
    feedback += `Found ${tellCount} "tell" phrases that could be more vivid. `;
    if (examples.length > 0) {
      feedback += `Examples to revise: ${examples.join('; ')}`;
    }
    return feedback;
  }

  const examples = getTopTellExamples(tellPhrases, 3);
  let feedback = `Heavy on telling (only ${percentage}% showing). `;
  feedback += `Your essay states feelings and thoughts directly rather than demonstrating them. `;
  feedback += `This makes the writing feel distant. `;
  if (examples.length > 0) {
    feedback += `Key phrases to revise: ${examples.join('; ')}`;
  }
  return feedback;
}

/**
 * Gets example "tell" phrases for feedback
 *
 * @param tellPhrases - Array of TellPhrase objects
 * @param count - Number of examples to return
 * @returns Array of example strings
 */
function getTopTellExamples(tellPhrases: TellPhrase[], count: number): string[] {
  return tellPhrases
    .slice(0, count)
    .map(p => `"${p.phrase.trim()}" → ${p.suggestion.split('.')[0]}`);
}

/**
 * Gets specific revision suggestions for tell phrases
 *
 * @param analysis - The ShowTellAnalysis result
 * @param limit - Maximum number of suggestions
 * @returns Array of revision suggestions
 */
export function getShowTellSuggestions(
  analysis: ShowTellAnalysis,
  limit: number = 5
): Array<{ original: string; suggestion: string }> {
  return analysis.tellPhrases.slice(0, limit).map(phrase => ({
    original: phrase.phrase.trim(),
    suggestion: phrase.suggestion
  }));
}

/**
 * Groups show verbs by category for display
 *
 * @param showVerbs - Array of show verbs found
 * @returns Object mapping categories to verb arrays
 */
export function groupShowVerbsByCategory(
  showVerbs: string[]
): Record<string, string[]> {
  const categories: Record<string, string[]> = {
    movement: [],
    communication: [],
    interaction: [],
    creation: [],
    sensory: [],
    other: []
  };

  // Simple categorization based on verb meanings
  const categoryMap: Record<string, string> = {
    // Movement
    ran: 'movement', walked: 'movement', jumped: 'movement', climbed: 'movement',
    fell: 'movement', rushed: 'movement', dashed: 'movement', sprinted: 'movement',

    // Communication
    shouted: 'communication', whispered: 'communication', screamed: 'communication',
    laughed: 'communication', cried: 'communication', sighed: 'communication',

    // Interaction
    grabbed: 'interaction', pushed: 'interaction', pulled: 'interaction',
    held: 'interaction', touched: 'interaction', caught: 'interaction',

    // Creation
    built: 'creation', created: 'creation', designed: 'creation',
    crafted: 'creation', formed: 'creation', developed: 'creation',

    // Sensory
    watched: 'sensory', observed: 'sensory', noticed: 'sensory',
    heard: 'sensory', listened: 'sensory', smelled: 'sensory'
  };

  for (const verb of showVerbs) {
    const category = categoryMap[verb] || 'other';
    if (!categories[category].includes(verb)) {
      categories[category].push(verb);
    }
  }

  // Remove empty categories
  return Object.fromEntries(
    Object.entries(categories).filter(([, verbs]) => verbs.length > 0)
  );
}
