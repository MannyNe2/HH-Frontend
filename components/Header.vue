<template>
  <header class="d-flex justify-space-between align-center">
    <Logo :height="35" class="d-none d-sm-block pr-3" />
    <Logo :height="35" class="d-block d-sm-none pr-3" small />
    <div class="search-box-area col col-sm-5 col-xl-3 pa-0">
      <SearchBox class="" />
    </div>
    <div v-if="isLoggedIn" class="d-flex flex-justify-space-between align-center">
      <v-btn
        v-if="userRole === 'creator'"
        to="/creator"
        color="secondary"
        class="mx-2 mx-sm-5 d-none d-md-flex"
        ><v-icon left>mdi-coffee</v-icon>Creator Studio</v-btn
      >
      <v-btn
        v-else-if="userRole === 'admin'"
        to="/admin"
        color="secondary"
        class="mx-2 mx-sm-5 d-none d-md-flex"
        ><v-icon left>mdi-shield-lock</v-icon>Dashboard</v-btn
      >
      <v-btn
        v-if="userRole === 'creator'"
        to="/creator"
        color="secondary"
        fab
        small
        class="mx-5 d-md-none"
        elevation="2"
      >
        <v-icon>mdi-coffee</v-icon>
      </v-btn>
      <v-btn
        v-else-if="userRole === 'admin'"
        to="/admin"
        color="secondary"
        fab
        small
        class="mx-5 d-md-none"
        elevation="2"
      >
        <v-icon>mdi-shield-lock</v-icon>
      </v-btn>
      <ProfileButton />
    </div>
    <div v-else class="buttons-area">
      <v-btn to="/auth/login" class="mr-3" text>Login</v-btn>
      <v-btn to="/auth/signup" rounded color="secondary">Sign Up</v-btn>
    </div>
  </header>
</template>

<script>
export default {
  computed: {
    userRole() {
      return localStorage.userRole;
    },
    isLoggedIn() {
      return this.$authHelper.isLoggedIn();
    },
  },
};
</script>

<style>
header {
  position: fixed !important;
  width: 100%;
  z-index: 10;
  backdrop-filter: blur(10px);
}
</style>