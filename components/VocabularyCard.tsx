'use client';

import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from './ui/Card';
import { Badge } from './ui/Badge';
import { ProgressBar } from './ui/ProgressBar';
import type { VocabularyAnalysis } from '@/lib/types';

interface VocabularyCardProps {
  vocabulary: VocabularyAnalysis;
}

export function VocabularyCard({ vocabulary }: VocabularyCardProps) {
  const [showDetails, setShowDetails] = useState(false);
  const {
    totalWords,
    uniqueWords,
    vocabularyRichness,
    overusedWords
  } = vocabulary;

  const richPercentage = Math.round(vocabularyRichness * 100);

  const getRating = () => {
    // Adjust for text length (TTR naturally decreases with length)
    const adjustedRichness = vocabularyRichness * Math.min(1, 300 / Math.max(totalWords, 100));
    if (adjustedRichness >= 0.5) return { label: 'Excellent', variant: 'success' as const };
    if (adjustedRichness >= 0.4) return { label: 'Good', variant: 'success' as const };
    if (adjustedRichness >= 0.3) return { label: 'Average', variant: 'warning' as const };
    return { label: 'Needs Work', variant: 'error' as const };
  };

  const rating = getRating();

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle icon="📚">Vocabulary</CardTitle>
        <Badge variant={rating.variant}>{rating.label}</Badge>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {/* Main metric */}
          <div className="text-center">
            <div className="text-3xl font-bold text-gray-800">{richPercentage}%</div>
            <div className="text-xs text-gray-500">Vocabulary Richness</div>
          </div>

          {/* Progress bar */}
          <ProgressBar
            value={richPercentage}
            variant={rating.variant}
            size="sm"
          />

          {/* Stats */}
          <div className="grid grid-cols-2 gap-4 text-center text-sm">
            <div>
              <div className="font-semibold text-gray-700">{uniqueWords}</div>
              <div className="text-xs text-gray-500">Unique words</div>
            </div>
            <div>
              <div className="font-semibold text-gray-700">{totalWords}</div>
              <div className="text-xs text-gray-500">Total words</div>
            </div>
          </div>

          {/* Overused words */}
          {overusedWords.length > 0 && (
            <div className="pt-2 border-t border-gray-100">
              <button
                onClick={() => setShowDetails(!showDetails)}
                className="w-full text-left text-xs text-gray-600 hover:text-gray-800 flex items-center justify-between"
              >
                <span className="font-medium">
                  {overusedWords.length} overused word{overusedWords.length !== 1 ? 's' : ''}
                </span>
                <svg
                  className={`w-4 h-4 transition-transform ${showDetails ? 'rotate-180' : ''}`}
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              {showDetails && (
                <div className="mt-2 space-y-2">
                  {overusedWords.slice(0, 5).map((item, index) => (
                    <div key={index} className="text-xs bg-amber-50 p-2 rounded">
                      <div className="flex justify-between">
                        <span className="font-medium text-amber-800">"{item.word}"</span>
                        <span className="text-amber-600">{item.count}x</span>
                      </div>
                      <div className="text-amber-700 mt-1">{item.suggestion}</div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {overusedWords.length === 0 && (
            <div className="text-xs text-green-600 bg-green-50 p-2 rounded">
              No overused words detected. Great variety!
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
