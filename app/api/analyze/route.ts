/**
 * ESSAY ANALYSIS API ENDPOINT
 *
 * This API endpoint handles POST requests containing essay text
 * and returns a comprehensive NLP analysis.
 *
 * Route: POST /api/analyze
 * Body: { text: string }
 * Response: EssayAnalysis object
 *
 * The analysis includes:
 * - Basic statistics (word count, sentence count, etc.)
 * - Vocabulary analysis (richness, overused words)
 * - Cliché detection (using regex patterns)
 * - Sentence starter analysis (n-gram based)
 * - Show vs Tell analysis (simplified POS)
 * - Opening sentence suggestions (Markov chain generated)
 * - Overall score and feedback
 */

import { NextResponse } from 'next/server';
import { analyzeEssay } from '@/lib/nlp';

/**
 * Minimum character requirement for analysis
 * Essays shorter than this won't have meaningful analysis
 */
const MIN_CHARACTERS = 50;

/**
 * Maximum character limit to prevent abuse
 * ~10,000 characters is roughly 1,500-2,000 words
 */
const MAX_CHARACTERS = 10000;

/**
 * POST handler for essay analysis
 *
 * @param request - The incoming request with essay text in body
 * @returns JSON response with analysis or error
 */
export async function POST(request: Request) {
  try {
    // Parse request body
    const body = await request.json();
    const { text } = body;

    // Validate that text is provided
    if (!text || typeof text !== 'string') {
      return NextResponse.json(
        {
          error: 'Essay text is required',
          details: 'Please provide a "text" field with your essay content.'
        },
        { status: 400 }
      );
    }

    // Validate minimum length
    const trimmedText = text.trim();
    if (trimmedText.length < MIN_CHARACTERS) {
      return NextResponse.json(
        {
          error: 'Essay is too short',
          details: `Your essay must be at least ${MIN_CHARACTERS} characters. Current length: ${trimmedText.length} characters.`
        },
        { status: 400 }
      );
    }

    // Validate maximum length
    if (trimmedText.length > MAX_CHARACTERS) {
      return NextResponse.json(
        {
          error: 'Essay is too long',
          details: `Maximum allowed length is ${MAX_CHARACTERS} characters. Current length: ${trimmedText.length} characters.`
        },
        { status: 400 }
      );
    }

    // Perform the analysis
    const analysis = analyzeEssay(trimmedText);

    // Convert Map objects to plain objects for JSON serialization
    // Maps don't serialize to JSON properly, so we convert them
    const serializableAnalysis = {
      ...analysis,
      vocabulary: {
        ...analysis.vocabulary,
        // Convert wordFrequencies Map to Object
        wordFrequencies: Object.fromEntries(analysis.vocabulary.wordFrequencies)
      },
      sentenceStarters: {
        ...analysis.sentenceStarters,
        // Convert starterFrequencies Map to Object
        starterFrequencies: Object.fromEntries(analysis.sentenceStarters.starterFrequencies)
      }
    };

    // Return successful response
    return NextResponse.json(serializableAnalysis);

  } catch (error) {
    // Log error for debugging
    console.error('Analysis error:', error);

    // Check if it's a JSON parse error
    if (error instanceof SyntaxError) {
      return NextResponse.json(
        {
          error: 'Invalid request format',
          details: 'Request body must be valid JSON with a "text" field.'
        },
        { status: 400 }
      );
    }

    // Generic server error
    return NextResponse.json(
      {
        error: 'Failed to analyze essay',
        details: 'An unexpected error occurred during analysis. Please try again.'
      },
      { status: 500 }
    );
  }
}

/**
 * GET handler - returns API information
 *
 * This provides helpful information about how to use the API
 */
export async function GET() {
  return NextResponse.json({
    name: 'Essay Insight Analysis API',
    version: '1.0.0',
    description: 'NLP-powered college essay analysis',
    usage: {
      method: 'POST',
      endpoint: '/api/analyze',
      body: {
        text: 'Your essay text here (string, required)'
      },
      constraints: {
        minLength: `${MIN_CHARACTERS} characters`,
        maxLength: `${MAX_CHARACTERS} characters`
      }
    },
    analyses: [
      'Basic statistics (word count, sentence count, etc.)',
      'Vocabulary analysis (richness, overused words)',
      'Cliché detection (regex-based pattern matching)',
      'Sentence variety (n-gram analysis of starters)',
      'Show vs Tell (simplified POS analysis)',
      'Opening suggestions (Markov chain generation)'
    ],
    nlpConcepts: [
      'Tokenization (Week 5)',
      'Frequency Analysis (Week 5)',
      'Regular Expressions (Week 11)',
      'Part-of-Speech Tagging concepts (Week 6)',
      'N-grams (Week 12)',
      'Markov Chains (Week 12)'
    ],
    course: 'CSCI 3310 - Computing Language',
    developer: 'Tim Nguyen'
  });
}
