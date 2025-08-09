const mongoose = require("mongoose");
const Blog = require('../models/blogModel');

exports.addBlog = async (req, res) => {
    try {
        const newBlog = new Blog(req.body);
        const savedBlog = await newBlog.save();
        res.status(201).json(savedBlog);
    } catch (error) {
        console.error('Error adding blog:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
}

exports.getBlogs = async (req, res) => {
    try {
        const newBlog = await Blog.find();
        res.status(200).json(newBlog);
    } catch (error) {
        console.error('Error fetching blogs:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
}

exports.updateBlogs = async (req, res) => {
    try {
        const updated = await Blog.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.status(200).json(updated);
    } catch (error) {
        console.error('Error updating blog:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
}

exports.deleteBlog = async (req, res) => {
    try {
            const deleted = await Blog.findByIdAndDelete(req.params.id);
     if (!deleted) {
        return res.status(404).json({ message: 'Blog not found' });
    }
    res.json({ message: 'Blog deleted successfully' });
    } catch (error) {
        console.error('Error deleting blog:',error);
        res.status(500).json({ message: 'Internal server error' });
    }
}