import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Unbounded } from "next/font/google";
import { Toaster } from "react-hot-toast";
import InitializeCart from "@/components/Cart/InitializeCart";
import { Providers } from "@/providers/provider";
import Navbar from "@/components/Navbar/Navbar";
import Footer from "@/components/Footer/Footer";
import { Suspense } from "react";
import AgeVerification from "@/components/AgeVerification/AgeVerification";
import ScrollToTopButton from "@/components/ScrollToTopButton/ScrollToTopButton";
import { getSEOData } from "@/lib/seo";

const unbounded = Unbounded({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-unbounded",
});

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});


export async function generateMetadata(): Promise<Metadata> {
  const seoData = await getSEOData('/*');

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

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {

  return (
    <html lang="en">
      <head>
        {/* Google Tag Manager */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
              new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
              j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
              'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
              })(window,document,'script','dataLayer','GTM-TLGTR33M');
            `,
          }}
        />
        {/* End Google Tag Manager */}

        {/* Yandex.Metrika counter */}
        <script
          type="text/javascript"
          dangerouslySetInnerHTML={{
            __html: `
              (function(m,e,t,r,i,k,a){m[i]=m[i]||function(){(m[i].a=m[i].a||[]).push(arguments)};
              m[i].l=1*new Date();
              for (var j = 0; j < document.scripts.length; j++) {if (document.scripts[j].src === r) { return; }}
              k=e.createElement(t),a=e.getElementsByTagName(t)[0],k.async=1,k.src=r,a.parentNode.insertBefore(k,a)})
              (window, document, "script", "https://mc.yandex.ru/metrika/tag.js", "ym");
            
              ym(102308489, "init", {
                   clickmap:true,
                   trackLinks:true,
                   accurateTrackBounce:true,
                   webvisor:true,
                   ecommerce:"dataLayer"
              });
            `,
          }}
        />
        <noscript>
          <div>
            <img
              src="https://mc.yandex.ru/watch/102308489"
              style={{ position: 'absolute', left: '-9999px' }}
              alt=""
            />
          </div>
        </noscript>
        {/* /Yandex.Metrika counter */}

        {/* Alli AI Widget */}
        <script
          type="text/javascript"
          dangerouslySetInnerHTML={{
            __html: `
              /* Alli AI widget for www.itips.co */
              (function (w,d,s,o,f,js,fjs) {w['AlliJSWidget']=o;w[o] = w[o] || function () { (w[o].q = w[o].q || []).push(arguments) };js = d.createElement(s), fjs = d.getElementsByTagName(s)[0];js.id = o; js.src = f; js.async = 1; fjs.parentNode.insertBefore(js, fjs);}(window, document, 'script', 'alli', 'https://static.alliai.com/widget/v1.js'));
              alli('init', 'site_oLVbrkWbu5ty2AvF');
              alli('optimize', 'all');
            `,
          }}
        />
        {/* End Alli AI Widget */}
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased ${unbounded.variable}`}
      >
        {/* Google Tag Manager (noscript) */}
        <noscript>
          <iframe
            src="https://www.googletagmanager.com/ns.html?id=GTM-TLGTR33M"
            height="0"
            width="0"
            style={{ display: 'none', visibility: 'hidden' }}
          />
        </noscript>
        {/* End Google Tag Manager (noscript) */}

        <Providers>
          <Navbar />
          <Toaster position="top-right" reverseOrder={false} />
          <InitializeCart />
          <div className="bg-white text-black">
            <Suspense>
              <AgeVerification />
              {children}
            </Suspense>
          </div>
          <ScrollToTopButton />
          <Footer />
        </Providers>
      </body>
    </html>
  );
}