const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Product name is required'],
        trim: true
    },
    description: {
        type: String,
        required: [true, 'Product description is required']
    },
    price: {
        type: Number,
        required: [true, 'Price is required']
    },
    category: {
        type: String,
        required: [true, 'Category is required'],
        enum: ['Vegetables', 'Fruits', 'Grains', 'Pulses', 'Spices', 'Other']
    },
    quantity: {
        type: Number,
        required: [true, 'Quantity is required']
    },
    unit: {
        type: String,
        required: [true, 'Unit is required (e.g., kg, quintal, piece)'],
        default: 'kg'
    },
    images: [{
        url: String,
        public_id: String
    }],
    farmer: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    status: {
        type: String,
        enum: ['pending', 'approved', 'rejected'],
        default: 'pending'
    },
    location: {
        city: String,
        state: String
    }
}, {
    timestamps: true
});

const Product = mongoose.model('Product', productSchema);
module.exports = Product;
