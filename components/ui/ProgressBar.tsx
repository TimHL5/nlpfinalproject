'use client';

import React from 'react';

type ProgressVariant = 'success' | 'warning' | 'error' | 'info' | 'neutral';

interface ProgressBarProps {
  value: number; // 0-100
  max?: number;
  variant?: ProgressVariant;
  showLabel?: boolean;
  label?: string;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

const variantStyles: Record<ProgressVariant, string> = {
  success: 'bg-green-500',
  warning: 'bg-amber-500',
  error: 'bg-red-500',
  info: 'bg-blue-500',
  neutral: 'bg-gray-500'
};

const sizeStyles: Record<'sm' | 'md' | 'lg', string> = {
  sm: 'h-1.5',
  md: 'h-2.5',
  lg: 'h-4'
};

export function ProgressBar({
  value,
  max = 100,
  variant = 'info',
  showLabel = false,
  label,
  className = '',
  size = 'md'
}: ProgressBarProps) {
  const percentage = Math.min(100, Math.max(0, (value / max) * 100));

  return (
    <div className={`w-full ${className}`}>
      {(showLabel || label) && (
        <div className="flex justify-between mb-1 text-xs text-gray-600">
          {label && <span>{label}</span>}
          {showLabel && <span>{Math.round(percentage)}%</span>}
        </div>
      )}
      <div className={`w-full bg-gray-200 rounded-full overflow-hidden ${sizeStyles[size]}`}>
        <div
          className={`${sizeStyles[size]} rounded-full transition-all duration-300 ${variantStyles[variant]}`}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
}

interface RatioBarProps {
  leftValue: number;
  rightValue: number;
  leftLabel?: string;
  rightLabel?: string;
  leftColor?: string;
  rightColor?: string;
  className?: string;
}

export function RatioBar({
  leftValue,
  rightValue,
  leftLabel = 'Left',
  rightLabel = 'Right',
  leftColor = 'bg-blue-500',
  rightColor = 'bg-gray-300',
  className = ''
}: RatioBarProps) {
  const total = leftValue + rightValue;
  const leftPercentage = total > 0 ? (leftValue / total) * 100 : 50;

  return (
    <div className={`w-full ${className}`}>
      <div className="flex justify-between mb-1 text-xs text-gray-600">
        <span>{leftLabel}: {leftValue}</span>
        <span>{rightLabel}: {rightValue}</span>
      </div>
      <div className="w-full h-2.5 bg-gray-200 rounded-full overflow-hidden flex">
        <div
          className={`h-full ${leftColor} transition-all duration-300`}
          style={{ width: `${leftPercentage}%` }}
        />
        <div
          className={`h-full ${rightColor} transition-all duration-300`}
          style={{ width: `${100 - leftPercentage}%` }}
        />
      </div>
    </div>
  );
}
