import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { learningPath, defaultAchievements } from '../data/curriculum';
import { getUserProgress } from '../services/progress';
import './Progress.css';

const Progress: React.FC = () => {
  const [progress, setProgress] = useState(getUserProgress());
  const [achievements] = useState(defaultAchievements);

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress(getUserProgress());
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const earnedAchievements = achievements.filter(a => a.earnedAt);
  const totalHours = Math.floor(progress.totalTimeSpent / 60);
  const totalMinutes = progress.totalTimeSpent % 60;

  const getPhaseProgress = (phaseNum: number) => {
    const phase = learningPath.phases.find(p => p.number === phaseNum);
    if (!phase) return 0;
    
    const totalLessons = phase.courses.reduce((sum, c) => sum + (c.lessons?.length || 0), 0);
    const completedLessons = progress.completedLessons.filter(l => 
      l.startsWith(`phase${phaseNum}`)
    ).length;
    
    return totalLessons > 0 ? Math.round((completedLessons / totalLessons) * 100) : 0;
  };

  return (
    <div className="progress-page">
      <div className="page-header">
        <h1>Your Progress</h1>
        <p>Track your learning journey</p>
      </div>

      {/* Overall Stats */}
      <div className="stats-section">
        <div className="overall-progress-card">
          <div className="progress-circle">
            <svg viewBox="0 0 100 100">
              <circle className="progress-bg" cx="50" cy="50" r="45" />
              <circle 
                className="progress-fill" 
                cx="50" cy="50" r="45" 
                strokeDasharray={`${progress.overallCompletion * 2.83} 283`}
              />
            </svg>
            <div className="progress-text">
              <span className="percentage">{progress.overallCompletion}%</span>
              <span className="label">Complete</span>
            </div>
          </div>
          <div className="overall-stats">
            <h2>Overall Progress</h2>
            <div className="stat-row">
              <span className="stat-label">🔥 Day Streak</span>
              <span className="stat-value">{progress.streak} days</span>
            </div>
            <div className="stat-row">
              <span className="stat-label">⏱ Time Spent</span>
              <span className="stat-value">{totalHours}h {totalMinutes}m</span>
            </div>
            <div className="stat-row">
              <span className="stat-label">📚 Lessons Completed</span>
              <span className="stat-value">{progress.completedLessons.length}</span>
            </div>
            <div className="stat-row">
              <span className="stat-label">📝 Quizzes Passed</span>
              <span className="stat-value">{progress.completedAssessments.length}</span>
            </div>
            <div className="stat-row">
              <span className="stat-label">💻 Projects Done</span>
              <span className="stat-value">{progress.completedProjects.length}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Phase Progress */}
      <div className="section">
        <h2>Learning Phases</h2>
        <div className="phases-progress">
          {learningPath.phases.map(phase => {
            const phaseProgress = getPhaseProgress(phase.number);
            const isUnlocked = !phase.isLocked;
            const isCurrent = phase.number === progress.currentPhase;
            
            return (
              <div 
                key={phase.number} 
                className={`phase-progress-card ${isUnlocked ? 'unlocked' : 'locked'} ${isCurrent ? 'current' : ''}`}
              >
                <div className="phase-progress-header">
                  <span className="phase-number">Phase {phase.number}</span>
                  {phase.isLocked && <span className="lock-icon">🔒</span>}
                </div>
                <h3>{phase.title}</h3>
                <div className="phase-progress-bar">
                  <div 
                    className="phase-progress-fill" 
                    style={{ width: `${phaseProgress}%` }}
                  />
                </div>
                <span className="phase-progress-text">{phaseProgress}% complete</span>
                {isUnlocked && (
                  <Link to={`/courses?phase=${phase.number}`} className="phase-link">
                    {phaseProgress > 0 ? 'Continue' : 'Start'} →
                  </Link>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Assessment Scores */}
      {progress.assessmentScores.length > 0 && (
        <div className="section">
          <h2>Assessment Scores</h2>
          <div className="scores-table">
            <div className="table-header">
              <span>Assessment</span>
              <span>Score</span>
              <span>Date</span>
            </div>
            {progress.assessmentScores.map((score, index) => {
              const date = new Date(score.completedAt);
              return (
                <div key={index} className="table-row">
                  <span>{score.assessmentId}</span>
                  <span className="score-value">{score.score}%</span>
                  <span>{date.toLocaleDateString()}</span>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Achievements */}
      <div className="section">
        <h2>Achievements</h2>
        <div className="achievements-grid">
          {achievements.map(achievement => {
            const isEarned = !!achievement.earnedAt;
            const date = isEarned ? new Date(achievement.earnedAt).toLocaleDateString() : null;
            
            return (
              <div 
                key={achievement.id} 
                className={`achievement-card ${isEarned ? 'earned' : 'locked'}`}
              >
                <span className="achievement-icon">
                  {isEarned ? achievement.icon : '🔒'}
                </span>
                <div className="achievement-details">
                  <h3>{achievement.name}</h3>
                  <p>{achievement.description}</p>
                  {isEarned && <span className="earned-date">Earned: {date}</span>}
                </div>
              </div>
            );
          })}
        </div>
        <div className="achievements-summary">
          {earnedAchievements.length} of {achievements.length} achievements earned
        </div>
      </div>
    </div>
  );
};

export default Progress;
