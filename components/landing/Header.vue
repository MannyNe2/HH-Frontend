<template>
  <nav class="d-flex justify-space-between align-center">
    <Logo :height="35" color="white" class="d-none d-sm-block px-3" />
    <Logo :height="35" color="white" class="d-block d-sm-none px-3" small />
    <div class="search-area col col-sm-5 col-md-4 col-xl-2 pa-0 px-3">
      <SearchBox />
    </div>
    <div class="d-none d-sm-flex px-3">
      <v-btn to="/auth/login" class="mr-3" text color="white">Login</v-btn>
      <v-btn to="/auth/signup" rounded color="secondary">Sign Up</v-btn>
    </div>
    <div class="d-flex justify-space-between d-sm-none pr-2">
      <v-btn
        fab
        text
        rounded
        small
        to="/auth/login"
        aria-label="login"
        color="white"
      >
        <v-icon>mdi-login</v-icon>
      </v-btn>
      <v-btn
        fab
        text
        small
        to="/auth/signup"
        aria-label="signup"
        color="white"
        ><v-icon>mdi-account-plus</v-icon></v-btn
      >
    </div>
  </nav>
</template>

<script>
export default {};
</script>

<style>
</style>