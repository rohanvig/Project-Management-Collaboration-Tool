import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import toast from 'react-hot-toast';
import api from '../utils/api';
import Navbar from '../components/Navbar';
import TaskModal from '../components/TaskModal';

const columns = ['Todo', 'In Progress', 'Done'];

const ProjectBoard = () => {
  const { id: projectId } = useParams();
  const [board, setBoard] = useState(null);
  const [tasks, setTasks] = useState({ 'Todo': [], 'In Progress': [], 'Done': [] });
  const [newTaskTitle, setNewTaskTitle] = useState('');
  
  // New State for Modal, Invite, and Filters
  const [selectedTask, setSelectedTask] = useState(null);
  const [inviteEmail, setInviteEmail] = useState('');
  const [search, setSearch] = useState('');
  const [priorityFilter, setPriorityFilter] = useState('');
  const [page, setPage] = useState(1);
  const [totalTasks, setTotalTasks] = useState(0);
  const [projectMembers, setProjectMembers] = useState([]);

  const fetchBoardAndTasks = async () => {
    try {
      let res = await api.get(`/boards/${projectId}`);
      let currentBoard = res.data.data[0];
      
      if (!currentBoard) {
        const createRes = await api.post('/boards', { projectId, name: 'Main Board' });
        currentBoard = createRes.data.data;
      }
      setBoard(currentBoard);

      // Fetch project details for members
      const projRes = await api.get('/projects');
      const project = projRes.data.data.find(p => p._id === projectId);
      if (project) setProjectMembers(project.members);

      let url = `/tasks?boardId=${currentBoard._id}&page=${page}&limit=20`;
      if (search) url += `&search=${search}`;
      if (priorityFilter) url += `&priority=${priorityFilter}`;

      const taskRes = await api.get(url);
      const allTasks = taskRes.data.data;
      setTotalTasks(taskRes.data.pagination?.total || 0);
      
      const grouped = { 'Todo': [], 'In Progress': [], 'Done': [] };
      allTasks.forEach(task => {
        if (grouped[task.status]) grouped[task.status].push(task);
        else grouped['Todo'].push(task);
      });
      setTasks(grouped);
    } catch (err) {
      console.error('Failed to load board', err);
    }
  };

  useEffect(() => {
    fetchBoardAndTasks();
  }, [projectId, search, priorityFilter, page]);

  const handleCreateTask = async (e) => {
    e.preventDefault();
    if (!newTaskTitle.trim() || !board) return;
    try {
      const res = await api.post('/tasks', { title: newTaskTitle, boardId: board._id, status: 'Todo' });
      const newTask = res.data.data;
      setTasks(prev => ({ ...prev, 'Todo': [...prev['Todo'], newTask] }));
      setNewTaskTitle('');
      toast.success('Task created');
    } catch (err) {
      toast.error('Failed to create task');
      console.error('Failed to create task', err);
    }
  };

  const handleInvite = async (e) => {
    e.preventDefault();
    if (!inviteEmail.trim()) return;
    try {
      await api.post(`/projects/${projectId}/invite`, { email: inviteEmail });
      toast.success('User invited successfully!');
      setInviteEmail('');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to invite user');
    }
  };

  const onDragEnd = async (result) => {
    const { source, destination, draggableId } = result;
    if (!destination) return;
    if (source.droppableId === destination.droppableId && source.index === destination.index) return;

    const sourceStatus = source.droppableId;
    const destStatus = destination.droppableId;

    const sourceTasks = Array.from(tasks[sourceStatus]);
    const destTasks = sourceStatus === destStatus ? sourceTasks : Array.from(tasks[destStatus]);
    
    const [movedTask] = sourceTasks.splice(source.index, 1);
    movedTask.status = destStatus;
    destTasks.splice(destination.index, 0, movedTask);

    setTasks(prev => ({ ...prev, [sourceStatus]: sourceTasks, [destStatus]: destTasks }));

    try {
      await api.put(`/tasks/${draggableId}`, { status: destStatus });
    } catch (err) {
      console.error('Failed to update task status', err);
    }
  };

  return (
    <div>
      <Navbar />
      <div className="container" style={{ paddingTop: 0, maxWidth: '1400px' }}>
        {/* Top Header & Invite */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
          <h2 className="heading" style={{ margin: 0 }}>Project Board</h2>
          
          <form onSubmit={handleInvite} style={{ display: 'flex', gap: '0.5rem' }}>
            <input 
              type="email" 
              placeholder="Invite member by email..." 
              value={inviteEmail}
              onChange={(e) => setInviteEmail(e.target.value)}
              style={{ padding: '0.5rem', borderRadius: '4px', border: '1px solid var(--border-color)' }}
            />
            <button type="submit" className="btn" style={{ backgroundColor: 'var(--status-progress)' }}>Invite</button>
          </form>
        </div>

        {/* Filters & Add Task */}
        <div style={{ display: 'flex', justifyContent: 'space-between', gap: '1rem', marginBottom: '2rem', backgroundColor: 'var(--card-bg)', padding: '1rem', borderRadius: '8px', boxShadow: 'var(--shadow)' }}>
          <div style={{ display: 'flex', gap: '1rem', flex: 1 }}>
            <input 
              type="text" 
              placeholder="Search tasks..." 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              style={{ padding: '0.5rem', borderRadius: '4px', border: '1px solid var(--border-color)', minWidth: '200px' }}
            />
            <select 
              value={priorityFilter} 
              onChange={(e) => setPriorityFilter(e.target.value)}
              style={{ padding: '0.5rem', borderRadius: '4px', border: '1px solid var(--border-color)' }}
            >
              <option value="">All Priorities</option>
              <option value="Low">Low</option>
              <option value="Medium">Medium</option>
              <option value="High">High</option>
            </select>
          </div>

          <form onSubmit={handleCreateTask} style={{ display: 'flex', gap: '0.5rem' }}>
            <input 
              type="text" 
              placeholder="New task title..." 
              value={newTaskTitle}
              onChange={(e) => setNewTaskTitle(e.target.value)}
              style={{ padding: '0.5rem', borderRadius: '4px', border: '1px solid var(--border-color)' }}
            />
            <button type="submit" className="btn">Add Task</button>
          </form>
        </div>

        {/* Kanban Board */}
        <DragDropContext onDragEnd={onDragEnd}>
          <div style={{ display: 'flex', gap: '1.5rem', overflowX: 'auto', paddingBottom: '1rem', minHeight: '60vh' }}>
            {columns.map(columnId => (
              <div key={columnId} style={{ flex: 1, minWidth: '300px', backgroundColor: '#e5e7eb', borderRadius: '8px', padding: '1rem' }}>
                <h3 style={{ marginBottom: '1rem', display: 'flex', justifyContent: 'space-between' }}>
                  {columnId} 
                  <span style={{ fontSize: '0.8rem', backgroundColor: '#d1d5db', padding: '2px 8px', borderRadius: '12px' }}>
                    {tasks[columnId]?.length || 0}
                  </span>
                </h3>
                
                <Droppable droppableId={columnId}>
                  {(provided, snapshot) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.droppableProps}
                      style={{ 
                        minHeight: '200px',
                        height: '100%',
                        backgroundColor: snapshot.isDraggingOver ? '#d1d5db' : 'transparent',
                        transition: 'background-color 0.2s',
                        borderRadius: '4px'
                      }}
                    >
                      {tasks[columnId].map((task, index) => (
                        <Draggable key={task._id} draggableId={task._id} index={index}>
                          {(provided, snapshot) => (
                            <div
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                              {...provided.dragHandleProps}
                              className="card"
                              onClick={() => setSelectedTask(task)}
                              style={{
                                ...provided.draggableProps.style,
                                marginBottom: '0.75rem',
                                padding: '1rem',
                                backgroundColor: 'var(--card-bg)',
                                cursor: 'grab',
                                boxShadow: snapshot.isDragging ? '0 5px 15px rgba(0,0,0,0.15)' : 'var(--shadow)',
                              }}
                            >
                              <h4 style={{ margin: 0, fontSize: '1rem' }}>{task.title}</h4>
                              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.3rem', marginTop: '0.5rem', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                  <span>Priority: {task.priority}</span>
                                  {task.assignedTo && <span>👤 {task.assignedTo.name}</span>}
                                </div>
                                {task.dueDate && <span>📅 Due: {new Date(task.dueDate).toLocaleDateString()}</span>}
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
            ))}
          </div>
        </DragDropContext>

        {/* Pagination */}
        {totalTasks > 20 && (
          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '1rem', marginTop: '2rem', padding: '1rem', backgroundColor: 'var(--card-bg)', borderRadius: '8px', boxShadow: 'var(--shadow)' }}>
            <button className="btn" disabled={page === 1} onClick={() => setPage(p => p - 1)} style={{ padding: '0.5rem 1rem' }}>Previous</button>
            <span style={{ fontWeight: 'bold' }}>Page {page} of {Math.ceil(totalTasks / 20)}</span>
            <button className="btn" disabled={page >= Math.ceil(totalTasks / 20)} onClick={() => setPage(p => p + 1)} style={{ padding: '0.5rem 1rem' }}>Next</button>
          </div>
        )}
      </div>

      {selectedTask && (
        <TaskModal 
          task={selectedTask} 
          members={projectMembers}
          onClose={() => {
            setSelectedTask(null);
            fetchBoardAndTasks(); // refresh to get new history/comments if updated
          }} 
        />
      )}
    </div>
  );
};

export default ProjectBoard;
