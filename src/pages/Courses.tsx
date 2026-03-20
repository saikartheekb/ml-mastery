import React, { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { learningPath } from '../data/curriculum';
import { getUserProgress } from '../services/progress';
import { getGeneratedCourses } from '../services/courseGenerator';
import './Courses.css';

const Courses: React.FC = () => {
  const [searchParams] = useSearchParams();
  const phaseFilter = searchParams.get('phase');
  const [progress, setProgress] = useState(getUserProgress());
  const [generatedCourses, setGeneratedCourses] = useState(getGeneratedCourses());

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress(getUserProgress());
      setGeneratedCourses(getGeneratedCourses());
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const phases = phaseFilter 
    ? learningPath.phases.filter(p => p.number === parseInt(phaseFilter))
    : learningPath.phases.filter(p => !p.isLocked);

  const getCourseProgress = (courseId: string) => {
    const completedLessons = progress.completedLessons.filter(l => l.startsWith(courseId.split('-')[0]));
    const phaseNum = courseId.includes('phase1') ? 1 : courseId.includes('phase2') ? 2 : courseId.includes('phase3') ? 3 : 0;
    const totalLessons = phaseNum === 1 ? 5 : phaseNum === 2 ? 5 : phaseNum === 3 ? 5 : 5;
    return Math.round((completedLessons.length / totalLessons) * 100);
  };

  return (
    <div className="courses-page">
      <div className="page-header">
        <h1>Course Catalog</h1>
        <p>Explore our comprehensive ML curriculum</p>
      </div>

      {phases.map(phase => (
        <div key={phase.number} className="phase-section">
          <div className="phase-header">
            <div className="phase-badge">Phase {phase.number}</div>
            <h2>{phase.title}</h2>
            <p>{phase.description}</p>
            <div className="phase-info">
              <span>📚 {phase.courses.length} Course{phase.courses.length !== 1 ? 's' : ''}</span>
              <span>⏱ {phase.estimatedHours} hours</span>
            </div>
          </div>

          <div className="courses-grid">
            {phase.courses.map(course => {
              const courseProgress = getCourseProgress(course.id);
              const isStarted = progress.completedLessons.some(l => l.startsWith(course.id.split('-')[0]));
              
              return (
                <Link 
                  key={course.id} 
                  to={`/course/${course.id}`}
                  className={`course-card ${isStarted ? 'started' : ''}`}
                >
                  <div className="course-header">
                    <span className="course-icon">{course.icon}</span>
                    <div className="course-progress">
                      <div className="progress-ring">
                        <svg viewBox="0 0 36 36">
                          <path
                            className="progress-bg"
                            d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                          />
                          <path
                            className="progress-fill"
                            strokeDasharray={`${courseProgress}, 100`}
                            d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                          />
                        </svg>
                        <span className="progress-text">{courseProgress}%</span>
                      </div>
                    </div>
                  </div>
                  
                  <h3>{course.title}</h3>
                  <p className="course-description">{course.description}</p>
                  
                  <div className="course-meta">
                    <span>📖 {course.lessons.length} Lessons</span>
                    <span>📝 {course.assessments.length} Quiz{course.assessments.length !== 1 ? 'zes' : ''}</span>
                    <span>💻 {course.projects.length} Project{course.projects.length !== 1 ? 's' : ''}</span>
                  </div>
                  
                  <div className="course-footer">
                    <span className="course-time">⏱ {course.estimatedHours}h</span>
                    <button className="course-button">
                      {courseProgress > 0 ? 'Continue' : 'Start'} →
                    </button>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      ))}

      {phaseFilter && phases.length === 0 && (
        <div className="empty-phase">
          <p>No courses found for this phase.</p>
        </div>
      )}

      {/* AI Generated Courses Section */}
      {generatedCourses.length > 0 && (
        <div className="phase-section">
          <div className="phase-header">
            <div className="phase-badge" style={{ background: '#7c3aed' }}>🧠 AI Generated</div>
            <h2>Your Custom Courses</h2>
            <p>Personalized courses created just for you</p>
          </div>

          <div className="courses-grid">
            {generatedCourses.map(course => {
              const lessons = course.lessons || [];
              const completedLessons = progress.completedLessons.filter(l => l.startsWith(course.id.split('-')[0])).length;
              const totalLessons = lessons.length || 1;
              const courseProgress = Math.round((completedLessons / totalLessons) * 100);
              const isStarted = completedLessons > 0;
              
              return (
                <Link 
                  key={course.id} 
                  to={`/course/${course.id}`}
                  className={`course-card ${isStarted ? 'started' : ''}`}
                >
                  <div className="course-header">
                    <span className="course-icon">🧠</span>
                    <div className="course-progress">
                      <div className="progress-ring">
                        <svg viewBox="0 0 36 36">
                          <path
                            className="progress-bg"
                            d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                          />
                          <path
                            className="progress-fill"
                            strokeDasharray={`${courseProgress}, 100`}
                            d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                          />
                        </svg>
                        <span className="progress-text">{courseProgress}%</span>
                      </div>
                    </div>
                  </div>
                  
                  <h3>{course.title}</h3>
                  <p className="course-description">{course.description}</p>
                  
                  <div className="course-meta">
                    <span>📖 {lessons.length} Lessons</span>
                  </div>
                  
                  <div className="course-footer">
                    <span className="course-time">🧠 AI Generated</span>
                    <button className="course-button">
                      {courseProgress > 0 ? 'Continue' : 'Start'} →
                    </button>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      )}

      {/* Generate New Course CTA */}
      <div className="phase-section">
        <div className="phase-header">
          <div className="phase-badge" style={{ background: '#2563eb' }}>✨ Create New</div>
          <h2>Generate Your Own Course</h2>
          <p>Want to learn something specific? Let AI create a personalized course for you</p>
        </div>
        
        <Link to="/generate" className="generate-cta-card">
          <div className="generate-cta-content">
            <span className="generate-cta-icon">🎨</span>
            <div>
              <h3>AI Course Generator</h3>
              <p>Enter any topic and get a complete course with lessons, examples, and quizzes</p>
            </div>
          </div>
          <span className="generate-cta-button">Generate Course →</span>
        </Link>
      </div>
    </div>
  );
};

export default Courses;
