import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { CartContext } from '../../context/CartContext';
import { ShoppingCart, Star } from 'lucide-react';
import { toast } from 'react-toastify';

const ProductCard = ({ product }) => {
  const { addToCart } = useContext(CartContext);

  const handleAddToCart = (e) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart(product, 1);
    toast.success(`${product.name} added to cart!`);
  };

  // Generate stars based on rating
  const renderRating = (rating) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;
    
    for (let i = 0; i < fullStars; i++) {
      stars.push(<Star key={`full-${i}`} className="w-4 h-4 fill-current text-yellow-400" />);
    }
    
    if (hasHalfStar) {
      stars.push(
        <span key="half" className="relative">
          <Star className="w-4 h-4 text-gray-300" />
          <Star className="absolute top-0 left-0 w-4 h-4 overflow-hidden fill-current text-yellow-400" style={{ clipPath: 'inset(0 50% 0 0)' }} />
        </span>
      );
    }
    
    const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);
    for (let i = 0; i < emptyStars; i++) {
      stars.push(<Star key={`empty-${i}`} className="w-4 h-4 text-gray-300" />);
    }
    
    return stars;
  };

  return (
    <div className="product-card group">
      <Link to={`/product/${product._id}`} className="block relative">
        <div className="aspect-w-1 aspect-h-1">
          <img 
            src={product.image} 
            alt={product.name} 
            className="product-card-img transition-transform duration-300 group-hover:scale-105"
          />
        </div>
        
        {product.countInStock === 0 && (
          <div className="absolute top-2 right-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded">
            Out of Stock
          </div>
        )}
        
        {product.discount > 0 && (
          <div className="absolute top-2 left-2 bg-orange-500 text-white text-xs font-bold px-2 py-1 rounded">
            {product.discount}% OFF
          </div>
        )}
      </Link>
      
      <div className="product-card-body">
        <div className="mb-1">
          <span className="badge badge-primary">{product.category}</span>
        </div>
        
        <h3 className="text-lg font-semibold mb-1 line-clamp-2">
          <Link to={`/product/${product._id}`} className="hover:text-blue-600 transition-colors">
            {product.name}
          </Link>
        </h3>
        
        <div className="flex items-center mb-2">
          {renderRating(product.rating)}
          <span className="text-sm text-gray-500 ml-1">({product.numReviews})</span>
        </div>
        
        <div className="flex items-center mb-3">
          {product.discount > 0 ? (
            <>
              <span className="text-lg font-bold text-blue-600">
                ${(product.price * (1 - product.discount / 100)).toFixed(2)}
              </span>
              <span className="text-sm text-gray-500 line-through ml-2">
                ${product.price.toFixed(2)}
              </span>
            </>
          ) : (
            <span className="text-lg font-bold text-blue-600">${product.price.toFixed(2)}</span>
          )}
        </div>
        
        {/* Add to cart button */}
        <div className="mt-auto">
          <button
            onClick={handleAddToCart}
            disabled={product.countInStock === 0}
            className={`w-full btn flex items-center justify-center space-x-2 
              ${product.countInStock === 0 
                ? 'bg-gray-300 text-gray-500 cursor-not-allowed' 
                : 'btn-primary'}`}
          >
            <ShoppingCart className="h-4 w-4" />
            <span>Add to Cart</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;