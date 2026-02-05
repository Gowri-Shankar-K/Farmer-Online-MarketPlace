import React, { useState } from 'react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import './Checkout.css';

const Checkout = () => {
    const { cartItems, cartTotal, clearCart } = useCart();
    const { api } = useAuth();
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        address: '',
        city: '',
        state: '',
        zipCode: '',
    });

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const items = cartItems.map(item => ({
                product: item.product._id,
                quantity: item.quantity,
                price: item.product.price
            }));

            await api.post('/orders', {
                items,
                shippingAddress: formData
            });

            clearCart();
            alert('Order placed successfully!');
            navigate('/products');
        } catch (err) {
            alert(err.response?.data?.message || 'Failed to place order');
        }
    };

    return (
        <div className="checkout-page container">
            <h1>Checkout</h1>
            <form onSubmit={handleSubmit} className="checkout-layout mt-xl">
                <div className="shipping-info card">
                    <h2>Shipping Address</h2>
                    <div className="form-group mt-md">
                        <label className="form-label">Full Address</label>
                        <input
                            type="text"
                            className="form-control"
                            required
                            onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                        />
                    </div>
                    <div className="flex gap-md">
                        <div className="form-group flex-1">
                            <label className="form-label">City</label>
                            <input
                                type="text"
                                className="form-control"
                                required
                                onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                            />
                        </div>
                        <div className="form-group flex-1">
                            <label className="form-label">State</label>
                            <input
                                type="text"
                                className="form-control"
                                required
                                onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                            />
                        </div>
                        <div className="form-group flex-1">
                            <label className="form-label">Zip Code</label>
                            <input
                                type="text"
                                className="form-control"
                                required
                                onChange={(e) => setFormData({ ...formData, zipCode: e.target.value })}
                            />
                        </div>
                    </div>
                </div>

                <div className="order-review card">
                    <h2>Order Summary</h2>
                    <div className="items-list mt-md">
                        {cartItems.map(item => (
                            <div key={item.product._id} className="summary-item flex justify-between">
                                <span>{item.product.name} x {item.quantity}</span>
                                <span>₹{item.product.price * item.quantity}</span>
                            </div>
                        ))}
                    </div>
                    <hr className="mt-md mb-md" />
                    <div className="summary-row flex justify-between total">
                        <span>Total to Pay</span>
                        <span>₹{cartTotal + 40}</span>
                    </div>
                    <button type="submit" className="btn btn-primary w-100 mt-xl">
                        Place Order (COD)
                    </button>
                </div>
            </form>
        </div>
    );
};

export default Checkout;
