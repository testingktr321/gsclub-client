import { useQuery } from "@tanstack/react-query";

// Types for TypeScript (optional)
export interface FaqItem {
  question: string;
  answer: string;
  order: number;
}

export interface FaqPage {
  id: string;
  pageSlug: string;
  faqs: FaqItem[];
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

// API functions
const fetchAllFAQs = async (): Promise<FaqPage[]> => {
  const response = await fetch("/api/faqs");
  if (!response.ok) {
    throw new Error("Failed to fetch FAQs");
  }
  return response.json();
};

const fetchFAQBySlug = async (pageSlug: string): Promise<FaqPage> => {
  const response = await fetch(`/api/faq?pageSlug=${pageSlug}`);
  if (!response.ok) {
    if (response.status === 404) {
      throw new Error("FAQ page not found");
    }
    throw new Error("Failed to fetch FAQ");
  }
  return response.json();
};

// Hook for getting all FAQs
export const useAllFAQs = () => {
  return useQuery({
    queryKey: ["faqs"],
    queryFn: fetchAllFAQs,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes (previously cacheTime)
  });
};

// Hook for getting FAQ by specific slug
export const useFAQBySlug = (pageSlug: string) => {
  return useQuery({
    queryKey: ["faqs", pageSlug],
    queryFn: () => fetchFAQBySlug(pageSlug),
    enabled: !!pageSlug, // Only run if pageSlug is provided
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
    retry: (failureCount, error) => {
      // Don't retry on 404 errors
      if (error.message === "FAQ page not found") {
        return false;
      }
      return failureCount < 3;
    },
  });
};

// Combined hook that can handle both cases
export const useFAQs = (pageSlug?: string) => {
  const allFAQsQuery = useAllFAQs();
  const specificFAQQuery = useFAQBySlug(pageSlug || "");

  if (pageSlug) {
    return {
      data: specificFAQQuery.data,
      isLoading: specificFAQQuery.isLoading,
      error: specificFAQQuery.error,
      isError: specificFAQQuery.isError,
      refetch: specificFAQQuery.refetch,
    };
  }

  return {
    data: allFAQsQuery.data,
    isLoading: allFAQsQuery.isLoading,
    error: allFAQsQuery.error,
    isError: allFAQsQuery.isError,
    refetch: allFAQsQuery.refetch,
  };
};

// Hook for getting FAQ items from a specific page (just the faqs array)
export const useFAQItems = (pageSlug: string) => {
  const { data, isLoading, error, isError } = useFAQBySlug(pageSlug);

  return {
    faqs: data?.faqs || [],
    isLoading,
    error,
    isError,
  };
};
