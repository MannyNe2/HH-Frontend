<template>
  <v-app :style="{ background: background }">
    <StyledNotifications />
    <div class="d-flex align-center justify-center flex-column fill-height">
      <Nuxt />
    </div>
    <Footer class="background" />
  </v-app>
</template>

<script>
import Footer from "~/components/Footer.vue";
export default {
  components: {
    Footer,
  },
  computed: {
    background() {
      return this.$themeHelper.getColor("background");
    },
  },
};
</script>

<style>
</style>