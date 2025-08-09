const mongoose = require('mongoose');

const connectDB = ()=>{
    mongoose.connect(process.env.MONGO_DB_URI)
    .then((data)=>{
        console.log(`mongodb connected with server: ${data.connection.host}`)
    })
}
module.exports = connectDB;