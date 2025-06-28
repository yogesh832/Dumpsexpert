import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const useCartStore = create(
  persist(
    (set, get) => ({
      cartItems: [],
      
      // Add item to cart
      addToCart: (product) => {
        const { cartItems } = get();
        const existingItem = cartItems.find(item => item._id === product._id);
        
        if (existingItem) {
          // If item already exists, increase quantity
          const updatedItems = cartItems.map(item => 
            item._id === product._id 
              ? { ...item, quantity: item.quantity + 1 } 
              : item
          );
          set({ cartItems: updatedItems });
        } else {
          // Add new item with quantity 1
          set({ cartItems: [...cartItems, { ...product, quantity: 1 }] });
        }
      },
      
      // Remove item from cart
      removeFromCart: (productId) => {
        const { cartItems } = get();
        set({ cartItems: cartItems.filter(item => item._id !== productId) });
      },
      
      // Update item quantity
      updateQuantity: (productId, type) => {
        const { cartItems } = get();
        const updatedItems = cartItems.map(item => {
          if (item._id === productId) {
            const newQty = type === "inc" ? item.quantity + 1 : item.quantity - 1;
            return { ...item, quantity: Math.max(newQty, 0) };
          }
          return item;
        }).filter(item => item.quantity > 0); // Remove items with quantity 0
        
        set({ cartItems: updatedItems });
      },
      
      // Clear cart
      clearCart: () => set({ cartItems: [] }),
      
      // Get cart total
      getCartTotal: () => {
        const { cartItems } = get();
        return cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);
      },
      
      // Get cart count (for navbar)
      getCartCount: () => {
        const { cartItems } = get();
        return cartItems.reduce((count, item) => count + item.quantity, 0);
      }
    }),
    {
      name: 'cart-storage', // unique name for localStorage
      getStorage: () => localStorage, // use localStorage
    }
  )
);

export default useCartStore;