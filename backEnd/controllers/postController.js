import Post from '../models/Post.js';

// Get all posts with filtering
export const getPosts = async (req, res) => {
  try {
    const { 
      contentType, 
      category, 
      difficulty, 
      author, 
      search, 
      page = 1, 
      limit = 10 
    } = req.query;
    
    // Build filter object
    const filter = {};
    
    if (contentType) filter.contentType = contentType;
    if (category) filter.category = category;
    if (difficulty) filter.difficulty = difficulty;
    if (author) filter.author = author;
    
    // Search functionality
    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ];
    }
    
    const skip = (page - 1) * limit;
    
    const posts = await Post.find(filter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit))
      .lean();
    
    const total = await Post.countDocuments(filter);
    
    res.status(200).json({
      success: true,
      posts: posts || [],
      pagination: {
        current: parseInt(page),
        total: Math.ceil(total / limit),
        count: posts.length,
        totalPosts: total
      }
    });
  } catch (error) {
    console.error('Get posts error:', error);
    
    // Return empty array on error
    res.status(200).json({
      success: true,
      posts: [],
      pagination: {
        current: 1,
        total: 0,
        count: 0,
        totalPosts: 0
      }
    });
  }
};

// Get single post
export const getPost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    
    if (!post) {
      return res.status(404).json({
        success: false,
        message: 'Post not found'
      });
    }
    
    // Increment view count
    post.views += 1;
    await post.save();
    
    res.status(200).json({
      success: true,
      post
    });
  } catch (error) {
    console.error('Get post error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch post',
      error: error.message
    });
  }
};

// Create post
export const createPost = async (req, res) => {
  try {
    const { 
      title, 
      description, 
      contentType = 'post',
      tags, 
      category = 'other',
      difficulty = 'beginner',
      question // for Q&A posts
    } = req.body;
    
    // Validate required fields
    if (!title?.trim()) {
      return res.status(400).json({
        success: false,
        message: 'Title is required'
      });
    }
    
    // For Q&A posts, question is required
    if (contentType === 'qa' && !question?.trim()) {
      return res.status(400).json({
        success: false,
        message: 'Question is required for Q&A posts'
      });
    }
    
    // Process tags
    const processedTags = tags ? 
      tags.split(',').map(tag => tag.trim().toLowerCase()).filter(tag => tag) : 
      [];
    
    // Create post data
    const postData = {
      title: title.trim(),
      description: description?.trim() || '',
      contentType,
      tags: processedTags,
      category,
      difficulty,
      moderationResult: req.moderationResult || { approved: true }
    };
    
    // Add Q&A specific fields
    if (contentType === 'qa') {
      postData.question = question.trim();
    }
    
    // Add media information if file was uploaded
    if (req.file) {
      postData.mediaUrl = req.file.path;
      postData.mediaType = req.file.mimetype.startsWith('video') ? 'video' : 
                          req.file.mimetype.startsWith('image') ? 'image' :
                          req.file.mimetype.startsWith('audio') ? 'audio' : 'document';
      postData.fileSize = req.file.size;
    }
    
    const post = await Post.create(postData);
    
    res.status(201).json({
      success: true,
      message: 'Content uploaded successfully',
      post
    });
  } catch (error) {
    console.error('Create post error:', error);
    
    if (error.name === 'ValidationError') {
      const errors = {};
      Object.keys(error.errors).forEach(key => {
        errors[key] = error.errors[key].message;
      });
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors
      });
    }
    
    res.status(500).json({
      success: false,
      message: 'Failed to create post'
    });
  }
};

// Update post
export const updatePost = async (req, res) => {
  try {
    const { title, description, tags, category, difficulty } = req.body;
    
    const post = await Post.findById(req.params.id);
    if (!post) {
      return res.status(404).json({ success: false, message: 'Post not found' });
    }
    
    if (title) post.title = title.trim();
    if (description) post.description = description.trim();
    if (tags) post.tags = tags.split(',').map(tag => tag.trim().toLowerCase()).filter(tag => tag);
    if (category) post.category = category;
    if (difficulty) post.difficulty = difficulty;
    
    await post.save();
    
    res.status(200).json({ success: true, message: 'Post updated successfully', post });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to update post' });
  }
};

// Delete post
export const deletePost = async (req, res) => {
  try {
    const post = await Post.findByIdAndDelete(req.params.id);
    if (!post) {
      return res.status(404).json({ success: false, message: 'Post not found' });
    }
    res.status(200).json({ success: true, message: 'Post deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to delete post' });
  }
};

// Like/Unlike post
export const toggleLike = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    
    if (!post) {
      return res.status(404).json({
        success: false,
        message: 'Post not found'
      });
    }
    
    // For demo purposes, use a default user ID or generate one
    const userId = 'anonymous-user';
    const isLiked = post.likes.includes(userId);
    
    if (isLiked) {
      post.likes = post.likes.filter(id => id.toString() !== userId);
    } else {
      post.likes.push(userId);
    }
    
    await post.save();
    
    res.status(200).json({
      success: true,
      message: isLiked ? 'Post unliked' : 'Post liked',
      likeCount: post.likes.length,
      isLiked: !isLiked
    });
  } catch (error) {
    console.error('Toggle like error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to toggle like'
    });
  }
};

// Add answer to Q&A post
export const addAnswer = async (req, res) => {
  try {
    const { text } = req.body;
    
    if (!text?.trim()) {
      return res.status(400).json({
        success: false,
        message: 'Answer text is required'
      });
    }
    
    const post = await Post.findById(req.params.id);
    
    if (!post) {
      return res.status(404).json({
        success: false,
        message: 'Post not found'
      });
    }
    
    if (post.contentType !== 'qa') {
      return res.status(400).json({
        success: false,
        message: 'Can only add answers to Q&A posts'
      });
    }
    
    const answer = {
      text: text.trim(),
      author: 'anonymous-user',
      createdAt: new Date()
    };
    
    post.answers.push(answer);
    await post.save();
    
    const updatedPost = await Post.findById(post._id);
    
    res.status(201).json({
      success: true,
      message: 'Answer added successfully',
      post: updatedPost
    });
  } catch (error) {
    console.error('Add answer error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to add answer'
    });
  }
};