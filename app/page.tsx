import HomePage from "@/components/HomePage/HomePage";
import { getSEOData } from "@/lib/seo";
import { Metadata } from 'next';

export async function generateMetadata(): Promise<Metadata> {
  const seoData = await getSEOData('/');

  if (!seoData) return {};

  const metadata: Metadata = {};

  // Basic SEO
  if (seoData.title) metadata.title = seoData.title;
  if (seoData.description) metadata.description = seoData.description;
  if (seoData.keywords?.length > 0) metadata.keywords = seoData.keywords;

  // OpenGraph
  const ogTitle = seoData.ogTitle || seoData.title;
  const ogDescription = seoData.ogDescription || seoData.description;
  const ogImage = seoData.ogImage;

  if (ogTitle || ogDescription || ogImage) {
    metadata.openGraph = {};
    if (ogTitle) metadata.openGraph.title = ogTitle;
    if (ogDescription) metadata.openGraph.description = ogDescription;
    if (ogImage) metadata.openGraph.images = [ogImage];
  }

  // Twitter
  if (ogTitle || ogDescription || ogImage) {
    metadata.twitter = {
      card: 'summary_large_image',
    };
    if (ogTitle) metadata.twitter.title = ogTitle;
    if (ogDescription) metadata.twitter.description = ogDescription;
    if (ogImage) metadata.twitter.images = [ogImage];
  }

  return metadata;
}

export default function Home() {
  return (
    <HomePage />
  );
}
