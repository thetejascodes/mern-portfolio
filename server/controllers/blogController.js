const mongoose = require('mongoose');
const Blog  = require('../models/blogModel');
const path = require('path'); 

exports.addBlog = async (req, res,next) => {
    try {
        const { title, content, author, tags } = req.body;
        if (!title || !content) {
            return res.status(400).json({ message: 'Title and content are required' });
        }
        
        // Handle image upload
        let imagePath = '';
        if (req.file) {
            imagePath = `/uploads/${req.file.filename}`;
        }
        
        const newBlog = new Blog({ 
            title, 
            content, 
            image: imagePath, 
            author, 
            tags 
        });
        const savedBlog = await newBlog.save();
        console.log('Blog saved with image path:', savedBlog.image);
        res.status(201).json(savedBlog);
    } catch (error) {
        console.error('Error adding blog:', error);
        res.status(500).json({ message: error.message });
    }
};

exports.getBlogs = async (req, res) => {
    try {
        const blogs = await Blog.find().sort({ createdAt: -1 });
        res.status(200).json(blogs);
    } catch (error) {
        console.error('Error fetching blogs:', error);
        res.status(500);
        throw new Error(error.message);
    }
};

exports.getBlogById = async (req, res, next) => {
    try {
      const blog = await Blog.findById(req.params.id);
      if (!blog) {
        return res.status(404).json({ message: 'Blog not found' });
      }
      console.log('Fetching blog with image path:', blog.image);
      return res.status(200).json(blog);
    } catch (error) {
      console.error('Error fetching blog:', error);
      return res.status(500).json({ message: error.message });
    }
  };
exports.updateBlogs = async (req, res) => {
    try {
        const { title, content, author, tags } = req.body;
        
        // Handle image upload
        let imagePath = '';
        if (req.file) {
            imagePath = `/uploads/${req.file.filename}`;
        }
        
        const allowedUpdates = { title, content, author, tags };
        if (imagePath) {
            allowedUpdates.image = imagePath;
        }
        
        const updated = await Blog.findByIdAndUpdate(req.params.id, allowedUpdates, { new: true });
        if (!updated) {
            return res.status(404).json({ message: 'Blog not found' });
        }
        res.status(200).json(updated);
    } catch (error) {
        console.error('Error updating blog:', error);
        res.status(500).json({ message: error.message });
    }
};

exports.deleteBlog = async (req, res) => {
    try {
        const deleted = await Blog.findByIdAndDelete(req.params.id);
        if (!deleted) {
            return res.status(404);
            throw new Error('Blog not found');
        }
        res.status(200).json({ message: 'Blog deleted successfully' });
    } catch (error) {
        console.error('Error deleting blog:', error);
        res.status(500);
        throw new Error(error.message);
    }
};
