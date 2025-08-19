const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const app = express();
const projectRoutes = require('./routes/projectRoute');
const blogRoutes = require('./routes/blogRoutes');
const contactRoutes = require('./routes/contactRoute');

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api/projects",projectRoutes);
app.use("/api/blogs",blogRoutes);
app.use("/api/contacts",contactRoutes)




module.exports = app;