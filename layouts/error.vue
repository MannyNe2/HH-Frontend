<template>
  <v-app :style="{ background: background }" class="text-center">
    <div class="d-flex mt-16 pt-16 flex-column">
      <h1
        v-if="error.statusCode === 404"
        class="text-h3 mt-16 pt-16 font-weight-thin"
      >
        <span class="error--text">{{ error.statusCode }}</span>
        <span class="grey--text px-3"> | </span>
        <span class="pt-3">{{
          error.message ? error.message : pageNotFound
        }}</span>
      </h1>
      <h1 v-else class="text-h3 mt-16 pt-16 font-weight-thin">
        {{ otherError }}
      </h1>
      <NuxtLink class="pt-5" to="/"> Home page </NuxtLink>
    </div>
    <Footer class="mt-16 pt-16 background" />
  </v-app>
</template>

<script>
import Footer from "~/components/Footer.vue";
export default {
  name: "EmptyLayout",
  layout: "empty",
  components: {
    Footer,
  },
  props: {
    error: {
      type: Object,
      default: null,
    },
  },
  computed: {
    background() {
      return this.$themeHelper.getColor("background");
    },
  },
  data() {
    return {
      pageNotFound: "Page not Found",
      otherError: "An error occurred",
    };
  },
  head() {
    const title =
      this.error.statusCode === 404 ? this.pageNotFound : this.otherError;
    return {
      title,
    };
  },
};
</script>

<style scoped>
h1 {
  font-size: 20px;
}
</style>
