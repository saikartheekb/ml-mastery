import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { learningPath } from '../data/curriculum';
import { getUserProgress, completeProject } from '../services/progress';
import './Project.css';

const Project: React.FC = () => {
  const { projectId } = useParams<{ projectId: string }>();
  const navigate = useNavigate();
  const [progress, setProgress] = useState(getUserProgress());
  const [code, setCode] = useState('');
  const [output, setOutput] = useState('');
  const [isRunning, setIsRunning] = useState(false);
  const [showHints, setShowHints] = useState<number[]>([]);

  // Find the project
  let project = null;
  let course = null;

  for (const phase of learningPath.phases) {
    for (const c of phase.courses) {
      const foundProject = c.projects.find(p => p.id === projectId);
      if (foundProject) {
        project = foundProject;
        course = c;
        break;
      }
    }
  }

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress(getUserProgress());
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (project) {
      setCode(project.starterCode);
    }
  }, [project]);

  if (!project) {
    return (
      <div className="project-not-found">
        <h2>Project not found</h2>
        <Link to="/projects">Back to Projects</Link>
      </div>
    );
  }

  const isCompleted = progress.completedProjects.includes(project.id);

  const runCode = async () => {
    setIsRunning(true);
    setOutput('Running code...\n');
    
    try {
      // Simulate code execution
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Simple mock output
      const mockOutput = `Running your code...\n\n✓ Code executed successfully!\n\nNote: This is a simulation. In the full version, this would execute Python code using Pyodide.\n\nOutput:\nHello, ML Mastery!`;
      
      setOutput(mockOutput);
    } catch (error) {
      setOutput(`Error: ${error}`);
    }
    
    setIsRunning(false);
  };

  const handleSaveCode = () => {
    localStorage.setItem(`project_${projectId}_code`, code);
    setOutput('Code saved successfully!');
  };

  const handleMarkComplete = () => {
    completeProject(project.id);
    setProgress(getUserProgress());
    navigate(`/course/${course?.id}`);
  };

  const toggleHint = (index: number) => {
    if (showHints.includes(index)) {
      setShowHints(showHints.filter(i => i !== index));
    } else {
      setShowHints([...showHints, index]);
    }
  };

  return (
    <div className="project-page">
      {/* Header */}
      <div className="project-header">
        <Link to={`/projects`} className="back-link">
          ← Back to Projects
        </Link>
        <div className="header-info">
          <span className="project-badge">💻 Project</span>
          <h1>{project.title}</h1>
          <p className="project-description">{project.description}</p>
        </div>
      </div>

      <div className="project-content">
        {/* IDE Section */}
        <div className="ide-section">
          <div className="ide-header">
            <span className="ide-title">Code Editor</span>
            <div className="ide-actions">
              <button 
                className="ide-button secondary"
                onClick={handleSaveCode}
              >
                💾 Save
              </button>
              <button 
                className="ide-button primary"
                onClick={runCode}
                disabled={isRunning}
              >
                {isRunning ? '⏳ Running...' : '▶ Run Code'}
              </button>
            </div>
          </div>
          
          <textarea
            className="code-editor"
            value={code}
            onChange={(e) => setCode(e.target.value)}
            spellCheck={false}
            placeholder="Write your code here..."
          />
          
          <div className="output-section">
            <div className="output-header">
              <span>Output</span>
            </div>
            <pre className="output-content">
              {output || 'Run your code to see output here...'}
            </pre>
          </div>
        </div>

        {/* Sidebar */}
        <div className="project-sidebar">
          {/* Objectives */}
          <div className="sidebar-section">
            <h3>🎯 Objectives</h3>
            <ul className="objectives-list">
              {project.objectives.map((objective, index) => (
                <li key={index}>{objective}</li>
              ))}
            </ul>
          </div>

          {/* Expected Output */}
          <div className="sidebar-section">
            <h3>📤 Expected Output</h3>
            <pre className="expected-output">{project.expectedOutput}</pre>
          </div>

          {/* Hints */}
          <div className="sidebar-section">
            <h3>💡 Hints</h3>
            <div className="hints-list">
              {project.hints.map((hint, index) => (
                <div key={index} className="hint-item">
                  <button 
                    className="hint-toggle"
                    onClick={() => toggleHint(index)}
                  >
                    Hint {index + 1} {showHints.includes(index) ? '▼' : '▶'}
                  </button>
                  {showHints.includes(index) && (
                    <p className="hint-text">{hint}</p>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Rubric */}
          <div className="sidebar-section">
            <h3>📊 Grading Rubric</h3>
            <div className="rubric-list">
              {project.rubric.map((item, index) => (
                <div key={index} className="rubric-item">
                  <span className="rubric-criterion">{item.criterion}</span>
                  <span className="rubric-points">{item.maxPoints} pts</span>
                  <p className="rubric-description">{item.description}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Actions */}
          <div className="sidebar-section">
            {!isCompleted ? (
              <button className="complete-button" onClick={handleMarkComplete}>
                ✓ Mark as Complete
              </button>
            ) : (
              <div className="completed-badge">
                ✓ Project Completed!
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Project;
