'use client';

import React, { useState, useCallback } from 'react';

interface EssayInputProps {
  onAnalyze: (text: string) => void;
  isLoading: boolean;
}

// Sample essay for demo purposes
const SAMPLE_ESSAY = `Ever since I was young, I have always been passionate about music. It made me who I am today. The piano opened my eyes to a whole new world of expression.

I remember it like it was yesterday when my grandmother first placed my small hands on the ivory keys. Her gentle guidance taught me the importance of patience and persistence. This experience changed my life in ways I never expected.

Outside my comfort zone, I discovered a love for jazz improvisation. The first time I performed at the school talent show, my hands trembled and my heart raced. I walked onto the stage, adjusted the microphone, and placed my fingers on the familiar keys. The first notes floated into the silence, and suddenly, the fear transformed into pure joy.

In today's society, music education faces significant challenges. I believe that everyone deserves access to the transformative power of learning an instrument. That's why I started teaching piano to underprivileged children at the community center. Watching their faces light up when they master their first song reminds me of my own journey.

At the end of the day, music has been my constant companion through every challenge. I know that my passion for piano will continue to guide me as I pursue my dreams at your university.`;

export function EssayInput({ onAnalyze, isLoading }: EssayInputProps) {
  const [text, setText] = useState('');

  const wordCount = text.trim() ? text.trim().split(/\s+/).length : 0;
  const charCount = text.length;

  const handleAnalyze = useCallback(() => {
    if (text.trim().length >= 50) {
      onAnalyze(text);
    }
  }, [text, onAnalyze]);

  const handleClear = useCallback(() => {
    setText('');
  }, []);

  const handleLoadSample = useCallback(() => {
    setText(SAMPLE_ESSAY);
  }, []);

  const handlePaste = useCallback(async () => {
    try {
      const clipboardText = await navigator.clipboard.readText();
      setText(clipboardText);
    } catch {
      // Clipboard access denied or not available
      console.log('Clipboard access not available');
    }
  }, []);

  const getWordCountColor = () => {
    if (wordCount < 200) return 'text-gray-500';
    if (wordCount < 250) return 'text-amber-600';
    if (wordCount <= 650) return 'text-green-600';
    if (wordCount <= 700) return 'text-amber-600';
    return 'text-red-600';
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
      <div className="px-4 py-3 border-b border-gray-100 flex items-center justify-between">
        <h2 className="text-sm font-semibold text-gray-800">Your Essay</h2>
        <div className="flex gap-2">
          <button
            onClick={handlePaste}
            className="text-xs px-2 py-1 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded transition-colors"
            title="Paste from clipboard"
          >
            Paste
          </button>
          <button
            onClick={handleLoadSample}
            className="text-xs px-2 py-1 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded transition-colors"
            title="Load sample essay"
          >
            Sample
          </button>
          <button
            onClick={handleClear}
            className="text-xs px-2 py-1 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded transition-colors"
            title="Clear text"
          >
            Clear
          </button>
        </div>
      </div>

      <div className="p-4">
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Paste your college essay here..."
          className="w-full min-h-[250px] p-3 border border-gray-200 rounded-lg resize-y focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-800 text-sm leading-relaxed"
          disabled={isLoading}
        />

        <div className="mt-3 flex items-center justify-between">
          <div className="flex items-center gap-4 text-xs">
            <span className={getWordCountColor()}>
              <span className="font-medium">{wordCount}</span> / 650 words
            </span>
            <span className="text-gray-400">|</span>
            <span className="text-gray-500">
              {charCount} characters
            </span>
          </div>

          <button
            onClick={handleAnalyze}
            disabled={isLoading || text.trim().length < 50}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              isLoading || text.trim().length < 50
                ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                : 'bg-blue-600 text-white hover:bg-blue-700'
            }`}
          >
            {isLoading ? (
              <span className="flex items-center gap-2">
                <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                    fill="none"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  />
                </svg>
                Analyzing...
              </span>
            ) : (
              'Analyze Essay'
            )}
          </button>
        </div>

        {text.trim().length > 0 && text.trim().length < 50 && (
          <p className="mt-2 text-xs text-amber-600">
            Essay must be at least 50 characters for analysis
          </p>
        )}
      </div>
    </div>
  );
}
