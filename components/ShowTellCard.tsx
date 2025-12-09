'use client';

import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from './ui/Card';
import { Badge } from './ui/Badge';
import { RatioBar } from './ui/ProgressBar';
import type { ShowTellAnalysis } from '@/lib/types';

interface ShowTellCardProps {
  showTell: ShowTellAnalysis;
}

export function ShowTellCard({ showTell }: ShowTellCardProps) {
  const [showDetails, setShowDetails] = useState(false);
  const {
    tellCount,
    showCount,
    tellPhrases,
    showVerbs,
    ratio,
    rating,
    feedback
  } = showTell;

  const percentage = Math.round(ratio * 100);

  const getBadge = () => {
    switch (rating) {
      case 'excellent':
        return <Badge variant="success">Excellent</Badge>;
      case 'good':
        return <Badge variant="success">Good</Badge>;
      case 'needs-work':
        return <Badge variant="warning">Needs Work</Badge>;
      case 'poor':
        return <Badge variant="error">Poor</Badge>;
      default:
        return null;
    }
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle icon="📝">Show vs Tell</CardTitle>
        {getBadge()}
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {/* Main metric */}
          <div className="text-center">
            <div className="text-3xl font-bold text-gray-800">{percentage}%</div>
            <div className="text-xs text-gray-500">Showing ratio</div>
          </div>

          {/* Ratio bar */}
          <RatioBar
            leftValue={showCount}
            rightValue={tellCount}
            leftLabel="Show"
            rightLabel="Tell"
            leftColor="bg-green-500"
            rightColor="bg-amber-400"
          />

          {/* Explanation */}
          <div className="text-xs text-gray-600 bg-gray-50 p-2 rounded">
            {feedback}
          </div>

          {/* Details toggle */}
          <button
            onClick={() => setShowDetails(!showDetails)}
            className="w-full text-left text-xs text-blue-600 hover:text-blue-800 flex items-center justify-between pt-2 border-t border-gray-100"
          >
            <span>View details</span>
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
            <div className="space-y-3">
              {/* Tell phrases */}
              {tellPhrases.length > 0 && (
                <div>
                  <div className="text-xs font-medium text-amber-700 mb-1">
                    "Tell" phrases to revise ({tellPhrases.length}):
                  </div>
                  <div className="space-y-1 max-h-32 overflow-y-auto">
                    {tellPhrases.slice(0, 5).map((phrase, index) => (
                      <div key={index} className="text-xs bg-amber-50 p-2 rounded">
                        <div className="font-medium text-amber-800">"{phrase.phrase.trim()}"</div>
                        <div className="text-amber-600 mt-0.5">{phrase.suggestion}</div>
                      </div>
                    ))}
                    {tellPhrases.length > 5 && (
                      <div className="text-xs text-gray-500 italic">
                        +{tellPhrases.length - 5} more...
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Show verbs */}
              {showVerbs.length > 0 && (
                <div>
                  <div className="text-xs font-medium text-green-700 mb-1">
                    Strong "show" verbs found ({showVerbs.length}):
                  </div>
                  <div className="flex flex-wrap gap-1">
                    {[...new Set(showVerbs)].slice(0, 15).map((verb, index) => (
                      <span
                        key={index}
                        className="inline-flex px-2 py-0.5 rounded text-xs bg-green-100 text-green-800"
                      >
                        {verb}
                      </span>
                    ))}
                    {[...new Set(showVerbs)].length > 15 && (
                      <span className="text-xs text-gray-500 italic">
                        +{[...new Set(showVerbs)].length - 15} more
                      </span>
                    )}
                  </div>
                </div>
              )}

              {/* Writing tip */}
              <div className="text-xs text-gray-600 bg-blue-50 p-2 rounded">
                <span className="font-medium">Tip:</span> Instead of "I was nervous," try
                "My hands trembled as I approached the stage."
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
