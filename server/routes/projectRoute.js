const express = require('express');
const router = express.Router();
const {addProject, getProjects, updateProjects, deleteProject} = require('../controllers/projectsController');
const { protect, authorizeRoles } = require('../middleware/authMiddleware');

router.post("/",protect,authorizeRoles('admin'),addProject);
router.get("/",getProjects);
router.put("/:id",protect,authorizeRoles('admin'),updateProjects);
router.delete("/:id",protect,authorizeRoles('admin'),deleteProject);

module.exports = router;