import { useLocation, Outlet } from 'react-router-dom';
import { Link } from 'react-router-dom';
import './Layout.css';

const Layout = () => {
  const location = useLocation();

  return (
    <div className="layout">
      {/* Top Navigation - Like roadmap.sh */}
      <nav className="top-nav">
        <div className="nav-left">
          <Link to="/" className="nav-logo">
            <span className="nav-logo-icon">🧮</span>
            <span>ML Mastery</span>
          </Link>
          <div className="nav-links">
            <Link 
              to="/" 
              className={`nav-link ${location.pathname === '/' ? 'active' : ''}`}
            >
              Dashboard
            </Link>
            <Link 
              to="/courses" 
              className={`nav-link ${location.pathname.startsWith('/courses') || location.pathname.startsWith('/course') ? 'active' : ''}`}
            >
              Courses
            </Link>
            <Link 
              to="/generate" 
              className={`nav-link ${location.pathname === '/generate' ? 'active' : ''}`}
            >
              🎨 Generate AI Course
            </Link>
            <Link 
              to="/progress" 
              className={`nav-link ${location.pathname === '/progress' ? 'active' : ''}`}
            >
              Progress
            </Link>
            <Link 
              to="/settings" 
              className={`nav-link ${location.pathname === '/settings' ? 'active' : ''}`}
            >
              Settings
            </Link>
          </div>
        </div>
        <div className="nav-right">
          <Link to="/settings" className="nav-button nav-button-secondary">
            ⚙️ Settings
          </Link>
        </div>
      </nav>

      {/* Main Content */}
      <main className="main-content">
        <div className="content-area">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default Layout;
