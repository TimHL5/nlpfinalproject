/*
 * class for analyzing college essays
 *
 * Tim Nguyen
 */

import java.util.Scanner;
import java.util.Map;
import java.util.TreeMap;
import java.util.HashMap;
import java.util.Set;
import java.util.HashSet;
import java.util.List;
import java.util.ArrayList;
import java.util.Random;
import java.util.regex.Pattern;
import java.util.regex.Matcher;
import java.io.PrintWriter;
import java.io.File;
import java.io.FileNotFoundException;

public class Analyzer
{
    private Random rand = new Random();

    // ==================== TOKENIZATION ====================
    // From ps2/Corrector.java - reuse the tokenize method

    /*
     * returns the input string in lowercase with punctuation removed
     */
    public String tokenize(String s)
    {
        StringBuilder result = new StringBuilder("");

        for (int i = 0; i < s.length(); i++)
        {
            char c = s.charAt(i);
            if (Character.isLetter(c))
            {
                result.append(Character.toLowerCase(c));
            }
        }

        return result.toString();
    }

    /*
     * splits text into list of words (tokenized)
     */
    public List<String> getWords(String text)
    {
        List<String> words = new ArrayList<>();
        String[] rawWords = text.split("\\s+");

        for (int i = 0; i < rawWords.length; i++)
        {
            String word = tokenize(rawWords[i]);
            if (!word.isEmpty())
            {
                words.add(word);
            }
        }

        return words;
    }

    /*
     * splits text into list of sentences
     */
    public List<String> getSentences(String text)
    {
        List<String> sentences = new ArrayList<>();
        String[] rawSentences = text.split("[.!?]+\\s*");

        for (int i = 0; i < rawSentences.length; i++)
        {
            String sentence = rawSentences[i].trim();
            if (!sentence.isEmpty())
            {
                sentences.add(sentence);
            }
        }

        return sentences;
    }

    // ==================== FREQUENCY ANALYSIS ====================
    // From ps2/Corrector.java - reuse getFrequencies pattern

    /*
     * counts frequency of each word in the list
     */
    public Map<String, Integer> getFrequencies(List<String> words)
    {
        Map<String, Integer> freq = new HashMap<>();

        for (int i = 0; i < words.size(); i++)
        {
            String word = words.get(i);
            if (freq.containsKey(word))
            {
                int count = freq.get(word);
                freq.put(word, count + 1);
            }
            else
            {
                freq.put(word, 1);
            }
        }

        return freq;
    }

    /*
     * returns set of common stop words to ignore
     */
    public Set<String> getStopWords()
    {
        Set<String> stops = new HashSet<>();
        String[] common = {"the", "a", "an", "and", "or", "but", "in", "on",
            "at", "to", "for", "of", "with", "by", "from", "as", "is", "was",
            "are", "were", "been", "be", "have", "has", "had", "do", "does",
            "did", "will", "would", "could", "should", "may", "might", "must",
            "that", "which", "who", "this", "these", "those", "it", "its",
            "my", "your", "his", "her", "their", "our", "i", "you", "he",
            "she", "we", "they", "me", "him", "them", "what", "when", "where",
            "why", "how", "all", "each", "every", "both", "few", "more",
            "most", "other", "some", "such", "no", "not", "only", "same",
            "so", "than", "too", "very", "just", "if", "then", "because"};

        for (int i = 0; i < common.length; i++)
        {
            stops.add(common[i]);
        }

        return stops;
    }

    /*
     * finds words that appear too often (4+ times, excluding stop words)
     */
    public List<String> getOverusedWords(Map<String, Integer> freq, Set<String> stops)
    {
        List<String> overused = new ArrayList<>();

        for (Map.Entry<String, Integer> entry : freq.entrySet())
        {
            String word = entry.getKey();
            int count = entry.getValue();

            if (count >= 4 && word.length() > 3 && !stops.contains(word))
            {
                overused.add(word + " (" + count + "x)");
            }
        }

        return overused;
    }

    // ==================== SENTENCE STARTERS ====================
    // N-gram concept from class - unigram of first word

    /*
     * counts how each sentence begins
     */
    public Map<String, Integer> getSentenceStarters(List<String> sentences)
    {
        Map<String, Integer> starters = new TreeMap<>();

        for (int i = 0; i < sentences.size(); i++)
        {
            String sentence = sentences.get(i);
            String[] words = sentence.split("\\s+");

            if (words.length > 0)
            {
                String firstWord = tokenize(words[0]);

                if (!firstWord.isEmpty())
                {
                    if (starters.containsKey(firstWord))
                    {
                        starters.put(firstWord, starters.get(firstWord) + 1);
                    }
                    else
                    {
                        starters.put(firstWord, 1);
                    }
                }
            }
        }

        return starters;
    }

    /*
     * counts sentences starting with "I"
     */
    public int countIStarts(Map<String, Integer> starters)
    {
        if (starters.containsKey("i"))
        {
            return starters.get("i");
        }
        return 0;
    }

    // ==================== CLICHE DETECTION ====================
    // Regex from ps6/PatternMatcher.java - pattern matching

    /*
     * returns list of cliche regex patterns
     */
    public List<String> getClichePatterns()
    {
        List<String> patterns = new ArrayList<>();

        patterns.add("ever since i was (young|a child|a kid|little)");
        patterns.add("from a (young|early) age");
        patterns.add("i('ve)? always (wanted|dreamed|knew|loved|been)");
        patterns.add("(passionate|passion) (about|for)");
        patterns.add("made me (who i am|the person i am)");
        patterns.add("changed my (life|perspective|view|outlook)");
        patterns.add("taught me (the importance|a valuable|an important)");
        patterns.add("(opened|open) my eyes");
        patterns.add("eye[- ]?opening");
        patterns.add("(outside|out of|beyond) my comfort zone");
        patterns.add("learning experience");
        patterns.add("valuable (life )?lesson");
        patterns.add("at the end of the day");
        patterns.add("in today'?s (society|world)");
        patterns.add("(the )?dictionary defines");
        patterns.add("played a (big|huge|major) (role|part)");

        return patterns;
    }

    /*
     * finds cliches in text using regex patterns
     */
    public List<String> findCliches(String text, List<String> patterns)
    {
        List<String> found = new ArrayList<>();
        String lowerText = text.toLowerCase();

        for (int i = 0; i < patterns.size(); i++)
        {
            String patternStr = patterns.get(i);
            Pattern pattern = Pattern.compile(patternStr);
            Matcher matcher = pattern.matcher(lowerText);

            while (matcher.find())
            {
                found.add("\"" + matcher.group() + "\"");
            }
        }

        return found;
    }

    // ==================== SHOW VS TELL ====================
    // Simplified POS tagging using word lists

    /*
     * returns set of "tell" phrases to look for
     */
    public List<String> getTellPatterns()
    {
        List<String> patterns = new ArrayList<>();

        patterns.add("i (am|was|'m) ");
        patterns.add("i (feel|felt) ");
        patterns.add("i (think|thought) ");
        patterns.add("i (believe|believed) ");
        patterns.add("i (know|knew) ");
        patterns.add("i (realize|realized) ");
        patterns.add("it (is|was) (important|difficult|hard|easy)");

        return patterns;
    }

    /*
     * counts "tell" phrases in text
     */
    public int countTellPhrases(String text, List<String> patterns)
    {
        int count = 0;
        String lowerText = text.toLowerCase();

        for (int i = 0; i < patterns.size(); i++)
        {
            Pattern pattern = Pattern.compile(patterns.get(i));
            Matcher matcher = pattern.matcher(lowerText);

            while (matcher.find())
            {
                count++;
            }
        }

        return count;
    }

    /*
     * returns set of strong action verbs ("show" words)
     */
    public Set<String> getShowVerbs()
    {
        Set<String> verbs = new HashSet<>();
        String[] actions = {"ran", "walked", "jumped", "shouted", "whispered",
            "grabbed", "pulled", "pushed", "discovered", "built", "created",
            "led", "organized", "designed", "launched", "explored", "stumbled",
            "laughed", "cried", "screamed", "raced", "climbed", "lifted",
            "wrote", "painted", "sang", "danced", "fought", "won", "lost"};

        for (int i = 0; i < actions.length; i++)
        {
            verbs.add(actions[i]);
        }

        return verbs;
    }

    /*
     * counts action verbs in word list
     */
    public int countShowVerbs(List<String> words, Set<String> showVerbs)
    {
        int count = 0;

        for (int i = 0; i < words.size(); i++)
        {
            if (showVerbs.contains(words.get(i)))
            {
                count++;
            }
        }

        return count;
    }

    // ==================== MARKOV CHAIN GENERATOR ====================
    // From ps7/TextGenerator.java - reuse the trigram approach

    /*
     * computes bigram frequencies for text generation
     * (simplified from ps7 trigram to bigram for shorter output)
     */
    public Map<String, Map<String, Integer>> computeFrequencies(Scanner s)
    {
        Map<String, Map<String, Integer>> freq = new TreeMap<>();

        if (!s.hasNext())
        {
            return freq;
        }

        String word1 = s.next();

        while (s.hasNext())
        {
            String word2 = s.next();

            if (!freq.containsKey(word1))
            {
                freq.put(word1, new TreeMap<>());
            }

            Map<String, Integer> innerMap = freq.get(word1);

            if (innerMap.containsKey(word2))
            {
                innerMap.put(word2, innerMap.get(word2) + 1);
            }
            else
            {
                innerMap.put(word2, 1);
            }

            word1 = word2;
        }

        return freq;
    }

    /*
     * randomly picks next word based on frequencies
     * (from ps7/TextGenerator.java)
     */
    public String getNextWord(Map<String, Integer> choices)
    {
        int total = 0;
        for (int count : choices.values())
        {
            total = total + count;
        }

        int randomNum = rand.nextInt(total) + 1;

        int cumulative = 0;
        for (Map.Entry<String, Integer> entry : choices.entrySet())
        {
            cumulative = cumulative + entry.getValue();
            if (randomNum <= cumulative)
            {
                return entry.getKey();
            }
        }

        return "";
    }

    /*
     * generates opening sentence using bigram model
     */
    public String generateOpening(Map<String, Map<String, Integer>> freq, int maxWords)
    {
        if (freq.isEmpty())
        {
            return "";
        }

        List<String> words = new ArrayList<>(freq.keySet());

        // Pick a random starting word that begins with capital
        String currentWord = "";
        int attempts = 0;
        do
        {
            int randomIndex = rand.nextInt(words.size());
            currentWord = words.get(randomIndex);
            attempts++;
        }
        while (!Character.isUpperCase(currentWord.charAt(0)) && attempts < 100);

        if (!Character.isUpperCase(currentWord.charAt(0)))
        {
            return "";
        }

        String text = currentWord;
        int wordCount = 1;

        // Generate until we reach max words or hit dead end
        while (wordCount < maxWords && freq.containsKey(currentWord))
        {
            Map<String, Integer> choices = freq.get(currentWord);
            String nextWord = getNextWord(choices);
            text = text + " " + nextWord;
            wordCount++;
            currentWord = nextWord;

            // Stop at sentence-ending punctuation
            char lastChar = nextWord.charAt(nextWord.length() - 1);
            if (lastChar == '.' || lastChar == '!' || lastChar == '?')
            {
                break;
            }
        }

        return text;
    }

    // ==================== OUTPUT ====================

    /*
     * prints analysis results to console and file
     */
    public void printAnalysis(PrintWriter p, int wordCount, int sentenceCount,
        double avgSentenceLen, int uniqueWords, List<String> overused,
        int iStarts, int totalSentences, List<String> cliches,
        int tellCount, int showCount, List<String> openings)
    {
        String line = "══════════════════════════════════════════════════";

        // Print to both console and file
        output(p, line);
        output(p, "           ESSAY INSIGHT ANALYSIS");
        output(p, line);
        output(p, "");

        // Basic stats
        output(p, "BASIC STATISTICS");
        output(p, "   Words: " + wordCount);
        output(p, "   Sentences: " + sentenceCount);
        output(p, String.format("   Avg sentence length: %.1f words", avgSentenceLen));
        output(p, "   " + getLengthStatus(wordCount));
        output(p, "");

        // Vocabulary
        output(p, "VOCABULARY ANALYSIS");
        output(p, "   Unique words: " + uniqueWords);
        double richness = (wordCount > 0) ? (double) uniqueWords / wordCount * 100 : 0;
        output(p, String.format("   Vocabulary richness: %.0f%%", richness));
        if (overused.isEmpty())
        {
            output(p, "   [OK] No overused words detected");
        }
        else
        {
            output(p, "   [!] Overused words: " + String.join(", ", overused));
        }
        output(p, "");

        // Sentence starters
        output(p, "SENTENCE VARIETY");
        double iPercent = (totalSentences > 0) ? (double) iStarts / totalSentences * 100 : 0;
        output(p, String.format("   Sentences starting with 'I': %d (%.0f%%)", iStarts, iPercent));
        if (iPercent > 40)
        {
            output(p, "   [!] Too many sentences start with 'I'");
            output(p, "   Try: When, After, Although, The, My, During...");
        }
        else if (iPercent > 25)
        {
            output(p, "   [!] Consider varying sentence starters more");
        }
        else
        {
            output(p, "   [OK] Good sentence variety");
        }
        output(p, "");

        // Cliches
        output(p, "CLICHE DETECTOR");
        if (cliches.isEmpty())
        {
            output(p, "   [OK] No common cliches detected");
        }
        else
        {
            output(p, "   [!] Found " + cliches.size() + " cliche(s):");
            for (int i = 0; i < cliches.size(); i++)
            {
                output(p, "      - " + cliches.get(i));
            }
        }
        output(p, "");

        // Show vs Tell
        output(p, "SHOW VS TELL");
        output(p, "   'Tell' phrases (I am/feel/think): " + tellCount);
        output(p, "   'Show' verbs (action words): " + showCount);
        int total = tellCount + showCount;
        if (total > 0)
        {
            double showRatio = (double) showCount / total * 100;
            output(p, String.format("   Show ratio: %.0f%%", showRatio));
            if (showRatio >= 60)
            {
                output(p, "   [OK] Good balance of showing vs telling");
            }
            else
            {
                output(p, "   [!] Try showing through actions, not telling feelings");
            }
        }
        output(p, "");

        // Generated openings
        output(p, "OPENING SENTENCE IDEAS");
        output(p, "   (Markov-generated - use for inspiration only)");
        for (int i = 0; i < openings.size(); i++)
        {
            output(p, "   " + (i + 1) + ". " + openings.get(i));
        }
        output(p, "");

        output(p, line);
        output(p, "Remember: This tool provides suggestions, not rules.");
        output(p, "Your unique voice matters most!");
        output(p, line);
    }

    /*
     * helper to print to both console and file
     */
    private void output(PrintWriter p, String s)
    {
        System.out.println(s);
        p.println(s);
    }

    /*
     * returns status message based on word count
     */
    public String getLengthStatus(int wordCount)
    {
        if (wordCount < 250)
        {
            return "[!] Too short - aim for 250-650 words";
        }
        else if (wordCount > 650)
        {
            return "[!] Too long - cut to under 650 words";
        }
        else
        {
            return "[OK] Good length for Common App";
        }
    }
}
