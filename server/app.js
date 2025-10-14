const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const morgan = require('morgan');

const authRoutes = require('./routes/authRoutes');
const projectRoutes = require('./routes/projectRoute');
const blogRoutes = require('./routes/blogRoutes');
const contactRoutes = require('./routes/contactRoute');
const {protect} = require('./middleware/authMiddleware'); 
const errorHandler = require('./middleware/errorHandler');

const app = express();

app.use(helmet()); 
app.use(
  cors({
    origin: 'http://localhost:5173', 
    credentials: true, 
  })
);
app.use(cookieParser());

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, 
  max: 100, 
});

if(process.env.NODE_ENV==='development'){
    app.use(morgan('dev'));
}

app.use(limiter);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));



// 📌 API Routes
// -----------------------------
app.use('/api/auth', authRoutes);
app.use('/api/projects', projectRoutes);
app.use('/api/blogs',protect,blogRoutes);
app.use('/api/contacts', contactRoutes);


app.use(errorHandler);

module.exports = app;
