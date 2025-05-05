import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { CartContext } from '../context/CartContext';
import { AuthContext } from '../context/AuthContext';
import CartItem from '../components/cart/CartItem';
import { ShoppingCart, ArrowLeft, AlertCircle } from 'lucide-react';

const CartPage = () => {
  const { cart, total, clearCart } = useContext(CartContext);
  const { isAuthenticated } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleCheckout = () => {
    if (!isAuthenticated()) {
      // Redirect to login and then back to checkout
      navigate('/login', { state: { from: '/checkout' } });
      return;
    }
    
    navigate('/checkout');
  };

  // Calculate summary values
  const subtotal = total;
  const tax = (subtotal * 0.1).toFixed(2);
  const shipping = subtotal > 100 ? 0 : 10;
  const orderTotal = (parseFloat(subtotal) + parseFloat(tax) + shipping).toFixed(2);

  return (
    <div className="max-w-6xl mx-auto">
      <h1 className="text-2xl md:text-3xl font-bold mb-6">Shopping Cart</h1>
      
      {cart.length === 0 ? (
        <div className="bg-white rounded-lg shadow-sm p-8 text-center">
          <div className="flex justify-center mb-4">
            <ShoppingCart className="h-16 w-16 text-gray-400" />
          </div>
          <h2 className="text-xl font-semibold mb-2">Your cart is empty</h2>
          <p className="text-gray-600 mb-6">Looks like you haven't added any products to your cart yet.</p>
          <Link to="/products" className="btn btn-primary">
            Start Shopping
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-sm overflow-hidden">
              <div className="p-4 bg-gray-50 border-b border-gray-200 flex justify-between items-center">
                <h2 className="font-semibold text-lg">Cart Items ({cart.length})</h2>
                <button 
                  onClick={clearCart}
                  className="text-red-500 hover:text-red-700 text-sm font-medium"
                >
                  Clear Cart
                </button>
              </div>
              
              <div>
                {cart.map(item => (
                  <CartItem key={item._id} item={item} />
                ))}
              </div>
              
              <div className="p-4 bg-gray-50 border-t border-gray-200">
                <Link to="/products" className="flex items-center text-blue-600 hover:text-blue-800 transition-colors">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Continue Shopping
                </Link>
              </div>
            </div>
          </div>
          
          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-sm overflow-hidden">
              <div className="p-4 bg-gray-50 border-b border-gray-200">
                <h2 className="font-semibold text-lg">Order Summary</h2>
              </div>
              
              <div className="p-6">
                <div className="space-y-4">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Subtotal</span>
                    <span className="font-medium">${subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Tax (10%)</span>
                    <span className="font-medium">${tax}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Shipping</span>
                    <span className="font-medium">
                      {shipping === 0 ? 'Free' : `$${shipping.toFixed(2)}`}
                    </span>
                  </div>
                  
                  {subtotal < 100 && (
                    <div className="bg-blue-50 border border-blue-100 rounded-md p-3 flex items-start">
                      <AlertCircle className="h-5 w-5 text-blue-500 mr-2 flex-shrink-0 mt-0.5" />
                      <p className="text-sm text-blue-700">
                        Add ${(100 - subtotal).toFixed(2)} more to qualify for free shipping!
                      </p>
                    </div>
                  )}
                  
                  <div className="border-t border-gray-200 pt-4 mt-4">
                    <div className="flex justify-between items-center">
                      <span className="font-semibold text-lg">Total</span>
                      <span className="font-bold text-xl">${orderTotal}</span>
                    </div>
                  </div>
                </div>
                
                <button
                  onClick={handleCheckout}
                  className="w-full btn btn-primary py-3 mt-6 text-lg font-semibold"
                >
                  Proceed to Checkout
                </button>
                
                <div className="mt-4 text-center">
                  <p className="text-sm text-gray-500">
                    By proceeding to checkout, you agree to our Terms of Service and Privacy Policy.
                  </p>
                </div>
              </div>
            </div>
            
            {/* Payment Methods */}
            <div className="bg-white rounded-lg shadow-sm overflow-hidden mt-6 p-4">
              <h3 className="font-medium mb-3">We Accept</h3>
              <div className="flex justify-around">
                <div className="w-12 h-8 bg-gray-200 rounded"></div>
                <div className="w-12 h-8 bg-gray-200 rounded"></div>
                <div className="w-12 h-8 bg-gray-200 rounded"></div>
                <div className="w-12 h-8 bg-gray-200 rounded"></div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CartPage;