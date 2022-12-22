<template>
  <Profile v-if="isLoggedIn" :userId="userId" />
</template>

<script>
import Profile from "~/components/Profile.vue";
export default {
  components: {
    Profile
  },
  computed: {
    isLoggedIn() {
      if (this.$authHelper.isLoggedIn()) {
        return true;
      } else {
        this.$router.push("/auth/login");
      }
    },
    userId() {
      return this.$authHelper.getUserInfo().id;
    },
  },
};
</script>

<style>
</style>