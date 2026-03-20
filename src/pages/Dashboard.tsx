import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { learningPath, defaultAchievements } from '../data/curriculum';
import { getUserProgress } from '../services/progress';
import './Dashboard.css';

const Dashboard: React.FC = () => {
  const [progress, setProgress] = useState(getUserProgress());
  const [achievements] = useState(defaultAchievements);

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress(getUserProgress());
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const earnedAchievements = achievements.filter(a => a.earnedAt);
  const currentPhase = learningPath.phases.find(p => p.number === progress.currentPhase);
  const currentCourse = currentPhase?.courses[0];

  return (
    <div className="dashboard">
      {/* Welcome Section */}
      <div className="welcome-section">
        <div className="welcome-content">
          <h1>Welcome to ML Mastery! 🧮</h1>
          <p>Your journey from math foundations to ML expertise starts here.</p>
        </div>
        <div className="welcome-illustration">
          <div className="illustration-icon">🚀</div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon">📚</div>
          <div className="stat-info">
            <span className="stat-value">{progress.overallCompletion}%</span>
            <span className="stat-label">Overall Progress</span>
          </div>
          <div className="stat-progress">
            <div className="stat-progress-bar" style={{ width: `${progress.overallCompletion}%` }} />
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">🔥</div>
          <div className="stat-info">
            <span className="stat-value">{progress.streak}</span>
            <span className="stat-label">Day Streak</span>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">⏱</div>
          <div className="stat-info">
            <span className="stat-value">{Math.floor(progress.totalTimeSpent / 60)}h {progress.totalTimeSpent % 60}m</span>
            <span className="stat-label">Time Spent</span>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">🎯</div>
          <div className="stat-info">
            <span className="stat-value">{earnedAchievements.length}</span>
            <span className="stat-label">Achievements</span>
          </div>
        </div>
      </div>

      {/* Current Learning */}
      <div className="section">
        <h2 className="section-title">Continue Learning</h2>
        {currentCourse ? (
          <Link to={`/course/${currentCourse.id}`} className="continue-card">
            <div className="continue-badge">Phase {progress.currentPhase}</div>
            <h3>{currentCourse.title}</h3>
            <p>{currentCourse.description}</p>
            <div className="continue-meta">
              <span>📖 {currentCourse.lessons?.length || 0} Lessons</span>
              <span>⏱ {currentCourse.estimatedHours}h</span>
            </div>
            <button className="continue-button">Continue →</button>
          </Link>
        ) : (
          <div className="empty-state">
            <p>Start your learning journey!</p>
            <Link to="/courses" className="start-button">Browse Courses</Link>
          </div>
        )}
      </div>

      {/* Learning Phases */}
      <div className="section">
        <h2 className="section-title">Learning Path</h2>
        <div className="phases-grid">
          {learningPath.phases.map(phase => {
            return (
              <div 
                key={phase.number} 
                className={`phase-card ${phase.isLocked ? 'locked' : ''} ${phase.number === progress.currentPhase ? 'current' : ''}`}
              >
                <div className="phase-header">
                  <span className="phase-number">Phase {phase.number}</span>
                  {phase.isLocked && <span className="lock-icon">🔒</span>}
                </div>
                <h3>{phase.title}</h3>
                <p>{phase.description}</p>
                <div className="phase-meta">
                  <span>📚 {phase.courses.length} Courses</span>
                  <span>⏱ {phase.estimatedHours}h</span>
                </div>
                {!phase.isLocked && (
                  <Link to={`/courses?phase=${phase.number}`} className="phase-button">
                    {phase.number <= progress.currentPhase ? 'Continue' : 'Start'}
                  </Link>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="section">
        <h2 className="section-title">Quick Actions</h2>
        <div className="actions-grid">
          <Link to="/courses" className="action-card">
            <span className="action-icon">📖</span>
            <span className="action-label">Browse Courses</span>
          </Link>
          <Link to="/progress" className="action-card">
            <span className="action-icon">📊</span>
            <span className="action-label">View Progress</span>
          </Link>
          <Link to="/projects" className="action-card">
            <span className="action-icon">💻</span>
            <span className="action-label">Projects</span>
          </Link>
        </div>
      </div>

      {/* Recent Achievements */}
      {earnedAchievements.length > 0 && (
        <div className="section">
          <h2 className="section-title">Recent Achievements</h2>
          <div className="achievements-grid">
            {earnedAchievements.slice(0, 3).map(achievement => (
              <div key={achievement.id} className="achievement-card">
                <span className="achievement-icon">{achievement.icon}</span>
                <div className="achievement-info">
                  <h4>{achievement.name}</h4>
                  <p>{achievement.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
