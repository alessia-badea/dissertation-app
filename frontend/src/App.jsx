import { Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ApplicationProvider } from './context/ApplicationContext';
import ProtectedRoute from './components/ProtectedRoute';
import LoginPage from './pages/LoginPage';
import StudentHomepage from './pages/StudentHomepage';
import ProfHomepage from './pages/ProfHomepage';
import ProfilePage from './pages/ProfilePage';
import ApplicationPage from './pages/ApplicationPage';
import AboutPage from './pages/AboutPage';
import FAQPage from './pages/FAQPage';
import NotFoundPage from './pages/NotFoundPage';
import './App.css';

function App() {
  return (
    <AuthProvider>
      <ApplicationProvider>
        <Routes>
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/login" element={<LoginPage />} />
        
        {/* Protected Routes */}
        <Route 
          path="/student" 
          element={
            <ProtectedRoute requiredRole="student">
              <StudentHomepage />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/prof" 
          element={
            <ProtectedRoute requiredRole="professor">
              <ProfHomepage />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/application" 
          element={
            <ProtectedRoute>
              <ApplicationPage />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/profile" 
          element={
            <ProtectedRoute>
              <ProfilePage />
            </ProtectedRoute>
          } 
        />
        
        {/* Public Routes */}
        <Route path="/about" element={<AboutPage />} />
        <Route path="/faq" element={<FAQPage />} />
        <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </ApplicationProvider>
    </AuthProvider>
  );
}

export default App
