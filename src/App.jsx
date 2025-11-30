import { Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import StudentHomepage from './pages/StudentHomepage';
import ProfHomepage from './pages/ProfHomepage';
import NotFoundPage from './pages/NotFoundPage';
import './App.css';

function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/login" replace />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/student" element={<StudentHomepage />} />
      <Route path="/prof" element={<ProfHomepage />} />
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}

export default App
