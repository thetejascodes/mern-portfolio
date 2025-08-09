const mongoose = require('mongoose');
const express = require('express');
const Project = require('../models/projectsModel');



exports.getProjects = async (req, res) => {
    try {
        const newProject = Project.find().sort({ createdAt: -1 });
        const projects = await newProject;
        res.status(201).json(projects);
    } catch (error) {
        console.error('Error adding project:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
}



exports.addProject = async (req, res) => {
    try {
        const newProject = new Project(req.body);
        const savedProject = await newProject.save();
        res.status(201).json(savedProject);
    }
    catch (error) {
        console.error('Error adding project:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
}
exports.updateProjects = async (req,res) =>{
    try {
        const updated = await Project.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.json(updated);  
    } catch (error) {
        console.error('Error updating project:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
}

exports.deleteProject = async (req,res) =>{
try {
        const deleted = await Project.findByIdAndDelete(req.params.id);
    if (!deleted) {
        return res.status(404).json({ message: 'Project not found' });
    }
    res.json({ message: 'Project deleted successfully' });
} catch (error) {
    
    console.error('Error deleting project:', error);
    res.status(500).json({ message: 'Internal server error' });
}
}
