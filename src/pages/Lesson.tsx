import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import 'katex/dist/katex.min.css';
import { learningPath } from '../data/curriculum';
import { getUserProgress, completeLesson, addTimeSpent } from '../services/progress';
import { generateExplanation } from '../services/ai';
import type { AIProvider } from '../services/ai';
import { runPythonCode, loadPyodideEngine } from '../services/python';
import './Lesson.css';

const Lesson: React.FC = () => {
  const { lessonId } = useParams<{ lessonId: string }>();
  const navigate = useNavigate();
  const [progress, setProgress] = useState(getUserProgress());
  const [startTime] = useState(Date.now());
  const [codeOutputs, setCodeOutputs] = useState<Record<string, string>>({});
  const [isRunning, setIsRunning] = useState(false);
  
  // AI Chat state
  const [aiQuestion, setAiQuestion] = useState('');
  const [aiResponse, setAiResponse] = useState('');
  const [aiLoading, setAiLoading] = useState(false);
  const [aiError, setAiError] = useState('');
  
  // Auto AI explanation state
  const [autoExplanation, setAutoExplanation] = useState('');
  const [autoExplanationLoading, setAutoExplanationLoading] = useState(false);
  
  // Python Playground state
  const [pythonCode, setPythonCode] = useState('');
  const [pythonOutput, setPythonOutput] = useState('');
  const [pythonError, setPythonError] = useState('');
  const [pythonLoading, setPythonLoading] = useState(false);
  const [pythonReady, setPythonReady] = useState(false);

  // Find the lesson
  let lesson = null;
  let course = null;
  let phase = null;
  let lessonIndex = -1;

  for (const p of learningPath.phases) {
    for (const c of p.courses) {
      const foundLesson = c.lessons.find(l => l.id === lessonId);
      if (foundLesson) {
        lesson = foundLesson;
        course = c;
        phase = p;
        lessonIndex = c.lessons.findIndex(l => l.id === lessonId);
        break;
      }
    }
  }

  useEffect(() => {
    // Track time spent when leaving
    return () => {
      const minutesSpent = Math.round((Date.now() - startTime) / 60000);
      if (minutesSpent > 0) {
        addTimeSpent(minutesSpent);
      }
    };
  }, [startTime]);

  // Auto-generate AI explanation on lesson load
  useEffect(() => {
    if (!lesson || !course) return;
    
    const generateAutoExplanation = async () => {
      const savedSettings = localStorage.getItem('ai_settings');
      if (!savedSettings) return;
      
      const settings = JSON.parse(savedSettings);
      let apiKey = '';
      if (settings.provider === 'openai') {
        apiKey = settings.openaiKey;
      } else if (settings.provider === 'anthropic') {
        apiKey = settings.anthropicKey;
      } else {
        apiKey = settings.geminiKey;
      }
      if (!apiKey) return;
      
      setAutoExplanationLoading(true);
      try {
        const response = await generateExplanation(
          { provider: settings.provider as AIProvider, apiKey },
          {
            topic: course.title || 'Machine Learning',
            concept: lesson.title,
            context: lesson.content
          }
        );
        setAutoExplanation(response.explanation);
      } catch (err) {
        console.error('Auto explanation error:', err);
      }
      setAutoExplanationLoading(false);
    };
    
    generateAutoExplanation();
  }, [lesson?.id, course?.id]);

  // Initialize Python playground
  useEffect(() => {
    const initPython = async () => {
      const ready = await loadPyodideEngine();
      setPythonReady(ready);
    };
    initPython();
  }, []);

  if (!lesson) {
    return (
      <div className="lesson-not-found">
        <h2>Lesson not found</h2>
        <Link to="/courses">Back to Courses</Link>
      </div>
    );
  }

  const isCompleted = progress.completedLessons.includes(lesson.id);

  const handleMarkComplete = () => {
    const updatedProgress = completeLesson(lesson.id);
    setProgress(updatedProgress);
    
    // Navigate to next lesson or back to course
    if (course && lessonIndex < course.lessons.length - 1) {
      const nextLesson = course.lessons[lessonIndex + 1];
      navigate(`/lesson/${nextLesson.id}`);
    } else if (course) {
      navigate(`/course/${course.id}`);
    }
  };

  const runCode = async (code: string, exampleId: string) => {
    setIsRunning(true);
    try {
      const result = await runPythonCode(code);
      let output = '';
      if (result.output) {
        output = result.output;
      }
      if (result.error) {
        output = `Error:\n${result.error}`;
      }
      setCodeOutputs(prev => ({ ...prev, [exampleId]: output || 'Code executed successfully!' }));
    } catch (error) {
      setCodeOutputs(prev => ({ ...prev, [exampleId]: `Error: ${error}` }));
    }
    setIsRunning(false);
  };

  // AI Ask function
  const askAI = async () => {
    if (!aiQuestion.trim()) return;
    
    // Get API key from localStorage
    const savedSettings = localStorage.getItem('ai_settings');
    if (!savedSettings) {
      setAiError('Please configure your AI API key in Settings first!');
      return;
    }
    
    const settings = JSON.parse(savedSettings);
    let apiKey = '';
    if (settings.provider === 'openai') {
      apiKey = settings.openaiKey;
    } else if (settings.provider === 'anthropic') {
      apiKey = settings.anthropicKey;
    } else {
      apiKey = settings.geminiKey;
    }
    
    if (!apiKey) {
      setAiError('Please add your API key in Settings!');
      return;
    }
    
    setAiLoading(true);
    setAiError('');
    
    try {
      const response = await generateExplanation(
        { provider: settings.provider as AIProvider, apiKey },
        {
          topic: course?.title || 'Machine Learning',
          concept: lesson?.title || '',
          userQuestion: aiQuestion,
          context: lesson?.content
        }
      );
      setAiResponse(response.explanation);
    } catch (err: any) {
      setAiError(err.message || 'Failed to get AI response');
    }
    
    setAiLoading(false);
  };

  return (
    <div className="lesson-page">
      {/* Header */}
      <div className="lesson-header">
        <Link to={`/course/${course?.id}`} className="back-link">
          ← Back to {course?.title}
        </Link>
        <div className="lesson-info">
          <span className="phase-badge">Phase {phase?.number}</span>
          <h1>{lesson.title}</h1>
          <div className="lesson-meta">
            <span>⏱ {lesson.duration} min</span>
            <span>📚 {lesson.codeExamples.length} Examples</span>
            <span>✏️ {lesson.practiceProblems.length} Problems</span>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="lesson-content">
        <div className="content-main">
          {/* Theory Content */}
          <div className="theory-section">
            <h2>Theory</h2>
            <div className="markdown-content">
              <ReactMarkdown remarkPlugins={[remarkMath]} rehypePlugins={[rehypeKatex]}>{lesson.content}</ReactMarkdown>
            </div>
          </div>

          {/* AI Explanation - Auto Generated */}
          {autoExplanationLoading ? (
            <div className="ai-explanation-section loading">
              <div className="loading-spinner">🤔</div>
              <p>Generating comprehensive explanation with AI...</p>
            </div>
          ) : autoExplanation ? (
            <div className="ai-explanation-section">
              <h2>🤖 AI-Powered Deep Dive</h2>
              <p className="ai-explanation-intro">
                Here's a comprehensive explanation of this concept:
              </p>
              <div className="ai-explanation-content">
                <ReactMarkdown remarkPlugins={[remarkMath]} rehypePlugins={[rehypeKatex]}>
                  {autoExplanation}
                </ReactMarkdown>
              </div>
            </div>
          ) : (
            <div className="ai-explanation-section">
              <h2>🤖 AI-Powered Explanations</h2>
              <p>Configure your AI API key in Settings to get automatic comprehensive explanations!</p>
              <Link to="/settings" className="settings-link">→ Go to Settings</Link>
            </div>
          )}

          {/* Code Examples */}
          {lesson.codeExamples.length > 0 && (
            <div className="examples-section">
              <h2>Code Examples</h2>
              {lesson.codeExamples.map((example) => (
                <div key={example.id} className="code-example">
                  <h3>{example.title}</h3>
                  <pre className="code-block">
                    <code>{example.code}</code>
                  </pre>
                  <p className="code-explanation">{example.explanation}</p>
                  <button 
                    className="run-button"
                    onClick={() => runCode(example.code, example.id)}
                    disabled={isRunning}
                  >
                    {isRunning ? 'Running...' : '▶ Run Code'}
                  </button>
                  {codeOutputs[example.id] && (
                    <div className="code-output">
                      <pre>{codeOutputs[example.id]}</pre>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}

          {/* Practice Problems */}
          {lesson.practiceProblems.length > 0 && (
            <div className="practice-section">
              <h2>Practice Problems</h2>
              {lesson.practiceProblems.map((problem, index) => (
                <div key={problem.id} className="practice-problem">
                  <h3>{index + 1}. {problem.title}</h3>
                  <p>{problem.description}</p>
                  <details>
                    <summary>Show Solution</summary>
                    <div className="solution">
                      <strong>Answer:</strong> {problem.solution}
                    </div>
                  </details>
                </div>
              ))}
            </div>
          )}

          {/* AI Assistant Section */}
          <div className="ai-assistant-section">
            <h2>🤖 Ask AI Assistant</h2>
            <p className="ai-description">
              Have questions about this lesson? Ask our AI tutor for explanations.
            </p>
            
            <div className="ai-input-area">
              <textarea
                value={aiQuestion}
                onChange={(e) => setAiQuestion(e.target.value)}
                placeholder="Ask a question about this concept... (e.g., 'Can you explain matrix multiplication in simpler terms?')"
                rows={3}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    askAI();
                  }
                }}
              />
              <button 
                className="ai-ask-button" 
                onClick={askAI}
                disabled={aiLoading || !aiQuestion.trim()}
              >
                {aiLoading ? '🤔 Thinking...' : '💬 Ask'}
              </button>
            </div>

            {aiError && (
              <div className="ai-error">
                {aiError}
              </div>
            )}

            {aiResponse && (
              <div className="ai-response">
                <h3>Answer:</h3>
                <ReactMarkdown>{aiResponse}</ReactMarkdown>
              </div>
            )}
          </div>

          {/* Python Playground */}
          <div className="python-playground-section">
            <h2>🐍 Python Coding Playground</h2>
            <p className="playground-description">
              Write and run Python code directly in your browser. Powered by Pyodide!
            </p>
            
            {!pythonReady ? (
              <div className="python-loading">
                <div className="loading-spinner">🐍</div>
                <p>Loading Python environment...</p>
              </div>
            ) : (
              <>
                <div className="python-editor">
                  <textarea
                    value={pythonCode}
                    onChange={(e) => setPythonCode(e.target.value)}
                    placeholder="# Write your Python code here!
import numpy as np
import matplotlib.pyplot as plt

# Example: Create a simple array
arr = np.array([1, 2, 3, 4, 5])
print('Array:', arr)
print('Mean:', np.mean(arr))
"
                    rows={10}
                  />
                </div>
                
                <div className="python-actions">
                  <button 
                    className="run-python-button"
                    onClick={async () => {
                      setPythonLoading(true);
                      setPythonOutput('');
                      setPythonError('');
                      const result = await runPythonCode(pythonCode);
                      if (result.output) setPythonOutput(result.output);
                      if (result.error) setPythonError(result.error);
                      setPythonLoading(false);
                    }}
                    disabled={pythonLoading || !pythonCode.trim()}
                  >
                    {pythonLoading ? '⏳ Running...' : '▶ Run Code'}
                  </button>
                  <button 
                    className="clear-python-button"
                    onClick={() => {
                      setPythonCode('');
                      setPythonOutput('');
                      setPythonError('');
                    }}
                  >
                    🗑️ Clear
                  </button>
                </div>

                {pythonError && (
                  <div className="python-output error">
                    <h4>Error:</h4>
                    <pre>{pythonError}</pre>
                  </div>
                )}

                {pythonOutput && (
                  <div className="python-output">
                    <h4>Output:</h4>
                    <pre>{pythonOutput}</pre>
                  </div>
                )}
              </>
            )}
          </div>
        </div>

        {/* Sidebar */}
        <div className="lesson-sidebar">
          <div className="sidebar-section">
            <h3>Lesson Progress</h3>
            <div className="progress-indicator">
              {isCompleted ? (
                <span className="completed-badge">✓ Completed</span>
              ) : (
                <span className="in-progress-badge">In Progress</span>
              )}
            </div>
          </div>

          {course && (
            <div className="sidebar-section">
              <h3>Course Navigation</h3>
              <div className="lesson-nav">
                {lessonIndex > 0 && (
                  <Link 
                    to={`/lesson/${course.lessons[lessonIndex - 1].id}`}
                    className="nav-button prev"
                  >
                    ← Previous
                  </Link>
                )}
                {lessonIndex < course.lessons.length - 1 && (
                  <Link 
                    to={`/lesson/${course.lessons[lessonIndex + 1].id}`}
                    className="nav-button next"
                  >
                    Next →
                  </Link>
                )}
              </div>
            </div>
          )}

          <div className="sidebar-section">
            {!isCompleted ? (
              <button className="complete-button" onClick={handleMarkComplete}>
                Mark as Complete ✓
              </button>
            ) : (
              <div className="completed-message">
                <p>Great job completing this lesson!</p>
                {lessonIndex < (course?.lessons.length || 0) - 1 && (
                  <Link to={`/lesson/${course!.lessons[lessonIndex + 1].id}`} className="next-lesson-button">
                    Next Lesson →
                  </Link>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Lesson;
