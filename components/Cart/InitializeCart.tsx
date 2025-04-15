"use client";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import useCart from "@/hooks/useCart";
import { CartItem } from "@/types/cart";

export default function InitializeCart() {
    const { data: session, status } = useSession();
    const initializeCart = useCart((state) => state.initializeCart);
    const syncCart = useCart((state) => state.syncCart);
    const setItems = useCart((state) => state.setItems);

    // Track whether the cart has been initialized
    const [cartInitialized, setCartInitialized] = useState(false);

    // Initialize cart when the user is logged in
    useEffect(() => {
        if (status === "authenticated" && session?.user?.email) {
            initializeCart(session.user.email).then(() => {
                setCartInitialized(true);
            });
        }
    }, [status, session, initializeCart]);

    // Load local cart when the user is not logged in
    useEffect(() => {
        if (status === "unauthenticated") {
            const localCart = localStorage.getItem("cart");
            if (localCart) {
                const localItems = JSON.parse(localCart) as CartItem[];
                setItems(localItems);
            }
        }
    }, [status, setItems]);

    // Sync local cart with the server only after cart is initialized
    useEffect(() => {
        if (status === "authenticated" && session?.user?.email && cartInitialized) {
            const localCart = localStorage.getItem("cart");
            if (localCart) {
                const localItems = JSON.parse(localCart) as CartItem[];
                syncCart(session.user.email, localItems).then((success) => {
                    if (success) {
                        localStorage.removeItem("cart");
                    }
                });
            }
        }
    }, [status, session, syncCart, cartInitialized]);

    return null;
}