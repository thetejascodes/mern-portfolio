const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const app = express();
const projectRoutes = require('./routes/projectRoute');



app.use(express.json());
app.use(bodyParser.urlencoded({extended:true}));

app.use("/api/projects",projectRoutes);


module.exports = app;