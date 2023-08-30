import { createVuetify } from "vuetify";
import * as components from "vuetify/components";
import * as directives from "vuetify/directives";
import { VDatePicker } from "vuetify/labs/VDatePicker";
import { pt } from "vuetify/locale";

export default defineNuxtPlugin((nuxtApp) => {
  const vuetify = createVuetify({
    ssr: true,

    components: {
      ...components,
      VDatePicker,
    },
    directives,

    locale: {
      locale: "pt",
      messages: { pt },
    },
  });

  nuxtApp.vueApp.use(vuetify);
});
