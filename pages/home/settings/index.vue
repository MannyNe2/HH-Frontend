<template>
  <v-card class="mt-5 pa-3" outlined flat>
    <UserEditForm :userId="userId" />
  </v-card>
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