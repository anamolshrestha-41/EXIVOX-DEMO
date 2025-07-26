import express from 'express';
import multer from 'multer';
import Post from '../models/Post.js';

const router = express.Router();

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: 'uploads/',
  filename: (req, file, cb) => {
    cb(null, Date.now() + '-' + file.originalname);
  }
});

const upload = multer({ 
  storage,
  limits: { fileSize: 100 * 1024 * 1024 }
});

// Mock data fallback
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
    views: 120,
    mediaUrl: 'https://www.w3schools.com/html/mov_bbb.mp4',
    mediaType: 'video'
  },
  {
    _id: '2',
    title: "Mathematics: Algebra Fundamentals",
    description: "Understanding the core concepts of algebra with practical examples.",
    contentType: "post",
    category: "mathematics",
    author: "Jane Smith",
    createdAt: new Date().toISOString(),
    likes: ['user1', 'user3', 'user4'],
    views: 89,
    mediaUrl: 'https://images.unsplash.com/photo-1635070041078-e363dbe005cb?w=400&h=300&fit=crop',
    mediaType: 'image'
  }
];

// Get all posts
router.get('/', async (req, res) => {
  try {
    const posts = await Post.find().sort({ createdAt: -1 });
    console.log(`📊 Found ${posts.length} posts in database`);
    
    res.json({
      success: true,
      posts: posts.length > 0 ? posts : mockPosts
    });
  } catch (error) {
    console.error('❌ Database error:', error.message);
    res.json({
      success: true,
      posts: mockPosts
    });
  }
});

// Create post with MongoDB save
router.post('/create', upload.array('media', 10), async (req, res) => {
  try {
    console.log('📝 Creating new post:', req.body.title);
    
    const postData = {
      title: req.body.title || 'Untitled',
      description: req.body.description || 'No description',
      contentType: req.body.contentType || 'post',
      category: req.body.category || 'other',
      author: 'Anonymous'
    };
    
    // Add media if uploaded
    if (req.files && req.files.length > 0) {
      console.log(`📎 Processing ${req.files.length} files`);
      if (req.files.length === 1) {
        postData.mediaUrl = `http://localhost:5000/uploads/${req.files[0].filename}`;
        postData.mediaType = req.files[0].mimetype.startsWith('video') ? 'video' : 'image';
      } else {
        postData.mediaUrls = req.files.map(file => `http://localhost:5000/uploads/${file.filename}`);
        postData.mediaType = 'images';
      }
    }
    
    if (req.body.contentType === 'qa') {
      postData.answers = [];
    }
    
    // Save to MongoDB
    const post = await Post.create(postData);
    console.log('✅ Post saved to database:', post._id);
    
    res.json({ success: true, post });
  } catch (error) {
    console.error('❌ Save error:', error.message);
    res.status(500).json({ success: false, message: 'Failed to save post' });
  }
});

// Add answer
router.post('/:id/answer', async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (post) {
      if (!post.answers) post.answers = [];
      post.answers.push({
        text: req.body.text,
        author: 'Anonymous',
        createdAt: new Date()
      });
      await post.save();
      res.json({ success: true, post });
    } else {
      res.status(404).json({ success: false, message: 'Post not found' });
    }
  } catch (error) {
    console.error('❌ Answer error:', error.message);
    res.status(500).json({ success: false, message: 'Failed to add answer' });
  }
});

export default router;