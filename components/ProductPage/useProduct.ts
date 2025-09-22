"use client";
import { useQuery } from "@tanstack/react-query";
import { Product } from "@/types/product";

const fetchProduct = async (productSlug: string): Promise<Product> => {
  const response = await fetch(`/api/products/${productSlug}`);
  if (!response.ok) {
    throw new Error("Failed to fetch product");
  }
  return response.json();
};

export const useProduct = (productSlug: string) => {
  return useQuery<Product>({
    queryKey: ["product", productSlug],
    queryFn: () => fetchProduct(productSlug),
    enabled: !!productSlug,
  });
};
