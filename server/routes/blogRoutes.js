const express = require('express');
const router = express.Router();
const { addBlog, getBlogs, updateBlogs, deleteBlog , getBlogById } = require('../controllers/blogController');

router.post("/",addBlog);
router.get("/",getBlogs);
router.get("/:id", getBlogById);
router.put("/:id",updateBlogs);
router.delete("/:id",deleteBlog);

module.exports = router;
