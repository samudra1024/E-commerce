import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import ProductList from "../components/products/ProductList";
import axiosInstance from '../config/axios';
import {
  ArrowRight,
  Truck,
  ShieldCheck,
  RefreshCw,
  CreditCard,
} from "lucide-react";

const HomePage = () => {
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [newArrivals, setNewArrivals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const featuredRes = await axiosInstance.get(
          "/api/products?featured=true&limit=4"
        );
        console.log(featuredRes.data.products)
        setFeaturedProducts(featuredRes.data.products);
        console.log('This featureProducts : ',featuredProducts)

        const newArrivalsRes = await axiosInstance.get(
          "/api/products?sort=-createdAt&limit=4"
        );
        setNewArrivals(newArrivalsRes.data.products);
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    };

    fetchProducts();
  }, []);

  return (
    <div>
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-600 to-blue-800 text-white rounded-xl overflow-hidden">
        <div className="container mx-auto px-4 py-16 sm:py-20">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            <div className="space-y-6">
              <h1 className="text-4xl sm:text-5xl font-bold leading-tight">
                Shop the Latest Products at Amazing Prices
              </h1>
              <p className="text-xl opacity-90 max-w-lg">
                Discover a wide range of quality products with fast shipping and
                excellent customer service.
              </p>
              <div className="pt-4 flex flex-wrap gap-4">
                <Link
                  to="/products"
                  className="bg-white text-blue-600 hover:bg-blue-50 px-6 py-3 rounded-lg font-semibold text-lg transition-colors duration-200"
                >
                  Shop Now
                </Link>
                <Link
                  to="/register"
                  className="bg-transparent border-2 border-white text-white hover:bg-white hover:text-blue-600 px-6 py-3 rounded-lg font-semibold text-lg transition-colors duration-200"
                >
                  Sign Up
                </Link>
              </div>
            </div>
            <div className="hidden md:block relative">
              <img
                src="https://images.pexels.com/photos/1571460/pexels-photo-1571460.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"
                alt="Shopping Experience"
                className="rounded-lg shadow-lg object-cover w-full h-[400px]"
              />
              <div className="absolute -bottom-6 -left-6 bg-orange-500 text-white px-6 py-3 rounded-lg font-bold text-xl shadow-lg transform rotate-3">
                30% OFF
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Categories */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl sm:text-3xl font-bold mb-8 text-center">
            Top Categories
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
            <Link to="/products?category=Electronics" className="group">
              <div className="bg-blue-100 rounded-xl p-6 text-center hover:bg-blue-200 transition-colors duration-200">
                <div className="w-16 h-16 mx-auto bg-blue-500 rounded-full flex items-center justify-center mb-4">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-8 w-8 text-white"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z"
                    />
                  </svg>
                </div>
                <h3 className="font-semibold text-lg group-hover:text-blue-700 transition-colors">
                  Electronics
                </h3>
              </div>
            </Link>
            <Link to="/products?category=clothing" className="group">
              <div className="bg-teal-100 rounded-xl p-6 text-center hover:bg-teal-200 transition-colors duration-200">
                <div className="w-16 h-16 mx-auto bg-teal-500 rounded-full flex items-center justify-center mb-4">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-8 w-8 text-white"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                    />
                  </svg>
                </div>
                <h3 className="font-semibold text-lg group-hover:text-teal-700 transition-colors">
                  Clothing
                </h3>
              </div>
            </Link>
            <Link to="/products?category=home" className="group">
              <div className="bg-amber-100 rounded-xl p-6 text-center hover:bg-amber-200 transition-colors duration-200">
                <div className="w-16 h-16 mx-auto bg-amber-500 rounded-full flex items-center justify-center mb-4">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-8 w-8 text-white"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
                    />
                  </svg>
                </div>
                <h3 className="font-semibold text-lg group-hover:text-amber-700 transition-colors">
                  Home & Garden
                </h3>
              </div>
            </Link>
            <Link to="/products?category=beauty" className="group">
              <div className="bg-purple-100 rounded-xl p-6 text-center hover:bg-purple-200 transition-colors duration-200">
                <div className="w-16 h-16 mx-auto bg-purple-500 rounded-full flex items-center justify-center mb-4">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-8 w-8 text-white"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z"
                    />
                  </svg>
                </div>
                <h3 className="font-semibold text-lg group-hover:text-purple-700 transition-colors">
                  Beauty & Health
                </h3>
              </div>
            </Link>
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-12 bg-gray-50 rounded-xl my-8">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-2xl sm:text-3xl font-bold">
              Featured Products
            </h2>
            <Link
              to="/products?featured=true"
              className="text-blue-600 hover:text-blue-800 flex items-center transition-colors"
            >
              View All <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </div>

          {featuredProducts[0] === undefined ? (
            <p>Products should be displayed here</p>
          ) : (
            // console.log("This the actauly", featuredProducts[0]);
            <ProductList
              products={featuredProducts[0].products}
              loading={loading}
              error={error}
            />
          )}
        </div>
      </section>

      {/* Shop Benefits */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl sm:text-3xl font-bold mb-8 text-center">
            Why Shop With Us
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-white p-6 rounded-xl shadow-sm text-center hover:shadow-md transition-shadow">
              <div className="w-16 h-16 mx-auto bg-blue-100 rounded-full flex items-center justify-center mb-4">
                <Truck className="h-8 w-8 text-blue-600" />
              </div>
              <h3 className="font-semibold text-lg mb-2">Free Shipping</h3>
              <p className="text-gray-600">
                On orders over $100. Get your products delivered to your
                doorstep for free.
              </p>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-sm text-center hover:shadow-md transition-shadow">
              <div className="w-16 h-16 mx-auto bg-green-100 rounded-full flex items-center justify-center mb-4">
                <ShieldCheck className="h-8 w-8 text-green-600" />
              </div>
              <h3 className="font-semibold text-lg mb-2">Secure Payments</h3>
              <p className="text-gray-600">
                All transactions are processed securely through trusted payment
                gateways.
              </p>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-sm text-center hover:shadow-md transition-shadow">
              <div className="w-16 h-16 mx-auto bg-amber-100 rounded-full flex items-center justify-center mb-4">
                <RefreshCw className="h-8 w-8 text-amber-600" />
              </div>
              <h3 className="font-semibold text-lg mb-2">30-Day Returns</h3>
              <p className="text-gray-600">
                Not satisfied? Return any product within 30 days for a full
                refund.
              </p>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-sm text-center hover:shadow-md transition-shadow">
              <div className="w-16 h-16 mx-auto bg-purple-100 rounded-full flex items-center justify-center mb-4">
                <CreditCard className="h-8 w-8 text-purple-600" />
              </div>
              <h3 className="font-semibold text-lg mb-2">
                Multiple Payment Options
              </h3>
              <p className="text-gray-600">
                Choose from various payment methods including credit cards and
                PayPal.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* New Arrivals */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-2xl sm:text-3xl font-bold">New Arrivals</h2>
            <Link
              to="/products?sort=createdAt"
              className="text-blue-600 hover:text-blue-800 flex items-center transition-colors"
            >
              View All <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </div>
          {newArrivals[0] === undefined ? (
            <p>Products should be displayed here</p>
          ) : (
            // console.log("This the actauly", newArrivals[0]);
            <ProductList
              products={newArrivals[0].products}
              loading={loading}
              error={error}
            />
          )}
        </div>
      </section>

      {/* Newsletter */}
      <section className="py-12 bg-gradient-to-r from-teal-500 to-teal-600 rounded-xl my-8 text-white">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-2xl sm:text-3xl font-bold mb-4">
              Subscribe to Our Newsletter
            </h2>
            <p className="text-lg mb-6 opacity-90">
              Get updates on new products, exclusive offers, and discounts
              directly to your inbox.
            </p>
            <form className="flex flex-col sm:flex-row max-w-lg mx-auto">
              <input
                type="email"
                placeholder="Your email address"
                className="flex-grow px-4 py-3 rounded-l-lg sm:rounded-r-none rounded-r-lg sm:rounded-l-lg mb-2 sm:mb-0 text-gray-800 focus:outline-none"
                required
              />
              <button
                type="submit"
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-r-lg sm:rounded-l-none rounded-l-lg sm:rounded-r-lg font-semibold transition-colors"
              >
                Subscribe
              </button>
            </form>
            <p className="text-sm mt-4 opacity-75">
              We respect your privacy. Unsubscribe at any time.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
