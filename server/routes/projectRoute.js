const express = require('express');
const router = express.Router();
const {addProject, getProjects, updateProjects, deleteProject, getProjectById} = require('../controllers/projectsController');
const { protect, authorizeRoles } = require('../middleware/authMiddleware');
const upload = require('../middleware/uploadMiddleware');

router.post("/",protect,authorizeRoles('admin'),upload.single('image'),addProject);
router.get("/",getProjects);
router.get("/:id",getProjectById);
router.put("/:id",protect,authorizeRoles('admin'),upload.single('image'),updateProjects);
router.delete("/:id",protect,authorizeRoles('admin'),deleteProject);

module.exports = router;