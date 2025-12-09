'use client';

import React from 'react';
import { StatisticsCard } from './StatisticsCard';
import { VocabularyCard } from './VocabularyCard';
import { SentenceVarietyCard } from './SentenceVarietyCard';
import { ClicheCard } from './ClicheCard';
import { ShowTellCard } from './ShowTellCard';
import { OpeningGenerator } from './OpeningGenerator';
import { OverallScoreCard } from './OverallScoreCard';
import type { EssayAnalysis } from '@/lib/types';

interface AnalysisResultsProps {
  analysis: EssayAnalysis | null;
  isLoading: boolean;
  error: string | null;
}

export function AnalysisResults({ analysis, isLoading, error }: AnalysisResultsProps) {
  // Loading state
  if (isLoading) {
    return (
      <div className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
              <div className="animate-pulse space-y-3">
                <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                <div className="h-8 bg-gray-200 rounded w-1/3 mx-auto"></div>
                <div className="h-2 bg-gray-200 rounded"></div>
                <div className="h-2 bg-gray-200 rounded w-3/4"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4">
        <div className="flex items-center gap-2 text-red-700">
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span className="font-medium">Analysis Error</span>
        </div>
        <p className="mt-2 text-sm text-red-600">{error}</p>
      </div>
    );
  }

  // Empty state
  if (!analysis) {
    return (
      <div className="bg-gray-50 border border-gray-200 rounded-lg p-8 text-center">
        <div className="text-gray-400 mb-2">
          <svg className="w-12 h-12 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
        </div>
        <h3 className="text-gray-600 font-medium">No Analysis Yet</h3>
        <p className="text-sm text-gray-500 mt-1">
          Paste your essay above and click "Analyze Essay" to get started.
        </p>
      </div>
    );
  }

  // Results display
  return (
    <div className="space-y-4">
      {/* Overall Score - Full width at top */}
      <OverallScoreCard overallScore={analysis.overallScore} />

      {/* Analysis cards grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <StatisticsCard statistics={analysis.statistics} />
        <VocabularyCard vocabulary={analysis.vocabulary} />
        <SentenceVarietyCard sentenceStarters={analysis.sentenceStarters} />
        <ClicheCard cliches={analysis.cliches} />
        <ShowTellCard showTell={analysis.showTell} />
      </div>

      {/* Opening Generator - Full width */}
      <OpeningGenerator initialOpenings={analysis.generatedOpenings} />

      {/* Analysis timestamp */}
      <div className="text-xs text-gray-400 text-center">
        Analysis completed at {new Date(analysis.timestamp).toLocaleString()}
      </div>
    </div>
  );
}
