import { useState, useEffect } from 'react';
import UploadComponent from '../components/UploadComponent';
import ContentCard from '../components/ContentCard';
import Button from '../components/Button';
import MobileNav from '../components/MobileNav';
import ProfileView from '../components/ProfileView';
import CommentModal from '../components/CommentModal';
import axios from 'axios';

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState('feed');
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 640);
  const [isTablet, setIsTablet] = useState(window.innerWidth > 640 && window.innerWidth <= 1024);
  const [commentModal, setCommentModal] = useState({ isOpen: false, post: null });

  useEffect(() => {
    fetchPosts();
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 640);
      setIsTablet(window.innerWidth > 640 && window.innerWidth <= 1024);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const fetchPosts = async () => {
    try {
      const response = await axios.get('/api/posts');
      if (response.data.success) {
        setPosts(response.data.posts);
      }
    } catch (error) {
      console.error('Error fetching posts:', error);
      setPosts(mockPosts);
    }
    setLoading(false);
  };

  const handleAddComment = async (postId, comment) => {
    try {
      const response = await axios.post(`/api/posts/${postId}/answer`, { text: comment });
      if (response.data.success) {
        setPosts(prev => prev.map(post => 
          post._id === postId ? response.data.post : post
        ));
      }
    } catch (error) {
      console.error('Error adding comment:', error);
    }
  };

  const mockPosts = [
    {
      _id: '1',
      title: "Introduction to React Hooks",
      description: "Learn the basics of React Hooks and how to use them effectively in your applications.",
      contentType: "tutorial",
      category: "technology",
      author: "John Doe",
      createdAt: new Date().toISOString(),
      likes: ['user1', 'user2'],
      views: 120
    },
    {
      _id: '2',
      title: "Mathematics: Algebra Fundamentals",
      description: "Understanding the core concepts of algebra with practical examples.",
      contentType: "lecture",
      category: "mathematics",
      author: "Jane Smith",
      createdAt: new Date().toISOString(),
      likes: ['user1', 'user3', 'user4'],
      views: 89
    },
    {
      _id: '3',
      title: "How to solve quadratic equations?",
      description: "I'm struggling with quadratic equations. Can someone help?",
      contentType: "qa",
      category: "mathematics",
      author: "Student123",
      createdAt: new Date().toISOString(),
      likes: ['user2'],
      views: 45
    }
  ];



  const styles = {
    container: {
      minHeight: '100vh',
      backgroundColor: '#f9fafb',
      width: '100%'
    },
    header: {
      backgroundColor: '#1f2937',
      color: 'white',
      boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)'
    },
    headerContent: {
      width: '100%',
      padding: isMobile ? '1rem' : '1.5rem 2rem',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      flexDirection: isMobile ? 'column' : 'row',
      gap: isMobile ? '1rem' : '0'
    },
    title: {
      margin: 0,
      fontSize: isMobile ? '1.75rem' : '2rem',
      fontWeight: '700'
    },
    subtitle: {
      fontSize: isMobile ? '0.875rem' : '1rem',
      opacity: 0.9,
      fontWeight: '400'
    },
    nav: {
      backgroundColor: 'white',
      borderBottom: '1px solid #e5e7eb',
      position: 'sticky',
      top: 0,
      zIndex: 40
    },
    navContent: {
      width: '100%',
      padding: '1rem 2rem',
      display: 'flex',
      justifyContent: isMobile ? 'flex-end' : 'flex-start',
      alignItems: 'center'
    },
    navButtons: {
      display: isMobile ? 'none' : 'flex',
      gap: '1rem'
    },
    main: {
      width: '100%',
      padding: isMobile ? '1rem' : '2rem'
    },
    feedTitle: {
      marginBottom: '2rem',
      color: '#1f2937',
      fontSize: isMobile ? '1.5rem' : '1.75rem',
      fontWeight: '600',
      paddingLeft: '2rem'
    },
    loading: {
      textAlign: 'center',
      padding: '4rem 2rem',
      fontSize: '1.125rem',
      color: '#6b7280'
    }
  };

  return (
    <div style={styles.container}>
      <header style={styles.header}>
        <div style={styles.headerContent}>
          <div>
            <h1 style={styles.title}>🎓 EXIVOX</h1>
            <p style={styles.subtitle}>Educational Platform</p>
          </div>
        </div>
      </header>

      <nav style={styles.nav}>
        <div style={styles.navContent}>
          {isMobile ? (
            <MobileNav activeTab={activeTab} setActiveTab={setActiveTab} />
          ) : (
            <div style={styles.navButtons}>
              <Button
                variant="primary"
                size={isTablet ? 'sm' : 'md'}
                active={activeTab === 'feed'}
                onClick={() => setActiveTab('feed')}
              >
                📚 Content Feed
              </Button>
              <Button
                variant="secondary"
                size={isTablet ? 'sm' : 'md'}
                active={activeTab === 'upload'}
                onClick={() => setActiveTab('upload')}
              >
                📤 Upload Content
              </Button>
              {!isMobile && (
                <Button
                  variant="primary"
                  size={isTablet ? 'sm' : 'md'}
                  active={activeTab === 'profile'}
                  onClick={() => setActiveTab('profile')}
                >
                  👤 My Uploads
                </Button>
              )}
            </div>
          )}
        </div>
      </nav>

      <main style={styles.main}>
        {activeTab === 'feed' && (
          <section className="fade-in">
            <h2 style={styles.feedTitle}>Discover Educational Content</h2>
            
            {loading ? (
              <div style={styles.loading} role="status" aria-live="polite">
                Loading amazing content...
              </div>
            ) : (
              <div className="grid" style={{ padding: '0 2rem' }}>
                {(posts && posts.length > 0 ? posts : mockPosts).map(post => (
                  <div key={post._id || post.id}>
                    <ContentCard 
                      post={post} 
                      onComment={() => setCommentModal({ isOpen: true, post })}
                    />
                  </div>
                ))}
              </div>
            )}
          </section>
        )}

        {activeTab === 'upload' && (
          <section className="fade-in" style={{ padding: '0 2rem' }}>
            <UploadComponent />
          </section>
        )}

        {activeTab === 'profile' && (
          <section className="fade-in">
            <ProfileView />
          </section>
        )}
      </main>
      
      <CommentModal 
        post={commentModal.post}
        isOpen={commentModal.isOpen}
        onClose={() => setCommentModal({ isOpen: false, post: null })}
        onAddComment={handleAddComment}
      />
    </div>
  );
}
