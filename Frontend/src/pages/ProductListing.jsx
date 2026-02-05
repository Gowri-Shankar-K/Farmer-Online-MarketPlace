import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { Search, Filter, MapPin } from 'lucide-react';
import './ProductListing.css';

const ProductListing = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filters, setFilters] = useState({
        category: '',
        search: '',
        minPrice: '',
        maxPrice: ''
    });
    const { api } = useAuth();
    const { addToCart } = useCart();

    useEffect(() => {
        fetchProducts();
    }, [filters]);

    const fetchProducts = async () => {
        setLoading(true);
        try {
            const params = new URLSearchParams();
            if (filters.category) params.append('category', filters.category);
            if (filters.search) params.append('search', filters.search);
            if (filters.minPrice) params.append('price[gte]', filters.minPrice);
            if (filters.maxPrice) params.append('price[lte]', filters.maxPrice);

            const { data } = await api.get(`/products?${params.toString()}`);
            setProducts(data.data);
        } catch (err) {
            console.error('Error fetching products:', err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="product-listing-page container">
            {/* Search and Filters Bar */}
            <div className="filters-bar card">
                <div className="search-input">
                    <Search size={20} />
                    <input
                        type="text"
                        placeholder="Search for crops, fruits, grains..."
                        value={filters.search}
                        onChange={(e) => setFilters({ ...filters, search: e.target.value })}
                    />
                </div>
                <div className="filter-group">
                    <select
                        value={filters.category}
                        onChange={(e) => setFilters({ ...filters, category: e.target.value })}
                        className="form-control"
                    >
                        <option value="">All Categories</option>
                        <option value="Vegetables">Vegetables</option>
                        <option value="Fruits">Fruits</option>
                        <option value="Grains">Grains</option>
                        <option value="Pulses">Pulses</option>
                    </select>
                </div>
                <div className="price-filters">
                    <input
                        type="number"
                        placeholder="Min Price"
                        className="form-control"
                        value={filters.minPrice}
                        onChange={(e) => setFilters({ ...filters, minPrice: e.target.value })}
                    />
                    <span>-</span>
                    <input
                        type="number"
                        placeholder="Max Price"
                        className="form-control"
                        value={filters.maxPrice}
                        onChange={(e) => setFilters({ ...filters, maxPrice: e.target.value })}
                    />
                </div>
            </div>

            <div className="content-layout">
                {/* Main Product Grid */}
                <div className="product-grid">
                    {loading ? (
                        <div className="loading-state">Loading fresh produce...</div>
                    ) : products.length > 0 ? (
                        products.map(product => (
                            <div key={product._id} className="product-card card">
                                <div className="product-img-wrapper">
                                    <img src={product.images[0]?.url || 'https://via.placeholder.com/300x200?text=AgroMarket'} alt={product.name} />
                                    <span className="category-tag">{product.category}</span>
                                </div>
                                <div className="product-info">
                                    <h3>{product.name}</h3>
                                    <p className="farmer-info">
                                        <MapPin size={14} /> {product.location?.city}, {product.location?.state}
                                    </p>
                                    <div className="price-info">
                                        <span className="price">₹{product.price}</span>
                                        <span className="unit">/ {product.unit}</span>
                                    </div>
                                    <button
                                        className="btn btn-primary w-100 mt-md"
                                        onClick={() => addToCart(product)}
                                    >
                                        Add to Cart
                                    </button>
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="empty-state">No products found for your criteria.</div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ProductListing;
