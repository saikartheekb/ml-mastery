import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { learningPath } from '../data/curriculum';
import { getUserProgress, setCurrentLesson } from '../services/progress';
import { type GeneratedCourse } from '../services/courseGenerator';
import './CourseDetail.css';

const CourseDetail: React.FC = () => {
  const { courseId } = useParams<{ courseId: string }>();
  const navigate = useNavigate();
  const [progress, setProgress] = useState(getUserProgress);
  const [expandedLesson, setExpandedLesson] = useState<string | null>(null);
  const [generatedCourse, setGeneratedCourse] = useState<GeneratedCourse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Refresh progress periodically
    const interval = setInterval(() => {
      setProgress(getUserProgress());
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  // Check if this is an AI-generated course
  useEffect(() => {
    setLoading(true);
    setError(null);
    
    try {
      if (courseId?.startsWith('ai-course-')) {
        const courses = JSON.parse(localStorage.getItem('ai_generated_courses') || '[]');
        const course = courses.find((c: GeneratedCourse) => c.id === courseId);
        if (course) {
          setGeneratedCourse(course);
        }
      }
    } catch (err) {
      console.error('Error loading course:', err);
      setError('Failed to load course');
    } finally {
      setLoading(false);
    }
  }, [courseId]);

  if (loading) {
    return (
      <div className="course-loading" style={{ padding: '2rem', textAlign: 'center' }}>
        <p>Loading course...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="course-error" style={{ padding: '2rem', textAlign: 'center' }}>
        <h2>Error</h2>
        <p>{error}</p>
        <Link to="/courses">Back to Courses</Link>
      </div>
    );
  }

  // Find the course from static curriculum
  let staticCourse = null;
  let phase = null;
  
  if (!generatedCourse) {
    for (const p of learningPath.phases) {
      const foundCourse = p.courses.find(c => c.id === courseId);
      if (foundCourse) {
        staticCourse = foundCourse;
        phase = p;
        break;
      }
    }
  }

  // If neither found, show not found
  if (!staticCourse && !generatedCourse) {
    return (
      <div className="course-not-found">
        <h2>Course not found</h2>
        <Link to="/courses">Back to Courses</Link>
      </div>
    );
  }

  // Get lessons from either source
  const lessons = generatedCourse 
    ? generatedCourse.lessons.map(l => ({
        id: l.id,
        title: l.title,
        content: l.content,
        duration: l.duration,
        order: l.order
      }))
    : staticCourse?.lessons || [];

  const courseTitle = generatedCourse?.title || staticCourse?.title || '';
  const courseDescription = generatedCourse?.description || staticCourse?.description || '';

  const getLessonProgress = (lessonId: string) => {
    return progress.completedLessons.includes(lessonId);
  };

  // For AI-generated courses, just calculate based on lessons
  const totalItems = lessons.length;
  const completedItems = lessons.filter(l => getLessonProgress(l.id)).length;
  const courseProgress = totalItems > 0 ? Math.round((completedItems / totalItems) * 100) : 0;

  const handleStartLesson = (lessonId: string) => {
    setCurrentLesson(courseId!, lessonId);
    navigate(`/lesson/${lessonId}`);
  };

  const isLessonUnlocked = (index: number) => {
    if (index === 0) return true;
    const prevLesson = lessons[index - 1];
    return getLessonProgress(prevLesson.id);
  };

  return (
    <div className="course-detail">
      <div className="course-header">
        <Link to="/courses" className="back-link">← Back to Courses</Link>
        
        <div className="course-info">
          <span className="course-icon">{generatedCourse ? '🧠' : staticCourse?.icon || '📚'}</span>
          <div className="course-title-section">
            {generatedCourse ? (
              <span className="phase-label">AI Generated</span>
            ) : (
              <span className="phase-label">Phase {phase?.number}</span>
            )}
            <h1>{courseTitle}</h1>
            <p>{courseDescription}</p>
          </div>
        </div>

        <div className="course-progress-card">
          <div className="progress-info">
            <span className="progress-label">Course Progress</span>
            <span className="progress-value">{courseProgress}%</span>
          </div>
          <div className="progress-bar">
            <div className="progress-fill" style={{ width: `${courseProgress}%` }} />
          </div>
          <div className="progress-stats">
            <span>📖 {completedItems}/{totalItems} Lessons</span>
          </div>
        </div>
      </div>

      <div className="course-content">
        <div className="content-section">
          <h2>Lessons</h2>
          <div className="lessons-list">
            {lessons.map((lesson, index) => {
              const isCompleted = getLessonProgress(lesson.id);
              const isUnlocked = isLessonUnlocked(index);
              const isExpanded = expandedLesson === lesson.id;

              return (
                <div 
                  key={lesson.id} 
                  className={`lesson-item ${isCompleted ? 'completed' : ''} ${!isUnlocked ? 'locked' : ''} ${isExpanded ? 'expanded' : ''}`}
                >
                  <div 
                    className="lesson-header"
                    onClick={() => isUnlocked && setExpandedLesson(isExpanded ? null : lesson.id)}
                  >
                    <div className="lesson-status">
                      {isCompleted ? (
                        <span className="status-icon completed">✓</span>
                      ) : !isUnlocked ? (
                        <span className="status-icon locked">🔒</span>
                      ) : (
                        <span className="status-icon">{index + 1}</span>
                      )}
                    </div>
                    <div className="lesson-info">
                      <h3>{lesson.title}</h3>
                      <span className="lesson-meta">⏱ {lesson.duration} min</span>
                    </div>
                    {isUnlocked && (
                      <button 
                        className="lesson-button"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleStartLesson(lesson.id);
                        }}
                      >
                        {isCompleted ? 'Review' : 'Start'}
                      </button>
                    )}
                  </div>
                  
                  {isExpanded && lesson.content && (
                    <div className="lesson-details">
                      <p>{lesson.content.substring(0, 300)}...</p>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Assessments Section - Only for static courses */}
        {staticCourse && staticCourse.assessments && (
          <div className="content-section">
            <h2>Assessments</h2>
            <div className="assessments-list">
              {staticCourse.assessments.map(assessment => {
                const isCompleted = progress.completedAssessments.includes(assessment.id);
                const assessmentScore = progress.assessmentScores.find(s => s.assessmentId === assessment.id);

                return (
                  <div key={assessment.id} className={`assessment-item ${isCompleted ? 'completed' : ''}`}>
                    <div className="assessment-info">
                      <span className="assessment-icon">📝</span>
                      <div>
                        <h3>{assessment.title}</h3>
                        <span className="assessment-meta">
                          {assessment.questions.length} Questions • {assessment.duration} min
                        </span>
                      </div>
                    </div>
                    <div className="assessment-action">
                      {isCompleted && assessmentScore && (
                        <span className="score-badge">Score: {assessmentScore.score}%</span>
                      )}
                      <Link 
                        to={`/assessment/${assessment.id}`}
                        className={`assessment-button ${!isCompleted ? 'primary' : 'secondary'}`}
                      >
                        {isCompleted ? 'Retake' : 'Take Quiz'}
                      </Link>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Projects Section - Only for static courses */}
        {staticCourse && staticCourse.projects && (
          <div className="content-section">
            <h2>Projects</h2>
            <div className="projects-list">
              {staticCourse.projects.map(project => {
                const isCompleted = progress.completedProjects.includes(project.id);

                return (
                  <div key={project.id} className={`project-item ${isCompleted ? 'completed' : ''}`}>
                    <div className="project-info">
                      <span className="project-icon">💻</span>
                      <div>
                        <h3>{project.title}</h3>
                        <p>{project.description}</p>
                        <span className="project-meta">
                          ⏱ {project.estimatedHours} hours
                        </span>
                      </div>
                    </div>
                    <div className="project-action">
                      <Link 
                        to={`/project/${project.id}`}
                        className={`project-button ${!isCompleted ? 'primary' : 'secondary'}`}
                      >
                        {isCompleted ? 'View Project' : 'Start Project'}
                      </Link>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CourseDetail;
