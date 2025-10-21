const express = require('express');
const router = express.Router();
const { addBlog, getBlogs, updateBlogs, deleteBlog , getBlogById } = require('../controllers/blogController');
const { protect, authorizeRoles } = require('../middleware/authMiddleware');
const upload = require('../middleware/uploadMiddleware');

router.post("/",protect,authorizeRoles('admin'),upload.single('image'),addBlog);
router.get("/",protect,getBlogs);
router.get("/:id",protect,getBlogById);
router.put("/:id",protect,authorizeRoles('admin'),upload.single('image'),updateBlogs);
router.delete("/:id",protect,authorizeRoles('admin'),deleteBlog);

module.exports = router;
