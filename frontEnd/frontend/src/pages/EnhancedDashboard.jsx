import { useState, useEffect } from 'react';
import UploadComponent from '../components/UploadComponent';
import axios from 'axios';

export default function EnhancedDashboard() {
  const [activeTab, setActiveTab] = useState('feed');
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      setError(null);
      const response = await axios.get('/api/posts');
      
      if (response.data.success) {
        setPosts(response.data.posts);
      }
    } catch (error) {
      console.error('Error fetching posts:', error);
      setError('Failed to load posts. Please try again.');
    }
    setLoading(false);
  };

  const mockPosts = [
    {
      id: 1,
      title: "Introduction to React Hooks",
      description: "Learn the basics of React Hooks and how to use them effectively in your applications.",
      contentType: "tutorial",
      category: "technology",
      author: { name: "John Doe", role: "tutor" },
      createdAt: new Date().toISOString(),
      likes: 15,
      views: 120
    },
    {
      id: 2,
      title: "Mathematics: Algebra Fundamentals",
      description: "Understanding the core concepts of algebra with practical examples.",
      contentType: "lecture",
      category: "mathematics",
      author: { name: "Jane Smith", role: "tutor" },
      createdAt: new Date().toISOString(),
      likes: 23,
      views: 89
    },
    {
      id: 3,
      title: "How to solve quadratic equations?",
      description: "I'm struggling with quadratic equations. Can someone help?",
      contentType: "qa",
      category: "mathematics",
      author: { name: "Student123", role: "student" },
      createdAt: new Date().toISOString(),
      likes: 8,
      views: 45
    }
  ];

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

  const getCategoryColor = (category) => {
    const colors = {
      technology: 'bg-blue-100 text-blue-800',
      mathematics: 'bg-purple-100 text-purple-800',
      science: 'bg-green-100 text-green-800',
      literature: 'bg-yellow-100 text-yellow-800',
      history: 'bg-red-100 text-red-800',
      other: 'bg-gray-100 text-gray-800'
    };
    return colors[category] || colors.other;
  };

  const getContentTypeColor = (type) => {
    const colors = {
      tutorial: 'bg-emerald-100 text-emerald-800',
      lecture: 'bg-indigo-100 text-indigo-800',
      qa: 'bg-orange-100 text-orange-800',
      post: 'bg-cyan-100 text-cyan-800',
      reel: 'bg-pink-100 text-pink-800'
    };
    return colors[type] || colors.post;
  };

  return (
    <>
      {/* CDN Links */}
      <link href="https://cdn.jsdelivr.net/npm/tailwindcss@2.2.19/dist/tailwind.min.css" rel="stylesheet" />
      <script src="https://cdn.jsdelivr.net/npm/framer-motion@10.16.4/dist/framer-motion.js"></script>
      <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap" rel="stylesheet" />
      
      <div className="min-h-screen bg-gray-50 font-sans" style={{ fontFamily: 'Inter, sans-serif' }}>
        {/* Sticky Header */}
        <header className="sticky top-0 z-50 bg-white shadow-sm border-b border-gray-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16">
              {/* Logo and Brand */}
              <div className="flex items-center">
                <h1 className="text-xl sm:text-2xl font-bold text-gray-900">
                  <span className="text-blue-600">EXIVOX</span>
                  <span className="hidden sm:inline text-gray-600 ml-2 font-normal">Educational Platform</span>
                </h1>
              </div>

              {/* Desktop Navigation */}
              <div className="hidden md:flex items-center space-x-4">
                <span className="text-gray-700">Welcome to EXIVOX!</span>
              </div>

              {/* Mobile Menu Button */}
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="md:hidden p-2 rounded-md text-gray-600 hover:text-gray-900 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                aria-label="Toggle mobile menu"
              >
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  {mobileMenuOpen ? (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  ) : (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                  )}
                </svg>
              </button>
            </div>
          </div>

          {/* Mobile Menu */}
          <div className={`md:hidden transition-all duration-300 ease-in-out ${mobileMenuOpen ? 'max-h-48 opacity-100' : 'max-h-0 opacity-0 overflow-hidden'}`}>
            <div className="px-4 py-3 space-y-3 bg-gray-50 border-t border-gray-200">
              <div className="text-sm text-gray-700">Welcome to EXIVOX!</div>
            </div>
          </div>
        </header>

        {/* Navigation Tabs */}
        <nav className="bg-white border-b border-gray-200 sticky top-16 z-40">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex space-x-1 py-4 overflow-x-auto">
              <button
                onClick={() => setActiveTab('feed')}
                className={`flex items-center px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 whitespace-nowrap ${
                  activeTab === 'feed'
                    ? 'bg-blue-600 text-white shadow-md transform scale-105'
                    : 'text-blue-600 hover:bg-blue-50 hover:scale-105'
                }`}
                aria-label="Content Feed"
              >
                <span className="mr-2">📚</span>
                Content Feed
              </button>
              <button
                onClick={() => setActiveTab('upload')}
                className={`flex items-center px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 whitespace-nowrap ${
                  activeTab === 'upload'
                    ? 'bg-green-600 text-white shadow-md transform scale-105'
                    : 'text-green-600 hover:bg-green-50 hover:scale-105'
                }`}
                aria-label="Upload Content"
              >
                <span className="mr-2">📤</span>
                Upload Content
              </button>
            </div>
          </div>
        </nav>

        {/* Main Content */}
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
          {/* Feed Tab */}
          {activeTab === 'feed' && (
            <div className="transition-opacity duration-300 ease-in-out">
              <div className="mb-6">
                <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">Educational Content Feed</h2>
                <p className="text-gray-600">Discover and explore educational content from our community</p>
              </div>

              {/* Error State */}
              {error && (
                <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
                  <div className="flex items-center">
                    <svg className="h-5 w-5 text-red-400 mr-2" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                    </svg>
                    <span className="text-red-800">{error}</span>
                  </div>
                </div>
              )}

              {/* Loading State */}
              {loading ? (
                <div className="flex justify-center items-center py-12">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
                  <span className="ml-3 text-gray-600">Loading posts...</span>
                </div>
              ) : (
                /* Posts Grid */
                <div className="grid gap-6 sm:gap-8">
                  {(posts.length > 0 ? posts : mockPosts).map((post, index) => (
                    <article
                      key={post._id || post.id}
                      className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-lg hover:scale-[1.02] transition-all duration-300 ease-out"
                      style={{
                        animation: `fadeInUp 0.6s ease-out ${index * 0.1}s both`
                      }}
                    >
                      {/* Post Header */}
                      <div className="p-4 sm:p-6">
                        <div className="flex items-start justify-between mb-4">
                          <div className="flex items-center space-x-3">
                            <div className="text-2xl" role="img" aria-label={`${post.contentType} content`}>
                              {getContentTypeIcon(post.contentType)}
                            </div>
                            <div className="flex-1">
                              <div className="flex flex-wrap items-center gap-2 mb-2">
                                <span className={`px-2 py-1 text-xs font-medium rounded-full ${getContentTypeColor(post.contentType)}`}>
                                  {post.contentType}
                                </span>
                                <span className={`px-2 py-1 text-xs font-medium rounded-full ${getCategoryColor(post.category)}`}>
                                  {post.category}
                                </span>
                              </div>
                              <div className="text-sm text-gray-600">
                                By <span className="font-medium">{post.author?.name || 'Unknown'}</span> • {formatDate(post.createdAt)}
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Post Content */}
                        <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-3 line-clamp-2">
                          {post.title}
                        </h3>
                        <p className="text-gray-700 leading-relaxed mb-4 line-clamp-3">
                          {post.description}
                        </p>

                        {/* Post Actions */}
                        <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                          <div className="flex items-center space-x-4">
                            <button className="flex items-center space-x-1 text-gray-600 hover:text-red-600 transition-colors duration-200 group">
                              <svg className="h-5 w-5 group-hover:scale-110 transition-transform duration-200" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
                              </svg>
                              <span className="text-sm font-medium">{post.likeCount || post.likes || 0}</span>
                            </button>
                            <div className="flex items-center space-x-1 text-gray-600">
                              <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
                                <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                                <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" />
                              </svg>
                              <span className="text-sm font-medium">{post.views || 0}</span>
                            </div>
                          </div>
                          <button className="text-blue-600 hover:text-blue-800 text-sm font-medium hover:underline transition-colors duration-200">
                            View Details
                          </button>
                        </div>
                      </div>
                    </article>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Upload Tab */}
          {activeTab === 'upload' && (
            <div className="transition-opacity duration-300 ease-in-out">
              <div className="max-w-4xl mx-auto">
                <UploadComponent />
              </div>
            </div>
        </main>
      </div>

      {/* Custom Styles */}
      <style jsx>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .line-clamp-2 {
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }

        .line-clamp-3 {
          display: -webkit-box;
          -webkit-line-clamp: 3;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }

        @media (prefers-reduced-motion: reduce) {
          * {
            animation-duration: 0.01ms !important;
            animation-iteration-count: 1 !important;
            transition-duration: 0.01ms !important;
          }
        }

        /* Smooth scrolling */
        html {
          scroll-behavior: smooth;
        }

        /* Custom scrollbar */
        ::-webkit-scrollbar {
          width: 6px;
          height: 6px;
        }

        ::-webkit-scrollbar-track {
          background: #f1f5f9;
        }

        ::-webkit-scrollbar-thumb {
          background: #cbd5e1;
          border-radius: 3px;
        }

        ::-webkit-scrollbar-thumb:hover {
          background: #94a3b8;
        }
      `}</style>
    </>
  );
}