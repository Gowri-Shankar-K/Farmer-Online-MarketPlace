import React from 'react';
import { NavLink, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { ShoppingCart, User, LogOut, Menu } from 'lucide-react';
import './Navbar.css';

const Navbar = () => {
    const { user, logout } = useAuth();
    const { cartItems } = useCart();

    return (
        <nav className="navbar">
            <div className="container navbar-content">
                <Link to="/" className="logo">
                    Agro<span>Market</span>
                </Link>

                <div className="nav-links">
                    <NavLink to="/products" className={({ isActive }) => isActive ? 'active' : ''}>
                        Browse
                    </NavLink>
                    {user?.role === 'farmer' && (
                        <NavLink to="/farmer/dashboard">Farmer Dashboard</NavLink>
                    )}
                    {user?.role === 'admin' && (
                        <NavLink to="/admin/dashboard">Admin Panel</NavLink>
                    )}
                </div>

                <div className="nav-actions">
                    <Link to="/cart" className="action-item">
                        <ShoppingCart size={20} />
                        {cartItems.length > 0 && <span className="badge">{cartItems.length}</span>}
                    </Link>

                    {user ? (
                        <div className="user-menu">
                            <span className="user-name">Hi, {user.name.split(' ')[0]}</span>
                            <button onClick={logout} className="logout-btn">
                                <LogOut size={18} />
                            </button>
                        </div>
                    ) : (
                        <Link to="/login" className="btn btn-primary">
                            Login
                        </Link>
                    )}
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
