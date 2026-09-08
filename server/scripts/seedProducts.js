require('dotenv').config();
const mongoose = require('mongoose');
const Category = require('../models/Category');
const Product = require('../models/Product');
const Order = require('../models/Order');
const CustomOrder = require('../models/CustomOrder');

const connectDB = require('../config/db');

const images = {
  yellow: 'https://res.cloudinary.com/ddh5ynpqg/image/upload/v1787498188/trilokini_uploads/hxwix2jbgfew6q2coh3l.jpg',
  pink: 'https://res.cloudinary.com/ddh5ynpqg/image/upload/v1787498188/trilokini_uploads/ia3c9hb4l1p0zvyw4pm9.jpg',
  green: 'https://res.cloudinary.com/ddh5ynpqg/image/upload/v1787498188/trilokini_uploads/tnf7ybpppgs56dgz3j7v.jpg',
  blue: 'https://res.cloudinary.com/ddh5ynpqg/image/upload/v1787498188/trilokini_uploads/h9d5tsgbbdyj0omtg1zs.jpg',
};

const DEFAULT_SIZES = ['XS', 'S', 'M', 'L', 'XL', '2XL', '3XL', '4XL', '5XL', '6XL'];

const productsData = [
  {
    title: 'Yellow Printed Gharara Set',
    subtitle: 'Printed Silk Kurta Set With Skirt',
    designerName: 'DRISHTI & ZAHABIA',
    productCode: 'GC22234',
    description: 'Featuring exquisite craftsmanship and contemporary design, this yellow printed gharara set is perfect for celebratory occasions. The ensemble includes a printed silk kurta paired with a matching gharara skirt.',
    shippingInfo: 'This product will be shipped to you after 3-4 weeks from the date of order placed. All custom made orders are not returnable.',
    disclaimer: 'This product will be exclusively handcrafted for you, making the colour/texture/pattern slightly vary from the image shown.',
    currentPrice: 32480,
    previousPrice: 40600,
    sizes: DEFAULT_SIZES,
    bottomSizes: DEFAULT_SIZES,
    stockBySize: { XS: 2, S: 5, M: 8, L: 6, XL: 4, '2XL': 3, '3XL': 2, '4XL': 1, '5XL': 1, '6XL': 0 },
    customTailoringEnabled: true,
    showInHomePage: true,
    homePageOrder: 0,
    variants: [
      { color: 'Yellow', images: [images.yellow, images.green], currentPrice: 32480, previousPrice: 40600 },
      { color: 'Pink', images: [images.pink], currentPrice: 33480, previousPrice: 41600 },
    ],
    addons: [
      { name: 'Dupatta', price: 500, hasSizes: false },
      { name: 'Lehenga', price: 500, hasSizes: true, sizes: ['XS', 'S', 'M', 'L', 'XL'] },
      { name: 'Potli', price: 950, hasSizes: false },
    ],
  },
  {
    title: 'Pink Organza Floral Printed Lehenga Set',
    subtitle: 'Floral Organza Lehenga with Blouse and Dupatta',
    designerName: 'ISHA GUPTA TAYAL',
    productCode: 'IGT88421',
    description: 'A stunning pink organza lehenga set featuring delicate floral prints. Includes blouse and dupatta.',
    shippingInfo: 'Shipped within 4-6 weeks. Express delivery available on request.',
    disclaimer: 'Colours may vary slightly due to screen settings and handcrafted nature.',
    currentPrice: 45600,
    previousPrice: 57000,
    sizes: DEFAULT_SIZES,
    bottomSizes: DEFAULT_SIZES,
    stockBySize: { XS: 1, S: 3, M: 5, L: 4, XL: 2, '2XL': 1, '3XL': 0, '4XL': 0, '5XL': 0, '6XL': 0 },
    customTailoringEnabled: true,
    showInHomePage: true,
    homePageOrder: 1,
    variants: [
      { color: 'Pink', images: [images.pink, images.yellow], currentPrice: 45600, previousPrice: 57000 },
    ],
    addons: [
      { name: 'Blouse', price: 12000, hasSizes: true, sizes: ['XS', 'S', 'M', 'L', 'XL'] },
      { name: 'Dupatta', price: 8000, hasSizes: false },
    ],
  },
  {
    title: 'Emerald Silk Anarkali',
    subtitle: 'Hand-embroidered Silk Anarkali Gown',
    designerName: 'NIDHIKA SHEKHAR',
    productCode: 'NS55102',
    description: 'An elegant emerald silk anarkali with intricate hand embroidery, perfect for weddings and receptions.',
    shippingInfo: 'Ready to ship within 2-3 weeks.',
    disclaimer: 'Handcrafted product — minor variations are natural.',
    currentPrice: 28900,
    previousPrice: 34000,
    sizes: DEFAULT_SIZES,
    customTailoringEnabled: true,
    showInHomePage: true,
    homePageOrder: 2,
    variants: [
      { color: 'Emerald', images: [images.green, images.blue], currentPrice: 28900, previousPrice: 34000 },
    ],
    addons: [
      { name: 'Dupatta', price: 500, hasSizes: false },
    ],
  },
];

async function seed() {
  await connectDB();

  let category = await Category.findOne({ isActive: true });
  if (!category) {
    category = await Category.create({
      title: 'Kurta Sets',
      description: 'Shop Kurta Sets',
      imageUrl: images.yellow,
      showInHomePage: true,
      isActive: true,
      order: 1,
    });
    console.log('Created category:', category.title);
  }

  await Order.deleteMany({});
  await CustomOrder.deleteMany({});
  await Product.deleteMany({});

  const products = [];
  for (const data of productsData) {
    const product = await Product.create({ ...data, category: category._id, isActive: true });
    products.push(product);
    console.log(`Created product: ${product.title}`);
  }

  const mainProduct = products[0];

  const order = await Order.create({
    orderNumber: 'ORD-DEMO1001',
    customerName: 'Priya Sharma',
    customerEmail: 'priya@example.com',
    customerMobile: '+919876543210',
    items: [{
      product: mainProduct._id,
      productTitle: mainProduct.title,
      designerName: mainProduct.designerName,
      imageUrl: mainProduct.imageUrl,
      size: 'M',
      color: 'Yellow',
      addons: [{ name: 'Dupatta', price: 500 }],
      unitPrice: 32980,
      quantity: 1,
      lineTotal: 32980,
    }],
    subtotal: 32980,
    shipping: 200,
    discount: 0,
    total: 33180,
    status: 'shipped',
    paymentStatus: 'paid',
    trackingNumber: 'TRK123456789',
    statusHistory: [
      { status: 'pending', note: 'Order placed' },
      { status: 'confirmed', note: 'Payment received' },
      { status: 'processing', note: 'Being prepared' },
      { status: 'shipped', note: 'Dispatched via BlueDart' },
    ],
  });
  console.log(`Created order: ${order.orderNumber}`);

  const customOrder = await CustomOrder.create({
    orderNumber: 'CTO-DEMO2001',
    product: mainProduct._id,
    productTitle: mainProduct.title,
    designerName: mainProduct.designerName,
    imageUrl: mainProduct.imageUrl,
    color: 'Yellow',
    unit: 'inches',
    measurements: {
      shoulder: 15, bust: 36, underBust: 32, armHole: 18,
      sleeveLength: 22, bicep: 12, elbow: 10, wrist: 7,
      waist: 30, lowerWaist: 32, hip: 38,
      topLength: 42, bottomLength: 38, kurtaLength: 44,
      frontNeckDepth: 8, backNeckDepth: 6,
      crotchLength: 28, thighCircumference: 22,
      kneeCircumference: 14, calfCircumference: 12, ankleCircumference: 9,
    },
    customerEmail: 'priya@example.com',
    customerMobile: '+919876543210',
    status: 'price_set',
    quotedPrice: 38500,
    finalPrice: 38500,
    paymentStatus: 'pending',
    statusHistory: [
      { status: 'submitted', note: 'Custom order submitted' },
      { status: 'under_review', note: 'Measurements reviewed' },
      { status: 'price_set', note: 'Price quoted at ₹38,500' },
    ],
    messages: [
      { sender: 'customer', text: 'Custom tailoring request submitted with measurements.' },
      { sender: 'admin', text: 'Thank you! We have reviewed your measurements. The custom price for this gharara set is ₹38,500 including all customizations.' },
      { sender: 'customer', text: 'Can we discuss the dupatta fabric options?' },
    ],
  });
  console.log(`Created custom order: ${customOrder.orderNumber}`);

  console.log('\nSeed complete!');
  console.log(`Products: ${products.length}`);
  console.log(`Sample product ID: ${mainProduct._id}`);
  process.exit(0);
}

seed().catch((err) => {
  console.error('Seed failed:', err);
  process.exit(1);
});
