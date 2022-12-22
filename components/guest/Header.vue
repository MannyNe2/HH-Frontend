<template>
  <nav class="d-flex justify-space-between align-center">
    <Logo :height="25" />
    <div class="search-area col-3 pa-0">
      <SearchBox />
    </div>
    <div class="buttons-area">
      <v-btn plain to="/auth/login" class="mr-3">Login</v-btn>
      <v-btn to="/auth/signup" rounded color="secondary">Sign Up</v-btn>
    </div>
  </nav>
</template>

<script>
export default {};
</script>

<style>
</style>