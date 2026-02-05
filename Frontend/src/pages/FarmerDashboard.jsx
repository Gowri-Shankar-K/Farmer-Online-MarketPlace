import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { Plus, Edit, Trash2, Package } from 'lucide-react';
import './FarmerDashboard.css';

const FarmerDashboard = () => {
    const { user, api } = useAuth();
    const [products, setProducts] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        category: 'Vegetables',
        price: '',
        quantity: '',
        unit: 'kg',
        description: '',
    });

    useEffect(() => {
        fetchMyProducts();
    }, []);

    const fetchMyProducts = async () => {
        try {
            // For now, filtering by user id on frontend or a dedicated endpoint
            const { data } = await api.get(`/products?farmer=${user.id}`);
            setProducts(data.data);
        } catch (err) {
            console.error(err);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await api.post('/products', formData);
            setIsModalOpen(false);
            fetchMyProducts();
        } catch (err) {
            alert('Failed to create product');
        }
    };

    return (
        <div className="farmer-dashboard container">
            <div className="dashboard-header flex justify-between align-center">
                <div>
                    <h1>Farmer Dashboard</h1>
                    <p>Manage your listings and view orders</p>
                </div>
                <button className="btn btn-primary" onClick={() => setIsModalOpen(true)}>
                    <Plus size={20} /> Add New Listing
                </button>
            </div>

            {/* Stats Section */}
            <div className="stats-grid mt-xl">
                <div className="card stat-card">
                    <div className="flex align-center gap-md">
                        <Package color="var(--primary-color)" />
                        <div>
                            <h3>{products.length}</h3>
                            <p>Total Products</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Product List */}
            <div className="products-table-container mt-xl card">
                <table className="products-table">
                    <thead>
                        <tr>
                            <th>Product</th>
                            <th>Category</th>
                            <th>Price</th>
                            <th>Stock</th>
                            <th>Status</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {products.map(product => (
                            <tr key={product._id}>
                                <td>{product.name}</td>
                                <td>{product.category}</td>
                                <td>₹{product.price} / {product.unit}</td>
                                <td>{product.quantity} {product.unit}</td>
                                <td>
                                    <span className={`status-badge ${product.status}`}>
                                        {product.status}
                                    </span>
                                </td>
                                <td>
                                    <div className="flex gap-sm">
                                        <button className="icon-btn"><Edit size={16} /></button>
                                        <button className="icon-btn text-error"><Trash2 size={16} /></button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Add Product Modal (Simple implementation) */}
            {isModalOpen && (
                <div className="modal-overlay">
                    <div className="modal-content card">
                        <h2>Add New Product</h2>
                        <form onSubmit={handleSubmit}>
                            <div className="form-group">
                                <label className="form-label">Product Name</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    required
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                />
                            </div>
                            <div className="flex gap-md">
                                <div className="form-group flex-1">
                                    <label className="form-label">Category</label>
                                    <select className="form-control" onChange={(e) => setFormData({ ...formData, category: e.target.value })}>
                                        <option value="Vegetables">Vegetables</option>
                                        <option value="Fruits">Fruits</option>
                                        <option value="Grains">Grains</option>
                                        <option value="Pulses">Pulses</option>
                                    </select>
                                </div>
                                <div className="form-group flex-1">
                                    <label className="form-label">Price</label>
                                    <input
                                        type="number"
                                        className="form-control"
                                        required
                                        onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                                    />
                                </div>
                            </div>
                            <div className="flex gap-md">
                                <div className="form-group flex-1">
                                    <label className="form-label">Quantity</label>
                                    <input
                                        type="number"
                                        className="form-control"
                                        required
                                        onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
                                    />
                                </div>
                                <div className="form-group flex-1">
                                    <label className="form-label">Unit</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        placeholder="e.g. kg, quintal"
                                        onChange={(e) => setFormData({ ...formData, unit: e.target.value })}
                                    />
                                </div>
                            </div>
                            <div className="form-group">
                                <label className="form-label">Description</label>
                                <textarea
                                    className="form-control"
                                    rows="3"
                                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                ></textarea>
                            </div>
                            <div className="flex justify-between mt-lg">
                                <button type="button" className="btn btn-outline" onClick={() => setIsModalOpen(false)}>Cancel</button>
                                <button type="submit" className="btn btn-primary">Save Listing</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default FarmerDashboard;
