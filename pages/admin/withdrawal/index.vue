<template>
  <v-container class="">
    <h3 class="text-h5 font-weight-light">Withdrawal Requests</h3>
    <v-divider class="mt-3 mb-5"></v-divider>
    <div v-if="campaigns.length < 0" class="mt-5">
      <div>
        <AdminWithdrawalThumb
          class="ma-3"
          v-for="campaign in campaigns"
          :key="campaign.id"
          :campaign="campaign.campaign"
          :withdrawId="campaign.id"
        />
      </div>
    </div>
    <h2
      v-else
      class="text-h6 font-weight-light text-center py-5"
      :style="{ color: noReportsColor }"
    >
      No requests found
    </h2>
  </v-container>
</template>

<script>
import { allRequests } from "~/queries/admin/withdrawal/allRequests.gql";
export default {
  middleware: "isAdmin",
  apollo: {
    withdrawal_request: {
      query: allRequests,
      result({ data }) {
        this.campaigns = data.withdrawal_request;
      },
    },
  },
  computed: {
    noReportsColor() {
      return this.$themeHelper.setThemeColorOpacity("foreground", 0.5);
    },
  },
  data() {
    return {
      campaigns: [],
    };
  },
};
</script>

<style>
.action-bar {
  position: fixed;
  bottom: 0;
  left: 0;
  width: 100%;
}
</style>