import React from 'react';
import { Link } from 'react-router-dom';
import './Landing.css';

const Landing = () => {
    return (
        <div className="landing">
            {/* Hero Section */}
            <section className="hero">
                <div className="container hero-content">
                    <h1>Fresh from <span>Local Farms</span> to Your Table</h1>
                    <p>The transparent bridge between hard-working farmers and quality-conscious buyers. Empowering local agriculture, one order at a time.</p>
                    <div className="hero-btns">
                        <Link to="/products" className="btn btn-primary">Start Shopping</Link>
                        <Link to="/register?role=farmer" className="btn btn-outline">Sell Your Produce</Link>
                    </div>
                </div>
                <div className="hero-overlay"></div>
            </section>

            {/* Categories Section */}
            <section className="categories container">
                <h2 className="text-center">Browse by Category</h2>
                <div className="category-grid">
                    {['Vegetables', 'Fruits', 'Grains', 'Pulses'].map(cat => (
                        <Link key={cat} to={`/products?category=${cat}`} className="category-card">
                            <h3>{cat}</h3>
                            <span>Explore More</span>
                        </Link>
                    ))}
                </div>
            </section>

            {/* Features Section */}
            <section className="features bg-green">
                <div className="container flex justify-between gap-xl">
                    <div className="feature-item">
                        <h3>Direct Sourcing</h3>
                        <p>Buy directly from farmers, ensuring they get the best price and you get the freshest produce.</p>
                    </div>
                    <div className="feature-item">
                        <h3>Verified Farmers</h3>
                        <p>Every farmer on our platform is verified for quality and ethical practices.</p>
                    </div>
                    <div className="feature-item">
                        <h3>Transparent Pricing</h3>
                        <p>No hidden costs. Full breakdown of quality and price before you buy.</p>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default Landing;
