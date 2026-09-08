require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs');
const connectDB = require('./config/db');
const { connectRedis } = require('./config/redis');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors({
  origin: ['http://localhost:3000', 'http://localhost:3001']
}));
app.use(express.json());

// Create uploads directory
const uploadDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

const categoryRoutes = require('./routes/categoryRoutes');
const productRoutes = require('./routes/productRoutes');
const heroBannerRoutes = require('./routes/heroBannerRoutes');
const designerRoutes = require('./routes/designerRoutes');
const celebrityRoutes = require('./routes/celebrityRoutes');
const weddingRoutes = require('./routes/weddingRoutes');
const favouriteRoutes = require('./routes/favouriteRoutes');
const collectionRoutes = require('./routes/collectionRoutes');
const collectionImageRoutes = require('./routes/collectionImageRoutes');
const uploadRoutes = require('./routes/uploadRoutes');
const pricingRoutes = require('./routes/pricingRoutes');
const orderRoutes = require('./routes/orderRoutes');
const customOrderRoutes = require('./routes/customOrderRoutes');
const authRoutes = require('./routes/authRoutes');

// Basic Route
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'Server is running normally' });
});

app.use('/api/categories', categoryRoutes);
app.use('/api/products', productRoutes);
app.use('/api/hero-banners', heroBannerRoutes);
app.use('/api/designers', designerRoutes);
app.use('/api/celebrities', celebrityRoutes);
app.use('/api/wedding-items', weddingRoutes);
app.use('/api/favourites', favouriteRoutes);
app.use('/api/collections', collectionRoutes);
app.use('/api/collection-images', collectionImageRoutes);
app.use('/api/upload', uploadRoutes);
app.use('/api/pricing', pricingRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/custom-orders', customOrderRoutes);
app.use('/api/auth', authRoutes);

const startServer = async () => {
  await connectDB();
  await connectRedis();
  
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
};

startServer();
