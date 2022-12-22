<template>
  <v-app :style="{ background: background }">
    <v-container class="fill-height container d-flex flex-column align-center">
      <AuthHeader class="py-3" />
      <div class="d-flex justify-center align-center mt-5">
        <div class="pa-0 col-sm-auto">
          <Nuxt class="pt-4" />
        </div>
        <div class="d-none d-sm-flex justify-end">
          <img
            class="img-contain"
            :src="require('assets/images/authbanner.png')"
            height="600px"
          />
        </div>
      </div>
      <Footer class="mt-16 background" />
    </v-container>
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
  data() {
    return {
      backgroundImg: require("assets/images/authbanner.png"),
    };
  },
};
</script>

<style>
.back {
  background-size: contain;
  background-position-x: right;
}
</style>