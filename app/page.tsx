'use client';

import React, { useState, useCallback } from 'react';
import { EssayInput } from '@/components/EssayInput';
import { AnalysisResults } from '@/components/AnalysisResults';
import type { EssayAnalysis } from '@/lib/types';

export default function Home() {
  const [analysis, setAnalysis] = useState<EssayAnalysis | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleAnalyze = useCallback(async (text: string) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/analyze', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ text }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || data.details || 'Failed to analyze essay');
      }

      // Convert frequency objects back to Maps for TypeScript compatibility
      const analysisWithMaps: EssayAnalysis = {
        ...data,
        vocabulary: {
          ...data.vocabulary,
          wordFrequencies: new Map(Object.entries(data.vocabulary.wordFrequencies || {})),
        },
        sentenceStarters: {
          ...data.sentenceStarters,
          starterFrequencies: new Map(Object.entries(data.sentenceStarters.starterFrequencies || {})),
        },
      };

      setAnalysis(analysisWithMaps);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unexpected error occurred');
    } finally {
      setIsLoading(false);
    }
  }, []);

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-2xl">📝</span>
            <div>
              <h1 className="text-xl font-bold text-gray-800">Essay Insight</h1>
              <p className="text-xs text-gray-500">AI-powered feedback for college essays</p>
            </div>
          </div>
          <a
            href="https://github.com/TimHL5/nlpfinalproject"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 text-sm text-gray-600 hover:text-gray-800 transition-colors"
          >
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
              <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" />
            </svg>
            <span className="hidden sm:inline">View on GitHub</span>
          </a>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-4 py-6">
        {/* Project Info Banner */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
          <div className="flex items-start gap-3">
            <span className="text-blue-500 text-xl">🎓</span>
            <div className="text-sm">
              <p className="font-medium text-blue-800">CSCI 3310 Final Project - Boston College</p>
              <p className="text-blue-600 mt-1">
                This tool demonstrates NLP concepts: <span className="font-medium">Tokenization</span>,{' '}
                <span className="font-medium">Frequency Analysis</span>,{' '}
                <span className="font-medium">Regular Expressions</span>,{' '}
                <span className="font-medium">POS concepts</span>,{' '}
                <span className="font-medium">N-grams</span>, and{' '}
                <span className="font-medium">Markov Chains</span>.
              </p>
            </div>
          </div>
        </div>

        {/* Two-column layout on larger screens */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Essay Input - Takes up less space on large screens */}
          <div className="lg:col-span-5">
            <div className="lg:sticky lg:top-24">
              <EssayInput onAnalyze={handleAnalyze} isLoading={isLoading} />

              {/* Tips Section */}
              <div className="mt-4 bg-white rounded-lg shadow-sm border border-gray-200 p-4">
                <h3 className="text-sm font-semibold text-gray-800 mb-2">Tips for a Strong Essay</h3>
                <ul className="text-xs text-gray-600 space-y-1">
                  <li>• Start with a specific moment, not a general statement</li>
                  <li>• Show emotions through actions, not statements</li>
                  <li>• Vary your sentence starters (avoid starting every sentence with &ldquo;I&rdquo;)</li>
                  <li>• Use specific details instead of clichés</li>
                  <li>• Aim for 250-650 words (Common App limit)</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Analysis Results */}
          <div className="lg:col-span-7">
            <AnalysisResults
              analysis={analysis}
              isLoading={isLoading}
              error={error}
            />
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 mt-12">
        <div className="max-w-6xl mx-auto px-4 py-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="text-sm text-gray-600">
              <p>
                <span className="font-medium">Essay Insight</span> - CSCI 3310 Final Project
              </p>
              <p className="text-gray-500">
                Developer: Tim Nguyen | Professor: Naomi Bolotin | Boston College, Fall 2025
              </p>
            </div>
            <div className="flex items-center gap-4 text-xs text-gray-500">
              <span>All NLP logic implemented from scratch</span>
              <span className="hidden md:inline">•</span>
              <span className="hidden md:inline">No external NLP libraries</span>
            </div>
          </div>

          {/* NLP Concepts Reference */}
          <div className="mt-4 pt-4 border-t border-gray-100">
            <div className="grid grid-cols-2 md:grid-cols-6 gap-2 text-xs text-gray-500">
              <div className="bg-gray-50 p-2 rounded text-center">
                <div className="font-medium text-gray-700">Week 5</div>
                <div>Tokenization</div>
              </div>
              <div className="bg-gray-50 p-2 rounded text-center">
                <div className="font-medium text-gray-700">Week 5</div>
                <div>Frequency Analysis</div>
              </div>
              <div className="bg-gray-50 p-2 rounded text-center">
                <div className="font-medium text-gray-700">Week 6</div>
                <div>POS Concepts</div>
              </div>
              <div className="bg-gray-50 p-2 rounded text-center">
                <div className="font-medium text-gray-700">Week 11</div>
                <div>Regex Patterns</div>
              </div>
              <div className="bg-gray-50 p-2 rounded text-center">
                <div className="font-medium text-gray-700">Week 12</div>
                <div>N-grams</div>
              </div>
              <div className="bg-gray-50 p-2 rounded text-center">
                <div className="font-medium text-gray-700">Week 12</div>
                <div>Markov Chains</div>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
