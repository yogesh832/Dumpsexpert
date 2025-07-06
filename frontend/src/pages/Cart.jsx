import React, { useState } from "react";
import emptycartimg from "../assets/landingassets/emptycart.webp";
import Button from "../components/ui/Button";
import useCartStore from "../store/useCartStore";
import axios from 'axios';

// Add this near your other imports
axios.defaults.baseURL = import.meta.env.VITE_API_URL;
axios.defaults.withCredentials = true;

const Cart = () => {
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const cartItems = useCartStore(state => state.cartItems);
  const removeFromCart = useCartStore(state => state.removeFromCart);
  const updateQuantity = useCartStore(state => state.updateQuantity);
  const getCartTotal = useCartStore(state => state.getCartTotal);

  const handlePayment = async (gateway) => {
    try {
      const orderData = {
        amount: grandTotal,
        currency: "INR",
        items: cartItems.map(item => ({
          name: item.title,
          quantity: item.quantity,
          price: item.price
        }))
      };

      if (gateway === 'razorpay') {
        const response = await axios.post('/api/payments/razorpay/create-order', orderData);
        const options = {
          key: import.meta.env.VITE_RAZORPAY_KEY_ID,
          amount: response.data.amount,
          currency: response.data.currency,
          order_id: response.data.id,
          name: "DumpsExpert",
          description: "Purchase Exam Dumps",
          handler: async (response) => {
            try {
              await axios.post('/api/payments/razorpay/verify', {
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_order_id: response.razorpay_order_id,
                razorpay_signature: response.razorpay_signature,
                amount: orderData.amount
              });
              window.location.href = '/dashboard/student';
            } catch (error) {
              console.error('Payment verification failed:', error);
              alert('Payment verification failed');
            }
          },
          theme: {
            color: "#3B82F6"
          }
        };
        const rzp = new window.Razorpay(options);
        rzp.open();
      } else if (gateway === 'stripe') {
        const response = await axios.post('/api/payments/stripe/create-session', orderData);
        window.location.href = response.data.sessionUrl;
      }
    } catch (error) {
      console.error('Payment initiation failed:', error);
      alert('Payment initiation failed');
    }
    setShowPaymentModal(false);
  };

  const handleDelete = (id) => {
    removeFromCart(id);
  };

  const handleQuantityChange = (id, type) => {
    updateQuantity(id, type);
  };

  const subtotal = getCartTotal();
  const discount = 0;
  const grandTotal = subtotal - discount;

  const handleCoupon = () => {
    alert("Coupon applied");
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
              <p className="text-gray-600 text-lg">
                Your cart is empty. Add items to your cart to proceed.
              </p>
            </div>
          ) : (
            <div className="space-y-4 w-full max-h-[565px] overflow-y-auto pr-2">
              {cartItems.map((item) => (
                <div
                  key={item._id}
                  className="flex items-center justify-between bg-white border border-gray-200 p-4 rounded-lg shadow-sm hover:shadow-md transition duration-200"
                >
                  <div className="flex items-center gap-4">
                    <img
                      src={item.imageUrls?.[0] || 'https://via.placeholder.com/100'}
                      alt={item.title}
                      className="w-16 h-16 object-cover rounded-lg border border-gray-100"
                    />
                    <div>
                      <h4 className="text-lg font-semibold text-gray-800">{item.title}</h4>
                      <div className="flex items-center gap-2 mt-2">
                        <button
                          onClick={() => handleQuantityChange(item._id, "dec")}
                          className="px-3 py-1 bg-gray-200 rounded hover:bg-gray-300 text-lg"
                        >
                          −
                        </button>
                        <span className="px-3 py-1 border rounded text-gray-700 bg-white">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => handleQuantityChange(item._id, "inc")}
                          className="px-3 py-1 bg-gray-200 rounded hover:bg-gray-300 text-lg"
                        >
                          +
                        </button>
                      </div>
                    </div>
                  </div>
                  <div className="text-right space-y-2">
                    <p className="text-gray-800 font-semibold text-lg">
                      ₹{item.price * item.quantity}
                    </p>
                    <button
                      onClick={() => handleDelete(item._id)}
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
            <p>Subtotal (Price): <span className="float-right">₹{subtotal}</span></p>
            <p>Discount: <span className="float-right text-green-600">₹{discount}</span></p>
          </div>

          <hr className="my-4" />

          <div className="flex gap-2">
            <input
              type="text"
              placeholder="Enter coupon code"
              className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <Button variant="blue" onClick={handleCoupon}>Apply</Button>
          </div>

          <hr className="my-4" />

          <p className="font-medium text-lg">
            Grand Total: <span className="float-right text-green-600">₹{grandTotal}</span>
          </p>

          {cartItems.length > 0 && (
            <div className="mt-6">
              <Button 
                variant="blue" 
                className="w-full"
                onClick={() => setShowPaymentModal(true)}
              >
                Continue to Payment
              </Button>
            </div>
          )}
        </div>
      </div>

      {/* Payment Gateway Modal */}
      {showPaymentModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h3 className="text-xl font-semibold mb-4">Select Payment Method</h3>
            <div className="space-y-4">
              <button
                onClick={() => handlePayment('razorpay')}
                className="w-full p-4 border rounded-lg hover:bg-gray-50 flex items-center justify-between"
              >
                <span>Pay with Razorpay</span>
                <span>→</span>
              </button>
              <button
                onClick={() => handlePayment('stripe')}
                className="w-full p-4 border rounded-lg hover:bg-gray-50 flex items-center justify-between"
              >
                <span>Pay with Stripe</span>
                <span>→</span>
              </button>
            </div>
            <button
              onClick={() => setShowPaymentModal(false)}
              className="mt-4 text-gray-600 hover:text-gray-800"
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
