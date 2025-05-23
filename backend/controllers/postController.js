const Post = require('../models/Post');
const User = require('../models/User');

// Create a new post (only for logged-in users)
exports.create = async (req, res) => {
  try {
    const { title, content } = req.body;
    const userId = req.user.id;

    const newPost = await Post.create({ title, content, userId });
    
    // Fetch post with user data
    const postWithUser = await Post.findByPk(newPost.id, {
      include: [{ model: User, as: 'user' }]
    });

    res.status(201).json({
      message: 'Post created successfully!',
      post: postWithUser
    });
  } catch (error) {
    res.status(500).json({ message: 'Error creating post', error: error.message });
  }
};

// Edit a post (only owner)
exports.edit = async (req, res) => {
  try {
    const postId = req.params.id;
    const { title, content } = req.body;
    const userId = req.user.id;

    const post = await Post.findByPk(postId);
    if (!post) return res.status(404).json({ message: 'Post not found' });
    if (post.userId !== userId) return res.status(403).json({ message: 'Unauthorized' });

    post.title = title;
    post.content = content;
    await post.save();

    const updatedPost = await Post.findByPk(postId, {
      include: [{ model: User, as: 'user' }]
    });

    res.json({
      message: 'Post updated successfully!',
      post: updatedPost
    });
  } catch (error) {
    res.status(500).json({ message: 'Error editing post', error: error.message });
  }
};

// Delete a post (only owner)
exports.delete = async (req, res) => {
  try {
    const postId = req.params.id;
    const userId = req.user.id;

    const post = await Post.findByPk(postId);
    if (!post) return res.status(404).json({ message: 'Post not found' });
    if (post.userId !== userId) return res.status(403).json({ message: 'Unauthorized' });

    await post.destroy();
    res.json({ message: 'Post deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting post', error: error.message });
  }
};

// Get all posts (public)
exports.getAll = async (req, res) => {
  try {
    const posts = await Post.findAll({
      include: [{ model: User, as: 'user' }],
      order: [['createdAt', 'DESC']]
    });
    res.json(posts);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching posts', error: error.message });
  }
};

// Get single post by id (public)
exports.get = async (req, res) => {
  try {
    const post = await Post.findByPk(req.params.id, { 
      include: [{ model: User, as: 'user' }] 
    });
    if (!post) return res.status(404).json({ message: 'Post not found' });
    res.json(post);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching post', error: error.message });
  }
};

// Get user's posts
exports.getUserPosts = async (req, res) => {
  try {
    const userId = req.user.id;
    const posts = await Post.findAll({
      where: { userId },
      include: [{ model: User, as: 'user' }],
      order: [['createdAt', 'DESC']]
    });
    res.json(posts);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching user posts', error: error.message });
  }
};