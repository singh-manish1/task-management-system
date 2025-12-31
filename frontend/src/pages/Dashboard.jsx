import { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import toast from 'react-hot-toast';
import axios from 'axios';
import { Plus, Calendar, User, CheckCircle2, Circle, GripVertical } from 'lucide-react';
import AuthContext from '../context/AuthContext';
import Navbar from '../components/Navbar';

const Dashboard = () => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useContext(AuthContext);

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      const res = await axios.get('/api/tasks/all');
      setTasks(res.data.tasks);
      setLoading(false);
    } catch (err) {
      toast.error('Failed to fetch tasks');
      setLoading(false);
    }
  };

  const handleDragEnd = async (result) => {
    if (!result.destination) return;

    const { source, destination, draggableId } = result;
    
    // If dropped in the same position, do nothing
    if (
      source.droppableId === destination.droppableId &&
      source.index === destination.index
    ) {
      return;
    }

    const task = tasks.find(t => t._id === draggableId);
    
    // If moving to a different priority column, check permissions
    if (source.droppableId !== destination.droppableId) {
      if (task.createdBy._id.toString() !== user._id.toString()) {
        toast.error('Only the creator can change task priority');
        return;
      }

      const newPriority = destination.droppableId;
      const updatedTasks = tasks.map(t =>
        t._id === draggableId ? { ...t, priority: newPriority } : t
      );
      setTasks(updatedTasks);

      try {
        await axios.put(`/api/tasks/${draggableId}`, { priority: newPriority });
        toast.success('Task priority updated');
      } catch (err) {
        setTasks(tasks);
        toast.error('Failed to update task');
      }
    } else {
      // Reordering within the same column
      const priorityTasks = getTasksByPriority(source.droppableId);
      const reorderedTasks = Array.from(priorityTasks);
      const [movedTask] = reorderedTasks.splice(source.index, 1);
      reorderedTasks.splice(destination.index, 0, movedTask);
      
      // Update the tasks array with the new order
      const otherTasks = tasks.filter(t => t.priority !== source.droppableId);
      setTasks([...otherTasks, ...reorderedTasks]);
    }
  };

  const toggleStatus = async (taskId) => {
    const task = tasks.find(t => t._id === taskId);
    if (task.assignedTo._id.toString() !== user._id.toString()) {
      toast.error('Only the assigned user can update status');
      return;
    }

    const newStatus = task.status === 'pending' ? 'completed' : 'pending';
    const updatedTasks = tasks.map(t =>
      t._id === taskId ? { ...t, status: newStatus } : t
    );
    setTasks(updatedTasks);

    try {
      await axios.put(`/api/tasks/${taskId}`, { status: newStatus });
      toast.success('Task status updated');
    } catch (err) {
      setTasks(tasks);
      toast.error('Failed to update status');
    }
  };

  const getTasksByPriority = (priority) => {
    return tasks.filter(task => task.priority === priority);
  };

  const stats = {
    total: tasks.length,
    pending: tasks.filter(t => t.status === 'pending').length,
    completed: tasks.filter(t => t.status === 'completed').length
  };

  const priorityConfig = {
    high: { color: 'red', bg: 'bg-red-50', border: 'border-red-200', text: 'text-red-700' },
    medium: { color: 'orange', bg: 'bg-orange-50', border: 'border-orange-200', text: 'text-orange-700' },
    low: { color: 'green', bg: 'bg-green-50', border: 'border-green-200', text: 'text-green-700' }
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
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
            <p className="text-gray-600 mt-1">Manage your tasks efficiently</p>
          </div>
          <Link to="/tasks/create" className="btn-primary flex items-center space-x-2">
            <Plus className="h-5 w-5" />
            <span>New Task</span>
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="card bg-gradient-to-br from-blue-50 to-blue-100">
            <h3 className="text-lg font-semibold text-gray-700 mb-2">Total Tasks</h3>
            <p className="text-4xl font-bold text-blue-600">{stats.total}</p>
          </div>
          <div className="card bg-gradient-to-br from-orange-50 to-orange-100">
            <h3 className="text-lg font-semibold text-gray-700 mb-2">Pending</h3>
            <p className="text-4xl font-bold text-orange-600">{stats.pending}</p>
          </div>
          <div className="card bg-gradient-to-br from-green-50 to-green-100">
            <h3 className="text-lg font-semibold text-gray-700 mb-2">Completed</h3>
            <p className="text-4xl font-bold text-green-600">{stats.completed}</p>
          </div>
        </div>

        <DragDropContext onDragEnd={handleDragEnd}>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {['high', 'medium', 'low'].map((priority) => {
              const config = priorityConfig[priority];
              const priorityTasks = getTasksByPriority(priority);

              return (
                <div key={priority}>
                  <h2 className={`text-xl font-bold mb-4 ${config.text} capitalize`}>
                    {priority} Priority ({priorityTasks.length})
                  </h2>
                  <Droppable droppableId={priority}>
                    {(provided, snapshot) => (
                      <div
                        ref={provided.innerRef}
                        {...provided.droppableProps}
                        className={`min-h-[400px] p-4 rounded-lg ${config.bg} ${config.border} border-2 ${
                          snapshot.isDraggingOver ? 'ring-2 ring-primary' : ''
                        }`}
                      >
                        {priorityTasks.map((task, index) => (
                          <Draggable key={task._id} draggableId={task._id} index={index}>
                            {(provided, snapshot) => (
                              <div
                                ref={provided.innerRef}
                                {...provided.draggableProps}
                                className={`bg-white p-4 rounded-lg shadow-md mb-3 hover:shadow-lg transition-shadow ${
                                  snapshot.isDragging ? 'shadow-2xl rotate-2' : ''
                                } ${task.status === 'completed' ? 'opacity-60' : ''}`}
                              >
                                <div className="flex items-start space-x-2">
                                  <div {...provided.dragHandleProps} className="mt-1 text-gray-400 hover:text-gray-600 cursor-grab active:cursor-grabbing">
                                    <GripVertical className="h-5 w-5" />
                                  </div>
                                  <div className="flex-1">
                                    <div className="flex items-start justify-between mb-2">
                                      <h3 className="font-semibold text-gray-900 flex-1">{task.title}</h3>
                                      <button
                                        onClick={() => toggleStatus(task._id)}
                                        className="ml-2"
                                      >
                                        {task.status === 'completed' ? (
                                          <CheckCircle2 className="h-5 w-5 text-green-600" />
                                        ) : (
                                          <Circle className="h-5 w-5 text-gray-400" />
                                        )}
                                      </button>
                                    </div>
                                    <p className="text-sm text-gray-600 mb-3 line-clamp-2">{task.description}</p>
                                    <div className="flex items-center justify-between text-xs text-gray-500">
                                      <div className="flex items-center space-x-1">
                                        <Calendar className="h-4 w-4" />
                                        <span>{new Date(task.dueDate).toLocaleDateString()}</span>
                                      </div>
                                      <div className="flex items-center space-x-1">
                                        <User className="h-4 w-4" />
                                        <span>{task.assignedTo?.name}</span>
                                      </div>
                                    </div>
                                    <Link
                                      to={`/tasks/${task._id}`}
                                      className="text-xs text-primary hover:text-secondary mt-2 inline-block"
                                    >
                                      View Details
                                    </Link>
                                  </div>
                                </div>
                              </div>
                            )}
                          </Draggable>
                        ))}
                        {provided.placeholder}
                      </div>
                    )}
                  </Droppable>
                </div>
              );
            })}
          </div>
        </DragDropContext>
      </div>
    </>
  );
};

export default Dashboard;
