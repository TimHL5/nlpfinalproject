/**
 * CLICHÉ DETECTION MODULE
 *
 * This module uses regular expressions (Week 11 concept from CSCI 3310)
 * to detect overused phrases commonly found in college application essays.
 *
 * Key regex concepts from class:
 * - Character classes: [a-z] matches any lowercase letter
 * - Quantifiers: * (0+), + (1+), ? (0 or 1)
 * - Alternation: (word1|word2) matches either word
 * - Word boundaries: \b ensures we match whole words, not substrings
 * - Case insensitivity: /pattern/gi flags (g = global, i = case-insensitive)
 * - Capturing groups: (captured) for extracting matched text
 * - Lookbehind/Lookahead: (?<=...) and (?=...) for context matching
 *
 * IMPORTANT: Avoiding catastrophic backtracking
 * From the Cloudflare outage case study in class, we learned that poorly
 * written regex with nested quantifiers like .*.*= can cause exponential
 * time complexity. Our patterns use:
 * - Specific patterns rather than generic .*
 * - Word boundaries \b to limit matching scope
 * - Bounded quantifiers where possible
 *
 * Each pattern includes a suggestion for how to improve the essay.
 */

import { ClicheMatch, ClicheAnalysis } from '../types';
import { CLICHE_PATTERNS } from '../constants/cliches';

/**
 * Detects clichés in the given text
 *
 * Process:
 * 1. Iterate through all cliché patterns
 * 2. For each pattern, use RegExp.exec() in a loop to find all matches
 *    (String.match() doesn't give us indices, which we need for highlighting)
 * 3. Store the match text, position (index), and improvement suggestion
 * 4. Calculate severity based on total count
 *
 * Using exec() with global flag:
 * When a regex has the 'g' flag, exec() remembers the lastIndex and
 * finds the next match on each call. We reset lastIndex before each
 * pattern to ensure fresh matching.
 *
 * @param text - The essay text to analyze
 * @returns ClicheAnalysis with matches and severity rating
 */
export function detectCliches(text: string): ClicheAnalysis {
  if (!text.trim()) {
    return {
      totalCliches: 0,
      matches: [],
      severity: 'none'
    };
  }

  const matches: ClicheMatch[] = [];

  // Iterate through each cliché pattern
  for (const { pattern, name, suggestion } of CLICHE_PATTERNS) {
    // Reset lastIndex to start fresh for each pattern
    // This is important because we're reusing regex objects with 'g' flag
    pattern.lastIndex = 0;

    // Use exec() in a loop to find all matches with their positions
    let match: RegExpExecArray | null;
    while ((match = pattern.exec(text)) !== null) {
      matches.push({
        pattern: name,
        match: match[0],       // The actual matched text
        index: match.index,    // Position in original text (for highlighting)
        suggestion
      });

      // Safety check to prevent infinite loop if regex doesn't advance
      // This can happen with some zero-width assertions
      if (match.index === pattern.lastIndex) {
        pattern.lastIndex++;
      }
    }
  }

  // Sort matches by their position in the text
  matches.sort((a, b) => a.index - b.index);

  // Determine severity based on cliché count
  const totalCliches = matches.length;
  const severity = getSeverity(totalCliches);

  return {
    totalCliches,
    matches,
    severity
  };
}

/**
 * Determines the severity rating based on number of clichés found
 *
 * Severity levels:
 * - none: 0 clichés - Excellent! Essay avoids common pitfalls
 * - minor: 1-2 clichés - Acceptable, but could be improved
 * - major: 3+ clichés - Significant issue, essay may feel unoriginal
 *
 * @param count - Number of clichés detected
 * @returns Severity rating
 */
function getSeverity(count: number): 'none' | 'minor' | 'major' {
  if (count === 0) return 'none';
  if (count <= 2) return 'minor';
  return 'major';
}

/**
 * Gets feedback message based on cliché analysis results
 *
 * Provides context-appropriate advice for different severity levels
 *
 * @param analysis - The ClicheAnalysis result
 * @returns Feedback message string
 */
export function getClicheFeedback(analysis: ClicheAnalysis): string {
  switch (analysis.severity) {
    case 'none':
      return 'Excellent! Your essay avoids common clichés. Your voice sounds authentic and original.';

    case 'minor':
      return `Found ${analysis.totalCliches} cliché${analysis.totalCliches > 1 ? 's' : ''}. Consider revising these phrases to make your essay more original. Admissions officers read thousands of essays with these exact phrases.`;

    case 'major':
      return `Found ${analysis.totalCliches} clichés. This is a significant concern - your essay may blend in with thousands of others. Focus on replacing these phrases with specific details and original language that only you could write.`;

    default:
      return '';
  }
}

/**
 * Highlights clichés in the original text using markdown-style markers
 * Useful for displaying where clichés appear in the essay
 *
 * @param text - Original essay text
 * @param matches - Array of ClicheMatch objects
 * @returns Text with clichés wrapped in **markers**
 */
export function highlightCliches(text: string, matches: ClicheMatch[]): string {
  if (matches.length === 0) return text;

  // Sort matches by index in reverse order so we can insert markers
  // without messing up subsequent indices
  const sortedMatches = [...matches].sort((a, b) => b.index - a.index);

  let result = text;
  for (const match of sortedMatches) {
    const before = result.slice(0, match.index);
    const cliche = result.slice(match.index, match.index + match.match.length);
    const after = result.slice(match.index + match.match.length);
    result = `${before}**${cliche}**${after}`;
  }

  return result;
}

/**
 * Groups clichés by category for better organization in the UI
 *
 * Categories:
 * - opening: Essay opening clichés
 * - passion: Overused "passion" phrases
 * - change: "Changed my life" type phrases
 * - lesson: "Learned a lesson" type phrases
 * - filler: Generic filler phrases
 *
 * @param matches - Array of ClicheMatch objects
 * @returns Object mapping categories to arrays of matches
 */
export function groupClichesByCategory(
  matches: ClicheMatch[]
): Record<string, ClicheMatch[]> {
  const categories: Record<string, ClicheMatch[]> = {
    opening: [],
    passion: [],
    change: [],
    lesson: [],
    filler: [],
    other: []
  };

  for (const match of matches) {
    const pattern = match.pattern.toLowerCase();

    if (pattern.includes('ever since') || pattern.includes('young age') ||
        pattern.includes('always wanted') || pattern.includes('dictionary')) {
      categories.opening.push(match);
    } else if (pattern.includes('passion')) {
      categories.passion.push(match);
    } else if (pattern.includes('change') || pattern.includes('who i am') ||
               pattern.includes('eye')) {
      categories.change.push(match);
    } else if (pattern.includes('taught') || pattern.includes('lesson') ||
               pattern.includes('experience') || pattern.includes('comfort zone')) {
      categories.lesson.push(match);
    } else if (pattern.includes('end of the day') || pattern.includes('society') ||
               pattern.includes('dawn of time') || pattern.includes('conclusion')) {
      categories.filler.push(match);
    } else {
      categories.other.push(match);
    }
  }

  // Remove empty categories
  return Object.fromEntries(
    Object.entries(categories).filter(([, matches]) => matches.length > 0)
  );
}
