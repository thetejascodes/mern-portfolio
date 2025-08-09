const express = require('express');
const router = express.Router();
const {addProject, getProjects, updateProjects, deleteProject} = require('../controllers/projectsController');

router.post("/",addProject);
router.get("/",getProjects);
router.put("/:id",updateProjects);
router.delete("/:id",deleteProject);

module.exports = router;