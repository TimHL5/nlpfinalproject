'use client';

import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from './ui/Card';
import { ProgressBar } from './ui/ProgressBar';
import type { OverallScore } from '@/lib/types';

interface OverallScoreCardProps {
  overallScore: OverallScore;
}

export function OverallScoreCard({ overallScore }: OverallScoreCardProps) {
  const { score, grade, strengths, improvements } = overallScore;

  const getGradeColor = () => {
    switch (grade) {
      case 'A':
        return 'text-green-600 bg-green-100';
      case 'B':
        return 'text-blue-600 bg-blue-100';
      case 'C':
        return 'text-amber-600 bg-amber-100';
      case 'D':
        return 'text-orange-600 bg-orange-100';
      case 'F':
        return 'text-red-600 bg-red-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  const getProgressVariant = () => {
    if (score >= 80) return 'success';
    if (score >= 60) return 'warning';
    return 'error';
  };

  return (
    <Card className="col-span-full">
      <CardHeader>
        <CardTitle icon="🎯">Overall Score</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col md:flex-row gap-6">
          {/* Score display */}
          <div className="flex items-center gap-4 md:w-1/3">
            <div className={`w-20 h-20 rounded-full flex items-center justify-center ${getGradeColor()}`}>
              <span className="text-3xl font-bold">{grade}</span>
            </div>
            <div>
              <div className="text-3xl font-bold text-gray-800">{score}/100</div>
              <div className="text-sm text-gray-500">Overall Score</div>
            </div>
          </div>

          {/* Progress bar and feedback */}
          <div className="flex-1 space-y-4">
            <ProgressBar
              value={score}
              variant={getProgressVariant()}
              size="lg"
              showLabel
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Strengths */}
              {strengths.length > 0 && (
                <div className="bg-green-50 rounded-lg p-3">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-green-600">✓</span>
                    <span className="text-sm font-medium text-green-800">Strengths</span>
                  </div>
                  <ul className="space-y-1">
                    {strengths.map((strength, index) => (
                      <li key={index} className="text-xs text-green-700">
                        • {strength}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Areas for improvement */}
              {improvements.length > 0 && (
                <div className="bg-amber-50 rounded-lg p-3">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-amber-600">↑</span>
                    <span className="text-sm font-medium text-amber-800">To Improve</span>
                  </div>
                  <ul className="space-y-1">
                    {improvements.map((improvement, index) => (
                      <li key={index} className="text-xs text-amber-700">
                        • {improvement}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Score breakdown info */}
        <div className="mt-4 pt-4 border-t border-gray-100">
          <details className="text-xs text-gray-500">
            <summary className="cursor-pointer hover:text-gray-700">
              How is this score calculated?
            </summary>
            <div className="mt-2 grid grid-cols-2 md:grid-cols-5 gap-2">
              <div className="bg-gray-50 p-2 rounded">
                <div className="font-medium">Length</div>
                <div>15 points</div>
              </div>
              <div className="bg-gray-50 p-2 rounded">
                <div className="font-medium">Vocabulary</div>
                <div>20 points</div>
              </div>
              <div className="bg-gray-50 p-2 rounded">
                <div className="font-medium">Variety</div>
                <div>20 points</div>
              </div>
              <div className="bg-gray-50 p-2 rounded">
                <div className="font-medium">Clichés</div>
                <div>25 points</div>
              </div>
              <div className="bg-gray-50 p-2 rounded">
                <div className="font-medium">Show/Tell</div>
                <div>20 points</div>
              </div>
            </div>
          </details>
        </div>
      </CardContent>
    </Card>
  );
}
