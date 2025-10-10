const express = require('express');
const router = express.Router();
const { addBlog, getBlogs, updateBlogs, deleteBlog , getBlogById } = require('../controllers/blogController');
const { protect, authorizeRoles } = require('../middleware/authMiddleware');

router.post("/",protect,authorizeRoles('admin'),addBlog);
router.get("/",protect,getBlogs);
router.get("/:id",protect,getBlogById);
router.put("/:id",protect,authorizeRoles('admin'),updateBlogs);
router.delete("/:id",protect,authorizeRoles('admin'),deleteBlog);

module.exports = router;
