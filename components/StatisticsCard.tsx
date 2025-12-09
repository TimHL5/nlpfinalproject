'use client';

import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from './ui/Card';
import { Badge } from './ui/Badge';
import { ProgressBar } from './ui/ProgressBar';
import type { BasicStatistics } from '@/lib/types';

interface StatisticsCardProps {
  statistics: BasicStatistics;
}

export function StatisticsCard({ statistics }: StatisticsCardProps) {
  const {
    wordCount,
    sentenceCount,
    paragraphCount,
    avgSentenceLength,
    avgWordLength,
    lengthStatus
  } = statistics;

  const getStatusBadge = () => {
    switch (lengthStatus.status) {
      case 'good':
        return <Badge variant="success">Good Length</Badge>;
      case 'short':
      case 'long':
        return <Badge variant="warning">Adjust Length</Badge>;
      case 'too-short':
      case 'too-long':
        return <Badge variant="error">Out of Range</Badge>;
      default:
        return null;
    }
  };

  const getProgressVariant = () => {
    switch (lengthStatus.status) {
      case 'good':
        return 'success';
      case 'short':
      case 'long':
        return 'warning';
      case 'too-short':
      case 'too-long':
        return 'error';
      default:
        return 'neutral';
    }
  };

  // Calculate progress as percentage of target range
  const targetMid = (lengthStatus.targetMin + lengthStatus.targetMax) / 2;
  const progressValue = Math.min(100, (wordCount / lengthStatus.targetMax) * 100);

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle icon="📊">Statistics</CardTitle>
        {getStatusBadge()}
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {/* Main metrics */}
          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <div className="text-2xl font-bold text-gray-800">{wordCount}</div>
              <div className="text-xs text-gray-500">Words</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-gray-800">{sentenceCount}</div>
              <div className="text-xs text-gray-500">Sentences</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-gray-800">{paragraphCount}</div>
              <div className="text-xs text-gray-500">Paragraphs</div>
            </div>
          </div>

          {/* Word count progress */}
          <div>
            <ProgressBar
              value={progressValue}
              variant={getProgressVariant()}
              label={`Target: ${lengthStatus.targetMin}-${lengthStatus.targetMax} words`}
              showLabel
            />
          </div>

          {/* Additional metrics */}
          <div className="grid grid-cols-2 gap-4 pt-2 border-t border-gray-100">
            <div className="text-center">
              <div className="text-lg font-semibold text-gray-700">{avgSentenceLength}</div>
              <div className="text-xs text-gray-500">Avg words/sentence</div>
            </div>
            <div className="text-center">
              <div className="text-lg font-semibold text-gray-700">{avgWordLength}</div>
              <div className="text-xs text-gray-500">Avg word length</div>
            </div>
          </div>

          {/* Status message */}
          <div className="text-xs text-gray-600 bg-gray-50 p-2 rounded">
            {lengthStatus.message}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
