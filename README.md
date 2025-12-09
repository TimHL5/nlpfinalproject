# Essay Insight

> AI-powered feedback tool for college application essays

**CSCI 3310 Final Project** | Boston College | Fall 2025  
**Developer:** Tim Nguyen  
**Professor:** Naomi Bolotin

## Project Overview

Essay Insight is a web-based Natural Language Processing tool that analyzes college application essays and provides actionable feedback. It demonstrates multiple NLP concepts from CSCI 3310: Computing Language.

### Live Demo

Deploy on [Vercel](https://vercel.com) for a live demo.

## NLP Concepts Demonstrated

| Concept | Course Week | Implementation |
|---------|-------------|----------------|
| **Tokenization** | Week 5 | Breaking text into words, sentences, paragraphs |
| **Frequency Analysis** | Week 5 | Vocabulary richness, overused word detection |
| **Regular Expressions** | Week 11 | Pattern-based cliché detection |
| **POS Tagging Concepts** | Week 6 | Show vs Tell analysis using word categories |
| **N-grams** | Week 12 | Sentence starter analysis (unigrams) |
| **Markov Chains** | Week 12 | Opening sentence generation (bigrams) |

## Features

### 1. Basic Statistics
- Word, sentence, paragraph counts
- Average sentence/word length
- Common App word limit check (250-650 words)

### 2. Vocabulary Analysis
- Vocabulary richness (types/tokens ratio)
- Overused word detection (excluding stop words)
- Suggestions for word variety

### 3. Sentence Variety
- Tracks sentence-starting words (unigram analysis)
- Flags excessive "I" starts (>30%)
- Suggests alternative openers

### 4. Cliché Detection
- 20+ college essay cliché patterns
- Uses regex for flexible matching
- Provides specific revision suggestions

### 5. Show vs Tell Analysis
- Identifies passive "tell" phrases
- Counts active "show" verbs
- Calculates showing ratio

### 6. Opening Sentence Generator
- Trained on 50+ strong essay openings
- Bigram Markov chain model
- Generates 5 unique suggestions

## Technical Implementation

### Tokenization
```typescript
// Split on whitespace, preserve contractions
const words = text.split(/\s+/).map(w =>
  w.replace(/^[^a-zA-Z']+|[^a-zA-Z']+$/g, '').toLowerCase()
).filter(Boolean);
```

### Cliché Detection (Regex)
```typescript
const CLICHE_PATTERNS = [
  /\bever since i was (young|a child|little)\b/gi,
  /\b(passionate|passion) (about|for)\b/gi,
  // ... more patterns
];
```

### Markov Chain Generation
```typescript
// Build bigram model
for (let i = 0; i < words.length - 1; i++) {
  const current = words[i], next = words[i + 1];
  if (!bigrams[current]) bigrams[current] = new Map();
  bigrams[current].set(next, (bigrams[current].get(next) || 0) + 1);
}

// Generate by sampling
let sentence = [randomStart];
while (sentence.length < maxWords) {
  const options = bigrams[sentence[sentence.length - 1]];
  if (!options) break;
  sentence.push(weightedRandom(options));
}
```

## Running Locally

```bash
# Clone repository
git clone https://github.com/TimHL5/nlpfinalproject.git
cd nlpfinalproject

# Install dependencies
npm install

# Run development server
npm run dev

# Open http://localhost:3000
```

## Project Structure

```
essay-insight/
├── app/                    # Next.js app router
│   ├── page.tsx           # Main application
│   ├── layout.tsx         # Root layout
│   ├── globals.css        # Global styles
│   └── api/analyze/       # Analysis API endpoint
├── components/            # React components
│   ├── EssayInput.tsx     # Essay text input
│   ├── AnalysisResults.tsx # Results container
│   ├── StatisticsCard.tsx # Statistics display
│   ├── VocabularyCard.tsx # Vocabulary analysis
│   ├── SentenceVarietyCard.tsx # Sentence starters
│   ├── ClicheCard.tsx     # Cliché detection
│   ├── ShowTellCard.tsx   # Show vs Tell
│   ├── OpeningGenerator.tsx # Markov suggestions
│   ├── OverallScoreCard.tsx # Overall score
│   └── ui/                # Reusable UI components
├── lib/
│   ├── nlp/              # NLP modules (core logic)
│   │   ├── tokenizer.ts  # Tokenization
│   │   ├── statistics.ts # Basic statistics
│   │   ├── vocabulary.ts # Vocabulary analysis
│   │   ├── clicheDetector.ts # Cliché detection
│   │   ├── sentenceStarters.ts # N-gram analysis
│   │   ├── showTell.ts   # POS-based analysis
│   │   ├── markovChain.ts # Text generation
│   │   └── index.ts      # Main analysis function
│   ├── constants/        # Word lists, patterns
│   │   ├── stopWords.ts  # Stop words
│   │   ├── cliches.ts    # Cliché patterns
│   │   ├── showTellWords.ts # Show/tell word lists
│   │   └── trainingCorpus.ts # Markov training data
│   └── types.ts          # TypeScript interfaces
└── README.md
```

## Sample Analysis

**Input Essay:** (487 words)
"Ever since I was young, I have always been passionate about..."

**Output:**
- ⚠️ 3 clichés detected
- ⚠️ 38% sentences start with "I"
- ✓ 64% vocabulary richness
- ✓ 63% show vs tell ratio
- **Overall Score: 78/100 (B)**

## Technical Stack

- **Framework:** Next.js 14+ with App Router
- **Language:** TypeScript
- **Styling:** Tailwind CSS
- **Deployment:** Vercel-ready
- **No external NLP libraries** - All NLP logic implemented from scratch

## Future Improvements

- [ ] Syllable counting for rhythm analysis
- [ ] Tone/sentiment analysis
- [ ] Integration with real POS tagger
- [ ] Essay comparison feature
- [ ] Export analysis as PDF

## References

- Jurafsky, D. & Martin, J.H. *Speech and Language Processing*
- CSCI 3310 Course Slides (Prof. Bolotin)
- Common App Essay Guidelines

## License

MIT License - Feel free to use for educational purposes.

---

*Built with care at Boston College*
