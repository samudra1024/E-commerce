import React, { useState, useEffect } from "react";
import { useLocation, useNavigate, useSearchParams } from "react-router-dom";
import ProductList from "../components/products/ProductList";
import axios from "axios";
import { Filter, ChevronDown, Check, X } from "lucide-react";
import axiosInstance from '../config/axios';

const ProductsPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const queryParams = new URLSearchParams(location.search);
  const searchParams = useSearchParams()[0];

  // State
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

  // Filter states
  const [categories, setCategories] = useState([]);
  const [priceRange, setPriceRange] = useState({ min: "", max: "" });
  const [sortOption, setSortOption] = useState(
    queryParams.get("sort") || "newest"
  );
  const [selectedCategory, setSelectedCategory] = useState(
    queryParams.get("category") || ""
  );
  const [inStock, setInStock] = useState(queryParams.get("inStock") === "true");
  const [onSale, setOnSale] = useState(queryParams.get("onSale") === "true");
  const [searchTerm, setSearchTerm] = useState(queryParams.get("search") || "");
  const [page, setPage] = useState(parseInt(queryParams.get("page")) || 1);
  const [totalPages, setTotalPages] = useState(1);

  // Effect to fetch products based on filters
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const params = new URLSearchParams();
        if (selectedCategory) params.append('category', selectedCategory);
        if (inStock) params.append("inStock", "true");
        if (onSale) params.append("onSale", "true");
        if (searchTerm) params.append("search", searchTerm);
        if (priceRange.min) params.append("minPrice", priceRange.min);
        if (priceRange.max) params.append("maxPrice", priceRange.max);
        if (sortOption) params.append("sort", sortOption);
        if (page) params.append("page", page);

        const response = await axiosInstance.get(`/api/products?${params.toString()}`);
        setProducts(response.data.products);
        setTotalPages(response.data.totalPages);
        setLoading(false);
      } catch (error) {
        setError(error.message);
        setLoading(false);
      }
    };

    const fetchCategories = async () => {
      try {
        const response = await axiosInstance.get("/api/products/categories");
        setCategories(response.data);
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };

    fetchProducts();
    fetchCategories();

    // Update URL with current filters
    const params = new URLSearchParams();
    if (selectedCategory) {
      params.append("category", selectedCategory);
      console.log("selectedCategory " + selectedCategory);
    }
    if (inStock) params.append("inStock", "true");
    if (onSale) params.append("onSale", "true");
    if (searchTerm) params.append("search", searchTerm);
    if (sortOption) params.append("sort", sortOption);
    if (page > 1) params.append("page", page.toString());

    navigate(`/products?${params.toString()}`, { replace: true });
  }, [
    selectedCategory,
    inStock,
    onSale,
    searchTerm,
    sortOption,
    page,
    priceRange,
    navigate,
  ]);

  // For development - sample data
  // Remove this when backend is connected
  // useEffect(() => {
  //   if (process.env.NODE_ENV === "developmentsss") {
  //     const sampleCategories = [
  //       "Electronics",
  //       "Clothing",
  //       "Home & Garden",
  //       "Beauty & Health",
  //       "Sports",
  //       "Toys",
  //       "Books",
  //       "Automotive",
  //     ];
  //     setCategories(sampleCategories);

  //     const sampleProducts = Array(12)
  //       .fill()
  //       .map((_, idx) => ({
  //         _id: idx.toString(),
  //         name: `Product ${idx + 1}`,
  //         description: "Product description here",
  //         price: 50 + Math.floor(Math.random() * 150),
  //         image: `https://picsum.photos/seed/${idx + 1}/300/300`,
  //         category:
  //           sampleCategories[
  //             Math.floor(Math.random() * sampleCategories.length)
  //           ],
  //         rating: 3 + Math.random() * 2,
  //         numReviews: Math.floor(Math.random() * 100),
  //         countInStock: Math.floor(Math.random() * 20),
  //         discount: Math.random() > 0.7 ? Math.floor(Math.random() * 30) : 0,
  //       }));

  //     // Apply simple filtering for development
  //     let filtered = [...sampleProducts];

  //     if (selectedCategory) {
  //       filtered = filtered.filter((p) => p.category === selectedCategory);
  //     }

  //     if (inStock) {
  //       filtered = filtered.filter((p) => p.countInStock > 0);
  //     }

  //     if (onSale) {
  //       filtered = filtered.filter((p) => p.discount > 0);
  //     }

  //     if (searchTerm) {
  //       const term = searchTerm.toLowerCase();
  //       filtered = filtered.filter(
  //         (p) =>
  //           p.name.toLowerCase().includes(term) ||
  //           p.description.toLowerCase().includes(term)
  //       );
  //     }

  //     if (priceRange.min) {
  //       filtered = filtered.filter((p) => p.price >= Number(priceRange.min));
  //     }

  //     if (priceRange.max) {
  //       filtered = filtered.filter((p) => p.price <= Number(priceRange.max));
  //     }

  //     setProducts(filtered);
  //     setTotalPages(Math.ceil(filtered.length / 12));
  //     setLoading(false);
  //   }
  // }, [selectedCategory, inStock, onSale, searchTerm, priceRange, sortOption]);

  // Handle price range changes
  const handlePriceChange = (e) => {
    const { name, value } = e.target;
    setPriceRange((prev) => ({ ...prev, [name]: value }));
  };

  // Apply price filter
  const applyPriceFilter = () => {
    setPage(1); // Reset to first page when filtering
  };

  // Clear all filters
  const clearFilters = () => {
    setSelectedCategory("");
    setInStock(false);
    setOnSale(false);
    setPriceRange({ min: "", max: "" });
    setSortOption("newest");
    setSearchTerm("");
    setPage(1);
  };

  // Handle page change
  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setPage(newPage);
      window.scrollTo(0, 0);
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl md:text-3xl font-bold">All Products</h1>

        {/* Mobile filter button */}
        <button
          className="md:hidden flex items-center text-gray-700 hover:text-blue-600 transition-colors"
          onClick={() => setMobileFiltersOpen(true)}
        >
          <Filter className="h-5 w-5 mr-2" />
          Filters
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
        {/* Filters - Desktop */}
        <div className="hidden md:block">
          <div className="bg-white rounded-lg shadow-sm p-6 sticky top-20">
            <div className="pb-4 border-b border-gray-200">
              <h3 className="font-semibold text-lg mb-4">Filters</h3>
              <button
                onClick={clearFilters}
                className="text-sm text-blue-600 hover:text-blue-800 transition-colors flex items-center"
              >
                <X className="h-4 w-4 mr-1" />
                Clear All Filters
              </button>
            </div>

            {/* Categories */}
            <div className="py-4 border-b border-gray-200">
              <h4 className="font-medium mb-3">Categories</h4>
              <div className="space-y-2">
                {categories.map((category) => (
                  <div key={category} className="flex items-center">
                    <input
                      type="radio"
                      id={`category-${category}`}
                      name="category"
                      checked={selectedCategory === category}
                      onChange={() => {
                        setSelectedCategory(
                          category === selectedCategory ? "" : category
                        );
                        setPage(1);
                      }}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500"
                    />
                    <label
                      htmlFor={`category-${category}`}
                      className="ml-2 text-sm text-gray-700"
                    >
                      {category}
                    </label>
                  </div>
                ))}
              </div>
            </div>

            {/* Price Range */}
            <div className="py-4 border-b border-gray-200">
              <h4 className="font-medium mb-3">Price Range</h4>
              <div className="flex space-x-2">
                <div className="flex-1">
                  <label htmlFor="min-price" className="sr-only">
                    Minimum Price
                  </label>
                  <input
                    type="number"
                    name="min"
                    id="min-price"
                    placeholder="Min"
                    value={priceRange.min}
                    onChange={handlePriceChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-blue-300 focus:border-blue-500 focus:outline-none"
                  />
                </div>
                <div className="flex-1">
                  <label htmlFor="max-price" className="sr-only">
                    Maximum Price
                  </label>
                  <input
                    type="number"
                    name="max"
                    id="max-price"
                    placeholder="Max"
                    value={priceRange.max}
                    onChange={handlePriceChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-blue-300 focus:border-blue-500 focus:outline-none"
                  />
                </div>
              </div>
              <button
                onClick={applyPriceFilter}
                className="mt-2 w-full px-4 py-2 bg-gray-100 text-gray-800 hover:bg-gray-200 text-sm rounded-md transition-colors"
              >
                Apply
              </button>
            </div>

            {/* Availability */}
            <div className="py-4 border-b border-gray-200">
              <h4 className="font-medium mb-3">Availability</h4>
              <div className="space-y-2">
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="in-stock"
                    checked={inStock}
                    onChange={() => {
                      setInStock(!inStock);
                      setPage(1);
                    }}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 rounded"
                  />
                  <label
                    htmlFor="in-stock"
                    className="ml-2 text-sm text-gray-700"
                  >
                    In Stock Only
                  </label>
                </div>
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="on-sale"
                    checked={onSale}
                    onChange={() => {
                      setOnSale(!onSale);
                      setPage(1);
                    }}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 rounded"
                  />
                  <label
                    htmlFor="on-sale"
                    className="ml-2 text-sm text-gray-700"
                  >
                    On Sale
                  </label>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Mobile Filters Overlay */}
        {mobileFiltersOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 z-50 md:hidden">
            <div className="fixed right-0 top-0 h-full w-3/4 bg-white overflow-y-auto">
              <div className="flex items-center justify-between p-4 bg-gray-50 border-b border-gray-200">
                <h3 className="font-semibold text-lg">Filters</h3>
                <button
                  onClick={() => setMobileFiltersOpen(false)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>

              <div className="p-4">
                <button
                  onClick={() => {
                    clearFilters();
                    setMobileFiltersOpen(false);
                  }}
                  className="mb-4 text-sm text-blue-600 hover:text-blue-800 transition-colors flex items-center"
                >
                  <X className="h-4 w-4 mr-1" />
                  Clear All Filters
                </button>

                {/* Categories */}
                <div className="py-4 border-b border-gray-200">
                  <h4 className="font-medium mb-3">Categories</h4>
                  <div className="space-y-2">
                    {categories.map((category) => (
                      <div key={category} className="flex items-center">
                        <input
                          type="radio"
                          id={`mobile-category-${category}`}
                          name="mobile-category"
                          checked={selectedCategory === category}
                          onChange={() => {
                            setSelectedCategory(
                              category === selectedCategory ? "" : category
                            );
                            setPage(1);
                          }}
                          className="h-4 w-4 text-blue-600 focus:ring-blue-500"
                        />
                        <label
                          htmlFor={`mobile-category-${category}`}
                          className="ml-2 text-sm text-gray-700"
                        >
                          {category}
                        </label>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Price Range */}
                <div className="py-4 border-b border-gray-200">
                  <h4 className="font-medium mb-3">Price Range</h4>
                  <div className="flex space-x-2">
                    <div className="flex-1">
                      <input
                        type="number"
                        name="min"
                        placeholder="Min"
                        value={priceRange.min}
                        onChange={handlePriceChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-blue-300 focus:border-blue-500 focus:outline-none"
                      />
                    </div>
                    <div className="flex-1">
                      <input
                        type="number"
                        name="max"
                        placeholder="Max"
                        value={priceRange.max}
                        onChange={handlePriceChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-blue-300 focus:border-blue-500 focus:outline-none"
                      />
                    </div>
                  </div>
                  <button
                    onClick={applyPriceFilter}
                    className="mt-2 w-full px-4 py-2 bg-gray-100 text-gray-800 hover:bg-gray-200 text-sm rounded-md transition-colors"
                  >
                    Apply
                  </button>
                </div>

                {/* Availability */}
                <div className="py-4 border-b border-gray-200">
                  <h4 className="font-medium mb-3">Availability</h4>
                  <div className="space-y-2">
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        id="mobile-in-stock"
                        checked={inStock}
                        onChange={() => {
                          setInStock(!inStock);
                          setPage(1);
                        }}
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 rounded"
                      />
                      <label
                        htmlFor="mobile-in-stock"
                        className="ml-2 text-sm text-gray-700"
                      >
                        In Stock Only
                      </label>
                    </div>
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        id="mobile-on-sale"
                        checked={onSale}
                        onChange={() => {
                          setOnSale(!onSale);
                          setPage(1);
                        }}
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 rounded"
                      />
                      <label
                        htmlFor="mobile-on-sale"
                        className="ml-2 text-sm text-gray-700"
                      >
                        On Sale
                      </label>
                    </div>
                  </div>
                </div>

                <div className="py-4">
                  <button
                    onClick={() => setMobileFiltersOpen(false)}
                    className="w-full px-4 py-2 bg-blue-600 text-white hover:bg-blue-700 rounded-md transition-colors"
                  >
                    Apply Filters
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Products Section */}
        <div className="md:col-span-3">
          {/* Sort and Search */}
          <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              {/* Search */}
              <div className="flex-1">
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Search products..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full px-4 py-2 pl-10 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-300 focus:border-blue-500 focus:outline-none"
                  />
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5 text-gray-400"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                      />
                    </svg>
                  </div>
                </div>
              </div>

              {/* Sort */}
              <div className="w-full sm:w-auto">
                <div className="relative">
                  <select
                    value={sortOption}
                    onChange={(e) => setSortOption(e.target.value)}
                    className="appearance-none w-full bg-white border border-gray-300 rounded-md pl-4 pr-10 py-2 focus:ring-2 focus:ring-blue-300 focus:border-blue-500 focus:outline-none"
                  >
                    <option value="newest">Newest Arrivals</option>
                    <option value="priceLow">Price: Low to High</option>
                    <option value="priceHigh">Price: High to Low</option>
                    <option value="popularity">Most Popular</option>
                    <option value="rating">Highest Rated</option>
                  </select>
                  <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
                    <ChevronDown className="h-5 w-5 text-gray-400" />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Active Filters */}
          {(selectedCategory ||
            inStock ||
            onSale ||
            priceRange.min ||
            priceRange.max ||
            searchTerm) && (
            <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-sm font-medium text-gray-700">
                  Active Filters:
                </span>

                {selectedCategory && (
                  <div className="inline-flex items-center bg-blue-100 text-blue-800 text-sm rounded-full px-3 py-1">
                    Category: {selectedCategory}
                    <button
                      onClick={() => setSelectedCategory("")}
                      className="ml-1 focus:outline-none"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </div>
                )}

                {inStock && (
                  <div className="inline-flex items-center bg-green-100 text-green-800 text-sm rounded-full px-3 py-1">
                    In Stock Only
                    <button
                      onClick={() => setInStock(false)}
                      className="ml-1 focus:outline-none"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </div>
                )}

                {onSale && (
                  <div className="inline-flex items-center bg-orange-100 text-orange-800 text-sm rounded-full px-3 py-1">
                    On Sale
                    <button
                      onClick={() => setOnSale(false)}
                      className="ml-1 focus:outline-none"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </div>
                )}

                {(priceRange.min || priceRange.max) && (
                  <div className="inline-flex items-center bg-purple-100 text-purple-800 text-sm rounded-full px-3 py-1">
                    Price: {priceRange.min ? `$${priceRange.min}` : "$0"} -{" "}
                    {priceRange.max ? `$${priceRange.max}` : "∞"}
                    <button
                      onClick={() => setPriceRange({ min: "", max: "" })}
                      className="ml-1 focus:outline-none"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </div>
                )}

                {searchTerm && (
                  <div className="inline-flex items-center bg-gray-100 text-gray-800 text-sm rounded-full px-3 py-1">
                    Search: "{searchTerm}"
                    <button
                      onClick={() => setSearchTerm("")}
                      className="ml-1 focus:outline-none"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </div>
                )}

                <button
                  onClick={clearFilters}
                  className="text-sm text-red-600 hover:text-red-800 transition-colors ml-auto"
                >
                  Clear All
                </button>
              </div>
            </div>
          )}

          {/* Products Grid */}
          {/* {alert(Array.isArray(products))} */}
          <ProductList products={products} loading={loading} error={error} />

          {/* Pagination */}
          {!loading && !error && totalPages > 1 && (
            <div className="flex justify-center mt-8">
              <nav
                className="inline-flex rounded-md shadow-sm -space-x-px"
                aria-label="Pagination"
              >
                <button
                  onClick={() => handlePageChange(page - 1)}
                  disabled={page === 1}
                  className={`relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 text-sm font-medium ${
                    page === 1
                      ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                      : "bg-white text-gray-500 hover:bg-gray-50"
                  }`}
                >
                  <span className="sr-only">Previous</span>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                </button>

                {/* Page numbers */}
                {[...Array(totalPages)].map((_, idx) => {
                  const pageNumber = idx + 1;

                  // Display first page, last page, current page, and pages around current page
                  if (
                    pageNumber === 1 ||
                    pageNumber === totalPages ||
                    (pageNumber >= page - 1 && pageNumber <= page + 1)
                  ) {
                    return (
                      <button
                        key={pageNumber}
                        onClick={() => handlePageChange(pageNumber)}
                        className={`relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium ${
                          page === pageNumber
                            ? "z-10 bg-blue-50 border-blue-500 text-blue-600"
                            : "bg-white text-gray-500 hover:bg-gray-50"
                        }`}
                      >
                        {pageNumber}
                      </button>
                    );
                  }

                  // Add ellipsis for skipped pages
                  if (
                    (pageNumber === 2 && page > 3) ||
                    (pageNumber === totalPages - 1 && page < totalPages - 2)
                  ) {
                    return (
                      <span
                        key={`ellipsis-${pageNumber}`}
                        className="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-gray-700"
                      >
                        ...
                      </span>
                    );
                  }

                  return null;
                })}

                <button
                  onClick={() => handlePageChange(page + 1)}
                  disabled={page === totalPages}
                  className={`relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 text-sm font-medium ${
                    page === totalPages
                      ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                      : "bg-white text-gray-500 hover:bg-gray-50"
                  }`}
                >
                  <span className="sr-only">Next</span>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                </button>
              </nav>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductsPage;
