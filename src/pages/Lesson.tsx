import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';
import { learningPath } from '../data/curriculum';
import { getUserProgress, completeLesson, addTimeSpent } from '../services/progress';
import './Lesson.css';

const Lesson: React.FC = () => {
  const { lessonId } = useParams<{ lessonId: string }>();
  const navigate = useNavigate();
  const [progress, setProgress] = useState(getUserProgress());
  const [startTime] = useState(Date.now());
  const [codeOutputs, setCodeOutputs] = useState<Record<string, string>>({});
  const [isRunning, setIsRunning] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress(getUserProgress());
    }, 1000);
    return () => clearInterval(interval);
  }, []);

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

  const runCode = async (_code: string, exampleId: string) => {
    setIsRunning(true);
    try {
      // Simulate code execution - in a real app, this would use Pyodide
      const output = `# Simulated output for example ${exampleId}:\n`;
      const mockOutput = output + `Code executed successfully!\n`;
      setCodeOutputs(prev => ({ ...prev, [exampleId]: mockOutput }));
    } catch (error) {
      setCodeOutputs(prev => ({ ...prev, [exampleId]: `Error: ${error}` }));
    }
    setIsRunning(false);
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
              <ReactMarkdown>{lesson.content}</ReactMarkdown>
            </div>
          </div>

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
