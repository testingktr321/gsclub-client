import { Review } from "@prisma/client";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-hot-toast";

interface CreateReviewParams {
  productId: string;
  productSlug: string;
  reviewData: {
    userName: string;
    userEmail: string;
    rating: number;
    title: string;
    comment: string;
  };
}

interface DeleteReviewParams {
  reviewId: string;
  userEmail: string;
  productId: string;
  productSlug: string;
}

interface DeleteReviewResponse {
  success: boolean;
  message: string;
}

const createReview = async ({
  productId,
  reviewData,
}: CreateReviewParams): Promise<Review> => {
  const response = await fetch("/api/review", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      ...reviewData,
      productId,
    }),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || "Failed to create review");
  }

  return response.json();
};

const deleteReview = async ({
  reviewId,
  userEmail,
  productId,
}: DeleteReviewParams): Promise<DeleteReviewResponse> => {
  const url = `/api/review/${reviewId}?userEmail=${encodeURIComponent(
    userEmail
  )}&productId=${encodeURIComponent(productId)}`;

  const response = await fetch(url, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || "Failed to delete review");
  }

  return response.json();
};

export const useCreateReview = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createReview,
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["product", variables.productSlug],
      });
      toast.success("Review submitted successfully!");
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to create review");
    },
  });
};

export const useDeleteReview = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteReview,
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["product", variables.productSlug],
      });
      toast.success("Review deleted successfully!");
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to delete review");
    },
  });
};