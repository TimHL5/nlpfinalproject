/**
 * STOP WORDS LIST
 *
 * Stop words are common words that don't carry significant semantic meaning
 * for analysis purposes. From CSCI 3310, we learned that stop words are
 * typically filtered out in text analysis tasks like frequency analysis
 * and information retrieval because they don't help distinguish documents
 * or reveal meaningful patterns.
 *
 * These words are high-frequency but low-information-content words that
 * appear in virtually every English text.
 */

export const STOP_WORDS = new Set([
  // Articles
  'the', 'a', 'an',

  // Conjunctions
  'and', 'or', 'but', 'nor', 'so', 'yet', 'for',

  // Prepositions
  'in', 'on', 'at', 'to', 'for', 'of', 'with', 'by', 'from', 'as',
  'into', 'through', 'during', 'before', 'after', 'above', 'below',
  'between', 'under', 'again', 'further', 'then', 'once', 'about',
  'against', 'over', 'out', 'up', 'down', 'off', 'across', 'along',

  // Pronouns
  'i', 'me', 'my', 'myself', 'we', 'our', 'ours', 'ourselves',
  'you', 'your', 'yours', 'yourself', 'yourselves',
  'he', 'him', 'his', 'himself', 'she', 'her', 'hers', 'herself',
  'it', 'its', 'itself', 'they', 'them', 'their', 'theirs', 'themselves',
  'what', 'which', 'who', 'whom', 'this', 'that', 'these', 'those',

  // Auxiliary/Modal verbs
  'is', 'am', 'are', 'was', 'were', 'be', 'been', 'being',
  'have', 'has', 'had', 'having', 'do', 'does', 'did', 'doing',
  'will', 'would', 'shall', 'should', 'may', 'might', 'must',
  'can', 'could',

  // Question words
  'when', 'where', 'why', 'how',

  // Quantifiers and determiners
  'all', 'each', 'every', 'both', 'few', 'more', 'most', 'other',
  'some', 'such', 'no', 'any', 'many', 'much', 'several',

  // Adverbs and other common words
  'not', 'only', 'own', 'same', 'than', 'too', 'very', 'just',
  'also', 'now', 'here', 'there', 'while', 'if', 'because',
  'until', 'although', 'though', 'whether', 'however', 'therefore',
  'thus', 'hence', 'otherwise', 'moreover', 'furthermore',

  // Common contractions (root forms)
  "don't", "doesn't", "didn't", "won't", "wouldn't", "can't", "couldn't",
  "shouldn't", "isn't", "aren't", "wasn't", "weren't", "haven't", "hasn't",
  "hadn't", "i'm", "you're", "he's", "she's", "it's", "we're", "they're",
  "i've", "you've", "we've", "they've", "i'll", "you'll", "he'll", "she'll",
  "we'll", "they'll", "i'd", "you'd", "he'd", "she'd", "we'd", "they'd",
  "that's", "there's", "here's", "what's", "who's", "let's",

  // Additional common words
  'even', 'well', 'back', 'still', 'way', 'make', 'like', 'get', 'got',
  'go', 'going', 'went', 'come', 'came', 'coming', 'take', 'took', 'taking',
  'see', 'saw', 'seen', 'know', 'knew', 'known', 'think', 'thought',
  'say', 'said', 'tell', 'told', 'ask', 'asked', 'use', 'used',
  'want', 'wanted', 'need', 'needed', 'try', 'tried', 'seem', 'seemed',
  'look', 'looked', 'give', 'gave', 'given', 'find', 'found', 'put',
  'thing', 'things', 'time', 'times', 'year', 'years', 'day', 'days',
  'first', 'last', 'new', 'old', 'good', 'great', 'little', 'long',
  'right', 'big', 'high', 'different', 'small', 'large', 'next', 'early',
  'young', 'important', 'few', 'public', 'bad', 'same', 'able',
  'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine', 'ten'
]);
