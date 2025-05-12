import React, { useContext, useState } from 'react';
import { Link } from 'react-router-dom';
import { CartContext } from '../../context/CartContext';
import { Trash, Minus, Plus } from 'lucide-react';

const CartItem = ({ item }) => {
  const { updateQuantity, removeFromCart } = useContext(CartContext);
  const [error, setError] = useState('');

  const handleQuantityChange = (newQuantity) => {
    // Check for negative or zero quantity
    if (newQuantity < 1) {
      setError('Quantity cannot be less than 1');
      return;
    }
    // Check if new quantity exceeds stock
    if (newQuantity > item.countInStock) {
      setError(`Maximum available: ${item.countInStock}`);
      return;
    }
    // If valid, update and clear error
    setError('');
    updateQuantity(item._id, newQuantity);
  };

  const handleRemove = () => {
    removeFromCart(item._id);
  };

  // Calculate item total price including any discounts
  const itemPrice = item.discount > 0 
    ? item.price * (1 - item.discount / 100) 
    : item.price;
  
  const totalPrice = (itemPrice * item.quantity).toFixed(2);

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between p-4 border-b border-gray-200">
      {/* Product Image & Info */}
      <div className="flex flex-col sm:flex-row items-center mb-4 sm:mb-0">
        <Link to={`/product/${item._id}`} className="block w-24 h-24 flex-shrink-0">
          <img 
            src={item.image} 
            alt={item.name} 
            className="w-full h-full object-cover object-center rounded-md"
          />
        </Link>
        
        <div className="ml-0 sm:ml-4 mt-2 sm:mt-0 text-center sm:text-left">
          <Link to={`/product/${item._id}`} className="text-lg font-medium text-gray-800 hover:text-blue-600 transition-colors">
            {item.name}
          </Link>
          
          <div className="text-sm text-gray-500 mt-1">
            {item.discount > 0 ? (
              <div className="flex flex-col sm:flex-row sm:items-center">
                <span className="text-blue-600 font-semibold mr-2">
                  ${(item.price * (1 - item.discount / 100)).toFixed(2)}
                </span>
                <span className="line-through text-gray-400">
                  ${item.price.toFixed(2)}
                </span>
              </div>
            ) : (
              <span>${item.price.toFixed(2)}</span>
            )}
          </div>
        </div>
      </div>
      
      {/* Quantity Control */}
      <div className="flex flex-col items-center space-y-1">
        <div className="flex items-center space-x-1">
        <button 
          onClick={() => handleQuantityChange(item.quantity - 1)}
          disabled={item.quantity <= 1}
          className="p-1 rounded border border-gray-300 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Minus className="h-4 w-4" />
        </button>
        
        <input
          type="number"
          min="1"
          max={item.countInStock}
          value={item.quantity}
          onChange={(e) => handleQuantityChange(parseInt(e.target.value))}
          className="w-12 h-8 text-center border border-gray-300 rounded focus:ring-2 focus:ring-blue-300 focus:border-blue-500 focus:outline-none text-sm"
        />
        
        <button 
          onClick={() => handleQuantityChange(item.quantity + 1)}
          disabled={item.quantity >= item.countInStock}
          className="p-1 rounded border border-gray-300 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Plus className="h-4 w-4" />
        </button>
        </div>
        {error && (
          <span className="text-xs text-red-500 mt-1">{error}</span>
        )}
      </div>
      
      {/* Price & Remove */}
      <div className="flex items-center mt-4 sm:mt-0">
        <span className="font-bold text-lg text-gray-800 mr-4">${totalPrice}</span>
        <button 
          onClick={handleRemove}
          className="p-2 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-full transition-colors"
        >
          <Trash className="h-5 w-5" />
        </button>
      </div>
    </div>
  );
};

export default CartItem;
