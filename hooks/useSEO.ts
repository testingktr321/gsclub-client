import { useState, useEffect } from "react";

interface SEOData {
  id: string;
  slug: string;
  title?: string;
  description?: string;
  keywords: string[];
  ogTitle?: string;
  ogDescription?: string;
  ogImage?: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export const useSEO = (slug: string) => {
  const [seoData, setSeoData] = useState<SEOData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchSEOData = async () => {
      try {
        setLoading(true);
        const response = await fetch(`/api/seo/${encodeURIComponent(slug)}`);

        if (!response.ok) {
          throw new Error("Failed to fetch SEO data");
        }

        const data = await response.json();
        setSeoData(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred");
      } finally {
        setLoading(false);
      }
    };

    if (slug) {
      fetchSEOData();
    }
  }, [slug]);

  return { seoData, loading, error };
};
