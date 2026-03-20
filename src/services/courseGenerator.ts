// AI Course Generator - Generates personalized courses on-demand (like roadmap.sh AI Tutor)

import type { AIProvider } from './ai';

export interface GeneratedCourse {
  id: string;
  title: string;
  description: string;
  topic: string;
  lessons: GeneratedLesson[];
  createdAt: string;
}

export interface GeneratedLesson {
  id: string;
  title: string;
  content: string;
  duration: number;
  order: number;
}

// AI-powered course generation - works like roadmap.sh's AI Tutor
export async function generateCourseWithAI(
  config: { provider: AIProvider; apiKey: string },
  topic: string,
  numLessons: number = 5
): Promise<GeneratedCourse> {
  const prompt = `Generate a comprehensive course about "${topic}" with exactly ${numLessons} lessons.
  
Format your response as a JSON object with this structure:
{
  "title": "Course Title",
  "description": "2-3 sentence description",
  "lessons": [
    {
      "title": "Lesson Title",
      "content": "Full markdown lesson content with explanations, examples, and code snippets",
      "duration": minutes (number)
    }
  ]
}

Requirements:
- Each lesson should be substantial (500-800 words)
- Include mathematical formulas where relevant using $...$ for inline and $$...$$ for block
- Include Python code examples where appropriate
- Cover fundamentals to advanced topics
- Make it practical and hands-on
- Use markdown formatting for headers, lists, code blocks

Respond ONLY with valid JSON, no other text.`;

  let response: string;

  if (config.provider === 'openai') {
    response = await generateWithOpenAI(config.apiKey, prompt);
  } else if (config.provider === 'anthropic') {
    response = await generateWithAnthropic(config.apiKey, prompt);
  } else {
    response = await generateWithGemini(config.apiKey, prompt);
  }

  // Parse the JSON response
  const courseData = JSON.parse(response);

  // Create the generated course
  const course: GeneratedCourse = {
    id: `ai-course-${Date.now()}`,
    title: courseData.title,
    description: courseData.description,
    topic,
    lessons: courseData.lessons.map((lesson: any, index: number) => ({
      id: `lesson-${Date.now()}-${index}`,
      title: lesson.title,
      content: lesson.content,
      duration: lesson.duration || 15,
      order: index + 1
    })),
    createdAt: new Date().toISOString()
  };

  return course;
}

// Generate quiz questions for a lesson
export async function generateQuizWithAI(
  config: { provider: AIProvider; apiKey: string },
  topic: string,
  lessonTitle: string,
  numQuestions: number = 5
): Promise<any[]> {
  const prompt = `Generate ${numQuestions} quiz questions about "${lessonTitle}" from the "${topic}" course.

Format as a JSON array of questions with this structure:
[
  {
    "id": "q1",
    "question": "Question text",
    "options": ["Option A", "Option B", "Option C", "Option D"],
    "correctAnswer": 0,
    "explanation": "Why this answer is correct"
  }
]

Make questions practical and test understanding, not just memorization.`;

  let response: string;

  if (config.provider === 'openai') {
    response = await generateWithOpenAI(config.apiKey, prompt);
  } else if (config.provider === 'anthropic') {
    response = await generateWithAnthropic(config.apiKey, prompt);
  } else {
    response = await generateWithGemini(config.apiKey, prompt);
  }

  return JSON.parse(response);
}

// Generate practice problems for a lesson
export async function generatePracticeProblemsWithAI(
  config: { provider: AIProvider; apiKey: string },
  topic: string,
  lessonTitle: string,
  numProblems: number = 3
): Promise<any[]> {
  const prompt = `Generate ${numProblems} hands-on practice problems for learning about "${lessonTitle}" in "${topic}".

Format as a JSON array:
[
  {
    "id": "p1",
    "title": "Problem title",
    "description": "Problem description",
    "starterCode": "Optional starter code",
    "solution": "Solution code",
    "hints": ["Hint 1", "Hint 2"],
    "difficulty": "easy|medium|hard"
  }
]

Include Python code problems where possible.`;

  let response: string;

  if (config.provider === 'openai') {
    response = await generateWithOpenAI(config.apiKey, prompt);
  } else if (config.provider === 'anthropic') {
    response = await generateWithAnthropic(config.apiKey, prompt);
  } else {
    response = await generateWithGemini(config.apiKey, prompt);
  }

  return JSON.parse(response);
}

// AI API implementations
async function generateWithOpenAI(apiKey: string, prompt: string): Promise<string> {
  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`
    },
    body: JSON.stringify({
      model: 'gpt-4o-mini',
      messages: [
        {
          role: 'system',
          content: 'You are an expert educator who creates comprehensive, practical courses. Generate detailed lesson content with clear explanations, examples, and code snippets.'
        },
        {
          role: 'user',
          content: prompt
        }
      ],
      temperature: 0.7
    })
  });

  if (!response.ok) {
    throw new Error(`OpenAI API error: ${response.status}`);
  }

  const data = await response.json();
  return data.choices[0]?.message?.content || '';
}

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
      max_tokens: 4000,
      messages: [
        {
          role: 'user',
          content: prompt
        }
      ],
      system: 'You are an expert educator who creates comprehensive, practical courses. Generate detailed lesson content with clear explanations, examples, and code snippets.'
    })
  });

  if (!response.ok) {
    throw new Error(`Anthropic API error: ${response.status}`);
  }

  const data = await response.json();
  return data.content[0]?.text || '';
}

async function generateWithGemini(apiKey: string, prompt: string): Promise<string> {
  const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      systemInstruction: {
        parts: [{
          text: 'You are an expert educator who creates comprehensive, practical courses. Generate detailed lesson content with clear explanations, examples, and code snippets in JSON format.'
        }]
      },
      contents: [
        {
          parts: [
            {
              text: prompt
            }
          ]
        }
      ],
      generationConfig: {
        temperature: 0.7,
        maxOutputTokens: 4000
      }
    })
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Gemini API error: ${response.status} - ${errorText}`);
  }

  const data = await response.json();
  return data.candidates[0]?.content?.parts[0]?.text || '';
}

// Local storage for generated courses
const STORAGE_KEY = 'ai_generated_courses';

export function saveGeneratedCourse(course: GeneratedCourse): void {
  const courses = getGeneratedCourses();
  courses.push(course);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(courses));
}

export function getGeneratedCourses(): GeneratedCourse[] {
  const stored = localStorage.getItem(STORAGE_KEY);
  return stored ? JSON.parse(stored) : [];
}

export function getGeneratedCourse(courseId: string): GeneratedCourse | undefined {
  const courses = getGeneratedCourses();
  return courses.find(c => c.id === courseId);
}

export function deleteGeneratedCourse(courseId: string): void {
  const courses = getGeneratedCourses().filter(c => c.id !== courseId);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(courses));
}
