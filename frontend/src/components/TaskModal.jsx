import React, { useState, useEffect } from 'react';
import api from '../utils/api';

const TaskModal = ({ task, onClose, onUpdate }) => {
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({
    title: task.title || '',
    description: task.description || '',
    priority: task.priority || 'Medium',
    dueDate: task.dueDate ? task.dueDate.split('T')[0] : ''
  });

  useEffect(() => {
    if (task) {
      api.get(`/comments/${task._id}`).then(res => setComments(res.data.data));
    }
  }, [task]);

  const handleAddComment = async (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;
    try {
      const res = await api.post('/comments', { taskId: task._id, content: newComment });
      setComments([res.data.data, ...comments]);
      setNewComment('');
    } catch (err) {
      console.error(err);
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      await api.put(`/tasks/${task._id}`, editForm);
      setIsEditing(false);
      if (onUpdate) onUpdate(); // Trigger refresh on parent
    } catch (err) {
      console.error(err);
    }
  };

  if (!task) return null;

  return (
    <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000 }}>
      <div className="card" style={{ width: '600px', maxHeight: '90vh', overflowY: 'auto', position: 'relative', backgroundColor: 'var(--card-bg)' }}>
        <button onClick={onClose} style={{ position: 'absolute', top: '1rem', right: '1rem', background: 'none', border: 'none', fontSize: '1.2rem', cursor: 'pointer' }}>✖</button>
        
        {isEditing ? (
          <form onSubmit={handleUpdate} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <input 
              type="text" 
              value={editForm.title} 
              onChange={e => setEditForm({...editForm, title: e.target.value})} 
              style={{ padding: '0.5rem' }} 
              required
            />
            <textarea 
              value={editForm.description} 
              onChange={e => setEditForm({...editForm, description: e.target.value})} 
              style={{ padding: '0.5rem', minHeight: '80px' }} 
              placeholder="Description"
            />
            <div style={{ display: 'flex', gap: '1rem' }}>
              <select value={editForm.priority} onChange={e => setEditForm({...editForm, priority: e.target.value})} style={{ padding: '0.5rem' }}>
                <option value="Low">Low</option>
                <option value="Medium">Medium</option>
                <option value="High">High</option>
              </select>
              <input 
                type="date" 
                value={editForm.dueDate} 
                onChange={e => setEditForm({...editForm, dueDate: e.target.value})} 
                style={{ padding: '0.5rem' }}
              />
            </div>
            <div style={{ display: 'flex', gap: '1rem' }}>
              <button type="submit" className="btn">Save Changes</button>
              <button type="button" className="btn" style={{ background: 'var(--text-muted)' }} onClick={() => setIsEditing(false)}>Cancel</button>
            </div>
          </form>
        ) : (
          <>
            <h2 className="heading">{task.title}</h2>
            {task.description && <p style={{ marginBottom: '1rem' }}>{task.description}</p>}
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
              Status: {task.status} | Priority: {task.priority} 
              {task.dueDate && ` | Due: ${new Date(task.dueDate).toLocaleDateString()}`}
            </p>
            <button className="btn" style={{ marginTop: '0.5rem', fontSize: '0.8rem', padding: '0.3rem 0.8rem' }} onClick={() => setIsEditing(true)}>Edit Task</button>
          </>
        )}
        
        <hr style={{ margin: '1.5rem 0', borderColor: 'var(--border-color)' }} />
        
        <h4>Activity History</h4>
        <ul style={{ fontSize: '0.85rem', marginBottom: '1rem', paddingLeft: '1.5rem', color: 'var(--text-color)' }}>
          {task.activityHistory?.map((entry, idx) => (
            <li key={idx}>
              {entry.action} by {entry.userId?.name || 'User'} on {new Date(entry.date).toLocaleString()}
            </li>
          ))}
          {(!task.activityHistory || task.activityHistory.length === 0) && <li>Task Created</li>}
        </ul>
        
        <hr style={{ margin: '1.5rem 0', borderColor: 'var(--border-color)' }} />
        
        <h4>Comments</h4>
        <form onSubmit={handleAddComment} style={{ display: 'flex', gap: '0.5rem', marginTop: '0.5rem', marginBottom: '1rem' }}>
          <input 
            type="text" 
            placeholder="Write a comment..." 
            value={newComment}
            onChange={e => setNewComment(e.target.value)}
            style={{ flex: 1, padding: '0.5rem', borderRadius: '4px', border: '1px solid var(--border-color)' }}
          />
          <button type="submit" className="btn">Post</button>
        </form>
        
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          {comments.map(c => (
            <div key={c._id} style={{ padding: '0.75rem', backgroundColor: 'var(--bg-color)', borderRadius: '6px' }}>
              <strong style={{ fontSize: '0.9rem', color: 'var(--primary-color)' }}>{c.userId?.name}: </strong>
              <span style={{ fontSize: '0.9rem' }}>{c.content}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TaskModal;
