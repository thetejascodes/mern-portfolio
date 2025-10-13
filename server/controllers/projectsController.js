const mongoose = require('mongoose');
const express = require('express');
const Project = require('../models/projectsModel');


exports.getProjects = async (req, res, next) => {
  try {
    const projects = await Project.find().sort({ createdAt: -1 });
    res.status(200).json(projects);
  } catch (error) {
    throw new Error('Error fetching projects');
  }
};

exports.addProject = async (req, res, next) => {
  try {
    const newProject = new Project(req.body);
    const savedProject = await newProject.save();
    res.status(201).json(savedProject);
  } catch (error) {
    throw new Error('Error adding project');
  }
};

exports.updateProjects = async (req, res, next) => {
  try {
    const updated = await Project.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });

    if (!updated) {
      throw new Error('Project not found');
    }

    res.status(200).json(updated);
  } catch (error) {
    throw new Error('Error updating project');
  }
};

exports.deleteProject = async (req, res, next) => {
  try {
    const deleted = await Project.findByIdAndDelete(req.params.id);

    if (!deleted) {
      throw new Error('Project not found');
    }

    res.json({ message: 'Project deleted successfully' });
  } catch (error) {
    throw new Error('Error deleting project');
  }
};
