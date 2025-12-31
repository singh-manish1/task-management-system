import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './context/AuthContext';
import PrivateRoute from './components/PrivateRoute';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import TaskList from './pages/TaskList';
import TaskDetails from './pages/TaskDetails';
import CreateTask from './pages/CreateTask';
import EditTask from './pages/EditTask';
import UserManagement from './pages/UserManagement';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Toaster position="top-right" />
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
          <Route path="/tasks" element={<PrivateRoute><TaskList /></PrivateRoute>} />
          <Route path="/tasks/create" element={<PrivateRoute><CreateTask /></PrivateRoute>} />
          <Route path="/tasks/:id" element={<PrivateRoute><TaskDetails /></PrivateRoute>} />
          <Route path="/tasks/:id/edit" element={<PrivateRoute><EditTask /></PrivateRoute>} />
          <Route path="/users" element={<PrivateRoute><UserManagement /></PrivateRoute>} />
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
