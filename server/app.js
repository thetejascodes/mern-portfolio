const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const app = express();
const projectRoutes = require('./routes/projectRoute');
const blogRoutes = require('./routes/blogRoutes')

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api/projects",projectRoutes);
app.use("/api/blogs",blogRoutes);



module.exports = app;