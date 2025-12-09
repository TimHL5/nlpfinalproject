'use client';

import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from './ui/Card';
import { Badge } from './ui/Badge';
import type { ClicheAnalysis } from '@/lib/types';

interface ClicheCardProps {
  cliches: ClicheAnalysis;
}

export function ClicheCard({ cliches }: ClicheCardProps) {
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);
  const { totalCliches, matches, severity } = cliches;

  const getBadge = () => {
    switch (severity) {
      case 'none':
        return <Badge variant="success">None Found</Badge>;
      case 'minor':
        return <Badge variant="warning">{totalCliches} Found</Badge>;
      case 'major':
        return <Badge variant="error">{totalCliches} Found</Badge>;
      default:
        return null;
    }
  };

  const getMainMessage = () => {
    switch (severity) {
      case 'none':
        return 'Your essay avoids common clichés. Great job using original language!';
      case 'minor':
        return 'A few clichés detected. Consider revising for more originality.';
      case 'major':
        return 'Multiple clichés found. These phrases may make your essay blend in with others.';
      default:
        return '';
    }
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle icon="🚨">Clichés</CardTitle>
        {getBadge()}
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {/* Main metric */}
          <div className="text-center">
            <div className={`text-3xl font-bold ${
              severity === 'none' ? 'text-green-600' :
              severity === 'minor' ? 'text-amber-600' : 'text-red-600'
            }`}>
              {totalCliches}
            </div>
            <div className="text-xs text-gray-500">Clichés detected</div>
          </div>

          {/* Status message */}
          <div className={`text-xs p-2 rounded ${
            severity === 'none' ? 'bg-green-50 text-green-700' :
            severity === 'minor' ? 'bg-amber-50 text-amber-700' :
            'bg-red-50 text-red-700'
          }`}>
            {getMainMessage()}
          </div>

          {/* Cliché list */}
          {matches.length > 0 && (
            <div className="space-y-2 max-h-60 overflow-y-auto">
              {matches.map((match, index) => (
                <div
                  key={index}
                  className="border border-gray-200 rounded overflow-hidden"
                >
                  <button
                    onClick={() => setExpandedIndex(expandedIndex === index ? null : index)}
                    className="w-full text-left px-3 py-2 bg-gray-50 hover:bg-gray-100 transition-colors flex items-center justify-between"
                  >
                    <span className="text-xs font-medium text-gray-700 truncate pr-2">
                      "{match.match}"
                    </span>
                    <svg
                      className={`w-4 h-4 flex-shrink-0 text-gray-400 transition-transform ${
                        expandedIndex === index ? 'rotate-180' : ''
                      }`}
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 9l-7 7-7-7"
                      />
                    </svg>
                  </button>

                  {expandedIndex === index && (
                    <div className="px-3 py-2 border-t border-gray-200 bg-white">
                      <div className="text-xs text-gray-500 mb-1">Pattern:</div>
                      <div className="text-xs font-medium text-gray-700 mb-2">
                        {match.pattern}
                      </div>
                      <div className="text-xs text-gray-500 mb-1">Suggestion:</div>
                      <div className="text-xs text-blue-600">
                        {match.suggestion}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}

          {/* Tips for avoiding clichés */}
          {severity !== 'none' && (
            <div className="pt-2 border-t border-gray-100">
              <div className="text-xs text-gray-600">
                <span className="font-medium">Tip:</span> Replace clichés with specific details
                and moments only you could write about.
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
