/*
 * analyzes college application essays and provides feedback
 *
 * uses Analyzer class
 *
 * Tim Nguyen
 * CSCI 3310 Final Project
 */

import java.util.*;
import java.io.*;

public class EssayInsight
{
    public static void main(String[] args)
    {
        try
        {
            Analyzer a = new Analyzer();

            // Read essay from file
            Scanner inFile = new Scanner(new File("essay.txt"));
            StringBuilder essayBuilder = new StringBuilder();
            while (inFile.hasNextLine())
            {
                essayBuilder.append(inFile.nextLine());
                essayBuilder.append(" ");
            }
            String essay = essayBuilder.toString();
            inFile.close();

            // Tokenize
            List<String> words = a.getWords(essay);
            List<String> sentences = a.getSentences(essay);

            // Basic stats
            int wordCount = words.size();
            int sentenceCount = sentences.size();
            double avgSentenceLen = (sentenceCount > 0) ?
                (double) wordCount / sentenceCount : 0;

            // Vocabulary analysis
            Map<String, Integer> freq = a.getFrequencies(words);
            Set<String> stops = a.getStopWords();
            int uniqueWords = freq.size();
            List<String> overused = a.getOverusedWords(freq, stops);

            // Sentence starters
            Map<String, Integer> starters = a.getSentenceStarters(sentences);
            int iStarts = a.countIStarts(starters);

            // Cliche detection
            List<String> clichePatterns = a.getClichePatterns();
            List<String> cliches = a.findCliches(essay, clichePatterns);

            // Show vs Tell
            List<String> tellPatterns = a.getTellPatterns();
            int tellCount = a.countTellPhrases(essay, tellPatterns);
            Set<String> showVerbs = a.getShowVerbs();
            int showCount = a.countShowVerbs(words, showVerbs);

            // Markov chain generation
            Scanner openingsFile = new Scanner(new File("openings.txt"));
            Map<String, Map<String, Integer>> markovFreq =
                a.computeFrequencies(openingsFile);
            openingsFile.close();

            List<String> openings = new ArrayList<>();
            for (int i = 0; i < 5; i++)
            {
                String opening = a.generateOpening(markovFreq, 12);
                if (!opening.isEmpty())
                {
                    openings.add(opening);
                }
            }

            // Output results
            PrintWriter outFile = new PrintWriter("analysis.txt");
            a.printAnalysis(outFile, wordCount, sentenceCount, avgSentenceLen,
                uniqueWords, overused, iStarts, sentenceCount, cliches,
                tellCount, showCount, openings);
            outFile.close();

            System.out.println("\nAnalysis saved to analysis.txt");
        }
        catch (FileNotFoundException e)
        {
            System.out.println(e.getMessage());
        }
    }
}
