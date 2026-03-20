import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { learningPath } from '../data/curriculum';
import { completeAssessment } from '../services/progress';
import './Assessment.css';

interface Answer {
  questionId: string;
  answer: string | string[];
}

const Assessment: React.FC = () => {
  const { assessmentId } = useParams<{ assessmentId: string }>();
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<Answer[]>([]);
  const [showResults, setShowResults] = useState(false);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(0);

  // Find the assessment
  let assessment = null;
  let course = null;

  for (const phase of learningPath.phases) {
    for (const c of phase.courses) {
      const foundAssessment = c.assessments.find(a => a.id === assessmentId);
      if (foundAssessment) {
        assessment = foundAssessment;
        course = c;
        break;
      }
    }
  }

  useEffect(() => {
    if (assessment && assessment.duration > 0) {
      setTimeLeft(assessment.duration * 60);
      const timer = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            clearInterval(timer);
            calculateScore();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [assessment]);

  if (!assessment) {
    return (
      <div className="assessment-not-found">
        <h2>Assessment not found</h2>
        <Link to="/courses">Back to Courses</Link>
      </div>
    );
  }

  const question = assessment.questions[currentQuestion];

  const handleAnswer = (answer: string) => {
    const existingAnswer = answers.find(a => a.questionId === question.id);
    if (existingAnswer) {
      setAnswers(answers.map(a => 
        a.questionId === question.id ? { ...a, answer } : a
      ));
    } else {
      setAnswers([...answers, { questionId: question.id, answer }]);
    }
  };

  const calculateScore = () => {
    let totalPoints = 0;
    let earnedPoints = 0;

    assessment!.questions.forEach(q => {
      totalPoints += q.points;
      const userAnswer = answers.find(a => a.questionId === q.id);
      if (userAnswer) {
        if (Array.isArray(q.correctAnswer)) {
          if (q.correctAnswer.some(a => 
            a.toLowerCase() === (userAnswer.answer as string).toLowerCase()
          )) {
            earnedPoints += q.points;
          }
        } else if (
          (userAnswer.answer as string).toLowerCase() === q.correctAnswer.toLowerCase()
        ) {
          earnedPoints += q.points;
        }
      }
    });

    const finalScore = Math.round((earnedPoints / totalPoints) * 100);
    setScore(finalScore);
    setShowResults(true);
    
    if (finalScore >= assessment!.passingScore) {
      completeAssessment(assessment!.id, finalScore);
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  if (showResults) {
    const passed = score >= assessment.passingScore;
    
    return (
      <div className="assessment-results">
        <div className="results-card">
          <div className={`results-icon ${passed ? 'passed' : 'failed'}`}>
            {passed ? '🎉' : '📚'}
          </div>
          <h1>{passed ? 'Congratulations!' : 'Keep Learning!'}</h1>
          <p className="results-message">
            {passed 
              ? `You passed with ${score}%!` 
              : `You scored ${score}%. You need ${assessment.passingScore}% to pass.`
            }
          </p>
          
          <div className="results-details">
            <div className="detail-row">
              <span>Total Questions</span>
              <span>{assessment.questions.length}</span>
            </div>
            <div className="detail-row">
              <span>Passing Score</span>
              <span>{assessment.passingScore}%</span>
            </div>
            <div className="detail-row">
              <span>Your Score</span>
              <span className={passed ? 'score-passed' : 'score-failed'}>{score}%</span>
            </div>
          </div>

          <div className="results-actions">
            {!passed && (
              <button 
                className="retry-button"
                onClick={() => {
                  setAnswers([]);
                  setCurrentQuestion(0);
                  setShowResults(false);
                  setScore(0);
                  if (assessment.duration > 0) {
                    setTimeLeft(assessment.duration * 60);
                  }
                }}
              >
                Try Again
              </button>
            )}
            <Link to={`/course/${course?.id}`} className="back-button">
              Back to Course
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="assessment-page">
      {/* Header */}
      <div className="assessment-header">
        <Link to={`/course/${course?.id}`} className="back-link">
          ← Back to {course?.title}
        </Link>
        <div className="header-info">
          <h1>{assessment.title}</h1>
          <div className="assessment-meta">
            <span>Question {currentQuestion + 1} of {assessment.questions.length}</span>
            {timeLeft > 0 && (
              <span className={`timer ${timeLeft < 60 ? 'warning' : ''}`}>
                ⏱ {formatTime(timeLeft)}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="assessment-progress">
        <div 
          className="progress-fill"
          style={{ width: `${((currentQuestion + 1) / assessment.questions.length) * 100}%` }}
        />
      </div>

      {/* Question */}
      <div className="question-card">
        <div className="question-header">
          <span className="question-number">Q{currentQuestion + 1}</span>
          <span className="question-points">{question.points} points</span>
        </div>
        
        <h2 className="question-text">{question.question}</h2>

        {question.type === 'multiple_choice' && question.options && (
          <div className="options-list">
            {question.options.map((option, index) => {
              const currentAnswer = answers.find(a => a.questionId === question.id);
              const isSelected = currentAnswer?.answer === option;
              
              return (
                <button
                  key={index}
                  className={`option-button ${isSelected ? 'selected' : ''}`}
                  onClick={() => handleAnswer(option)}
                >
                  <span className="option-letter">
                    {String.fromCharCode(65 + index)}
                  </span>
                  <span className="option-text">{option}</span>
                </button>
              );
            })}
          </div>
        )}

        {question.type === 'fill_blank' && (
          <div className="fill-blank">
            <input
              type="text"
              placeholder="Type your answer..."
              value={(answers.find(a => a.questionId === question.id)?.answer as string) || ''}
              onChange={(e) => handleAnswer(e.target.value)}
              className="fill-input"
            />
          </div>
        )}

        {question.type === 'short_answer' && (
          <div className="short-answer">
            <textarea
              placeholder="Write your answer..."
              value={(answers.find(a => a.questionId === question.id)?.answer as string) || ''}
              onChange={(e) => handleAnswer(e.target.value)}
              className="answer-textarea"
              rows={4}
            />
          </div>
        )}

        {/* Navigation */}
        <div className="question-navigation">
          <button
            className="nav-button"
            onClick={() => setCurrentQuestion(prev => prev - 1)}
            disabled={currentQuestion === 0}
          >
            ← Previous
          </button>
          
          {currentQuestion < assessment.questions.length - 1 ? (
            <button
              className="nav-button primary"
              onClick={() => setCurrentQuestion(prev => prev + 1)}
              disabled={!answers.find(a => a.questionId === question.id)}
            >
              Next →
            </button>
          ) : (
            <button
              className="nav-button submit"
              onClick={calculateScore}
              disabled={answers.length < assessment.questions.length}
            >
              Submit Quiz
            </button>
          )}
        </div>
      </div>

      {/* Question Indicators */}
      <div className="question-indicators">
        {assessment.questions.map((q, index) => {
          const isAnswered = answers.some(a => a.questionId === q.id);
          const isCurrent = index === currentQuestion;
          
          return (
            <button
              key={q.id}
              className={`indicator ${isAnswered ? 'answered' : ''} ${isCurrent ? 'current' : ''}`}
              onClick={() => setCurrentQuestion(index)}
            >
              {index + 1}
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default Assessment;
