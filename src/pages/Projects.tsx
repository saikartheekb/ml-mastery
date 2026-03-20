import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { learningPath } from '../data/curriculum';
import { getUserProgress } from '../services/progress';
import './Projects.css';

const Projects: React.FC = () => {
  const [progress, setProgress] = useState(getUserProgress());

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress(getUserProgress());
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  // Collect all projects from all courses
  const allProjects = learningPath.phases
    .filter(p => !p.isLocked)
    .flatMap(phase => 
      phase.courses.flatMap(course =>
        course.projects.map(project => ({
          ...project,
          courseName: course.title,
          phaseNumber: phase.number
        }))
      )
    );

  const getProjectStatus = (projectId: string) => {
    if (progress.completedProjects.includes(projectId)) return 'completed';
    return 'not-started';
  };

  return (
    <div className="projects-page">
      <div className="page-header">
        <h1>Projects</h1>
        <p>Apply your skills with hands-on projects</p>
      </div>

      <div className="projects-grid">
        {allProjects.map(project => {
          const status = getProjectStatus(project.id);
          
          return (
            <div key={project.id} className={`project-card ${status}`}>
              <div className="project-header">
                <span className="phase-badge">Phase {project.phaseNumber}</span>
                {status === 'completed' && <span className="completed-badge">✓ Completed</span>}
              </div>
              
              <h3>{project.title}</h3>
              <p className="project-course">{project.courseName}</p>
              <p className="project-description">{project.description}</p>
              
              <div className="project-meta">
                <span>🎯 {project.objectives?.length || 0} Objectives</span>
                <span>💡 {project.hints?.length || 0} Hints</span>
                <span>⏱ {project.estimatedHours}h</span>
              </div>
              
              <div className="project-rubric">
                <h4>Grading Rubric:</h4>
                {project.rubric.map((item, index) => (
                  <div key={index} className="rubric-item">
                    <span>{item.criterion}</span>
                    <span>{item.maxPoints} pts</span>
                  </div>
                ))}
              </div>
              
              <Link 
                to={`/project/${project.id}`}
                className={`project-button ${status === 'completed' ? 'secondary' : 'primary'}`}
              >
                {status === 'completed' ? 'View Project' : 'Start Project'}
              </Link>
            </div>
          );
        })}
      </div>

      {allProjects.length === 0 && (
        <div className="empty-state">
          <p>No projects available yet. Complete courses to unlock projects!</p>
        </div>
      )}
    </div>
  );
};

export default Projects;
