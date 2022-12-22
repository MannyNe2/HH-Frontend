<template>
  <v-app class="fill-height" :style="{ background: background }">
    <!-- <v-overlay :z-index="0" :opacity="0.1" /> -->
    <div class="landing-gradient fill-height px-sm-7 py-5">
      <LandingHeader />
      <v-main>
        <Nuxt />
      </v-main>
      <Footer class="mt-8 transparent white--text" />
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

<style lang="sass">
.landing-gradient
  background: rgb(38,109,211)
  background: linear-gradient(90deg, rgba(38,109,211,1) 0%, rgba(112,60,178,1) 35%, rgba(222,13,146,1) 100%)
</style>