import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Landing from './pages/Landing';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import ResumeAnalyzer from './pages/ResumeAnalyzer';
import Interview from './pages/Interview';
import InterviewSetup from './pages/InterviewSetup';
import InterviewDSA from './pages/InterviewDSA';

const PrivateRoute = ({ children }) => {
  const token = localStorage.getItem('token');
  return token ? children : <Navigate to="/login" />;
};

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/dashboard" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
        <Route path="/resume" element={<PrivateRoute><ResumeAnalyzer /></PrivateRoute>} />
        <Route path="/interview" element={<PrivateRoute><Interview /></PrivateRoute>} />
        <Route path="/interview-setup" element={<PrivateRoute><InterviewSetup /></PrivateRoute>} />
        <Route path="/interview/dsa" element={<PrivateRoute><InterviewDSA /></PrivateRoute>} />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </BrowserRouter>
  );
}