import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import Courses from './pages/Courses';
import CourseDetail from './pages/CourseDetail';
import Lesson from './pages/Lesson';
import Assessment from './pages/Assessment';
import Progress from './pages/Progress';
import Projects from './pages/Projects';
import Project from './pages/Project';
import Settings from './pages/Settings';
import CourseGenerator from './pages/CourseGenerator';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Dashboard />} />
          <Route path="courses" element={<Courses />} />
          <Route path="generate" element={<CourseGenerator />} />
          <Route path="course/:courseId" element={<CourseDetail />} />
          <Route path="lesson/:lessonId" element={<Lesson />} />
          <Route path="assessment/:assessmentId" element={<Assessment />} />
          <Route path="progress" element={<Progress />} />
          <Route path="projects" element={<Projects />} />
          <Route path="project/:projectId" element={<Project />} />
          <Route path="settings" element={<Settings />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
