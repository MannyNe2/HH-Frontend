<template>
  <v-app :style="{ background: background }">
    <div class="px-7 py-5">
      <GuestHeader />
      <v-main>
        <Nuxt />
      </v-main>
      <Footer class="mt-16 background" />
    </div>
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

<style></style>