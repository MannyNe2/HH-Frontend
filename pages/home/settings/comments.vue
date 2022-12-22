<template>
  <div class="mt-5">
    <UserCommentsList :userId="userId" />
  </div>
</template>

<script>
export default {
  computed: {
    userId() {
      return this.$authHelper.getUserInfo().id;
    },
  },
};
</script>

<style>
</style>