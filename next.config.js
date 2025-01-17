const withPWA = require("next-pwa");
const runtimeCaching = require("next-pwa/cache");

module.exports = withPWA({
  pwa: {
    dest: "public",
    register: true,
    runtimeCaching,
    disable: process.env.NODE_ENV === "development",
  },
  i18n: {
    locales: ["en", "fr"],
    defaultLocale: "en",
  },
});
