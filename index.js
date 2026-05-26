require('dotenv').config();
const express = require('express');
const connectDB = require('./config/database');
const authRoutes = require('./routes/authRoutes');
const countryRoutes = require('./routes/countryRoutes');  
const adminRoutes = require('./routes/adminRoutes');  

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




// Error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

// module.exports = app;

// // Start server
const PORT = process.env.PORT ;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});