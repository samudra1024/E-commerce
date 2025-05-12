import React, { useState, useEffect, useContext } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { CartContext } from "../context/CartContext";
import AuthContext from "../context/AuthContext";
import { toast } from "react-toastify";
import {
  ShoppingCart,
  Heart,
  Share,
  Star,
  ChevronRight,
  Check,
  Truck,
} from "lucide-react";
import axiosInstance from '../config/axios';

const ProductDetailPage = () => {
  const { id } = useParams();
  const { addToCart } = useContext(CartContext);
  const { isAuthenticated } = useContext(AuthContext);
  const navigate = useNavigate();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState("description");
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [isWishlist, setIsWishlist] = useState(false);

  // Review form state
  const [reviewRating, setReviewRating] = useState(0);
  const [reviewComment, setReviewComment] = useState("");
  const [reviewLoading, setReviewLoading] = useState(false);
  const [reviewError, setReviewError] = useState(null);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await axiosInstance.get(`/api/products/${id}`);
        setProduct(response.data);
        setLoading(false);
      } catch (error) {
        setError(error.message);
        setLoading(false);
      }
    };

    const fetchWishlist = async () => {
      try {
        const wishlistRes = await axiosInstance.get("/api/users/wishlist");
        setIsWishlist(wishlistRes.data.some((item) => item._id === id));
      } catch (error) {
        console.error("Error fetching wishlist:", error);
      }
    };

    const fetchRelatedProducts = async () => {
      try {
        const relatedRes = await axiosInstance.get(`/api/products/related/${id}`);
        setRelatedProducts(relatedRes.data);
      } catch (error) {
        console.error("Error fetching related products:", error);
      }
    };

    fetchProduct();
    fetchWishlist();
    fetchRelatedProducts();
  }, [id]);
  
  const handleAddToCart = () => {
    addToCart(product, quantity);
    toast.success(`${product.name} added to cart!`);
  };
  
  const toggleWishlist = async () => {
    if (!isAuthenticated()) {
      toast.info("Please login to add items to your wishlist");
      return;
    }
    
    try {
      if (isWishlist) {
        await axiosInstance.delete(`/api/users/wishlist/${id}`);
        toast.success("Removed from wishlist");
      } else {
        await axiosInstance.post("/api/users/wishlist", { productId: id });
        toast.success("Added to wishlist");
      }
      
      setIsWishlist(!isWishlist);
    } catch (err) {
      toast.error("Failed to update wishlist");
      console.error("Wishlist error:", err);
    }
  };
  
  const handleShareProduct = () => {
    navigator.clipboard.writeText(window.location.href);
    toast.success("Link copied to clipboard!");
  };
  
  // Handle review form submission
  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    setReviewError(null);
    
    if (reviewRating === 0) {
      setReviewError("Please select a rating.");
      return;
    }
    if (!reviewComment.trim()) {
      setReviewError("Please enter a comment.");
      return;
    }
    
    setReviewLoading(true);
    try {
      // POST review to backend
      await axiosInstance.post(`/api/products/${id}/reviews`, {
        rating: reviewRating,
        comment: reviewComment,
      });
      
      console.log(product)
      toast.success("Review submitted!");
      
      // Fetch updated product details (including new reviews)
      const updatedProduct = await axiosInstance.get(`/api/products/${id}`);
      setProduct(updatedProduct.data);
      
      // Reset form
      setReviewRating(0);
      setReviewComment("");
      setReviewLoading(false);
      setReviewError(null);
    } catch (err) {
      setReviewLoading(false);
      if (err.response && err.response.data && err.response.data.message) {
        setReviewError(err.response.data.message);
      } else {
        setReviewError("Failed to submit review. Please try again.");
      }
    }
  };

  // Handle star click for review form
  const handleStarClick = (star) => {
    setReviewRating(star);
  };

  // Generate stars based on rating
  const renderStars = (rating) => {
    const stars = [];

    for (let i = 1; i <= 5; i++) {
      if (i <= Math.floor(rating)) {
        // Full star
        stars.push(
          <Star key={i} className="w-5 h-5 fill-current text-yellow-400" />
        );
      } else if (i === Math.ceil(rating) && !Number.isInteger(rating)) {
        // Half star
        stars.push(
          <span key={i} className="relative">
            <Star className="w-5 h-5 text-gray-300" />
            <Star
              className="absolute top-0 left-0 w-5 h-5 overflow-hidden fill-current text-yellow-400"
              style={{ clipPath: "inset(0 50% 0 0)" }}
            />
          </span>
        );
      } else {
        // Empty star
        stars.push(<Star key={i} className="w-5 h-5 text-gray-300" />);
      }
    }

    return stars;
  };

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto py-8 px-4">
        <div className="animate-pulse">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-gray-300 rounded-lg aspect-square"></div>
            <div className="space-y-4">
              <div className="h-8 bg-gray-300 rounded w-3/4"></div>
              <div className="h-6 bg-gray-300 rounded w-1/4"></div>
              <div className="h-4 bg-gray-300 rounded w-full"></div>
              <div className="h-4 bg-gray-300 rounded w-full"></div>
              <div className="h-4 bg-gray-300 rounded w-3/4"></div>
              <div className="h-12 bg-gray-300 rounded w-1/3 mt-8"></div>
              <div className="h-12 bg-gray-300 rounded w-full"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="max-w-6xl mx-auto py-8 px-4 text-center">
        <div className="bg-red-50 p-6 rounded-lg">
          <h2 className="text-2xl font-bold text-red-700 mb-2">
            Error Loading Product
          </h2>
          <p className="text-red-600 mb-4">{error || "Product not found"}</p>
          <Link to="/products" className="btn btn-primary">
            Browse Products
          </Link>
        </div>
      </div>
    );
  }

  // Calculate discounted price
  const discountedPrice =
    product.discount > 0
      ? (product.price * (1 - product.discount / 100)).toFixed(2)
      : product.price.toFixed(2);

  return (
    <div className="max-w-6xl mx-auto py-8 px-4">
      {/* Breadcrumbs */}
      <nav className="flex items-center text-sm text-gray-500 mb-6">
        <Link to="/" className="hover:text-blue-600 transition-colors">
          Home
        </Link>
        <ChevronRight className="h-4 w-4 mx-2" />
        <Link to="/products" className="hover:text-blue-600 transition-colors">
          Products
        </Link>
        <ChevronRight className="h-4 w-4 mx-2" />
        <Link
          to={`/products?category=${product.category}`}
          className="hover:text-blue-600 transition-colors"
        >
          {product.category}
        </Link>
        <ChevronRight className="h-4 w-4 mx-2" />
        <span className="text-gray-700 font-medium">{product.name}</span>
      </nav>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
        {/* Product Image */}
        <div>
          <div className="bg-white rounded-lg overflow-hidden mb-4">
            <img
              src={product.image}
              alt={product.name}
              className="w-full h-auto object-cover"
            />
          </div>

          {/* Thumbnail Images - if available */}
          {product.images && product.images.length > 0 && (
            <div className="grid grid-cols-5 gap-2">
              {product.images.map((img, index) => (
                <div
                  key={index}
                  className="bg-white rounded-lg overflow-hidden border-2 border-gray-200 cursor-pointer hover:border-blue-500 transition-colors"
                >
                  <img
                    src={img}
                    alt={`${product.name} - view ${index + 1}`}
                    className="w-full h-auto object-cover"
                  />
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Product Info */}
        <div>
          <div className="mb-2">
            {product.brand && (
              <span className="text-gray-500">{product.brand}</span>
            )}
          </div>

          <h1 className="text-3xl font-bold mb-2">{product.name}</h1>

          {/* Rating */}
          <div className="flex items-center mb-4">
            <div className="flex mr-2">{renderStars(product.rating)}</div>
            <span className="text-gray-600">
              {product.rating.toFixed(1)} ({product.numReviews} reviews)
            </span>
          </div>

          {/* Price */}
          <div className="mb-6">
            {product.discount > 0 ? (
              <div className="flex items-center">
                <span className="text-3xl font-bold text-blue-600 mr-3">
                  ${discountedPrice}
                </span>
                <span className="text-xl text-gray-500 line-through">
                  ${product.price.toFixed(2)}
                </span>
                <span className="ml-3 bg-orange-100 text-orange-800 font-medium text-sm px-2.5 py-0.5 rounded">
                  {product.discount}% OFF
                </span>
              </div>
            ) : (
              <span className="text-3xl font-bold text-blue-600">
                ${product.price.toFixed(2)}
              </span>
            )}
          </div>

          {/* Short Description */}
          <p className="text-gray-700 mb-6">{product.description}</p>

          {/* Availability */}
          <div className="mb-6">
            {product.countInStock > 0 ? (
              <div className="flex items-center text-green-700">
                <Check className="h-5 w-5 mr-2" />
                <span>In Stock ({product.countInStock} available)</span>
              </div>
            ) : (
              <div className="flex items-center text-red-600">
                <span>Out of Stock</span>
              </div>
            )}
          </div>

          {/* Quantity Selector */}
          {product.countInStock > 0 && (
            <div className="mb-6">
              <label
                htmlFor="quantity"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Quantity
              </label>
              <div className="flex items-center">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="border border-gray-300 rounded-l-md p-2 focus:outline-none focus:ring-1 focus:ring-blue-300 hover:bg-gray-100"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z"
                      clipRule="evenodd"
                    />
                  </svg>
                </button>
                <input
                  type="number"
                  id="quantity"
                  min="1"
                  max={product.countInStock}
                  value={quantity}
                  onChange={(e) =>
                    setQuantity(
                      Math.min(
                        product.countInStock,
                        Math.max(1, parseInt(e.target.value))
                      )
                    )
                  }
                  className="w-16 border-t border-b border-gray-300 text-center py-2 focus:outline-none focus:ring-1 focus:ring-blue-300"
                />
                <button
                  onClick={() =>
                    setQuantity(Math.min(product.countInStock, quantity + 1))
                  }
                  className="border border-gray-300 rounded-r-md p-2 focus:outline-none focus:ring-1 focus:ring-blue-300 hover:bg-gray-100"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z"
                      clipRule="evenodd"
                    />
                  </svg>
                </button>
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-3 mb-6">
            <button
              onClick={handleAddToCart}
              disabled={product.countInStock === 0}
              className={`btn px-8 py-3 ${
                product.countInStock === 0
                  ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                  : "btn-primary"
              } flex-1 flex items-center justify-center`}
            >
              <ShoppingCart className="h-5 w-5 mr-2" />
              <span>
                {product.countInStock === 0 ? "Out of Stock" : "Add to Cart"}
              </span>
            </button>

            <button
              onClick={toggleWishlist}
              className={`btn px-8 py-3 ${
                isWishlist
                  ? "bg-red-500 text-white hover:bg-red-600"
                  : "btn-outline"
              } flex items-center justify-center`}
            >
              <Heart
                className={`h-5 w-5 mr-2 ${isWishlist ? "fill-current" : ""}`}
              />
              <span>{isWishlist ? "Saved" : "Save"}</span>
            </button>

            <button
              onClick={handleShareProduct}
              className="btn btn-outline px-4 py-3 flex items-center justify-center"
            >
              <Share className="h-5 w-5" />
            </button>
          </div>

          {/* Delivery Info */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <div className="flex items-start mb-2">
              <Truck className="h-5 w-5 text-blue-600 mr-3 mt-0.5" />
              <div>
                <span className="font-medium">Free Shipping</span>
                <p className="text-sm text-gray-600">On orders over $100</p>
              </div>
            </div>
            <div className="text-sm text-gray-600">
              Estimated delivery: 3-5 business days
            </div>
          </div>
        </div>
      </div>

      {/* Product Details Tabs */}
      <div className="bg-white rounded-lg shadow-sm mb-12 overflow-hidden">
        {/* Tab Navigation */}
        <div className="flex border-b border-gray-200">
          <button
            className={`px-6 py-4 text-sm font-medium ${
              activeTab === "description"
                ? "text-blue-600 border-b-2 border-blue-600"
                : "text-gray-500 hover:text-gray-700 hover:border-gray-300 hover:border-b-2"
            }`}
            onClick={() => setActiveTab("description")}
          >
            Description
          </button>
          <button
            className={`px-6 py-4 text-sm font-medium ${
              activeTab === "specifications"
                ? "text-blue-600 border-b-2 border-blue-600"
                : "text-gray-500 hover:text-gray-700 hover:border-gray-300 hover:border-b-2"
            }`}
            onClick={() => setActiveTab("specifications")}
          >
            Specifications
          </button>
          <button
            className={`px-6 py-4 text-sm font-medium ${
              activeTab === "reviews"
                ? "text-blue-600 border-b-2 border-blue-600"
                : "text-gray-500 hover:text-gray-700 hover:border-gray-300 hover:border-b-2"
            }`}
            onClick={() => setActiveTab("reviews")}
          >
            Reviews ({product.reviews?.length || product.numReviews})
          </button>
        </div>

        {/* Tab Content */}
        <div className="p-6">
          {/* Description Tab */}
          {activeTab === "description" && (
            <div>
              <p className="text-gray-700 mb-6">{product.description}</p>

              {product.features && (
                <div className="mt-6">
                  <h3 className="text-lg font-semibold mb-3">Key Features</h3>
                  <ul className="space-y-2">
                    {product.features.map((feature, index) => (
                      <li key={index} className="flex items-center">
                        <Check className="h-5 w-5 text-green-500 mr-3" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}

          {/* Specifications Tab */}
          {activeTab === "specifications" && (
            <div>
              {product.specifications ? (
                <div className="overflow-hidden border border-gray-200 rounded-lg">
                  <table className="min-w-full divide-y divide-gray-200">
                    <tbody className="bg-white divide-y divide-gray-200">
                      {Object.entries(product.specifications).map(
                        ([key, value], index) => (
                          <tr
                           key={index}
                            className={
                              index % 2 === 0 ? "bg-gray-50" : "bg-white"
                            }
                          >
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                              {key}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              {value}
                            </td>
                          </tr>
                        )
                      )}
                    </tbody>
                  </table>
                </div>
              ) : (
                <p className="text-gray-500">
                  No specifications available for this product.
                </p>
              )}
            </div>
          )}

          {/* Reviews Tab */}
          {activeTab === "reviews" && (
            <div>
              {/* Average Rating Summary */}
              <div className="mb-8">
                <div className="flex items-center mb-4">
                  <div className="flex mr-2">{renderStars(product.rating)}</div>
                  <span className="text-xl font-semibold">
                    {product.rating.toFixed(1)} out of 5
                  </span>
                </div>
                <p className="text-gray-600">
                  Based on {product.numReviews} reviews
                </p>
              </div>

              {/* Reviews List */}
              {product.reviews && product.reviews.length > 0 ? (
                <div className="space-y-6">
                  {product.reviews.map((review) => (
                    <div
                      key={review._id}
                      className="border-b border-gray-200 pb-6"
                    >
                      <div className="flex items-center mb-2">
                        <div className="flex mr-2">
                          {renderStars(review.rating)}
                        </div>
                        <span className="font-medium">{review.name}</span>
                      </div>
                      <p className="text-gray-600 text-sm mb-2">
                        {new Date(review.createdAt).toLocaleDateString()}
                      </p>
                      <p className="text-gray-700">{review.comment}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-600">
                  No reviews yet. Be the first to review this product!
                </p>
              )}

              {/* Write Review Form - only for authenticated users */}
              {isAuthenticated() && (
                <div className="mt-8 border-t border-gray-200 pt-6">
                  <h3 className="text-lg font-semibold mb-4">Write a Review</h3>
                  <form onSubmit={handleReviewSubmit}>
                    <div className="mb-4">
                      <label
                        htmlFor="rating"
                        className="block text-sm font-medium text-gray-700 mb-1"
                      >
                        Rating
                      </label>
                      <div className="flex items-center space-x-1">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <button
                            key={star}
                            type="button"
                            className="focus:outline-none"
                            onClick={() => handleStarClick(star)}
                            aria-label={`Rate ${star} star${star > 1 ? "s" : ""}`}
                          >
                            <Star
                              className={`h-6 w-6 transition-colors ${
                                reviewRating >= star
                                  ? "text-yellow-400 fill-current"
                                  : "text-gray-300"
                              }`}
                            />
                          </button>
                        ))}
                      </div>
                    </div>
                    <div className="mb-4">
                      <label
                        htmlFor="comment"
                        className="block text-sm font-medium text-gray-700 mb-1"
                      >
                        Comment
                      </label>
                      <textarea
                        id="comment"
                        rows={4}
                        className="w-full border border-gray-300 rounded-md p-2 focus:ring-2 focus:ring-blue-300 focus:border-blue-500 focus:outline-none"
                        placeholder="Share your experience with this product..."
                        value={reviewComment}
                        onChange={(e) => setReviewComment(e.target.value)}
                        disabled={reviewLoading}
                      ></textarea>
                    </div>
                    {reviewError && (
                      <div className="mb-2 text-red-600 text-sm">{reviewError}</div>
                    )}
                    <button
                      type="submit"
                      className="btn btn-primary px-6 py-2"
                      disabled={reviewLoading}
                    >
                      {reviewLoading ? "Submitting..." : "Submit Review"}
                    </button>
                  </form>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Related Products */}
      {relatedProducts.length > 0 && (
        <div className="mb-12">
          <h2 className="text-2xl font-bold mb-6">Related Products</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {relatedProducts.map((product) => (
              <div key={product._id} className="product-card group">
                <Link to={`/product/${product._id}`} className="block">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="product-card-img transition-transform duration-300 group-hover:scale-105"
                  />

                  {product.discount > 0 && (
                    <div className="absolute top-2 left-2 bg-orange-500 text-white text-xs font-bold px-2 py-1 rounded">
                      {product.discount}% OFF
                    </div>
                  )}
                </Link>

                <div className="product-card-body">
                  <h3 className="text-lg font-semibold mb-1 line-clamp-2">
                    <Link
                      to={`/product/${product._id}`}
                      className="hover:text-blue-600 transition-colors"
                    >
                      {product.name}
                    </Link>
                  </h3>

                  <div className="flex items-center mb-2">
                    {renderStars(product.rating)}
                    <span className="text-sm text-gray-500 ml-1">
                      ({product.numReviews})
                    </span>
                  </div>

                  <div className="flex items-center">
                    {product.discount > 0 ? (
                      <>
                        <span className="text-lg font-bold text-blue-600">
                          $
                          {(
                            product.price *
                            (1 - product.discount / 100)
                          ).toFixed(2)}
                        </span>
                        <span className="text-sm text-gray-500 line-through ml-2">
                          ${product.price.toFixed(2)}
                        </span>
                      </>
                    ) : (
                      <span className="text-lg font-bold text-blue-600">
                        ${product.price.toFixed(2)}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductDetailPage;
