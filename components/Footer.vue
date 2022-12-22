<template>
  <v-footer
    class="site-footer justify-center"
  >
    <h3 class="text-body-1 text-center font-weight-regular">
      &#169; {{ footerText }}
    </h3>
  </v-footer>
</template>

<script>
export default {
  name: "Footer",
  computed: {
    footerText() {
      const currentYear = new Date().getFullYear();
      return `2021-${currentYear} Helping Hand Inc. All Rights Reserved`;
    },
  },
};
</script>

<style>
.site-footer {
  position: absolute;
  bottom: 0;
  width: 100%;
}
</style>