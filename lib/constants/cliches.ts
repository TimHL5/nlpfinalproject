/**
 * CLICHÉ PATTERNS FOR COLLEGE ESSAYS
 *
 * These patterns use regular expressions (Week 11 concept from CSCI 3310)
 * to detect overused phrases commonly found in college application essays.
 *
 * Regex concepts used:
 * - \b: Word boundary - ensures we match whole words, not parts
 * - (a|b): Alternation - matches either 'a' or 'b'
 * - ?: Makes the preceding element optional (0 or 1 occurrence)
 * - +: One or more of the preceding element
 * - *: Zero or more of the preceding element
 * - \s: Whitespace character
 * - gi: Flags - g (global, find all matches), i (case-insensitive)
 *
 * IMPORTANT: We avoid catastrophic backtracking by:
 * - Using specific patterns rather than .*
 * - Limiting repetition with bounded quantifiers where possible
 * - Testing patterns with long inputs before deployment
 */

import { ClichePattern } from '../types';

export const CLICHE_PATTERNS: ClichePattern[] = [
  // Opening clichés - these are the most overused essay starters
  {
    pattern: /\bever since i was (young|a child|a kid|little|small)\b/gi,
    name: "Ever since I was young...",
    suggestion: "Start with a specific moment or scene instead of a generic time frame"
  },
  {
    pattern: /\bfrom a (young|early) age\b/gi,
    name: "From a young age",
    suggestion: "Show this through a specific childhood memory with vivid details"
  },
  {
    pattern: /\bi('ve| have)? always (wanted|dreamed|knew|loved|been passionate)\b/gi,
    name: "I always wanted/dreamed...",
    suggestion: "Describe what sparked this desire with a specific moment"
  },

  // "Passion" clichés - admissions officers see these constantly
  {
    pattern: /\b(passionate|passion) (about|for)\b/gi,
    name: "Passionate about",
    suggestion: "Show your passion through concrete actions and specific details"
  },
  {
    pattern: /\bfound my (true )?passion\b/gi,
    name: "Found my passion",
    suggestion: "Describe the discovery moment and what draws you to it specifically"
  },

  // "Change" clichés
  {
    pattern: /\bmade me (who i am|the person i am)( today)?\b/gi,
    name: "Made me who I am today",
    suggestion: "Be specific about what changed and demonstrate it through examples"
  },
  {
    pattern: /\bchanged my (life|perspective|view|outlook|way of thinking)\b/gi,
    name: "Changed my life/perspective",
    suggestion: "Describe your before and after with concrete details"
  },
  {
    pattern: /\blife[- ]?changing (experience|moment|event)\b/gi,
    name: "Life-changing experience",
    suggestion: "Show the change through specific scenes, not labels"
  },

  // "Lesson learned" clichés
  {
    pattern: /\btaught me (the importance|a valuable|an important|a lot|so much)\b/gi,
    name: "Taught me the importance of...",
    suggestion: "Show the lesson through a scene or example rather than stating it"
  },
  {
    pattern: /\blearning experience\b/gi,
    name: "Learning experience",
    suggestion: "Name the specific lesson and show how you apply it"
  },
  {
    pattern: /\bvaluable (life )?lesson\b/gi,
    name: "Valuable lesson",
    suggestion: "State the lesson directly and show its impact"
  },

  // "Eye-opening" clichés
  {
    pattern: /\b(opened|open) my eyes\b/gi,
    name: "Opened my eyes",
    suggestion: "Describe specifically what you now see differently"
  },
  {
    pattern: /\beye[- ]?opening\b/gi,
    name: "Eye-opening experience",
    suggestion: "Use a more specific and original descriptor"
  },

  // "Comfort zone" clichés
  {
    pattern: /\b(out(side)?|beyond|outside of|stepped out of) my comfort zone\b/gi,
    name: "Outside my comfort zone",
    suggestion: "Describe the discomfort with specific physical or emotional details"
  },
  {
    pattern: /\bpushed my (limits|boundaries)\b/gi,
    name: "Pushed my limits",
    suggestion: "Show the pushing through action and specific challenges"
  },

  // Filler phrases
  {
    pattern: /\bat the end of the day\b/gi,
    name: "At the end of the day",
    suggestion: "Simply state your conclusion directly"
  },
  {
    pattern: /\bin today'?s (society|world|day and age)\b/gi,
    name: "In today's society",
    suggestion: "Be specific about what aspect of contemporary life you mean"
  },
  {
    pattern: /\bsince the (dawn|beginning) of time\b/gi,
    name: "Since the dawn of time",
    suggestion: "Remove entirely - this is rarely necessary or accurate"
  },
  {
    pattern: /\bwhen all (is|was) said and done\b/gi,
    name: "When all is said and done",
    suggestion: "State your point directly without this filler"
  },
  {
    pattern: /\b(in )?the grand scheme of things\b/gi,
    name: "In the grand scheme of things",
    suggestion: "Remove or be specific about what larger context you mean"
  },

  // Dictionary definition opener - one of the worst essay openings
  {
    pattern: /\b(the )?dictionary defines\b/gi,
    name: "The dictionary defines...",
    suggestion: "Never start an essay with a dictionary definition - show, don't define"
  },
  {
    pattern: /\bwebster'?s? (defines|definition)\b/gi,
    name: "Webster's defines...",
    suggestion: "Avoid dictionary definitions entirely - demonstrate meaning through story"
  },

  // Memory clichés
  {
    pattern: /\bi remember (it )?like it was yesterday\b/gi,
    name: "I remember it like it was yesterday",
    suggestion: "Just describe the memory vividly with sensory details"
  },
  {
    pattern: /\blittle did i know\b/gi,
    name: "Little did I know",
    suggestion: "Simply describe what happened and what you learned"
  },

  // Impact clichés
  {
    pattern: /\bplayed a (big|huge|major|significant|important) (role|part)\b/gi,
    name: "Played a big role",
    suggestion: "Describe the specific impact with concrete examples"
  },
  {
    pattern: /\bhad a (big|huge|major|significant|profound) (impact|effect|influence)\b/gi,
    name: "Had a major impact",
    suggestion: "Show the impact through specific changes or outcomes"
  },

  // Overused descriptors
  {
    pattern: /\b(truly|really|extremely|incredibly|absolutely) (unique|special|amazing)\b/gi,
    name: "Truly unique/special",
    suggestion: "Remove the intensifier or find a more specific descriptor"
  },

  // Conclusion clichés
  {
    pattern: /\bin conclusion\b/gi,
    name: "In conclusion",
    suggestion: "Let your conclusion speak for itself without announcing it"
  },
  {
    pattern: /\bthis experience (taught me|showed me|made me realize)\b/gi,
    name: "This experience taught me...",
    suggestion: "Show the realization through action, not statement"
  }
];
