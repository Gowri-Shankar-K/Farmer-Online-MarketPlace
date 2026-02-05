import React from 'react';
import { useCart } from '../context/CartContext';
import { Trash2, Plus, Minus, ShoppingBag } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import './Cart.css';

const Cart = () => {
    const { cartItems, removeFromCart, updateQuantity, cartTotal } = useCart();
    const navigate = useNavigate();

    if (cartItems.length === 0) {
        return (
            <div className="cart-page container empty-cart">
                <ShoppingBag size={64} color="var(--text-muted)" />
                <h2>Your cart is empty</h2>
                <p>Looks like you haven't added anything to your cart yet.</p>
                <Link to="/products" className="btn btn-primary mt-lg">Browse Products</Link>
            </div>
        );
    }

    return (
        <div className="cart-page container">
            <h1>Your Shopping Cart</h1>
            <div className="cart-layout mt-xl">
                <div className="cart-items">
                    {cartItems.map(item => (
                        <div key={item.product._id} className="cart-item card">
                            <img src={item.product.images[0]?.url || 'https://via.placeholder.com/100'} alt={item.product.name} />
                            <div className="item-details">
                                <h3>{item.product.name}</h3>
                                <p className="price">₹{item.product.price} / {item.product.unit}</p>
                            </div>
                            <div className="item-quantity">
                                <button onClick={() => updateQuantity(item.product._id, item.quantity - 1)} className="icon-btn">
                                    <Minus size={16} />
                                </button>
                                <span>{item.quantity}</span>
                                <button onClick={() => updateQuantity(item.product._id, item.quantity + 1)} className="icon-btn">
                                    <Plus size={16} />
                                </button>
                            </div>
                            <div className="item-total">
                                ₹{item.product.price * item.quantity}
                            </div>
                            <button onClick={() => removeFromCart(item.product._id)} className="icon-btn text-error">
                                <Trash2 size={20} />
                            </button>
                        </div>
                    ))}
                </div>

                <div className="cart-summary card">
                    <h2>Order Summary</h2>
                    <div className="summary-row flex justify-between mt-md">
                        <span>Subtotal</span>
                        <span>₹{cartTotal}</span>
                    </div>
                    <div className="summary-row flex justify-between mt-sm">
                        <span>Delivery Fee</span>
                        <span>₹40</span>
                    </div>
                    <hr className="mt-md mb-md" />
                    <div className="summary-row flex justify-between total">
                        <span>Total</span>
                        <span>₹{cartTotal + 40}</span>
                    </div>
                    <button className="btn btn-primary w-100 mt-xl" onClick={() => navigate('/checkout')}>
                        Proceed to Checkout
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Cart;
