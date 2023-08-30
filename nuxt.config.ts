// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: { enabled: true },

  css: [
    // ...
    "@mdi/font/css/materialdesignicons.min.css",
    "vuetify/lib/styles/main.css",
  ],

  build: {
    transpile: [
      // ...
      "vuetify",
      "@vuepic/vue-datepicker",
    ],
  },
});
