'use client';

import React, { useState, useCallback } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from './ui/Card';
import type { GeneratedSentence } from '@/lib/types';

interface OpeningGeneratorProps {
  initialOpenings: GeneratedSentence[];
}

export function OpeningGenerator({ initialOpenings }: OpeningGeneratorProps) {
  const [openings, setOpenings] = useState<GeneratedSentence[]>(initialOpenings);
  const [isGenerating, setIsGenerating] = useState(false);
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  const handleGenerate = useCallback(async () => {
    setIsGenerating(true);
    try {
      // Call the API to get new openings
      const response = await fetch('/api/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: 'Generate new openings for inspiration. This is a placeholder text that is long enough to pass validation. The actual openings will be generated using the Markov chain model trained on strong essay openings.' })
      });

      if (response.ok) {
        const data = await response.json();
        if (data.generatedOpenings) {
          setOpenings(data.generatedOpenings);
        }
      }
    } catch (error) {
      console.error('Failed to generate new openings:', error);
    } finally {
      setIsGenerating(false);
    }
  }, []);

  const handleCopy = useCallback(async (text: string, index: number) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedIndex(index);
      setTimeout(() => setCopiedIndex(null), 2000);
    } catch (error) {
      console.error('Failed to copy:', error);
    }
  }, []);

  return (
    <Card className="col-span-full">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle icon="💡">Opening Sentence Ideas</CardTitle>
        <button
          onClick={handleGenerate}
          disabled={isGenerating}
          className={`text-xs px-3 py-1 rounded transition-colors ${
            isGenerating
              ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
              : 'bg-blue-100 text-blue-700 hover:bg-blue-200'
          }`}
        >
          {isGenerating ? 'Generating...' : 'Generate New'}
        </button>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {/* Info banner */}
          <div className="text-xs text-gray-600 bg-blue-50 p-2 rounded flex items-start gap-2">
            <svg className="w-4 h-4 text-blue-500 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span>
              These openings are generated using a Markov chain trained on strong essay examples.
              Use them for inspiration only - your essay should be entirely your own work.
            </span>
          </div>

          {/* Generated openings */}
          <div className="space-y-2">
            {openings.map((opening, index) => (
              <div
                key={index}
                className="group flex items-start gap-2 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <span className="text-gray-400 text-xs font-mono mt-0.5">
                  {index + 1}.
                </span>
                <p className="flex-1 text-sm text-gray-700 leading-relaxed">
                  {opening.text}
                </p>
                <button
                  onClick={() => handleCopy(opening.text, index)}
                  className={`opacity-0 group-hover:opacity-100 transition-opacity p-1 rounded ${
                    copiedIndex === index
                      ? 'text-green-600'
                      : 'text-gray-400 hover:text-gray-600'
                  }`}
                  title="Copy to clipboard"
                >
                  {copiedIndex === index ? (
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  ) : (
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                    </svg>
                  )}
                </button>
              </div>
            ))}
          </div>

          {/* NLP explanation */}
          <div className="pt-2 border-t border-gray-100">
            <details className="text-xs text-gray-500">
              <summary className="cursor-pointer hover:text-gray-700">
                How does this work? (Markov Chains)
              </summary>
              <div className="mt-2 space-y-1">
                <p>
                  This uses a <strong>bigram Markov chain</strong>, an NLP technique from Week 12 of CSCI 3310.
                </p>
                <p>
                  The model learns word transition probabilities from a corpus of strong essay openings.
                  For each word, it knows which words are likely to come next based on training data.
                </p>
                <p>
                  Generation starts with a random opener word, then repeatedly samples the next word
                  based on learned probabilities until a sentence is complete.
                </p>
              </div>
            </details>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
