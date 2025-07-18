import React, { useState } from "react";
import emptycartimg from "../assets/landingassets/emptycart.webp";
import Button from "../components/ui/Button";
import useCartStore from "../store/useCartStore";
import { instance } from "../lib/axios";
import { PayPalButtons } from "@paypal/react-paypal-js";

const Cart = () => {
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [showPayPal, setShowPayPal] = useState(false);
  const [couponCode, setCouponCode] = useState(""); // State for coupon code input
  const [couponError, setCouponError] = useState(""); // State for coupon error messages
  const [discount, setDiscount] = useState(0); // State for applied discount
  const [couponApplied, setCouponApplied] = useState(false); // State to track if coupon is applied
  const cartItems = useCartStore((state) => state.cartItems);
  const removeFromCart = useCartStore((state) => state.removeFromCart);
  const updateQuantity = useCartStore((state) => state.updateQuantity);
  const getCartTotal = useCartStore((state) => state.getCartTotal);

  const subtotal = getCartTotal();
  const grandTotal = subtotal - discount;

  const handleDelete = (id, type) => {
    console.log('handleDelete called with:', { id, type });
    removeFromCart(id, type);
  };

  const handleQuantityChange = (id, type, operation) => {
    console.log('handleQuantityChange called with:', { id, type, operation });
    updateQuantity(id, type, operation);
  };

  const handleCoupon = async () => {
    if (!couponCode) {
      setCouponError("Please enter a coupon code");
      return;
    }

    try {
      const response = await instance.post("/api/coupons/validate", {
        code: couponCode,
      });
      const { discount } = response.data.coupon;
      setDiscount(discount); // Assumes discount is a fixed amount in INR
      setCouponError("");
      setCouponApplied(true);
      setCouponCode(""); // Clear input after successful application
      alert(`Coupon applied successfully! You saved ₹${discount}`);
    } catch (error) {
      setCouponError(error.response?.data?.message || "Failed to apply coupon");
      setDiscount(0);
      setCouponApplied(false);
    }
  };

  const handleRazorpayPayment = async () => {
    try {
      const orderData = {
        amount: grandTotal,
        currency: "INR",
      };
      const response = await instance.post("/api/payments/razorpay/create-order", orderData);
      const { id, amount, currency } = response.data;

      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID || "rzp_test_7kAotmP1o8JR8V",
        amount: amount,
        currency: currency,
        order_id: id,
        name: "DumpsExpert",
        description: "Purchase Exam Dumps",
        handler: async (response) => {
          try {
            await instance.post("/api/payments/razorpay/verify", {
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_order_id: response.razorpay_order_id,
              razorpay_signature: response.razorpay_signature,
              amount: orderData.amount,
            });
            window.location.href = "/student/dashboard";
          } catch (error) {
            console.error("Verification failed:", error);
            alert("Payment verification failed.");
          }
        },
        theme: {
          color: "#3B82F6",
        },
      };
      const rzp = new window.Razorpay(options);
      rzp.open();
      setShowPaymentModal(false);
    } catch (error) {
      console.error("Payment initiation failed:", error);
      alert("Payment initiation failed");
    }
  };

  return (
    <div className="min-h-[80vh] bg-[#f9f9f9] px-4 py-10">
      <div className="flex justify-center mt-16 mb-4">
        <h2 className="text-4xl font-bold text-gray-800">Your Cart</h2>
      </div>

      <div className="flex flex-col items-center lg:flex-row justify-between gap-6 w-full">
        {/* Cart Items */}
        <div className="w-full lg:w-[65%]">
          {cartItems.length === 0 ? (
            <div className="flex flex-col items-center text-center space-y-4">
              <img src={emptycartimg} alt="empty_cart_img" className="w-64" draggable="false" />
              <p className="text-gray-600 text-lg">Your cart is empty. Add items to your cart to proceed.</p>
            </div>
          ) : (
            <div className="space-y-4 w-full max-h-[565px] overflow-y-auto pr-2">
              {cartItems.map((item) => (
                <div key={`${item._id}-${item.type}`} className="flex items-center justify-between bg-white border p-4 rounded-lg shadow-sm">
                  <div className="flex items-center gap-4">
                    <img
                      src={item.imageUrl || "https://via.placeholder.com/100"}
                      alt={item.title}
                      className="w-16 h-16 object-cover rounded-lg border"
                    />
                    <div>
                      <h4 className="text-lg font-semibold">{item.title}</h4>
                      <div className="flex items-center gap-2 mt-2">
                        <button
                          onClick={() => handleQuantityChange(item._id, item.type, "dec")}
                          className="px-3 py-1 bg-gray-200 rounded"
                        >
                          −
                        </button>
                        <span className="px-3 py-1 border rounded bg-white">{item.quantity}</span>
                        <button
                          onClick={() => handleQuantityChange(item._id, item.type, "inc")}
                          className="px-3 py-1 bg-gray-200 rounded"
                        >
                          +
                        </button>
                      </div>
                    </div>
                  </div>
                  <div className="text-right space-y-2">
                    <p className="text-lg font-semibold">₹{item.price * item.quantity}</p>
                    <button
                      onClick={() => handleDelete(item._id, item.type)}
                      className="text-red-500 text-sm hover:underline"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Order Summary */}
        <div className="w-full lg:w-[35%] h-96 bg-gray-50 p-6 rounded-xl shadow-md border">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Order Summary</h2>

          <div className="text-gray-700 space-y-2 text-sm">
            <p>Total (MRP): <span className="float-right">₹{subtotal}</span></p>
            <p>Subtotal: <span className="float-right">₹{subtotal}</span></p>
            <p>Discount: <span className="float-right text-green-600">₹{discount}</span></p>
            {couponApplied && (
              <p className="text-green-600 text-sm">Coupon applied! You saved ₹{discount}</p>
            )}
          </div>

          <hr className="my-4" />

          <div className="flex gap-2">
            <input
              type="text"
              placeholder="Enter coupon code"
              value={couponCode}
              onChange={(e) => setCouponCode(e.target.value)}
              className="flex-1 px-3 py-2 border border-gray-300 rounded-md"
            />
            <Button variant="blue" onClick={handleCoupon}>
              Apply
            </Button>
          </div>
          {couponError && <p className="text-red-500 text-sm mt-2">{couponError}</p>}

          <hr className="my-4" />

          <p className="font-medium text-lg">
            Grand Total: <span className="float-right text-green-600">₹{grandTotal}</span>
          </p>

          {cartItems.length > 0 && (
            <div className="mt-6">
              <Button variant="blue" className="w-full" onClick={() => setShowPaymentModal(true)}>
                Continue to Payment
              </Button>
            </div>
          )}
        </div>
      </div>

      {/* Payment Gateway Modal */}
      {showPaymentModal && (
        <div className="fixed inset-0 backdrop-blur-sm bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md space-y-4 shadow-xl">
            <h3 className="text-xl font-semibold text-center">Select Payment Method</h3>

            {/* Razorpay Button */}
            <button
              onClick={handleRazorpayPayment}
              className="w-full flex items-center justify-center gap-3 px-4 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg shadow transition"
            >
              <img
                src="https://upload.wikimedia.org/wikipedia/commons/8/89/Razorpay_logo.svg"
                alt="Razorpay"
                className="w-20 h-10"
              />
              Pay with Razorpay
            </button>

            {/* PayPal Button */}
            {!showPayPal && (
              <button
                onClick={() => setShowPayPal(true)}
                className="w-full flex items-center justify-center gap-3 px-4 py-3 bg-yellow-400 hover:bg-yellow-500 text-gray-800 font-semibold rounded-lg shadow transition"
              >
                <img
                  src="https://www.paypalobjects.com/webstatic/icon/pp258.png"
                  alt="PayPal"
                  className="w-6 h-6"
                />
                Pay with PayPal
              </button>
            )}

            {/* PayPal Component */}
            {showPayPal && (
              <div className="mt-4">
                <PayPalButtons
                  style={{ layout: "vertical" }}
                  createOrder={(data, actions) => {
                    return actions.order.create({
                      purchase_units: [
                        {
                          amount: {
                            value: (grandTotal / 83).toFixed(2), // Convert INR to USD (approx. rate)
                          },
                        },
                      ],
                    });
                  }}
                  onApprove={async (data, actions) => {
                    const details = await actions.order.capture();
                    await instance.post(
                      "/api/payments/paypal/process",
                      {
                        orderID: data.orderID,
                        amount: grandTotal,
                      },
                      {
                        headers: {
                          Authorization: `Bearer ${localStorage.getItem("token")}`,
                        },
                      }
                    );
                    alert(`Payment completed by ${details.payer.name.given_name}`);
                    window.location.href = "/student/dashboard";
                  }}
                  onError={(err) => {
                    console.error("PayPal Error:", err);
                    alert("Payment failed");
                  }}
                />
              </div>
            )}

            {/* Cancel */}
            <button
              onClick={() => {
                setShowPaymentModal(false);
                setShowPayPal(false);
              }}
              className="block mx-auto mt-2 text-sm text-gray-500 hover:underline"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Cart;