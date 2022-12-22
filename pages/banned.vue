<template>
  <div class="justify-center pa-5">
    <h2
      class="
        error
        white--text
        px-6
        py-6
        elevation-10
        font-weight-bold
        text-uppercase text-h5 text-sm-h4 text-center
      "
    >
      This account has been banned
    </h2>
    <h3
      class="text-center font-weight-regular mt-10 text-subtitle-2 text-sm-h6"
    >
      This account has been found to be in violation of one or more of our Terms
      of Service. <br />Please contact customer support for more information
    </h3>
    <v-divider class="my-10"></v-divider>
    <div class="d-flex justify-center">
      <v-btn large color="primary" class="" @click="signout"
        ><v-icon>mdi-exit-run</v-icon><span class="pl-2">Sign Out</span></v-btn
      >
    </div>
  </div>
</template>

<script>
export default {
  layout: "banned",
  middleware: "banned",
  methods: {
    signout() {
      this.$authHelper.cleanupUserInfo();
      this.$apolloHelpers.onLogout();
      this.$router.push("/");
    },
  },
};
</script>

<style>
</style>