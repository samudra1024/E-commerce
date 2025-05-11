import React, { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import { Upload, Plus, X, Loader2 } from "lucide-react";

// Initial form state
const initialFormData = {
  name: "",
  description: "",
  price: "",
  brand: "",
  category: "",
  countInStock: "",
  image: "",
  discount: "0",
  featured: false,
  features: [""],
  specifications: [{ key: "", value: "" }],
};

// Create axios instance with auth token
const api = axios.create({
  baseURL: "/api",
});

api.interceptors.request.use((config) => {
  const token = sessionStorage.getItem("authToken");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Utility to sanitize filenames
const sanitizeFilename = (name) => name.replace(/[^a-zA-Z0-9._-]/g, "_");

const CreateProductForm = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [imageUploading, setImageUploading] = useState(false);
  const [formData, setFormData] = useState(initialFormData);
  const fileInputRef = useRef(null);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleFeatureChange = (index, value) => {
    if (formData.features.some((f, i) => i !== index && f === value)) {
      toast.warning("This feature already exists");
      return;
    }

    const newFeatures = [...formData.features];
    newFeatures[index] = value;
    setFormData((prev) => ({ ...prev, features: newFeatures }));
  };

  const addFeature = () => {
    setFormData((prev) => ({
      ...prev,
      features: [...prev.features, ""],
    }));
  };

  const removeFeature = (index) => {
    if (formData.features.length <= 1) {
      toast.warning("At least one feature is required");
      return;
    }
    setFormData((prev) => ({
      ...prev,
      features: prev.features.filter((_, i) => i !== index),
    }));
  };

  const handleSpecificationChange = (index, field, value) => {
    const newSpecs = [...formData.specifications];
    newSpecs[index] = { ...newSpecs[index], [field]: value };
    setFormData((prev) => ({ ...prev, specifications: newSpecs }));
  };

  const addSpecification = () => {
    setFormData((prev) => ({
      ...prev,
      specifications: [...prev.specifications, { key: "", value: "" }],
    }));
  };

  const removeSpecification = (index) => {
    if (formData.specifications.length <= 1) {
      toast.warning("At least one specification is required");
      return;
    }
    setFormData((prev) => ({
      ...prev,
      specifications: prev.specifications.filter((_, i) => i !== index),
    }));
  };

  /**
   * Handles image upload from file input.
   * Validates file type and size, uploads to server, updates form state, and manages UI feedback.
   * @param {React.ChangeEvent<HTMLInputElement>} e - File input change event
   */
  const handleImageUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const validTypes = [
      "image/jpeg",
      "image/png",
      "image/gif",
      "image/webp",
    ];
    if (!validTypes.includes(file.type)) {
      toast.error("Only JPG, PNG, GIF, or WEBP images are allowed");
      if (fileInputRef.current) fileInputRef.current.value = "";
      return;
    }

    // Validate file size (10MB)
    const MAX_SIZE = 10 * 1024 * 1024;
    if (file.size > MAX_SIZE) {
      toast.error("Image size must be less than 10MB");
      if (fileInputRef.current) fileInputRef.current.value = "";
      return;
    }

    const uploadData = new FormData();
    uploadData.append("image", file, sanitizeFilename(file.name));

    setImageUploading(true);
    try {
      const { data } = await api.post("/upload", uploadData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      if (!data?.url) throw new Error("No image URL returned");

      setFormData((prev) => ({ ...prev, image: data.url }));
      toast.success("Image uploaded successfully");
      // Image URL successfully set in form state
    } catch (error) {
      if (error.response?.status === 401) {
        toast.error("Session expired. Please login again.");
        sessionStorage.removeItem("authToken");
        navigate("/login");
      } else {
        toast.error(error.response?.data?.message || "Failed to upload image");
      }
    } finally {
      setImageUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const validateForm = () => {
    if (!formData.name.trim()) return "Product name is required";
    if (!formData.description.trim()) return "Description is required";
    if (isNaN(Number(formData.price)) || parseFloat(formData.price) <= 0)
      return "Valid price is required";
    if (!formData.image) return "Product image is required";
    if (!formData.brand.trim()) return "Brand is required";
    if (!formData.category.trim()) return "Category is required";
    if (
      isNaN(Number(formData.countInStock)) ||
      parseInt(formData.countInStock) < 0
    )
      return "Valid stock quantity is required";
    return null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const validationError = validateForm();
    if (validationError) {
      toast.error(validationError);
      return;
    }

    try {
      setLoading(true);

      // Convert specifications array to object
      const specificationsObject = formData.specifications.reduce(
        (acc, spec) => {
          if (spec.key.trim() && spec.value.trim()) {
            acc[spec.key.trim()] = spec.value.trim();
          }
          return acc;
        },
        {}
      );

      // Filter out empty features
      const filteredFeatures = formData.features.filter(
        (feature) => feature.trim() !== ""
      );

      const productData = {
        name: formData.name.trim(),
        description: formData.description.trim(),
        price: parseFloat(formData.price),
        brand: formData.brand.trim(),
        category: formData.category.trim(),
        countInStock: parseInt(formData.countInStock),
        image: formData.image,
        discount: parseInt(formData.discount) || 0,
        featured: formData.featured,
        features: filteredFeatures,
        specifications: specificationsObject,
      };

      const response = await api.post("/products", productData);
      toast.success("Product created successfully");
      setFormData(initialFormData);
      navigate("/admin/products");
    } catch (error) {
      if (error.response?.status === 401) {
        toast.error("Session expired. Please login again.");
        sessionStorage.removeItem("authToken");
        navigate("/login");
      } else {
        toast.error(
          error.response?.data?.message || "Failed to create product"
        );
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {/* Basic Information */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h3 className="text-lg font-semibold mb-4">Basic Information</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Name */}
          <div>
            <label
              htmlFor="name"
              className="block text-sm font-medium text-gray-700"
            >
              Product Name *
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
          </div>

          {/* Brand */}
          <div>
            <label
              htmlFor="brand"
              className="block text-sm font-medium text-gray-700"
            >
              Brand *
            </label>
            <input
              type="text"
              id="brand"
              name="brand"
              value={formData.brand}
              onChange={handleChange}
              required
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
          </div>

          {/* Category */}
          <div>
            <label
              htmlFor="category"
              className="block text-sm font-medium text-gray-700"
            >
              Category *
            </label>
            <input
              type="text"
              id="category"
              name="category"
              value={formData.category}
              onChange={handleChange}
              required
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
          </div>

          {/* Price */}
          <div>
            <label
              htmlFor="price"
              className="block text-sm font-medium text-gray-700"
            >
              Price *
            </label>
            <div className="mt-1 relative rounded-md shadow-sm">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <span className="text-gray-500 sm:text-sm">$</span>
              </div>
              <input
                type="number"
                id="price"
                name="price"
                value={formData.price}
                onChange={handleChange}
                required
                min="0.01"
                step="0.01"
                className="pl-7 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
            </div>
          </div>

          {/* Stock */}
          <div>
            <label
              htmlFor="countInStock"
              className="block text-sm font-medium text-gray-700"
            >
              Stock Quantity *
            </label>
            <input
              type="number"
              id="countInStock"
              name="countInStock"
              value={formData.countInStock}
              onChange={handleChange}
              required
              min="0"
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
          </div>

          {/* Discount */}
          <div>
            <label
              htmlFor="discount"
              className="block text-sm font-medium text-gray-700"
            >
              Discount (%)
            </label>
            <input
              type="number"
              id="discount"
              name="discount"
              value={formData.discount}
              onChange={handleChange}
              min="0"
              max="100"
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
          </div>
        </div>

        {/* Description */}
        <div className="mt-6">
          <label
            htmlFor="description"
            className="block text-sm font-medium text-gray-700"
          >
            Description *
          </label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            rows={4}
            required
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          />
        </div>

        {/* Featured */}
        <div className="mt-6">
          <div className="flex items-center">
            <input
              type="checkbox"
              id="featured"
              name="featured"
              checked={formData.featured}
              onChange={handleChange}
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
            <label
              htmlFor="featured"
              className="ml-2 block text-sm text-gray-700"
            >
              Featured Product
            </label>
          </div>
        </div>
      </div>

      {/* Image Upload */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h3 className="text-lg font-semibold mb-4">Product Image *</h3>
        {imageUploading ? (
          <div className="flex flex-col items-center justify-center p-8 border-2 border-gray-300 border-dashed rounded-md">
            <Loader2 className="h-12 w-12 text-blue-500 animate-spin" />
            <p className="mt-2 text-sm text-gray-600">Uploading image...</p>
          </div>
        ) : (
          <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
            <div className="space-y-1 text-center">
              <Upload className="mx-auto h-12 w-12 text-gray-400" />
              <div className="flex text-sm text-gray-600">
                <label
                  htmlFor="image"
                  className="relative cursor-pointer bg-white rounded-md font-medium text-blue-600 hover:text-blue-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-blue-500"
                >
                  <span>Upload a file</span>
                  <input
                    id="image"
                    name="image"
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="sr-only"
                    required
                    ref={fileInputRef}
                  />
                </label>
                <p className="pl-1">or drag and drop</p>
              </div>
              <p className="text-xs text-gray-500">
                PNG, JPG, GIF, WEBP up to 10MB
              </p>
            </div>
          </div>
        )}
        {formData.image && (
          <div className="mt-4 flex flex-col items-center">
            <img
              src={formData.image}
              alt="Product preview"
              className="h-32 w-32 object-cover rounded-lg"
            />
            <button
              type="button"
              onClick={() => setFormData((prev) => ({ ...prev, image: "" }))}
              className="mt-2 text-sm text-red-600 hover:text-red-800"
            >
              Remove Image
            </button>
          </div>
        )}
      </div>

      {/* Features */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold">Features</h3>
          <button
            type="button"
            onClick={addFeature}
            className="inline-flex items-center px-3 py-1 border border-transparent text-sm font-medium rounded-md text-blue-700 bg-blue-100 hover:bg-blue-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            <Plus className="h-4 w-4 mr-1" />
            Add Feature
          </button>
        </div>
        <div className="space-y-3">
          {formData.features.map((feature, index) => (
            <div key={index} className="flex items-center gap-2">
              <input
                type="text"
                value={feature}
                onChange={(e) => handleFeatureChange(index, e.target.value)}
                placeholder="Enter feature"
                className="flex-1 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
              <button
                type="button"
                onClick={() => removeFeature(index)}
                className="p-2 text-red-600 hover:text-red-800"
                aria-label={`Remove feature ${index + 1}`}
              >
                <X className="h-5 w-5" />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Specifications */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold">Specifications</h3>
          <button
            type="button"
            onClick={addSpecification}
            className="inline-flex items-center px-3 py-1 border border-transparent text-sm font-medium rounded-md text-blue-700 bg-blue-100 hover:bg-blue-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            <Plus className="h-4 w-4 mr-1" />
            Add Specification
          </button>
        </div>
        <div className="space-y-3">
          {formData.specifications.map((spec, index) => (
            <div key={index} className="flex items-center gap-2">
              <input
                type="text"
                value={spec.key}
                onChange={(e) =>
                  handleSpecificationChange(index, "key", e.target.value)
                }
                placeholder="Specification name"
                className="flex-1 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
              <input
                type="text"
                value={spec.value}
                onChange={(e) =>
                  handleSpecificationChange(index, "value", e.target.value)
                }
                placeholder="Specification value"
                className="flex-1 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
              <button
                type="button"
                onClick={() => removeSpecification(index)}
                className="p-2 text-red-600 hover:text-red-800"
                aria-label={`Remove specification ${index + 1}`}
              >
                <X className="h-5 w-5" />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Submit Button */}
      <div className="flex justify-end">
        <button
          type="submit"
          disabled={loading}
          className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Creating...
            </>
          ) : (
            "Create Product"
          )}
        </button>
      </div>
    </form>
  );
};

export default CreateProductForm;
