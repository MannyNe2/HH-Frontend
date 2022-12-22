<template>
  <div class="mt-5">
    <v-card flat class="pa-8 mt-5" outlined>
      <h3 class="text-subtitle-1 font-weight-regular mb-3">Change Password</h3>
      <div class="mt-8">
        <ChangePasswordForm />
      </div>
    </v-card>
  </div>
</template>

<script>
import CreatorRequestForm from "~/components/user/CreatorRequestForm.vue";
import ChangePasswordForm from "~/components/user/ChangePasswordForm.vue";
export default {
  components: {
    CreatorRequestForm,
    ChangePasswordForm,
  },
};
</script>

<style>
</style>