import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { Check, X, AlertCircle } from 'lucide-react';
import './AdminDashboard.css';

const AdminDashboard = () => {
    const { api } = useAuth();
    const [pendingProducts, setPendingProducts] = useState([]);
    const [stats, setStats] = useState({ users: 0, products: 0, orders: 0 });

    useEffect(() => {
        fetchPendingProducts();
        // fetchStats(); // Simplified for now
    }, []);

    const fetchPendingProducts = async () => {
        try {
            const { data } = await api.get('/products?status=pending');
            setPendingProducts(data.data);
        } catch (err) {
            console.error(err);
        }
    };

    const handleApproval = async (id, status) => {
        try {
            await api.patch(`/products/${id}/approve`, { status });
            fetchPendingProducts();
        } catch (err) {
            alert('Action failed');
        }
    };

    return (
        <div className="admin-dashboard container">
            <h1>Admin Dashboard</h1>

            <div className="stats-grid mt-xl">
                <div className="card stat-card">
                    <h3>Verification Queue</h3>
                    <p>{pendingProducts.length} items waiting</p>
                </div>
            </div>

            <h2 className="mt-xl">Pending Product Listings</h2>
            <div className="pending-list mt-md">
                {pendingProducts.length > 0 ? (
                    pendingProducts.map(product => (
                        <div key={product._id} className="pending-item card flex justify-between align-center">
                            <div className="item-info">
                                <h3>{product.name}</h3>
                                <p>Category: {product.category} | Price: ₹{product.price}</p>
                                <p>Farmer ID: {product.farmer}</p>
                            </div>
                            <div className="item-actions flex gap-md">
                                <button
                                    className="btn btn-primary btn-sm"
                                    onClick={() => handleApproval(product._id, 'approved')}
                                >
                                    <Check size={18} /> Approve
                                </button>
                                <button
                                    className="btn btn-outline btn-sm text-error"
                                    onClick={() => handleApproval(product._id, 'rejected')}
                                >
                                    <X size={18} /> Reject
                                </button>
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="empty-state card">
                        <AlertCircle size={48} color="var(--text-muted)" />
                        <p>No pending listings for review.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default AdminDashboard;
