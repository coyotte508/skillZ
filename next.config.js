const withPWA = require("next-pwa");
const runtimeCaching = require("next-pwa/cache");

module.exports = withPWA({
  pwa: {
    dest: "public",
    register: true,
    runtimeCaching,
  },
  i18n: {
    locales: ["en", "fr"],
    defaultLocale: "en",
  },
});
