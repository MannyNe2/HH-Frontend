<template>
  <v-app :style="{ background: background }">
    <StyledNotifications />
    <Header class="px-7 py-3" :style="{ background: headerBackgroundRGBA }" />
    <v-container class="mt-16 pt-12">
      <Nuxt />
      <v-divider class="mt-16 background"></v-divider>
      <Footer class="mt-16 background" />
    </v-container>
  </v-app>
</template>

<script>
import Footer from "~/components/Footer.vue";
export default {
  name: "DefaultLayout",
  components: {
    Footer,
  },
  computed: {
    background() {
      return this.$themeHelper.getColor("background");
    },
    headerBackgroundRGBA() {
      return this.$themeHelper.setThemeColorOpacity("background", 0.5);
    },
  },
};
</script>
