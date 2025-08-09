const express = require('express');
const mongoose = require('mongoose');

const projectSchema = mongoose.Schema({
    title:{
        type:String,
        required:true,
    },
    description:String,
    techStack:[String],
    githubLink:String,
    liveLink:String,
    imageUrl:String,
    createdAt:{
        type:Date,
        default:Date.now
    }
})
const Project =    mongoose.model('Project',projectSchema);
module.exports = Project;