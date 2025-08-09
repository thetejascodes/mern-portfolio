const express = require('express');
const router = express.Router();
const { addBlog, getBlogs, updateBlogs, deleteBlog } = require('../controllers/blogController');

router.post("/",addBlog);
router.get("/",getBlogs);
router.put("/:id",updateBlogs);
router.delete("/:id",deleteBlog);

module.exports = router;
