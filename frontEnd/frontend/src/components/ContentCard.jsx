export default function ContentCard({ post, onComment }) {
  const getContentTypeIcon = (type) => {
    const icons = {
      post: '📝',
      reel: '🎬',
      qa: '❓',
      tutorial: '📚',
      lecture: '🎓'
    };
    return icons[type] || '📄';
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const styles = {
    card: {
      border: '1px solid #e5e7eb',
      borderRadius: '12px',
      padding: '1.5rem',
      backgroundColor: '#ffffff',
      boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
      transition: 'box-shadow 0.2s ease, transform 0.2s ease',
      cursor: 'pointer',
      height: 'fit-content'
    },
    header: {
      display: 'flex',
      alignItems: 'flex-start',
      marginBottom: '1rem',
      gap: '0.75rem'
    },
    icon: {
      fontSize: '2rem',
      flexShrink: 0
    },
    meta: {
      flex: 1,
      minWidth: 0
    },
    tags: {
      display: 'flex',
      gap: '0.5rem',
      marginBottom: '0.5rem',
      flexWrap: 'wrap'
    },
    tag: (bgColor, textColor) => ({
      fontSize: '0.75rem',
      backgroundColor: bgColor,
      color: textColor,
      padding: '0.25rem 0.75rem',
      borderRadius: '20px',
      fontWeight: '600',
      whiteSpace: 'nowrap'
    }),
    author: {
      fontSize: '0.875rem',
      color: '#64748b',
      fontWeight: '500'
    },
    title: {
      margin: '0 0 0.75rem 0',
      color: '#1a202c',
      fontSize: '1.25rem',
      fontWeight: '700',
      lineHeight: '1.4'
    },
    description: {
      margin: '0 0 1rem 0',
      color: '#4a5568',
      lineHeight: '1.6',
      fontSize: '1rem'
    },
    actions: {
      display: 'flex',
      alignItems: 'center',
      gap: '1.5rem',
      paddingTop: '1rem',
      borderTop: '1px solid #e2e8f0'
    },
    actionItem: {
      color: '#64748b',
      fontSize: '0.875rem',
      fontWeight: '600',
      display: 'flex',
      alignItems: 'center',
      gap: '0.25rem'
    }
  };

  return (
    <div 
      style={styles.card}
      onMouseOver={(e) => {
        e.currentTarget.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.15)';
        e.currentTarget.style.transform = 'translateY(-2px)';
      }}
      onMouseOut={(e) => {
        e.currentTarget.style.boxShadow = '0 1px 3px rgba(0, 0, 0, 0.1)';
        e.currentTarget.style.transform = 'translateY(0)';
      }}
    >
      <div style={styles.header}>
        <div style={styles.icon}>
          {getContentTypeIcon(post.contentType)}
        </div>
        <div style={styles.meta}>
          <div style={styles.tags}>
            <span style={styles.tag('#dbeafe', '#1e40af')}>
              {post.contentType}
            </span>
            <span style={styles.tag('#f3e8ff', '#7c3aed')}>
              {post.category}
            </span>
          </div>
          <div style={styles.author}>
            By {post.author || 'Anonymous'} • {formatDate(post.createdAt)}
          </div>
        </div>
      </div>

      <h3 style={styles.title}>{post.title}</h3>
      <p style={styles.description}>{post.description}</p>
      
      {post.contentType === 'qa' && (
        <div style={{
          backgroundColor: '#f0f9ff',
          border: '1px solid #bae6fd',
          borderRadius: '8px',
          padding: '1rem',
          marginBottom: '1rem'
        }}>
          <strong>Question:</strong> {post.question || post.title}
          {post.answers && post.answers.length > 0 && (
            <div style={{ marginTop: '0.5rem', fontSize: '0.875rem', color: '#6b7280' }}>
              {post.answers.length} answer{post.answers.length !== 1 ? 's' : ''}
            </div>
          )}
        </div>
      )}
      
      {post.mediaUrl && post.mediaType === 'video' && (
        <video 
          controls 
          style={{ width: '100%', maxHeight: '300px', borderRadius: '8px', marginBottom: '1rem' }}
          src={post.mediaUrl}
        >
          Your browser does not support the video tag.
        </video>
      )}
      
      {/* Single image */}
      {post.mediaUrl && post.mediaType === 'image' && (
        <div style={{ marginBottom: '1rem' }}>
          <img 
            src={post.mediaUrl} 
            alt={post.title}
            style={{ 
              width: '100%', 
              maxHeight: '300px', 
              objectFit: 'cover', 
              borderRadius: '8px',
              display: 'block',
              backgroundColor: '#f3f4f6'
            }}
            onLoad={(e) => {
              e.target.style.backgroundColor = 'transparent';
            }}
            onError={(e) => {
              e.target.style.display = 'none';
            }}
          />
        </div>
      )}
      
      {/* Multiple images */}
      {post.mediaUrls && post.mediaType === 'images' && (
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
          gap: '0.5rem',
          marginBottom: '1rem'
        }}>
          {post.mediaUrls.map((url, index) => (
            <img 
              key={index}
              src={url} 
              alt={`${post.title} ${index + 1}`}
              style={{ 
                width: '100%', 
                height: '150px', 
                objectFit: 'cover', 
                borderRadius: '8px',
                backgroundColor: '#f3f4f6'
              }}
              onError={(e) => {
                e.target.style.display = 'none';
              }}
            />
          ))}
        </div>
      )}

      <div style={styles.actions}>
        <div style={styles.actionItem}>
          ❤️ {post.likes?.length || 0}
        </div>
        <div style={styles.actionItem}>
          👁️ {post.views || 0}
        </div>
        {post.contentType === 'qa' && (
          <button 
            style={{
              ...styles.actionItem,
              backgroundColor: '#3b82f6',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              padding: '0.5rem 1rem',
              cursor: 'pointer'
            }}
            onClick={() => onComment && onComment(post)}
          >
            💬 Comment
          </button>
        )}
      </div>
    </div>
  );
}