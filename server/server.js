const express = require('express');
const app = require('./app');
const dotenv = require('dotenv').config({path:'./config/.env'});
const connectDB = require('./config/db');

connectDB();
const PORT = process.env.PORT || 3000;
app.listen(PORT,()=>{
    console.log(`Server is running on port ${PORT}`);
})
app.get('/',(req,res)=>{
    res.send("Hello Server Is Running");
})