/**
 * SHOW VS TELL WORD LISTS
 *
 * This module contains word lists for simplified POS (Part-of-Speech) analysis.
 * From CSCI 3310 (Week 6), we learned that POS tagging assigns grammatical
 * labels to words. While a full POS tagger would use statistical models or
 * neural networks, we use a simplified approach with curated word lists.
 *
 * "Show don't tell" is fundamental writing advice:
 * - TELL: "I was nervous" (states emotion directly)
 * - SHOW: "My hands trembled as I stepped toward the stage"
 *
 * TELL patterns typically follow: PRONOUN + BE-VERB + ADJECTIVE
 * SHOW patterns use: strong ACTION-VERB constructions
 */

import { TellPattern } from '../types';

/**
 * "Tell" patterns - These are regex patterns that identify passive statements
 * about internal states. Essays heavy in these feel distant and unconvincing.
 */
export const TELL_PATTERNS: TellPattern[] = [
  // "I am/was [adjective]" - direct state claims
  {
    pattern: /\bi (am|was|'m)\s+(\w+)/gi,
    suggestion: "Show this through actions or physical details instead of stating it"
  },

  // "I feel/felt [adjective]" - emotion claims
  {
    pattern: /\bi (feel|felt)\s+(\w+)/gi,
    suggestion: "Describe physical sensations that accompany this feeling"
  },

  // "I think/thought [that]" - internal cognition claims
  {
    pattern: /\bi (think|thought)\s+(that\s+)?/gi,
    suggestion: "State the thought directly or show the reasoning process"
  },

  // "I believe/believed [that]" - belief claims
  {
    pattern: /\bi (believe|believed)\s+(that\s+)?/gi,
    suggestion: "Demonstrate this belief through your actions or decisions"
  },

  // "I know/knew [that]" - knowledge claims
  {
    pattern: /\bi (know|knew)\s+(that\s+)?/gi,
    suggestion: "Show how you came to know this through experience"
  },

  // "I realize/realized [that]" - realization claims
  {
    pattern: /\bi (realize|realized)\s+(that\s+)?/gi,
    suggestion: "Describe the moment of realization with specific details"
  },

  // "I understand/understood [that]" - understanding claims
  {
    pattern: /\bi (understand|understood)\s+(that\s+)?/gi,
    suggestion: "Show understanding through your actions or changed behavior"
  },

  // "It is/was [adjective]" - generic state claims
  {
    pattern: /\bit (is|was) (important|difficult|hard|easy|interesting|challenging)\b/gi,
    suggestion: "Show why through specific examples rather than stating it"
  },

  // "I became [adjective]" - state change claims
  {
    pattern: /\bi became\s+(\w+)/gi,
    suggestion: "Show the transformation process through scenes and details"
  },

  // "I started to [feel/think]" - beginning state claims
  {
    pattern: /\bi started to (feel|think|believe|realize)\b/gi,
    suggestion: "Describe the triggering event and your response"
  },

  // "I began to [feel/understand]" - another beginning pattern
  {
    pattern: /\bi began to (feel|understand|realize|see)\b/gi,
    suggestion: "Show the moment when this shift began"
  },

  // "made me feel" - external cause of feeling
  {
    pattern: /\bmade me (feel|realize|understand|see)\b/gi,
    suggestion: "Show the effect through your physical or behavioral response"
  },

  // "I experienced" - distancing language
  {
    pattern: /\bi experienced\s+(\w+)/gi,
    suggestion: "Put the reader in the experience with vivid sensory details"
  }
];

/**
 * Strong action verbs (manually "tagged" as verbs that show action)
 * These are words that demonstrate rather than state. Essays rich in
 * these verbs feel vivid, active, and engaging.
 */
export const SHOW_VERBS = new Set([
  // Physical movement verbs
  'ran', 'run', 'running',
  'walked', 'walk', 'walking',
  'jumped', 'jump', 'jumping',
  'leaped', 'leap', 'leaping',
  'sprinted', 'sprint', 'sprinting',
  'dashed', 'dash', 'dashing',
  'crawled', 'crawl', 'crawling',
  'climbed', 'climb', 'climbing',
  'fell', 'fall', 'falling',
  'stumbled', 'stumble', 'stumbling',
  'tripped', 'trip', 'tripping',
  'rolled', 'roll', 'rolling',
  'spun', 'spin', 'spinning',
  'turned', 'turn', 'turning',
  'raced', 'race', 'racing',
  'rushed', 'rush', 'rushing',
  'hurried', 'hurry', 'hurrying',

  // Communication verbs (vivid alternatives to "said")
  'shouted', 'shout', 'shouting',
  'whispered', 'whisper', 'whispering',
  'screamed', 'scream', 'screaming',
  'muttered', 'mutter', 'muttering',
  'announced', 'announce', 'announcing',
  'declared', 'declare', 'declaring',
  'exclaimed', 'exclaim', 'exclaiming',
  'murmured', 'murmur', 'murmuring',
  'called', 'call', 'calling',
  'yelled', 'yell', 'yelling',
  'cried', 'cry', 'crying',
  'laughed', 'laugh', 'laughing',
  'sighed', 'sigh', 'sighing',
  'gasped', 'gasp', 'gasping',

  // Physical interaction verbs
  'grabbed', 'grab', 'grabbing',
  'pulled', 'pull', 'pulling',
  'pushed', 'push', 'pushing',
  'lifted', 'lift', 'lifting',
  'dropped', 'drop', 'dropping',
  'threw', 'throw', 'throwing',
  'caught', 'catch', 'catching',
  'clasped', 'clasp', 'clasping',
  'gripped', 'grip', 'gripping',
  'squeezed', 'squeeze', 'squeezing',
  'released', 'release', 'releasing',
  'held', 'hold', 'holding',
  'touched', 'touch', 'touching',
  'struck', 'strike', 'striking',
  'slammed', 'slam', 'slamming',

  // Creation and building verbs
  'built', 'build', 'building',
  'created', 'create', 'creating',
  'designed', 'design', 'designing',
  'constructed', 'construct', 'constructing',
  'assembled', 'assemble', 'assembling',
  'crafted', 'craft', 'crafting',
  'molded', 'mold', 'molding',
  'shaped', 'shape', 'shaping',
  'forged', 'forge', 'forging',
  'formed', 'form', 'forming',
  'developed', 'develop', 'developing',
  'established', 'establish', 'establishing',
  'invented', 'invent', 'inventing',
  'composed', 'compose', 'composing',

  // Leadership and organization verbs
  'led', 'lead', 'leading',
  'organized', 'organize', 'organizing',
  'managed', 'manage', 'managing',
  'directed', 'direct', 'directing',
  'coordinated', 'coordinate', 'coordinating',
  'initiated', 'initiate', 'initiating',
  'launched', 'launch', 'launching',
  'founded', 'found', 'founding',
  'pioneered', 'pioneer', 'pioneering',
  'spearheaded', 'spearhead', 'spearheading',

  // Discovery and learning verbs
  'discovered', 'discover', 'discovering',
  'uncovered', 'uncover', 'uncovering',
  'revealed', 'reveal', 'revealing',
  'explored', 'explore', 'exploring',
  'investigated', 'investigate', 'investigating',
  'examined', 'examine', 'examining',
  'studied', 'study', 'studying',
  'researched', 'research', 'researching',
  'analyzed', 'analyze', 'analyzing',
  'deciphered', 'decipher', 'deciphering',

  // Transformation verbs
  'transformed', 'transform', 'transforming',
  'converted', 'convert', 'converting',
  'revolutionized', 'revolutionize', 'revolutionizing',
  'reformed', 'reform', 'reforming',
  'reshaped', 'reshape', 'reshaping',
  'redefined', 'redefine', 'redefining',
  'reimagined', 'reimagine', 'reimagining',

  // Sensory perception verbs (showing awareness)
  'watched', 'watch', 'watching',
  'observed', 'observe', 'observing',
  'noticed', 'notice', 'noticing',
  'spotted', 'spot', 'spotting',
  'glimpsed', 'glimpse', 'glimpsing',
  'stared', 'stare', 'staring',
  'gazed', 'gaze', 'gazing',
  'heard', 'hear', 'hearing',
  'listened', 'listen', 'listening',
  'smelled', 'smell', 'smelling',
  'tasted', 'taste', 'tasting',

  // Physical sensation verbs (showing internal states)
  'trembled', 'tremble', 'trembling',
  'shivered', 'shiver', 'shivering',
  'sweated', 'sweat', 'sweating',
  'blushed', 'blush', 'blushing',
  'flinched', 'flinch', 'flinching',
  'winced', 'wince', 'wincing',
  'froze', 'freeze', 'freezing',
  'tensed', 'tense', 'tensing',

  // Struggle and effort verbs
  'fought', 'fight', 'fighting',
  'struggled', 'struggle', 'struggling',
  'wrestled', 'wrestle', 'wrestling',
  'battled', 'battle', 'battling',
  'persisted', 'persist', 'persisting',
  'persevered', 'persevere', 'persevering',
  'endured', 'endure', 'enduring',
  'overcame', 'overcome', 'overcoming',

  // Achievement verbs
  'accomplished', 'accomplish', 'accomplishing',
  'achieved', 'achieve', 'achieving',
  'conquered', 'conquer', 'conquering',
  'mastered', 'master', 'mastering',
  'completed', 'complete', 'completing',
  'finished', 'finish', 'finishing',
  'succeeded', 'succeed', 'succeeding',
  'earned', 'earn', 'earning',
  'won', 'win', 'winning'
]);
