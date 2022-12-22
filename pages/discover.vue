<template>
  <v-container class="pa-3">
    <v-flex>
      <h1 class="text-h5 font-weight-light">Discover Campaigns</h1>
      <span class="font-weight-light">{{campaigns.length}} campaigns available</span>
    </v-flex>
    <v-divider />
    <v-row class="d-flex">
      <v-col
        class="col-12 col-sm-6 col-md-4 col-lg-3 col-xl-2"
        v-for="campaign in campaigns"
        :key="campaign.id"
      >
        <CampaignThumbnail
          class="ma-2 d-flex justify-center"
          :width="275"
          :campaignId="campaign.id"
          :to="`/campaign/${campaign.id}`"
        />
      </v-col>
    </v-row>
  </v-container>
</template>I

<script>
import { discoverCampaigns } from "~/queries/discoverCampaigns.gql";
export default {
  layout: 'guest',
  apollo: {
    campaign: {
      query: discoverCampaigns,
      result({ data }) {
        console.log(data);
        this.campaigns = data.campaign;
      },
      fetchPolicy: "no-cache",
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
</style>