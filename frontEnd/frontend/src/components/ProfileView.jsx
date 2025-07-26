import { useState, useEffect } from 'react';
import ContentCard from './ContentCard';
import Button from './Button';
import axios from 'axios';

export default function ProfileView() {
  const [userPosts, setUserPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingPost, setEditingPost] = useState(null);
  const [editForm, setEditForm] = useState({ title: '', description: '' });

  useEffect(() => {
    fetchUserPosts();
  }, []);

  const fetchUserPosts = async () => {
    try {
      const response = await axios.get('/api/posts');
      if (response.data.success && response.data.posts) {
        setUserPosts(response.data.posts);
      } else {
        setUserPosts([]);
      }
    } catch (error) {
      console.error('Error fetching posts:', error);
      setUserPosts([]);
    }
    setLoading(false);
  };

  const handleEdit = (post) => {
    setEditingPost(post._id || post.id);
    setEditForm({ title: post.title || '', description: post.description || '' });
  };

  const handleUpdate = async (postId) => {
    try {
      const response = await axios.put(`/api/posts/${postId}`, editForm);
      if (response.data.success) {
        setUserPosts(prev => prev.map(post => 
          (post._id || post.id) === postId ? { ...post, ...editForm } : post
        ));
        setEditingPost(null);
      }
    } catch (error) {
      console.error('Error updating post:', error);
      alert('Failed to update post');
    }
  };

  const handleDelete = async (postId) => {
    if (window.confirm('Are you sure you want to delete this post?')) {
      try {
        const response = await axios.delete(`/api/posts/${postId}`);
        if (response.data.success) {
          setUserPosts(prev => prev.filter(post => (post._id || post.id) !== postId));
        }
      } catch (error) {
        console.error('Error deleting post:', error);
        alert('Failed to delete post');
      }
    }
  };

  const styles = {
    container: {
      padding: '2rem'
    },
    title: {
      fontSize: '1.75rem',
      fontWeight: '600',
      color: '#1f2937',
      marginBottom: '2rem'
    },
    editForm: {
      padding: '1rem',
      backgroundColor: '#f9fafb',
      borderRadius: '8px',
      marginBottom: '1rem'
    },
    input: {
      width: '100%',
      padding: '0.5rem',
      border: '1px solid #d1d5db',
      borderRadius: '4px',
      marginBottom: '0.5rem'
    },
    textarea: {
      width: '100%',
      padding: '0.5rem',
      border: '1px solid #d1d5db',
      borderRadius: '4px',
      minHeight: '80px',
      marginBottom: '0.5rem'
    },
    actions: {
      display: 'flex',
      gap: '0.5rem',
      marginTop: '1rem'
    },
    postActions: {
      display: 'flex',
      gap: '0.5rem',
      marginTop: '1rem',
      padding: '1rem',
      backgroundColor: '#f9fafb',
      borderRadius: '8px'
    }
  };

  if (loading) {
    return <div style={styles.container}>Loading your uploads...</div>;
  }

  return (
    <div style={styles.container}>
      <h2 style={styles.title}>My Uploads ({userPosts.length})</h2>
      
      {userPosts.length === 0 ? (
        <p>No uploads yet. Start sharing your content!</p>
      ) : (
        <div className="grid">
          {userPosts.map(post => (
            <div key={post._id || post.id}>
              {editingPost === (post._id || post.id) ? (
                <div style={styles.editForm}>
                  <input
                    style={styles.input}
                    value={editForm.title}
                    onChange={(e) => setEditForm(prev => ({ ...prev, title: e.target.value }))}
                    placeholder="Title"
                  />
                  <textarea
                    style={styles.textarea}
                    value={editForm.description}
                    onChange={(e) => setEditForm(prev => ({ ...prev, description: e.target.value }))}
                    placeholder="Description"
                  />
                  <div style={styles.actions}>
                    <Button size="sm" onClick={() => handleUpdate(post._id || post.id)}>Save</Button>
                    <Button size="sm" variant="secondary" onClick={() => setEditingPost(null)}>Cancel</Button>
                  </div>
                </div>
              ) : (
                <>
                  <ContentCard post={post} onComment={() => {}} />
                  <div style={styles.postActions}>
                    <Button size="sm" onClick={() => handleEdit(post)}>✏️ Edit</Button>
                    <Button size="sm" variant="secondary" onClick={() => handleDelete(post._id || post.id)}>🗑️ Delete</Button>
                  </div>
                </>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}