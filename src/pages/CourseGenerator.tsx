import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { generateCourseWithAI, GeneratedCourse } from '../services/courseGenerator';
import type { AIProvider } from '../services/ai';
import './CourseGenerator.css';

const CourseGenerator: React.FC = () => {
  const navigate = useNavigate();
  const [topic, setTopic] = useState('');
  const [numLessons, setNumLessons] = useState(5);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleGenerate = async () => {
    if (!topic.trim()) {
      setError('Please enter a topic');
      return;
    }

    // Get API key from settings
    const savedSettings = localStorage.getItem('ai_settings');
    if (!savedSettings) {
      setError('Please configure your AI API key in Settings first!');
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
      setError('Please add your API key in Settings');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const course = await generateCourseWithAI(
        { provider: settings.provider as AIProvider, apiKey },
        topic,
        numLessons
      );
      
      // Save course and navigate
      const courses = JSON.parse(localStorage.getItem('ai_generated_courses') || '[]');
      courses.push(course);
      localStorage.setItem('ai_generated_courses', JSON.stringify(courses));
      
      navigate(`/course/${course.id}`);
    } catch (err: any) {
      setError(err.message || 'Failed to generate course');
    } finally {
      setLoading(false);
    }
  };

  const suggestedTopics = [
    'Machine Learning Fundamentals',
    'Deep Learning with PyTorch',
    'Natural Language Processing',
    'Computer Vision',
    'Reinforcement Learning',
    'Data Science with Python',
    'Neural Networks from Scratch',
    'Transformers and Attention'
  ];

  return (
    <div className="generator-page">
      <div className="generator-header">
        <div className="header-content">
          <h1>🧠 AI Course Generator</h1>
          <p>Create personalized courses on any topic using AI - just like roadmap.sh's AI Tutor</p>
        </div>
      </div>

      <div className="generator-content">
        <div className="generator-card">
          <div className="input-section">
            <label htmlFor="topic">What do you want to learn?</label>
            <input
              id="topic"
              type="text"
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              placeholder="e.g., Machine Learning, Neural Networks, Data Science..."
              disabled={loading}
            />
          </div>

          <div className="lessons-section">
            <label htmlFor="lessons">Number of lessons:</label>
            <select
              id="lessons"
              value={numLessons}
              onChange={(e) => setNumLessons(Number(e.target.value))}
              disabled={loading}
            >
              <option value={3}>3 Lessons</option>
              <option value={5}>5 Lessons</option>
              <option value={7}>7 Lessons</option>
              <option value={10}>10 Lessons</option>
            </select>
          </div>

          {error && <div className="error-message">{error}</div>}

          <button 
            className="generate-button"
            onClick={handleGenerate}
            disabled={loading || !topic.trim()}
          >
            {loading ? (
              <>
                <span className="spinner"></span>
                Generating your course...
              </>
            ) : (
              '🚀 Generate Course with AI'
            )}
          </button>
        </div>

        <div className="suggested-topics">
          <h3>Suggested Topics</h3>
          <div className="topic-chips">
            {suggestedTopics.map(t => (
              <button
                key={t}
                className="topic-chip"
                onClick={() => setTopic(t)}
                disabled={loading}
              >
                {t}
              </button>
            ))}
          </div>
        </div>

        <div className="info-section">
          <div className="info-card">
            <h3>✨ How it works</h3>
            <ol>
              <li>Enter any topic you want to learn</li>
              <li>AI generates a complete course with lessons</li>
              <li>Each lesson includes explanations & code examples</li>
              <li>Practice with quizzes & Python code</li>
              <li>Track your progress as you learn</li>
            </ol>
          </div>

          <div className="info-card">
            <h3>💰 Cost</h3>
            <p>Uses your own API key - you only pay for what you use:</p>
            <ul>
              <li><strong>GPT-4o Mini:</strong> ~$0.01 per course</li>
              <li><strong>Claude Haiku:</strong> ~$0.005 per course</li>
              <li><strong>Gemini:</strong> ~$0.003 per course</li>
            </ul>
          </div>
        </div>

        <div className="settings-prompt">
          <p>Don't have an API key? <Link to="/settings">Configure one in Settings</Link></p>
        </div>
      </div>
    </div>
  );
};

export default CourseGenerator;
