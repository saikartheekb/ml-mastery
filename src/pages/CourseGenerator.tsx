import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { generateCourseWithAI } from '../services/courseGenerator';
import type { AIProvider } from '../services/ai';
import { mlTopics, topicCategories, getTopicsByCategory, type MLTopic } from '../data/topics';
import './CourseGenerator.css';

const CourseGenerator: React.FC = () => {
  const navigate = useNavigate();
  const [topic, setTopic] = useState('');
  const [selectedTopic, setSelectedTopic] = useState<MLTopic | null>(null);
  const [numLessons, setNumLessons] = useState(5);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showTopics, setShowTopics] = useState(true);

  const handleGenerate = async () => {
    const topicToGenerate = selectedTopic?.title || topic;
    
    if (!topicToGenerate.trim()) {
      setError('Please select a topic or enter a custom one');
      return;
    }

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
        topicToGenerate,
        numLessons
      );
      
      const courses = JSON.parse(localStorage.getItem('ai_generated_courses') || '[]');
      courses.push(course);
      localStorage.setItem('ai_generated_courses', JSON.stringify(courses));
      
      navigate(`/course/${course.id}`);
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to generate course';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleSelectTopic = (topicItem: MLTopic) => {
    setSelectedTopic(topicItem);
    setTopic(topicItem.title);
    setShowTopics(false);
  };

  return (
    <div className="generator-page">
      <div className="generator-header">
        <div className="header-content">
          <h1>🧠 AI Course Generator</h1>
          <p>Select from our exhaustive list of ML/AI topics or create your own custom course</p>
        </div>
      </div>

      <div className="generator-content">
        {selectedTopic && (
          <div className="selected-topic-card">
            <div className="selected-topic-info">
              <span className={`selected-topic-badge ${selectedTopic.difficulty}`}>{selectedTopic.difficulty}</span>
              <span className="selected-topic-category">{selectedTopic.category}</span>
            </div>
            <h2>{selectedTopic.title}</h2>
            <p>{selectedTopic.description}</p>
            <div className="selected-topic-meta">
              <span>⏱ {selectedTopic.estimatedHours} hours</span>
              {selectedTopic.prerequisites.length > 0 && (
                <span>📋 Prerequisites: {selectedTopic.prerequisites.join(', ')}</span>
              )}
            </div>
            <button className="change-topic-btn" onClick={() => { setSelectedTopic(null); setTopic(''); setShowTopics(true); }}>
              ← Change Topic
            </button>
          </div>
        )}

        {showTopics && (
          <div className="topics-section">
            <h2>Choose a Topic to Learn</h2>
            <p className="topics-intro">Select from {mlTopics.length} comprehensive topics designed for beginners to experts</p>
            
            {topicCategories.map(category => {
              const categoryTopics = getTopicsByCategory(category);
              if (categoryTopics.length === 0) return null;
              
              return (
                <div key={category} className="category-section">
                  <h3 className="category-title">{category}</h3>
                  <div className="topics-grid">
                    {categoryTopics.map(t => (
                      <button
                        key={t.id}
                        className="topic-card"
                        onClick={() => handleSelectTopic(t)}
                        disabled={loading}
                      >
                        <div className="topic-card-header">
                          <span className={`difficulty-badge ${t.difficulty}`}>{t.difficulty}</span>
                        </div>
                        <h4>{t.title}</h4>
                        <p>{t.description}</p>
                        <div className="topic-card-meta">
                          <span>⏱ {t.estimatedHours}h</span>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {!showTopics && (
          <div className="generator-card">
            <div className="lessons-section">
              <label htmlFor="lessons">Number of lessons:</label>
              <select
                id="lessons"
                value={numLessons}
                onChange={(e) => setNumLessons(Number(e.target.value))}
                disabled={loading}
              >
                <option value={3}>3 Lessons (Quick Overview)</option>
                <option value={5}>5 Lessons (Standard)</option>
                <option value={7}>7 Lessons (Comprehensive)</option>
                <option value={10}>10 Lessons (Deep Dive)</option>
              </select>
            </div>

            <div className="custom-topic-section">
              <label>Or enter a custom topic:</label>
              <input
                type="text"
                value={topic}
                onChange={(e) => { setTopic(e.target.value); setSelectedTopic(null); }}
                placeholder="e.g., Quantum Machine Learning, AI Ethics, Federated Learning..."
                disabled={loading}
              />
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
                  Generating your course with AI...
                </>
              ) : (
                '🚀 Generate Course with AI'
              )}
            </button>
          </div>
        )}

        <div className="info-section">
          <div className="info-card">
            <h3>✨ What You Get</h3>
            <ul>
              <li><strong>Comprehensive lessons</strong> with explanations</li>
              <li><strong>Code examples</strong> in Python</li>
              <li><strong>Practice problems</strong> to reinforce learning</li>
              <li><strong>Quizzes</strong> to test your knowledge</li>
              <li><strong>Progress tracking</strong> as you learn</li>
              <li><strong>Coding projects</strong> to build skills</li>
            </ul>
          </div>

          <div className="info-card">
            <h3>💰 Cost</h3>
            <p>Uses your own API key - you only pay for generation:</p>
            <ul>
              <li><strong>GPT-4o Mini:</strong> ~$0.01-0.02 per course</li>
              <li><strong>Claude Haiku:</strong> ~$0.005-0.01 per course</li>
              <li><strong>Gemini:</strong> ~$0.003-0.005 per course</li>
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
