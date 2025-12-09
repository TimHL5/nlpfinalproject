Essay Insight - College Essay Analyzer
======================================

CSCI 3310 Final Project
Tim Nguyen
Fall 2025

DESCRIPTION
-----------
A command-line tool that analyzes college application essays
and provides feedback on common issues.

HOW TO RUN
----------
1. Place your essay text in essay.txt
2. Compile: javac Analyzer.java EssayInsight.java
3. Run: java EssayInsight
4. View results in console and analysis.txt

NLP CONCEPTS
------------
1. Tokenization - Breaking text into words and sentences
2. Frequency Analysis - Counting word occurrences
3. Regular Expressions - Pattern matching for cliches
4. N-grams - Analyzing sentence starters
5. Markov Chains - Generating opening sentence suggestions

FEATURES
--------
- Word count and length check (Common App 250-650)
- Vocabulary richness calculation
- Overused word detection
- Sentence variety analysis
- Cliche detection (16 common patterns)
- Show vs Tell ratio
- Markov-generated opening suggestions

CODE REUSE FROM CLASS
---------------------
- tokenize() - Directly from ps2/Corrector.java
- getFrequencies() - Pattern from ps2/Corrector.java
- computeFrequencies() - Adapted from ps7/TextGenerator.java
- getNextWord() - Directly from ps7/TextGenerator.java
- Regex patterns - Pattern from ps6/PatternMatcher.java
- File I/O - Scanner/PrintWriter pattern used in all assignments

FILES
-----
- Analyzer.java - Core analysis class with all NLP methods
- EssayInsight.java - Driver class with main()
- openings.txt - Training corpus for Markov chain
- essay.txt - Sample/input essay file
- analysis.txt - Output analysis results
- README.txt - This file
