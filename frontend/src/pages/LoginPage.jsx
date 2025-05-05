import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const LoginPage = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <div className="max-w-md mx-auto my-8 p-6 bg-white rounded-lg shadow-md w-full">
      <h2 className="text-2xl font-bold text-center mb-6 text-gray-800">Login</h2>
      <p className="text-center mb-6 text-gray-600">
        Your one-stop shop for high-quality products at affordable prices.
      </p>
      
      <form className="space-y-4">
        <div>
          <label htmlFor="email" className="block mb-1 text-gray-700">Email</label>
          <input
            type="email"
            id="email"
            name="email"
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={formData.email}
            onChange={handleChange}
            required
          />
        </div>
        
        <div>
          <label htmlFor="password" className="block mb-1 text-gray-700">Password</label>
          <input
            type="password"
            id="password"
            name="password"
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={formData.password}
            onChange={handleChange}
            required
          />
        </div>
        
        <button 
          type="submit" 
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-md transition duration-200"
        >
          Login
        </button>
        
        <div className="text-center mt-4">
          <Link to="/forgot-password" className="text-blue-600 hover:underline">
            Forgot Password?
          </Link>
        </div>
        
        <div className="text-center mt-2">
          <span className="text-gray-600">Don't have an account? </span>
          <Link to="/register" className="text-blue-600 font-semibold hover:underline">
            Register
          </Link>
        </div>
      </form>
    </div>
  );
};

export default LoginPage;