require('dotenv').config();
const express = require('express');
const app = express();
const path = require('path');
const fs = require('fs');
const cors = require('cors');

const dbConnection = require('./config/db');
const productRoutes = require('./routes/productRoutes');
const contactRoutes = require('./routes/contactRoutes');

/*
// Create uploads folder if it doesn't exist
const uploadDir = 'uploads/';
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
}
*/


dbConnection();
// Middleware
app.use(cors());
app.use(cors());                     


app.use(cors({
  origin: ['https://www.shricomponents.in'], 
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true                  
}));
app.use(express.json());

app.use(express.urlencoded({ extended: true }));

// Serve uploaded images publicly
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Routes
app.use('/api/products', productRoutes);
app.use('/api', contactRoutes);
// Health check route (optional but useful)
app.get('/', (req, res) => {
    res.send('✅ Server is running successfully!');
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`🚀 Server is running on http://localhost:${PORT}`);
    console.log(`📁 Images will be served from: http://localhost:${PORT}/uploads`);
});