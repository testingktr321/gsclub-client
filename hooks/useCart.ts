import { create } from "zustand";
import toast from "react-hot-toast";
import axios from "axios";
import { CartItem } from "@/types/cart";

interface CartStore {
  items: CartItem[];
  loading: boolean;
  setItems: (items: CartItem[]) => void;
  setLoading: (loading: boolean) => void;
  initializeCart: (email: string) => Promise<boolean>;
  loadCart: (email: string) => Promise<boolean>;
  addItem: (email: string | null, item: CartItem) => Promise<boolean>;
  removeItem: (email: string | null, id: string) => Promise<boolean>;
  clearCart: (email: string | null) => Promise<boolean>;
  incrementQuantity: (email: string | null, id: string) => Promise<boolean>;
  decrementQuantity: (email: string | null, id: string) => Promise<boolean>;
  syncCart: (email: string, items: CartItem[]) => Promise<boolean>;
}

const useCart = create<CartStore>((set, get) => ({
  items: [],
  loading: false,
  setItems: (items) => set({ items }),
  setLoading: (loading) => set({ loading }),

  // Initialize cart or get existing cart
  async initializeCart(email) {
    try {
      const response = await axios.post("/api/cart/initial", { email });
      const cart = response.data;
      set({ items: cart.items });
      return true;
    } catch (error) {
      console.error("Failed to initialize cart:", error);
      toast.error("Failed to load cart");
      return false;
    }
  },

  // Load cart by email
  async loadCart(email) {
    try {
      const response = await axios.get(`/api/cart/${email}`);
      set({ items: response.data.items });
      return true;
    } catch (error) {
      console.error("Error loading cart:", error);
      toast.error("Failed to load cart");
      return false;
    }
  },

  // Add item to cart
  async addItem(email, item) {
    const { items: currentItems, loading } = get();
    if (loading) return false;

    set({ loading: true });

    // Check if the item already exists in the cart
    const existingItem = currentItems.find((i) => i.id === item.id);

    let updatedItems;

    if (existingItem) {
      // If the item exists, update its quantity by adding the new quantity
      updatedItems = currentItems.map((i) =>
        i.id === item.id ? { ...i, quantity: i.quantity + item.quantity } : i
      );
    } else {
      // If the item doesn't exist, add it to the cart
      updatedItems = [...currentItems, item];
    }

    if (email) {
      try {
        // Update the cart on the server
        const response = await axios.patch(`/api/cart/${email}`, {
          items: updatedItems,
        });

        if (response.status === 200) {
          set({ items: updatedItems });
          toast.success("Item added to cart");
          set({ loading: false });
          return true;
        }
      } catch (error) {
        console.error("Error adding item to cart:", error);
        toast.error("Failed to add item");
        set({ loading: false });
      }
    } else {
      // Save to local storage
      localStorage.setItem("cart", JSON.stringify(updatedItems));
      set({ items: updatedItems });
      toast.success("Item added to cart");
      set({ loading: false });
      return true;
    }

    return false;
  },

  // Remove item from cart
  async removeItem(email, id) {
    const { items, loading } = get();
    if (loading) return false;

    set({ loading: true });
    const updatedItems = items.filter((i) => i.id !== id);

    if (email) {
      try {
        const response = await axios.patch(`/api/cart/${email}`, {
          items: updatedItems,
        });
        if (response.status === 200) {
          set({ items: updatedItems });
          toast.success("Item removed from cart");
          set({ loading: false });
          return true;
        }
      } catch (error) {
        console.error("Error removing item:", error);
        toast.error("Failed to remove item");
        set({ loading: false });
      }
    } else {
      // Save to local storage
      localStorage.setItem("cart", JSON.stringify(updatedItems));
      set({ items: updatedItems });
      toast.success("Item removed from cart");
      set({ loading: false });
      return true;
    }
    return false;
  },

  // Clear cart
  async clearCart(email) {
    const { loading } = get();
    if (loading) return false;

    set({ loading: true });
    if (email) {
      try {
        const response = await axios.patch(`/api/cart/${email}`, { items: [] });
        if (response.status === 200) {
          set({ items: [] });
          // toast.success("Cart cleared");
          set({ loading: false });
          return true;
        }
      } catch (error) {
        console.error("Error clearing cart:", error);
        toast.error("Failed to clear cart");
        set({ loading: false });
      }
    } else {
      // Clear local storage
      localStorage.removeItem("cart");
      set({ items: [] });
      // toast.success("Cart cleared");
      set({ loading: false });
      return true;
    }
    return false;
  },

  // Increment item quantity
  async incrementQuantity(email, id) {
    const { items, loading } = get();
    if (loading) return false;

    set({ loading: true });

    const updatedItems = items.map((item) =>
      item.id === id ? { ...item, quantity: item.quantity + 1 } : item
    );

    if (email) {
      try {
        const response = await axios.patch(`/api/cart/${email}`, {
          items: updatedItems,
        });
        if (response.status === 200) {
          set({ items: updatedItems });
          toast.success("Quantity updated");
          set({ loading: false });
          return true;
        }
      } catch (error) {
        console.error("Error updating quantity:", error);
        toast.error("Failed to update quantity");
        set({ loading: false });
      }
    } else {
      // Save to local storage
      localStorage.setItem("cart", JSON.stringify(updatedItems));
      set({ items: updatedItems });
      toast.success("Quantity updated");
      set({ loading: false });
      return true;
    }
    return false;
  },

  // Decrement item quantity
  async decrementQuantity(email, id) {
    const { items, loading } = get();
    if (loading) return false;

    set({ loading: true });
    const updatedItems = items
      .map((item) => {
        if (item.id === id) {
          if (item.quantity === 1) return null;
          return { ...item, quantity: item.quantity - 1 };
        }
        return item;
      })
      .filter(Boolean) as CartItem[];

    if (email) {
      try {
        const response = await axios.patch(`/api/cart/${email}`, {
          items: updatedItems,
        });
        if (response.status === 200) {
          set({ items: updatedItems });
          toast.success("Quantity updated");
          set({ loading: false });
          return true;
        }
      } catch (error) {
        console.error("Error updating quantity:", error);
        toast.error("Failed to update quantity");
        set({ loading: false });
      }
    } else {
      // Save to local storage
      localStorage.setItem("cart", JSON.stringify(updatedItems));
      set({ items: updatedItems });
      toast.success("Quantity updated");
      set({ loading: false });
      return true;
    }
    return false;
  },

  // Sync local cart with server when user logs in
  async syncCart(email, localItems) {
    try {
      // Fetch the server cart data
      const serverResponse = await axios.get(`/api/cart/${email}`);
      const serverItems = serverResponse.data.items || [];

      // Merge local and server cart items
      const mergedItems = mergeCarts(serverItems, localItems);

      // Update the server with the merged cart
      const updateResponse = await axios.patch(`/api/cart/${email}`, {
        items: mergedItems,
      });

      if (updateResponse.status === 200) {
        set({ items: mergedItems }); // Update the Zustand store with the merged items
        return true;
      }
    } catch (error) {
      console.error("Error syncing cart:", error);
      toast.error("Failed to sync cart");
    }
    return false;
  },
}));

// Helper function to merge local and server cart items
function mergeCarts(
  serverItems: CartItem[],
  localItems: CartItem[]
): CartItem[] {
  const mergedItems = [...serverItems];

  localItems.forEach((localItem) => {
    const existingItem = mergedItems.find((item) => item.id === localItem.id);
    if (existingItem) {
      // If the item exists in both carts, update the quantity
      existingItem.quantity += localItem.quantity;
    } else {
      // If the item is only in the local cart, add it to the merged cart
      mergedItems.push(localItem);
    }
  });

  return mergedItems;
}

export default useCart;
