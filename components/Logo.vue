<template>
  <NuxtLink class="logo" to="/">
    <div class="pa-0 ma-0 d-flex align-center justify-center">
      <img
        :src="small ? smallLogoUrl : logoUrl"
        :width="width ? width : ''"
        :height="height ? height : ''"
      />
    </div>
  </NuxtLink>
</template>

<script>
export default {
  props: {
    width: Number,
    height: Number,
    color: String,
    small: { type: Boolean, default: false },
  },
  computed: {
    logoUrl() {
      if (this.color == "white") {
        return require("~/assets/images/logo-new-light.svg");
      } else if (this.color == "black") {
        return require("~/assets/images/logo-new-dark.svg");
      } else {
        if (this.$vuetify.theme.isDark) {
          return require("~/assets/images/logo-new-light.svg");
        } else {
          return require("~/assets/images/logo-new-dark.svg");
        }
      }
    },
    smallLogoUrl() {
      if (this.color == "white") {
        return require("~/assets/images/logo-small-light.svg");
      } else if (this.color == "black") {
        return require("~/assets/images/logo-small-dark.svg");
      } else {
        if (this.$vuetify.theme.isDark) {
          return require("~/assets/images/logo-small-light.svg");
        } else {
          return require("~/assets/images/logo-small-dark.svg");
        }
      }
    },
  },
};
</script>

<style>
.logo {
  user-select: none;
  cursor: pointer;
  transition: 0.3s;
}
.logo:hover {
  filter: brightness(250%);
}
</style>