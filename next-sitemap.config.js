/** @type {import('next-sitemap').IConfig} */
module.exports = {
  siteUrl: "https://www.itip.com/", // ✅ Your domain (no trailing slash)
  generateRobotsTxt: true, // ✅ Auto-generate robots.txt
  exclude: ["/admin/*", "/cart/*", "/checkout/*", "/user/*"], // ❌ Exclude private pages
  changefreq: "weekly",
  priority: 0.7,
  sitemapSize: 5000, // ✅ Auto split if large
};
