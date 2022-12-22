<template>
  <v-container v-if="id" class="fill-height d-flex justify-center align-center px-0">
    <v-col class="col-12 col-sm-8 col-md-6 col-lg-5 pa-0 col-xl-3">
      <WithdrawalRequestDialog class="pa-5" :campaignId="id" />
    </v-col>
  </v-container>
</template>

<script>
import WithdrawalRequestDialog from "~/components/campaign/Withdraw.vue";

export default {
  middleware: "isCreator",
  components: {
    WithdrawalRequestDialog,
  },
  computed: {},
  data() {
    return {
      id: this.$route.params.id,
    };
  },
};
</script>

<style>
</style>