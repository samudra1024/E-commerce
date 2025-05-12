import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import AuthContext from "../../context/AuthContext";
import { CartContext } from "../../context/CartContext";
import { toast } from "react-toastify";
import axios from "axios";

const CheckoutForm = () => {
  const { user } = useContext(AuthContext);
  const { cart, total, clearCart } = useContext(CartContext);
  const navigate = useNavigate();

  // Initialize form with user data if available
  const [formData, setFormData] = useState({
    fullName: user?.name || "",
    email: user?.email || "",
    address: "",
    city: "",
    postalCode: "",
    country: "",
    paymentMethod: "creditCard",
    cardNumber: "",
    cardName: "",
    expiryDate: "",
    cvv: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (cart.length === 0) {
      toast.error("Your cart is empty. Add some products before checkout.");
      return;
    }

    try {
      setIsSubmitting(true);

      // Create order items from cart
      const orderItems = cart.map((item) => ({
        product: item._id,
        name: item.name,
        image: item.image,
        price:
          item.discount > 0
            ? item.price * (1 - item.discount / 100)
            : item.price,
        quantity: item.quantity,
      }));

      // Create order object
      const order = {
        orderItems,
        shippingAddress: {
          address: formData.address,
          city: formData.city,
          postalCode: formData.postalCode,
          country: formData.country,
        },
        paymentMethod: formData.paymentMethod,
        itemsPrice: total,
        taxPrice: (total * 0.1).toFixed(2), // 10% tax
        shippingPrice: total > 100 ? 0 : 10, // Free shipping over $100
        totalPrice:
          total > 100
            ? (total + total * 0.1).toFixed(2)
            : (total + total * 0.1 + 10).toFixed(2),
      };
      // Retrieve token from sessionStorage
      let token = "";
      const userStr = sessionStorage.getItem("user");
      if (userStr) {
        try {
          token = JSON.parse(userStr)?.token ?? "";
        } catch {
          token = "";
        }
      }

      // Send order to backend
      const response = await axios.post("/api/orders", order, {
        headers: { Authorization: token },
      });

      // Clear cart after successful order
      clearCart();

      // Redirect to order success page with order ID
      navigate(`/orders/${response.data._id}`, {
        state: { success: true },
      });

      toast.success("Order placed successfully!");
    } catch (error) {
      console.error("Checkout error:", error);
      toast.error(
        error.response?.data?.message ||
          "Failed to place order. Please try again."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  // Calculate order summary
  const subtotal = total;
  const tax = (subtotal * 0.1).toFixed(2);
  const shipping = subtotal > 100 ? 0 : 10;
  const orderTotal = (
    parseFloat(subtotal) +
    parseFloat(tax) +
    shipping
  ).toFixed(2);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      {/* Checkout Form */}
      <div className="lg:col-span-2">
        <form
          onSubmit={handleSubmit}
          className="bg-white p-6 rounded-lg shadow-sm"
        >
          {/* Shipping Information */}
          <div className="mb-8">
            <h3 className="text-lg font-semibold mb-4 pb-2 border-b border-gray-200">
              Shipping Information
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label
                  htmlFor="fullName"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Full Name
                </label>
                <input
                  type="text"
                  id="fullName"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleChange}
                  required
                  className="input"
                />
              </div>
              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Email Address
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="input"
                />
              </div>
              <div className="md:col-span-2">
                <label
                  htmlFor="address"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Street Address
                </label>
                <input
                  type="text"
                  id="address"
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  required
                  className="input"
                />
              </div>
              <div>
                <label
                  htmlFor="city"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  City
                </label>
                <input
                  type="text"
                  id="city"
                  name="city"
                  value={formData.city}
                  onChange={handleChange}
                  required
                  className="input"
                />
              </div>
              <div>
                <label
                  htmlFor="postalCode"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Postal Code
                </label>
                <input
                  type="text"
                  id="postalCode"
                  name="postalCode"
                  value={formData.postalCode}
                  onChange={handleChange}
                  required
                  className="input"
                />
              </div>
              <div className="md:col-span-2">
                <label
                  htmlFor="country"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Country
                </label>
                <input
                  type="text"
                  id="country"
                  name="country"
                  value={formData.country}
                  onChange={handleChange}
                  required
                  className="input"
                />
              </div>
            </div>
          </div>

          {/* Payment Method */}
          <div className="mb-8">
            <h3 className="text-lg font-semibold mb-4 pb-2 border-b border-gray-200">
              Payment Method
            </h3>
            <div className="space-y-4">
              <div>
                <div className="flex items-center mb-4">
                  <input
                    type="radio"
                    id="creditCard"
                    name="paymentMethod"
                    value="creditCard"
                    checked={formData.paymentMethod === "creditCard"}
                    onChange={handleChange}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500"
                  />
                  <label
                    htmlFor="creditCard"
                    className="ml-2 text-sm font-medium text-gray-700"
                  >
                    Credit Card
                  </label>
                </div>

                {formData.paymentMethod === "creditCard" && (
                  <div className="pl-6 space-y-4">
                    <div>
                      <label
                        htmlFor="cardNumber"
                        className="block text-sm font-medium text-gray-700 mb-1"
                      >
                        Card Number
                      </label>
                      <input
                        type="text"
                        id="cardNumber"
                        name="cardNumber"
                        value={formData.cardNumber}
                        onChange={handleChange}
                        placeholder="XXXX XXXX XXXX XXXX"
                        required
                        className="input"
                      />
                    </div>
                    <div>
                      <label
                        htmlFor="cardName"
                        className="block text-sm font-medium text-gray-700 mb-1"
                      >
                        Cardholder Name
                      </label>
                      <input
                        type="text"
                        id="cardName"
                        name="cardName"
                        value={formData.cardName}
                        onChange={handleChange}
                        required
                        className="input"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label
                          htmlFor="expiryDate"
                          className="block text-sm font-medium text-gray-700 mb-1"
                        >
                          Expiry Date
                        </label>
                        <input
                          type="text"
                          id="expiryDate"
                          name="expiryDate"
                          value={formData.expiryDate}
                          onChange={handleChange}
                          placeholder="MM/YY"
                          required
                          className="input"
                        />
                      </div>
                      <div>
                        <label
                          htmlFor="cvv"
                          className="block text-sm font-medium text-gray-700 mb-1"
                        >
                          CVV
                        </label>
                        <input
                          type="text"
                          id="cvv"
                          name="cvv"
                          value={formData.cvv}
                          onChange={handleChange}
                          placeholder="123"
                          required
                          className="input"
                        />
                      </div>
                    </div>
                  </div>
                )}
              </div>

              <div>
                <div className="flex items-center">
                  <input
                    type="radio"
                    id="paypal"
                    name="paymentMethod"
                    value="paypal"
                    checked={formData.paymentMethod === "paypal"}
                    onChange={handleChange}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500"
                  />
                  <label
                    htmlFor="paypal"
                    className="ml-2 text-sm font-medium text-gray-700"
                  >
                    PayPal
                  </label>
                </div>
              </div>
            </div>
          </div>

          {/* Submit Button - Mobile Only */}
          <div className="lg:hidden mt-6">
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full btn btn-primary py-3 text-lg font-semibold"
            >
              {isSubmitting ? "Processing..." : `Place Order - $${orderTotal}`}
            </button>
          </div>
        </form>
      </div>

      {/* Order Summary */}
      <div className="lg:col-span-1">
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <h3 className="text-lg font-semibold mb-4 pb-2 border-b border-gray-200">
            Order Summary
          </h3>

          <div className="space-y-3 mb-4">
            {/* Cart Items Summary */}
            <div className="max-h-60 overflow-y-auto scrollbar-thin pr-2">
              {cart.map((item) => (
                <div
                  key={item._id}
                  className="flex justify-between py-2 border-b border-gray-100"
                >
                  <div className="flex items-center">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-10 h-10 object-cover rounded"
                    />
                    <div className="ml-2">
                      <p className="text-sm font-medium">{item.name}</p>
                      <p className="text-xs text-gray-500">
                        Qty: {item.quantity}
                      </p>
                    </div>
                  </div>
                  <span className="text-sm font-semibold">
                    $
                    {(
                      (item.discount > 0
                        ? item.price * (1 - item.discount / 100)
                        : item.price) * item.quantity
                    ).toFixed(2)}
                  </span>
                </div>
              ))}
            </div>

            {/* Pricing Details */}
            <div className="pt-4 space-y-2">
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
                  {shipping === 0 ? "Free" : `$${shipping.toFixed(2)}`}
                </span>
              </div>
              <div className="border-t border-gray-200 pt-2 mt-2">
                <div className="flex justify-between">
                  <span className="font-semibold">Total</span>
                  <span className="font-bold text-lg">${orderTotal}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Submit Button - Desktop */}
          <div className="hidden lg:block mt-6">
            <button
              type="submit"
              form="checkout-form"
              disabled={isSubmitting}
              onClick={handleSubmit}
              className="w-full btn btn-primary py-3 text-lg font-semibold"
            >
              {isSubmitting ? "Processing..." : "Place Order"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutForm;
