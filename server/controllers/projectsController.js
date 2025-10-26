const mongoose = require('mongoose');
const express = require('express');
const Project = require('../models/projectsModel');
const path = require('path');


exports.getProjects = async (req, res, next) => {
  try {
    const projects = await Project.find().sort({ createdAt: -1 });
    res.status(200).json(projects);
  } catch (error) {
    console.error('Error fetching projects:', error);
    res.status(500).json({ message: error.message });
  }
};

exports.getProjectById = async (req, res, next) => {
  try {
    const project = await Project.findById(req.params.id);
    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }
    res.status(200).json(project);
  } catch (error) {
    console.error('Error fetching project:', error);
    res.status(500).json({ message: error.message });
  }
};

exports.addProject = async (req, res, next) => {
  try {
    const { title, description, techStack, githubLink, liveLink } = req.body;
    
    if (!title) {
      return res.status(400).json({ message: 'Title is required' });
    }
    
    // Handle image upload
    let imagePath = '';
    if (req.file) {
      imagePath = `/uploads/${req.file.filename}`;
    }
    
    const newProject = new Project({
      title,
      description,
      techStack: techStack ? techStack.split(',').map(tech => tech.trim()).filter(Boolean) : [],
      githubLink,
      liveLink,
      imageUrl: imagePath
    });
    
    const savedProject = await newProject.save();
    res.status(201).json(savedProject);
  } catch (error) {
    console.error('Error adding project:', error);
    res.status(500).json({ message: error.message });
  }
};

exports.updateProjects = async (req, res, next) => {
  try {
    const { title, description, techStack, githubLink, liveLink } = req.body;
    
    // Handle image upload
    let imagePath = '';
    if (req.file) {
      imagePath = `/uploads/${req.file.filename}`;
    }
    
    const updateData = {
      title,
      description,
      techStack: techStack ? techStack.split(',').map(tech => tech.trim()).filter(Boolean) : [],
      githubLink,
      liveLink
    };
    
    if (imagePath) {
      updateData.imageUrl = imagePath;
    }
    
    const updated = await Project.findByIdAndUpdate(req.params.id, updateData, {
      new: true,
    });

    if (!updated) {
      return res.status(404).json({ message: 'Project not found' });
    }

    res.status(200).json(updated);
  } catch (error) {
    console.error('Error updating project:', error);
    res.status(500).json({ message: error.message });
  }
};

exports.deleteProject = async (req, res, next) => {
  try {
    const deleted = await Project.findByIdAndDelete(req.params.id);

    if (!deleted) {
      return res.status(404).json({ message: 'Project not found' });
    }

    res.status(200).json({ message: 'Project deleted successfully' });
  } catch (error) {
    console.error('Error deleting project:', error);
    res.status(500).json({ message: error.message });
  }
};
