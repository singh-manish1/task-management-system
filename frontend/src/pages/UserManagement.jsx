import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { UserPlus, Trash2, Mail, Shield } from 'lucide-react';
import axios from 'axios';
import Navbar from '../components/Navbar';
import toast from 'react-hot-toast';

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newUser, setNewUser] = useState({ name: '', email: '', password: '', role: 'user' });

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const res = await axios.get('/api/users');
      setUsers(res.data);
    } catch (err) {
      toast.error('Failed to fetch users');
    }
  };

  const handleAddUser = async (e) => {
    e.preventDefault();
    try {
      await axios.post('/api/auth/register', newUser);
      toast.success('User added successfully');
      setShowAddModal(false);
      setNewUser({ name: '', email: '', password: '', role: 'user' });
      fetchUsers();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to add user');
    }
  };

  const handleDeleteUser = async (userId) => {
    if (!window.confirm('Are you sure you want to delete this user?')) return;
    
    try {
      await axios.delete(`/api/users/${userId}`);
      toast.success('User deleted successfully');
      fetchUsers();
    } catch (err) {
      toast.error('Failed to delete user');
    }
  };

  return (
    <div className="min-h-screen">
      <Navbar />
      
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-4xl font-bold text-gray-800">User Management</h1>
            <p className="text-gray-600 mt-2">Manage system users</p>
          </div>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setShowAddModal(true)}
            className="btn-primary flex items-center space-x-2"
          >
            <UserPlus className="w-5 h-5" />
            <span>Add User</span>
          </motion.button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {users.map((user, index) => (
            <motion.div
              key={user._id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="card"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-gradient-to-br from-primary to-secondary rounded-full flex items-center justify-center text-white font-bold text-lg">
                    {user.name.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-800">{user.name}</h3>
                    <div className="flex items-center text-sm text-gray-600">
                      <Mail className="w-3 h-3 mr-1" />
                      {user.email}
                    </div>
                  </div>
                </div>
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => handleDeleteUser(user._id)}
                  className="text-red-500 hover:text-red-700"
                >
                  <Trash2 className="w-5 h-5" />
                </motion.button>
              </div>

              <div className="flex items-center space-x-2">
                <Shield className="w-4 h-4 text-gray-500" />
                <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                  user.role === 'admin' ? 'bg-primary/10 text-primary' : 'bg-gray-200 text-gray-700'
                }`}>
                  {user.role}
                </span>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {showAddModal && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
          onClick={() => setShowAddModal(false)}
        >
          <motion.div
            initial={{ scale: 0.9 }}
            animate={{ scale: 1 }}
            className="card max-w-md w-full"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="text-2xl font-bold text-gray-800 mb-6">Add New User</h3>
            
            <form onSubmit={handleAddUser} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Name</label>
                <input
                  type="text"
                  value={newUser.name}
                  onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
                  className="input-field"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                <input
                  type="email"
                  value={newUser.email}
                  onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
                  className="input-field"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Password</label>
                <input
                  type="password"
                  value={newUser.password}
                  onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
                  className="input-field"
                  minLength="6"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Role</label>
                <select
                  value={newUser.role}
                  onChange={(e) => setNewUser({ ...newUser, role: e.target.value })}
                  className="input-field"
                >
                  <option value="user">User</option>
                  <option value="admin">Admin</option>
                </select>
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="btn-secondary flex-1"
                >
                  Cancel
                </button>
                <button type="submit" className="btn-primary flex-1">
                  Add User
                </button>
              </div>
            </form>
          </motion.div>
        </motion.div>
      )}
    </div>
  );
};

export default UserManagement;
