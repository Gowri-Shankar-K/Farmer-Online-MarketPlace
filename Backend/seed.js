const mongoose = require('mongoose');
const User = require('./src/models/User');
const Product = require('./src/models/Product');
require('dotenv').config();

const users = [
    { name: 'Admin User', email: 'admin@agro.com', password: 'password123', role: 'admin' },
    { name: 'Farmer Ramesh', email: 'ramesh@farm.com', password: 'password123', role: 'farmer' },
    { name: 'Buyer Suresh', email: 'suresh@buy.com', password: 'password123', role: 'buyer' }
];

const products = [
    {
        name: 'Organic Wheat',
        description: 'Freshly harvested organic wheat from Punjab fields.',
        price: 45,
        category: 'Grains',
        quantity: 1000,
        unit: 'kg',
        status: 'approved',
        location: { city: 'Ludhiana', state: 'Punjab' }
    },
    {
        name: 'Basmati Rice',
        description: 'Long grain aromatic basmati rice.',
        price: 80,
        category: 'Grains',
        quantity: 500,
        unit: 'kg',
        status: 'approved',
        location: { city: 'Karnal', state: 'Haryana' }
    },
    {
        name: 'Pearl Millet (Bajra)',
        description: 'High nutrition pearl millet sourced from Rajasthan.',
        price: 35,
        category: 'Grains',
        quantity: 300,
        unit: 'kg',
        status: 'approved',
        location: { city: 'Jaipur', state: 'Rajasthan' }
    },
    {
        name: 'Fresh Tomatoes',
        description: 'Bright red juicy tomatoes.',
        price: 25,
        category: 'Vegetables',
        quantity: 200,
        unit: 'kg',
        status: 'approved',
        location: { city: 'Nashik', state: 'Maharashtra' }
    },
    {
        name: 'Organic Spinach',
        description: 'Fresh green leafy spinach, pesticide-free.',
        price: 20,
        category: 'Vegetables',
        quantity: 150,
        unit: 'kg',
        status: 'approved',
        location: { city: 'Pune', state: 'Maharashtra' }
    },
    {
        name: 'Alphonso Mangoes',
        description: 'King of mangoes from Ratnagiri.',
        price: 600,
        category: 'Fruits',
        quantity: 50,
        unit: 'dozen',
        status: 'pending',
        location: { city: 'Ratnagiri', state: 'Maharashtra' }
    },
    {
        name: 'Shimla Apples',
        description: 'Crunchy and sweet apples from Himachal orchards.',
        price: 180,
        category: 'Fruits',
        quantity: 200,
        unit: 'kg',
        status: 'approved',
        location: { city: 'Shimla', state: 'Himachal Pradesh' }
    },
    {
        name: 'Red Lentils (Masoor Dal)',
        description: 'High quality split red lentils.',
        price: 110,
        category: 'Pulses',
        quantity: 400,
        unit: 'kg',
        status: 'approved',
        location: { city: 'Indore', state: 'Madhya Pradesh' }
    },
    {
        name: 'Chickpeas (Kabuli Chana)',
        description: 'Premium quality large size chickpeas.',
        price: 120,
        category: 'Pulses',
        quantity: 250,
        unit: 'kg',
        status: 'approved',
        location: { city: 'Bhopal', state: 'Madhya Pradesh' }
    },
    {
        name: 'Turmeric Powder',
        description: 'Pure organic turmeric powder with high curcumin content.',
        price: 250,
        category: 'Spices',
        quantity: 100,
        unit: 'kg',
        status: 'approved',
        location: { city: 'Erode', state: 'Tamil Nadu' }
    },
    {
        name: 'Black Pepper',
        description: 'Wholesale quality black pepper from Kerala.',
        price: 550,
        category: 'Spices',
        quantity: 80,
        unit: 'kg',
        status: 'approved',
        location: { city: 'Waynad', state: 'Kerala' }
    },
    {
        name: 'Organic Honey',
        description: 'Raw and unprocessed forest honey.',
        price: 450,
        category: 'Other',
        quantity: 50,
        unit: 'kg',
        status: 'approved',
        location: { city: 'Dehradun', state: 'Uttarakhand' }
    }
];

const seedDB = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('Connected to MongoDB for seeding...');

        await User.deleteMany({});
        await Product.deleteMany({});

        const createdUsers = await User.create(users);
        const farmer = createdUsers.find(u => u.role === 'farmer');

        const productsWithFarmer = products.map(p => ({ ...p, farmer: farmer._id }));
        await Product.create(productsWithFarmer);

        console.log('Database seeded successfully!');
        process.exit();
    } catch (err) {
        const fs = require('fs');
        fs.writeFileSync('seed_error.log', err.stack || err.message);
        console.error('Error seeding database:', err);
        process.exit(1);
    }
};

seedDB();
