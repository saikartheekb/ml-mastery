import { useState, useEffect } from 'react';
import { Link, useLocation, Outlet } from 'react-router-dom';
import { learningPath, defaultAchievements } from '../data/curriculum';
import { getUserProgress } from '../services/progress';
import './Layout.css';

const Layout = () => {
  const location = useLocation();
  const [progress, setProgress] = useState(getUserProgress());
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [achievements] = useState(defaultAchievements);

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress(getUserProgress());
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const earnedAchievements = achievements.filter(a => a.earnedAt);
  const totalAchievements = achievements.length;

  return (
    <div className="layout">
      {/* Sidebar */}
      <aside className={`sidebar ${sidebarOpen ? 'open' : 'closed'}`}>
        <div className="sidebar-header">
          <Link to="/" className="logo">
            <span className="logo-icon">🧮</span>
            {sidebarOpen && <span className="logo-text">ML Mastery</span>}
          </Link>
          <button 
            className="sidebar-toggle"
            onClick={() => setSidebarOpen(!sidebarOpen)}
          >
            {sidebarOpen ? '◀' : '▶'}
          </button>
        </div>

        {sidebarOpen && (
          <>
            <nav className="sidebar-nav">
              <Link 
                to="/" 
                className={`nav-item ${location.pathname === '/' ? 'active' : ''}`}
              >
                <span className="nav-icon">🏠</span>
                <span>Dashboard</span>
              </Link>
              <Link 
                to="/courses" 
                className={`nav-item ${location.pathname.startsWith('/courses') ? 'active' : ''}`}
              >
                <span className="nav-icon">📚</span>
                <span>Courses</span>
              </Link>
              <Link 
                to="/progress" 
                className={`nav-item ${location.pathname === '/progress' ? 'active' : ''}`}
              >
                <span className="nav-icon">📊</span>
                <span>Progress</span>
              </Link>
              <Link 
                to="/projects" 
                className={`nav-item ${location.pathname === '/projects' ? 'active' : ''}`}
              >
                <span className="nav-icon">💻</span>
                <span>Projects</span>
              </Link>
            </nav>

            {/* Progress Section */}
            <div className="sidebar-section">
              <h3 className="section-title">Your Progress</h3>
              <div className="progress-card">
                <div className="progress-header">
                  <span>Overall</span>
                  <span className="progress-percentage">{progress.overallCompletion}%</span>
                </div>
                <div className="progress-bar">
                  <div 
                    className="progress-fill" 
                    style={{ width: `${progress.overallCompletion}%` }}
                  />
                </div>
                <div className="progress-stats">
                  <div className="stat">
                    <span className="stat-value">🔥 {progress.streak}</span>
                    <span className="stat-label">Day Streak</span>
                  </div>
                  <div className="stat">
                    <span className="stat-value">⏱ {Math.floor(progress.totalTimeSpent / 60)}h</span>
                    <span className="stat-label">Time Spent</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Achievements */}
            <div className="sidebar-section">
              <h3 className="section-title">Achievements</h3>
              <div className="achievements-list">
                {achievements.slice(0, 5).map(achievement => (
                  <div 
                    key={achievement.id} 
                    className={`achievement-item ${achievement.earnedAt ? 'earned' : 'locked'}`}
                    title={achievement.description}
                  >
                    <span className="achievement-icon">
                      {achievement.earnedAt ? achievement.icon : '🔒'}
                    </span>
                    <span className="achievement-name">{achievement.name}</span>
                  </div>
                ))}
              </div>
              <div className="achievements-summary">
                {earnedAchievements.length} / {totalAchievements} earned
              </div>
            </div>

            {/* Learning Phases */}
            <div className="sidebar-section">
              <h3 className="section-title">Learning Path</h3>
              <div className="phases-list">
                {learningPath.phases.map(phase => (
                  <div 
                    key={phase.number}
                    className={`phase-item ${phase.isLocked ? 'locked' : phase.number === progress.currentPhase ? 'current' : 'available'}`}
                  >
                    <span className="phase-number">{phase.number}</span>
                    <span className="phase-title">{phase.title}</span>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}
      </aside>

      {/* Main Content */}
      <main className="main-content">
        <header className="top-header">
          <button 
            className="menu-toggle"
            onClick={() => setSidebarOpen(!sidebarOpen)}
          >
            ☰
          </button>
          <div className="header-title">
            {location.pathname === '/' && 'Dashboard'}
            {location.pathname === '/courses' && 'Course Catalog'}
            {location.pathname === '/progress' && 'Your Progress'}
            {location.pathname === '/projects' && 'Projects'}
            {location.pathname.startsWith('/course/') && 'Course Content'}
            {location.pathname.startsWith('/lesson/') && 'Lesson'}
            {location.pathname.startsWith('/assessment/') && 'Assessment'}
            {location.pathname.startsWith('/project/') && 'Project'}
          </div>
          <div className="header-actions">
            <button className="theme-toggle" title="Toggle theme">
              🌙
            </button>
          </div>
        </header>
        <div className="content-area">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default Layout;
