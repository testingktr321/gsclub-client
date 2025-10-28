import ProductPage from '@/components/ProductPage/ProductPage';
import { prisma } from '@/lib/prisma';
import React from 'react';
import type { Metadata } from 'next';
import { getSEOData } from '@/lib/seo';

type Props = {
  params: Promise<{ productSlug: string }>;
};

const page = async ({ params }: Props) => {
  const { productSlug } = await params;

  // 🔍 Fetch product redirect link
  const product = await prisma.product.findUnique({
    where: { slug: productSlug },
    select: { redirectLink: true },
  });

  // ✅ If redirect link exists, show redirect screen within layout
if (product?.redirectLink) {
  return (
    <div
      style={{
        minHeight: 'calc(100vh - 200px)', // leave space for navbar + footer
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        textAlign: 'center',
        padding: '2rem',
      }}
    >
      <meta httpEquiv="refresh" content={`1;url=${product.redirectLink}`} />

      <h1 style={{ fontSize: '1.5rem', color: '#333', marginBottom: '1rem' }}>
        Redirecting to new product page...
      </h1>

      <p style={{ color: '#777' }}>
        You’ll be redirected shortly. If not,{' '}
        <a
          href={product.redirectLink}
          style={{ color: '#0070f3', textDecoration: 'underline' }}
        >
          click here
        </a>
        .
      </p>
    </div>
  );
}


  // 🟢 Otherwise, render your normal ProductPage
  return <ProductPage productSlug={productSlug} />;
};

export default page;

// Metadata (same as before)
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { productSlug } = await params;

  try {
    const product = await prisma.product.findUnique({
      where: { slug: productSlug },
      select: { name: true },
    });

    if (!product) {
      return {
        title: 'Product Not Found',
        description: 'The requested product could not be found.',
      };
    }

    const seoData = await getSEOData(`/product/${productSlug}`);
    const metadata: Metadata = {};

    if (seoData) {
      if (seoData.title) metadata.title = seoData.title;
      if (seoData.description) metadata.description = seoData.description;
      if (seoData.keywords?.length) metadata.keywords = seoData.keywords;

      if (seoData.ogTitle || seoData.ogDescription || seoData.ogImage) {
        metadata.openGraph = {};
        if (seoData.ogTitle) metadata.openGraph.title = seoData.ogTitle;
        if (seoData.ogDescription) metadata.openGraph.description = seoData.ogDescription;
        if (seoData.ogImage) metadata.openGraph.images = [seoData.ogImage];
      }

      if (seoData.ogTitle || seoData.ogDescription || seoData.ogImage) {
        metadata.twitter = {
          card: 'summary_large_image',
        };
        if (seoData.ogTitle) metadata.twitter.title = seoData.ogTitle;
        if (seoData.ogDescription) metadata.twitter.description = seoData.ogDescription;
        if (seoData.ogImage) metadata.twitter.images = [seoData.ogImage];
      }
    } else {
      metadata.title = product.name || 'Product';
      metadata.description = 'View product details.';
    }

    return metadata;
  } catch (error) {
    console.error('Failed to generate metadata:', error);
    return {
      title: 'Product Not Found',
      description: 'An error occurred while loading the product.',
    };
  }
}
