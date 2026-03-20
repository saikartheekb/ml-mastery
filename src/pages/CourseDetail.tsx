import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { learningPath } from '../data/curriculum';
import { getUserProgress, setCurrentLesson } from '../services/progress';
import './CourseDetail.css';

const CourseDetail: React.FC = () => {
  const { courseId } = useParams<{ courseId: string }>();
  const navigate = useNavigate();
  const [progress, setProgress] = useState(getUserProgress());
  const [expandedLesson, setExpandedLesson] = useState<string | null>(null);

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress(getUserProgress());
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  // Find the course
  let course = null;
  let phase = null;
  
  for (const p of learningPath.phases) {
    const foundCourse = p.courses.find(c => c.id === courseId);
    if (foundCourse) {
      course = foundCourse;
      phase = p;
      break;
    }
  }

  if (!course) {
    return (
      <div className="course-not-found">
        <h2>Course not found</h2>
        <Link to="/courses">Back to Courses</Link>
      </div>
    );
  }

  const getLessonProgress = (lessonId: string) => {
    return progress.completedLessons.includes(lessonId);
  };

  const getAssessmentProgress = (assessmentId: string) => {
    return progress.completedAssessments.includes(assessmentId);
  };

  const getProjectProgress = (projectId: string) => {
    return progress.completedProjects.includes(projectId);
  };

  const completedLessons = course.lessons.filter(l => getLessonProgress(l.id)).length;
  const completedAssessments = course.assessments.filter(a => getAssessmentProgress(a.id)).length;
  const completedProjects = course.projects.filter(p => getProjectProgress(p.id)).length;

  const totalItems = course.lessons.length + course.assessments.length + course.projects.length;
  const completedItems = completedLessons + completedAssessments + completedProjects;
  const courseProgress = Math.round((completedItems / totalItems) * 100);

  const handleStartLesson = (lessonId: string) => {
    setCurrentLesson(course!.id, lessonId);
    navigate(`/lesson/${lessonId}`);
  };

  const isLessonUnlocked = (index: number) => {
    if (index === 0) return true;
    const prevLesson = course!.lessons[index - 1];
    return getLessonProgress(prevLesson.id);
  };

  return (
    <div className="course-detail">
      {/* Course Header */}
      <div className="course-header">
        <Link to="/courses" className="back-link">← Back to Courses</Link>
        
        <div className="course-info">
          <span className="course-icon">{course.icon}</span>
          <div className="course-title-section">
            <span className="phase-label">Phase {phase?.number}</span>
            <h1>{course.title}</h1>
            <p>{course.description}</p>
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
            <span>📖 {completedLessons}/{course.lessons.length} Lessons</span>
            <span>📝 {completedAssessments}/{course.assessments.length} Quizzes</span>
            <span>💻 {completedProjects}/{course.projects.length} Projects</span>
          </div>
        </div>
      </div>

      {/* Course Content */}
      <div className="course-content">
        {/* Lessons Section */}
        <div className="content-section">
          <h2>Lessons</h2>
          <div className="lessons-list">
            {course.lessons.map((lesson, index) => {
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
                  
                  {isExpanded && (
                    <div className="lesson-details">
                      <p>{lesson.content.substring(0, 300)}...</p>
                      <div className="lesson-content-preview">
                        <span>📚 {lesson.codeExamples.length} Code Examples</span>
                        <span>✏️ {lesson.practiceProblems.length} Practice Problems</span>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Assessments Section */}
        <div className="content-section">
          <h2>Assessments</h2>
          <div className="assessments-list">
            {course.assessments.map(assessment => {
              const isCompleted = getAssessmentProgress(assessment.id);
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

        {/* Projects Section */}
        <div className="content-section">
          <h2>Projects</h2>
          <div className="projects-list">
            {course.projects.map(project => {
              const isCompleted = getProjectProgress(project.id);

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
      </div>
    </div>
  );
};

export default CourseDetail;
