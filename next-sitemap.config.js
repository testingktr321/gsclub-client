/** @type {import('next-sitemap').IConfig} */
module.exports = {
  siteUrl: "https://www.itip.com/",
  // siteUrl: "http://localhost:3000/",
  generateRobotsTxt: true,
  exclude: [
    "/api/*",
    "/my-account/*",
    "/cart/*",
    "/checkout/*",
    "/email-preview/*",
    "/login/*",
    "/signup/*",
    "/reset-password/*",
    "/forgot-password/*",
    "/_next/*",
  ],
  generateIndexSitemap: true,
  sitemapSize: 7000,

  // Static pages
  additionalPaths: async (config) => {
    const result = [];

    // Add your static pages here
    const staticPages = [
      { loc: "/", priority: 1.0, changefreq: "daily" },
      { loc: "/about", priority: 0.8, changefreq: "monthly" },
      { loc: "/contact", priority: 0.8, changefreq: "monthly" },
      { loc: "/privacy-policy", priority: 0.5, changefreq: "yearly" },
      { loc: "/return-policy", priority: 0.5, changefreq: "yearly" },
      { loc: "/shipping-policy", priority: 0.5, changefreq: "yearly" },
      { loc: "/terms-conditions", priority: 0.5, changefreq: "yearly" },
      { loc: "/blog", priority: 0.5, changefreq: "daily" },
      { loc: "/accessories", priority: 0.5, changefreq: "daily" },
      { loc: "/adult-goods", priority: 0.5, changefreq: "daily" },
      { loc: "/hookah", priority: 0.5, changefreq: "daily" },
      { loc: "/supplements", priority: 0.5, changefreq: "daily" },
      { loc: "/vapes", priority: 0.5, changefreq: "daily" },
    ];

    staticPages.forEach((page) => {
      result.push({
        loc: page.loc,
        changefreq: page.changefreq,
        priority: page.priority,
        lastmod: new Date().toISOString(),
      });
    });

    return result;
  },

  robotsTxtOptions: {
    policies: [
      {
        userAgent: "*",
        allow: "/",
      },
      {
        userAgent: "*",
        disallow: [
          "/admin/*",
          "/api/*",
          "/dashboard/*",
          "/_next/*",
          "/my-account/*",
          "/cart/*",
          "/checkout/*",
          "/email-preview/*",
          "/login/*",
          "/signup/*",
          "/reset-password/*",
          "/forgot-password/*",
        ],
      },
    ],
    additionalSitemaps: [
      "https://www.itip.com/server-sitemap-products.xml",
      "https://www.itip.com/server-sitemap-blog.xml",
    ],
  },
};
