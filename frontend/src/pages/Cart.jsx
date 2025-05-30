import React, { useState } from "react";
import emptycartimg from "../assets/landingassets/emptycart.webp";
import Button from "../components/ui/Button";
import cartData from "../assets/cartData";

const Cart = () => {
  const [cartItems, setCartItems] = useState(cartData);

  const handleDelete = (id) => {
    setCartItems(cartItems.filter(item => item.id !== id));
  };

  const handleQuantityChange = (id, type) => {
    setCartItems(prevItems =>
      prevItems
        .map(item => {
          if (item.id === id) {
            const newQty = type === "inc" ? item.quantity + 1 : item.quantity - 1;
            return { ...item, quantity: newQty };
          }
          return item;
        })
        .filter(item => item.quantity > 0)
    );
  };

  const subtotal = cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);
  const discount = 0;
  const grandTotal = subtotal - discount;

  const handleCoupon = () => {
    alert("Coupon applied");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#f9f9f9] px-4 py-10">
      <div className="w-full max-w-7xl p-6 ">
        <div className="flex justify-center mb-8">
          <h2 className="text-4xl font-bold text-gray-800">Your Cart</h2>
        </div>

        <div className="flex flex-col lg:flex-row items-start justify-center gap-12">
          {/* Cart Items */}
          <div className="flex flex-col items-center w-full max-w-xl">
            {cartItems.length === 0 ? (
              <div className="flex flex-col items-center text-center space-y-4">
                <img src={emptycartimg} alt="empty_cart_img" className="w-64" draggable="false" />
                <p className="text-gray-600 text-lg">
                  Your cart is empty. Add items to your cart to proceed.
                </p>
              </div>
            ) : (
              <div className="space-y-4 w-full max-h-[450px] overflow-y-auto pr-2">
                {cartItems.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center justify-between bg-white border border-gray-200 p-4 rounded-lg shadow-sm hover:shadow-md transition duration-200"
                  >
                    <div className="flex items-center gap-4">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-16 h-16 object-cover rounded-lg border border-gray-100"
                      />
                      <div>
                        <h4 className="text-lg font-semibold text-gray-800">{item.name}</h4>
                        <div className="flex items-center gap-2 mt-2">
                          <button
                            onClick={() => handleQuantityChange(item.id, "dec")}
                            className="px-3 py-1 bg-gray-200 rounded hover:bg-gray-300 text-lg"
                          >
                            −
                          </button>
                          <span className="px-3 py-1 border rounded text-gray-700 bg-white">{item.quantity}</span>
                          <button
                            onClick={() => handleQuantityChange(item.id, "inc")}
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
                        onClick={() => handleDelete(item.id)}
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
          <div className="w-full max-w-sm bg-gray-50 p-6 rounded-xl shadow-md border">
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
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;
