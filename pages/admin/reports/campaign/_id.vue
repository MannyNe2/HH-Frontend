<template>
  <v-container class="">
    <div class="mt-5">
      <v-flex>
        <h5 class="text-h5 font-weight-light mb-3">Campaign</h5>
      </v-flex>
      <AdminCampaignThumb
        class="ma-3"
        v-for="campaign in campaigns"
        :key="campaign.id"
        :campaign="campaign"
      />
    </div>
    <div>
      <v-flex>
        <h5 class="text-h5 font-weight-light mt-7 mb-4">
          Reports ({{ length }})
        </h5>
      </v-flex>
      <div class="d-flex flex-wrap paper rounded-lg">
        <AdminReport
          class="ma-3"
          v-for="report in reports"
          :key="report.id"
          :report="report"
        />
      </div>
    </div>
    <div>
      <AdminAction class="action-bar" :campaigns="mode" />
    </div>
  </v-container>
</template>

<script>
import { singleCampaign } from "~/queries/admin/reports/campaign/singleCampaign.gql";
export default {
  middleware: "isAdmin",
  apollo: {
    campaign_by_pk: {
      query: singleCampaign,
      variables() {
        return {
          campaignId: this.id,
        };
      },
      result({ data }) {
        try {
          this.$store.commit("report/setSelectedCampaign", data.campaign_by_pk);
        } catch (err) {
          console.log(err);
          this.$nuxt.error({ statusCode: 404, message: "Comment not found" });
        }
        this.campaigns = data;
        this.reports = data.campaign_by_pk.reports;
        this.length = this.reports.length;
      },
      skip() {
        return !this.id;
      },
    },
  },
  data() {
    return {
      mode: "campaign",
      campaigns: [],
      reports: [],
      length: "",
      id: this.$route.params.id,
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