import { useState, useEffect, useContext } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import axios from 'axios';
import { Save, X } from 'lucide-react';
import AuthContext from '../context/AuthContext';
import Navbar from '../components/Navbar';

const EditTask = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    dueDate: '',
    priority: 'medium',
    assignedTo: ''
  });

  useEffect(() => {
    fetchTask();
    fetchUsers();
  }, [id]);

  const fetchTask = async () => {
    try {
      const res = await axios.get(`/api/tasks/${id}`);
      const task = res.data;
      
      if (task.createdBy._id !== user.id) {
        toast.error('Only the creator can edit this task');
        navigate('/tasks');
        return;
      }

      setFormData({
        title: task.title,
        description: task.description,
        dueDate: task.dueDate.split('T')[0],
        priority: task.priority,
        assignedTo: task.assignedTo?._id || ''
      });
      setLoading(false);
    } catch (err) {
      toast.error('Failed to fetch task');
      navigate('/tasks');
    }
  };

  const fetchUsers = async () => {
    try {
      const res = await axios.get('/api/users');
      setUsers(res.data);
    } catch (err) {
      toast.error('Failed to fetch users');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`/api/tasks/${id}`, formData);
      toast.success('Task updated successfully');
      navigate('/tasks');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update task');
    }
  };

  if (loading) {
    return (
      <>
        <Navbar />
        <div className="flex items-center justify-center min-h-screen">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
      </>
    );
  }

  return (
    <>
      <Navbar />
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Edit Task</h1>
          <p className="text-gray-600 mb-8">Update task details</p>

          <div className="card">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Task Title
                </label>
                <input
                  type="text"
                  required
                  className="input-field"
                  placeholder="Enter task title"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description
                </label>
                <textarea
                  required
                  rows="4"
                  className="input-field"
                  placeholder="Enter task description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Due Date
                  </label>
                  <input
                    type="date"
                    required
                    className="input-field"
                    value={formData.dueDate}
                    onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Priority
                  </label>
                  <select
                    className="input-field"
                    value={formData.priority}
                    onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
                  >
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Assign To
                </label>
                <select
                  className="input-field"
                  value={formData.assignedTo}
                  onChange={(e) => setFormData({ ...formData, assignedTo: e.target.value })}
                >
                  <option value="">Select user</option>
                  {users.map(user => (
                    <option key={user._id} value={user._id}>{user.name}</option>
                  ))}
                </select>
              </div>

              <div className="flex justify-end space-x-3 pt-4">
                <button
                  type="button"
                  onClick={() => navigate('/tasks')}
                  className="btn-secondary flex items-center space-x-2"
                >
                  <X className="h-5 w-5" />
                  <span>Cancel</span>
                </button>
                <button type="submit" className="btn-primary flex items-center space-x-2">
                  <Save className="h-5 w-5" />
                  <span>Update Task</span>
                </button>
              </div>
            </form>
          </div>
        </motion.div>
      </div>
    </>
  );
};

export default EditTask;
