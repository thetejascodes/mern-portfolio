const dotenv = require('dotenv').config({path:'./config/.env'});
const express = require('express');
const app = require('./app');
const connectDB = require('./config/db');


connectDB();
const PORT = process.env.PORT || 3000;



app.get('/',(req,res)=>{
    res.send("Hello Server Is Running");
})

app.listen(PORT,()=>{
    console.log(`🚀 Server running on port ${PORT}`);
    console.log('🌍 NODE_ENV:', process.env.NODE_ENV);
})