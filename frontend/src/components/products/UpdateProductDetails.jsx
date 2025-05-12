
import React, { useState, useEffect, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getProductById, updateProduct } from "../../services/productService";
import { Upload, Plus, X, Loader2 } from "lucide-react";
import { toast } from "react-toastify";
import AuthContext from "../../context/AuthContext";
import axios from "axios";

const defaultFormData = {
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

const UpdateProductDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [imageUploading, setImageUploading] = useState(false);
  const [product, setProduct] = useState(null);
  const { getToken, isAdmin } = useContext(AuthContext);
  const [formData, setFormData] = useState({ ...defaultFormData });

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const data = await getProductById(id);
        setProduct(data);
        setFormData({
          name: data.name || "",
          description: data.description || "",
          price: data.price?.toString() || "",
          brand: data.brand || "",
          category: data.category || "",
          countInStock: data.countInStock?.toString() || "",
          image: data.image || "",
          discount: data.discount ? data.discount.toString() : "0",
          featured: !!data.featured || false,
          features:
            Array.isArray(data.features) && data.features.length > 0 ? data.features : [""],
          specifications:
            data.specifications && typeof data.specifications === "object" && Object.keys(data.specifications).length > 0
              ? Object.entries(data.specifications).map(([key, value]) => ({
                  key,
                  value,
                }))
              : [{ key: "", value: "" }],
        });
        setLoading(false);
      } catch (error) {
        toast.error("Failed to load product");
        navigate("/admin/products");
      }
    };

    fetchProduct();
  }, [id, navigate]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleFeatureChange = (index, value) => {
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
    setFormData((prev) => ({
      ...prev,
      specifications: prev.specifications.filter((_, i) => i !== index),
    }));
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Validate file type and size
    const validTypes = ["image/jpeg", "image/png", "image/gif", "image/webp"];
    if (!validTypes.includes(file.type)) {
      toast.error("Only JPG, PNG, GIF, or WEBP images are allowed");
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      toast.error("Image size must be less than 10MB");
      return;
    }

    const uploadData = new FormData();
    uploadData.append("image", file);

    try {
      setImageUploading(true);
      const token = getToken();
      if (!token) throw new Error("No token found");
      if (!isAdmin) {
        toast.error("Only admin users can create products");
        setImageUploading(false);
        return;
      }

      const response = await axios.post("base_url/api/upload", uploadData, {
        headers: {
          Authorization: token,
          "Content-Type": "multipart/form-data",
        },
      });

      if (response.data?.url) {
        setFormData((prev) => ({
          ...prev,
          image: response.data.url,
        }));
        toast.success("Image uploaded successfully");
      } else {
        throw new Error("No image URL returned");
      }
    } catch (error) {
      console.error("Upload error:", error);
      toast.error(error.response?.data?.message || "Failed to upload image");
    } finally {
      setImageUploading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setSubmitting(true);

      // Convert specifications array to object
      const specificationsObject = {};
      formData.specifications.forEach((spec) => {
        if (spec.key && spec.value) {
          specificationsObject[spec.key] = spec.value;
        }
      });

      // Filter out empty features
      const filteredFeatures = formData.features.filter(
        (feature) => feature.trim() !== ""
      );

      const productData = {
        name: formData.name.trim() || "",
        description: formData.description.trim() || "",
        price: parseFloat(formData.price) || 0,
        brand: formData.brand.trim() || "",
        category: formData.category.trim() || "",
        countInStock: parseInt(formData.countInStock) || 0,
        image: formData.image || "",
        discount: parseInt(formData.discount) || 0,
        featured: !!formData.featured || false,
        features: filteredFeatures || [],
        specifications: specificationsObject || {},
      };

      const token = getToken();
      await updateProduct(id, productData, token, isAdmin);
      toast.success("Product updated successfully");
      navigate("/admin/products");
    } catch (error) {
      console.error("Update error:", error);
      const errorMessage =
        error?.response?.data?.message ||
        error?.response?.data?.error ||
        error?.message ||
        "Failed to update product. Please check your data and try again.";
      toast.error(errorMessage);
      console.error("Update error:", errorMessage);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Loader2 className="h-12 w-12 animate-spin text-blue-500" />
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto py-8 px-4">
      <h1 className="text-2xl font-bold mb-8">Update Product</h1>

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
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                required
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
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                required
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
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                required
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
          <h3 className="text-lg font-semibold mb-4">Product Image</h3>
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
                      accept="image/png, image/jpeg, image/jpg, image/gif, image/webp"
                      onChange={handleImageUpload}
                      className="sr-only"
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
              <div className="relative">
                <img
                  src={formData.image}
                  alt="Product preview"
                  className="h-48 w-48 object-cover rounded-lg shadow-md"
                />
                <button
                  type="button"
                  onClick={() =>
                    setFormData((prev) => ({ ...prev, image: "" }))
                  }
                  className="absolute -top-2 -right-2 bg-red-100 rounded-full p-1 text-red-600 hover:text-red-800 hover:bg-red-200 transition-colors"
                  aria-label="Remove image"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
              <p className="mt-2 text-sm text-gray-500">
                {imageUploading
                  ? "Uploading..."
                  : "Image uploaded successfully"}
              </p>
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
            disabled={submitting}
            className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {submitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Updating...
              </>
            ) : (
              "Update Product"
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default UpdateProductDetails;
