"use client";
import { useQuery } from "@tanstack/react-query";
import { Product } from "@/types/product";

const fetchProduct = async (productId: string): Promise<Product> => {
  const response = await fetch(`/api/products/${productId}`);
  if (!response.ok) {
    throw new Error("Failed to fetch product");
  }
  return response.json();
};

export const useProduct = (productId: string) => {
  return useQuery<Product>({
    queryKey: ["product", productId],
    queryFn: () => fetchProduct(productId),
    enabled: !!productId,
  });
};
