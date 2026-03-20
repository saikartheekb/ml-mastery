// AI Service - Uses user's API key to generate explanations

export type AIProvider = 'openai' | 'anthropic';

export interface AIConfig {
  provider: AIProvider;
  apiKey: string;
}

export interface AIExplanationRequest {
  topic: string;
  concept: string;
  userQuestion?: string;
  context?: string;
}

export interface AIExplanationResponse {
  explanation: string;
  examples?: string[];
  relatedConcepts?: string[];
}

// Generate explanation using OpenAI
async function generateWithOpenAI(apiKey: string, prompt: string): Promise<string> {
  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`
    },
    body: JSON.stringify({
      model: 'gpt-3.5-turbo',
      messages: [
        {
          role: 'system',
          content: 'You are an expert ML/AI tutor. Explain concepts clearly with examples.'
        },
        {
          role: 'user',
          content: prompt
        }
      ],
      temperature: 0.7,
      max_tokens: 500
    })
  });

  if (!response.ok) {
    throw new Error(`OpenAI API error: ${response.status}`);
  }

  const data = await response.json();
  return data.choices[0]?.message?.content || 'No response generated';
}

// Generate explanation using Anthropic
async function generateWithAnthropic(apiKey: string, prompt: string): Promise<string> {
  const response = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': apiKey,
      'anthropic-version': '2023-06-01'
    },
    body: JSON.stringify({
      model: 'claude-3-haiku-20240307',
      max_tokens: 500,
      messages: [
        {
          role: 'user',
          content: prompt
        }
      ],
      system: 'You are an expert ML/AI tutor. Explain concepts clearly with examples.'
    })
  });

  if (!response.ok) {
    throw new Error(`Anthropic API error: ${response.status}`);
  }

  const data = await response.json();
  return data.content[0]?.text || 'No response generated';
}

// Main AI explanation function
export async function generateExplanation(
  config: AIConfig,
  request: AIExplanationRequest
): Promise<AIExplanationResponse> {
  const { topic, concept, userQuestion, context } = request;

  // Build prompt based on request
  let prompt = '';
  
  if (userQuestion) {
    // Answer user's specific question
    prompt = `Context: ${context || 'ML Learning Platform'}
Topic: ${topic}
Question: ${userQuestion}

Please provide a clear, detailed explanation.`;
  } else {
    // Explain a concept
    prompt = `Explain the concept of "${concept}" in ${topic}.

Please include:
1. A clear definition
2. Why it's important
3. A simple example
4. Common use cases`;
  }

  try {
    let explanation: string;

    if (config.provider === 'openai') {
      explanation = await generateWithOpenAI(config.apiKey, prompt);
    } else {
      explanation = await generateWithAnthropic(config.apiKey, prompt);
    }

    return {
      explanation,
      relatedConcepts: extractRelatedConcepts(explanation)
    };
  } catch (error) {
    console.error('AI generation error:', error);
    throw error;
  }
}

// Extract related concepts from explanation (simple heuristic)
function extractRelatedConcepts(text: string): string[] {
  // Look for capitalized terms that might be concepts
  const matches = text.match(/[A-Z][a-z]+(?:\s+[A-Z][a-z]+)*/g) || [];
  return [...new Set(matches)].slice(0, 5);
}

// Generate a quiz using AI
export async function generateQuiz(
  config: AIConfig,
  topic: string,
  numQuestions: number = 3
): Promise<string[]> {
  const prompt = `Generate ${numQuestions} quiz questions about "${topic}". 
Format as a JSON array of questions.
Each question should have 4 options with one correct answer.`;

  try {
    let response: string;

    if (config.provider === 'openai') {
      response = await generateWithOpenAI(config.apiKey, prompt);
    } else {
      response = await generateWithAnthropic(config.apiKey, prompt);
    }

    // Try to parse as JSON
    try {
      const questions = JSON.parse(response);
      return questions;
    } catch {
      // Return as text if not valid JSON
      return [response];
    }
  } catch (error) {
    console.error('Quiz generation error:', error);
    throw error;
  }
}
