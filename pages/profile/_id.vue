<template>
  <Profile :userId="userId" />
</template>

<script>
import Profile from "~/components/Profile.vue";
export default {
  components: {
    Profile
  },
  data() {
    return {
      userId: this.$route.params.id,
    }
  }
};
</script>

<style>
</style>