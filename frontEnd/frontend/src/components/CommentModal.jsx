import { useState } from 'react';
import Button from './Button';

export default function CommentModal({ post, isOpen, onClose, onAddComment }) {
  const [comment, setComment] = useState('');

  const handleSubmit = () => {
    if (comment.trim()) {
      onAddComment(post._id, comment.trim());
      setComment('');
      onClose();
    }
  };

  if (!isOpen) return null;

  const styles = {
    overlay: {
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1000
    },
    modal: {
      backgroundColor: 'white',
      borderRadius: '12px',
      padding: '2rem',
      maxWidth: '500px',
      width: '90%',
      maxHeight: '80vh',
      overflow: 'auto'
    },
    title: {
      fontSize: '1.25rem',
      fontWeight: '600',
      marginBottom: '1rem',
      color: '#1f2937'
    },
    textarea: {
      width: '100%',
      minHeight: '100px',
      padding: '0.75rem',
      border: '2px solid #e5e7eb',
      borderRadius: '8px',
      fontSize: '1rem',
      marginBottom: '1rem',
      resize: 'vertical'
    },
    buttons: {
      display: 'flex',
      gap: '0.5rem',
      justifyContent: 'flex-end'
    }
  };

  return (
    <div style={styles.overlay} onClick={onClose}>
      <div style={styles.modal} onClick={(e) => e.stopPropagation()}>
        <h3 style={styles.title}>Add Comment</h3>
        <p><strong>Question:</strong> {post.title}</p>
        <textarea
          style={styles.textarea}
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          placeholder="Write your answer or comment..."
        />
        <div style={styles.buttons}>
          <Button variant="secondary" onClick={onClose}>Cancel</Button>
          <Button onClick={handleSubmit}>Add Comment</Button>
        </div>
      </div>
    </div>
  );
}