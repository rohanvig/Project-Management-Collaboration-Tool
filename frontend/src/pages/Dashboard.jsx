import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import api from '../utils/api';
import Navbar from '../components/Navbar';

const Dashboard = () => {
  const [projects, setProjects] = useState([]);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [projectToDelete, setProjectToDelete] = useState(null);

  const fetchProjects = async () => {
    try {
      const res = await api.get('/projects');
      setProjects(res.data.data);
    } catch (err) {
      console.error('Failed to fetch projects', err);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  const handleCreateProject = async (e) => {
    e.preventDefault();
    if (!name) return;
    try {
      await api.post('/projects', { name, description });
      setName('');
      setDescription('');
      fetchProjects(); // Refresh the list
      toast.success('Project created!');
    } catch (err) {
      toast.error('Failed to create project');
      console.error('Failed to create project', err);
    }
  };

  const handleDeleteProject = (id) => {
    setProjectToDelete(id);
  };

  const confirmDeleteProject = async () => {
    try {
      await api.delete(`/projects/${projectToDelete}`);
      fetchProjects();
      toast.success('Project deleted');
      setProjectToDelete(null);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to delete project');
      setProjectToDelete(null);
    }
  };

  return (
    <div>
      <Navbar />
      <div className="container" style={{ paddingTop: 0 }}>
        <h2 className="heading">Your Projects</h2>
        
        {/* Create Project Form */}
        <div className="card" style={{ marginBottom: '2rem' }}>
          <h3 style={{ marginBottom: '1rem' }}>Create New Project</h3>
          <form onSubmit={handleCreateProject}>
            <div className="input-group">
              <input 
                type="text" 
                placeholder="Project Name" 
                value={name} 
                onChange={(e) => setName(e.target.value)} 
                required 
              />
            </div>
            <div className="input-group">
              <input 
                type="text" 
                placeholder="Description (Optional)" 
                value={description} 
                onChange={(e) => setDescription(e.target.value)} 
              />
            </div>
            <button type="submit" className="btn">Create Project</button>
          </form>
        </div>

        {/* Project List */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1rem' }}>
          {projects.length === 0 ? (
            <p>No projects yet. Create one above!</p>
          ) : (
            projects.map(project => (
              <div key={project._id} className="card">
                <h3 style={{ marginBottom: '0.5rem' }}>{project.name}</h3>
                <p style={{ color: 'var(--text-muted)', marginBottom: '1rem' }}>{project.description || 'No description'}</p>
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  <Link to={`/project/${project._id}`} style={{ flex: 1 }}>
                    <button className="btn" style={{ width: '100%' }}>View Board</button>
                  </Link>
                  <button className="btn" style={{ background: '#ef4444', padding: '0 1rem' }} onClick={() => handleDeleteProject(project._id)}>Delete</button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {projectToDelete && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 2000 }}>
          <div className="card" style={{ width: '400px', backgroundColor: 'var(--card-bg)' }}>
            <h3 style={{ marginTop: 0 }}>Confirm Delete</h3>
            <p>Are you sure you want to permanently delete this project? This cannot be undone.</p>
            <div style={{ display: 'flex', gap: '1rem', marginTop: '1.5rem', justifyContent: 'flex-end' }}>
              <button className="btn" style={{ background: 'var(--text-muted)' }} onClick={() => setProjectToDelete(null)}>Cancel</button>
              <button className="btn" style={{ background: '#ef4444' }} onClick={confirmDeleteProject}>Delete</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
