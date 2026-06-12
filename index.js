require('dotenv').config();
const express = require('express');
const connectDB = require('./config/database');
const authRoutes = require('./routes/authRoutes');
const countryRoutes = require('./routes/countryRoutes');  
const adminRoutes = require('./routes/adminRoutes');  
const postRoutes = require('./routes/postRoutes');          
const advertisementRoutes = require('./routes/advertisementRoutes');
const newsRoutes = require('./routes/newsRoutes');
const { notFound } = require('./middleware/errorMiddleware');


const cors = require('cors');
const app = express();

// Connect to database
connectDB();
app.use(cors());

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/', authRoutes);
app.use('/countries', countryRoutes);  
app.use('/admin', adminRoutes);  
app.use('/posts', postRoutes);               
app.use('/ads', advertisementRoutes); 
app.use('/news', newsRoutes);
app.use(notFound);



// Error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});


app.get("/",(req,res)=>{
  res.send("<h1>Wellcom to landChoice</h1>")
})
// module.exports = app;

// // Start server
const PORT = process.env.PORT ;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});