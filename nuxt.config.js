import colors from "vuetify/es5/util/colors";

export default {
  // Disable server-side rendering: https://go.nuxtjs.dev/ssr-mode
  ssr: false,

  server: {
    port: 7200, // default port: 3000
  },

  // Global page headers: https://go.nuxtjs.dev/config-head
  head: {
    titleTemplate: "%s | Crowdfunding",
    title: "Innovating Innovation",
    htmlAttrs: {
      lang: "en",
    },
    meta: [
      { charset: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { hid: "description", name: "description", content: "" },
      { name: "format-detection", content: "telephone=no" },
    ],
    link: [{ rel: "icon", type: "image/x-icon", href: "/favicon.ico" }],
  },

  // Global CSS: https://go.nuxtjs.dev/config-css
  css: ["~/assets/main.scss"],

  // Plugins to run before rendering page: https://go.nuxtjs.dev/config-plugins
  plugins: [
    "~/plugins/themeHelper.js",
    "~/plugins/avatarColors.js",
    "~/plugins/authHelper.js",
    "~/plugins/money.js",
    "~/plugins/notification.js",
    "~/plugins/cloudinaryHelper.js",
  ],

  // Auto import components: https://go.nuxtjs.dev/config-components
  components: true,

  // Modules for dev and build (recommended): https://go.nuxtjs.dev/config-modules
  buildModules: [
    // https://go.nuxtjs.dev/typescript
    "@nuxt/typescript-build",
    // https://go.nuxtjs.dev/vuetify
    "@nuxtjs/vuetify",
  ],

  // Modules: https://go.nuxtjs.dev/config-modules
  modules: ["@nuxtjs/apollo", "@nuxtjs/cloudinary"],

  apollo: {
    clientConfigs: {
      default: "~/plugins/apollo/apolloConfig.js",
    },
    errorHandler: "~/plugins/apollo/apolloErrorHandler.js",
  },

  cloudinary: {
    cloudName: process.env.CLOUD_NAME,
    apiKey: process.env.API_KEY,
    apiSecret: process.env.API_SECRET,
  },

  publicRuntimeConfig: {
    httpEndpoint: process.env.HTTP_ENDPOINT,
    wsEndpoint: process.env.WS_ENDPOINT,
    // localStorageTokenName: process.env.LOCAL_STORAGE_TOKEN_NAME,
    // cookieTokenName: process.env.COOKIE_TOKEN_NAME,
    // cookiePathAvailableIn: process.env.COOKIE_PATH_AVAILABLE_IN,
    // cookieDomainAvailableIn: process.env.COOKIE_DOMAIN_AVAILABLE_IN,
    // authenticationType: process.env.AUTHENTICATION_TYPE,
  },

  // Vuetify module configuration: https://go.nuxtjs.dev/config-vuetify
  vuetify: {
    customVariables: ["~/assets/variables.scss"],
    treeShake: true,
    defaultAssets: {
      font: {
        family: "Murecho",
      },
    },
    theme: {
      dark: false,
      options: {
        customProperties: true,
      },
      themes: {
        light: {
          primary: "#3a69ce",
          secondary: "#e2703b",
          accent: "#00662e",
          selection: colors.grey.lighten2,
          info: "#229ca8", // colors.teal.lighten1,
          warning: "#de9000", // colors.amber.base,
          error: colors.deepOrange.accent4,
          success: "#00ad4e", // colors.green.accent3,
          paper: "#ffffff",
          input: "#f0f0f0",
          background: "#eeeeee",
          foreground: "#000000",
          reversebackground: "#121212",
          reverseforeground: "#ffffff",
        },
        dark: {
          primary: "#3a69ce",
          secondary: "#e2703b",
          accent: "#68da4b",
          selection: colors.grey.darken3,
          info: "#229ca8", // colors.teal.lighten1,
          warning: "#de9000", // colors.amber.base,
          error: colors.deepOrange.accent4,
          success: "#00ad4e", // colors.green.accent3,
          paper: "#242424",
          input: "#303030",
          background: "#121212",
          foreground: "#ffffff",
          reversebackground: "#eeeeee",
          reverseforeground: "#000000",
        },
      },
    },
  },

  // Build Configuration: https://go.nuxtjs.dev/config-build
  build: {},
};
