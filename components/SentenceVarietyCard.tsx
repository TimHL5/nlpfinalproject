'use client';

import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from './ui/Card';
import { Badge } from './ui/Badge';
import { ProgressBar } from './ui/ProgressBar';
import type { SentenceStarterAnalysis } from '@/lib/types';

interface SentenceVarietyCardProps {
  sentenceStarters: SentenceStarterAnalysis;
}

export function SentenceVarietyCard({ sentenceStarters }: SentenceVarietyCardProps) {
  const [showSuggestions, setShowSuggestions] = useState(false);
  const {
    totalSentences,
    iStartCount,
    iStartPercentage,
    repetitiveStarters,
    variety,
    suggestions
  } = sentenceStarters;

  const getBadge = () => {
    switch (variety) {
      case 'good':
        return <Badge variant="success">Good Variety</Badge>;
      case 'moderate':
        return <Badge variant="warning">Moderate</Badge>;
      case 'poor':
        return <Badge variant="error">Needs Work</Badge>;
      default:
        return null;
    }
  };

  const getProgressVariant = () => {
    if (iStartPercentage > 40) return 'error';
    if (iStartPercentage > 25) return 'warning';
    return 'success';
  };

  // Invert for progress bar (lower "I" percentage is better)
  const varietyScore = 100 - iStartPercentage;

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle icon="✏️">Sentence Variety</CardTitle>
        {getBadge()}
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {/* Main metric */}
          <div className="text-center">
            <div className="text-3xl font-bold text-gray-800">{iStartPercentage}%</div>
            <div className="text-xs text-gray-500">Sentences start with "I"</div>
          </div>

          {/* Progress bar (inverted - lower is better) */}
          <div>
            <div className="flex justify-between text-xs text-gray-500 mb-1">
              <span>Variety Score</span>
              <span>{varietyScore}%</span>
            </div>
            <ProgressBar
              value={varietyScore}
              variant={getProgressVariant()}
              size="sm"
            />
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 gap-4 text-center text-sm pt-2 border-t border-gray-100">
            <div>
              <div className="font-semibold text-gray-700">{iStartCount}</div>
              <div className="text-xs text-gray-500">"I" starts</div>
            </div>
            <div>
              <div className="font-semibold text-gray-700">{totalSentences}</div>
              <div className="text-xs text-gray-500">Total sentences</div>
            </div>
          </div>

          {/* Repetitive starters */}
          {repetitiveStarters.length > 0 && (
            <div className="pt-2 border-t border-gray-100">
              <div className="text-xs font-medium text-gray-600 mb-2">Repetitive Starters:</div>
              <div className="flex flex-wrap gap-1">
                {repetitiveStarters.slice(0, 5).map((starter, index) => (
                  <span
                    key={index}
                    className="inline-flex items-center px-2 py-0.5 rounded text-xs bg-amber-100 text-amber-800"
                  >
                    "{starter.word}" ({starter.count}x)
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Suggestions */}
          {suggestions.length > 0 && (
            <div className="pt-2 border-t border-gray-100">
              <button
                onClick={() => setShowSuggestions(!showSuggestions)}
                className="w-full text-left text-xs text-blue-600 hover:text-blue-800 flex items-center justify-between"
              >
                <span>View suggestions</span>
                <svg
                  className={`w-4 h-4 transition-transform ${showSuggestions ? 'rotate-180' : ''}`}
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              {showSuggestions && (
                <div className="mt-2 space-y-2">
                  {suggestions.map((suggestion, index) => (
                    <div key={index} className="text-xs bg-blue-50 p-2 rounded text-blue-800">
                      {suggestion}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {variety === 'good' && (
            <div className="text-xs text-green-600 bg-green-50 p-2 rounded">
              Great sentence variety! Your writing has good rhythm.
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
