<template>
  <div v-if="userId">
    <v-row v-if="campaigns.length > 0" class="d-flex">
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
    <h2
      v-else
      class="text-h6 font-weight-light text-center py-5"
      :style="{ color: noCampaignsColor }"
    >
      No campaigns found
    </h2>
  </div>
</template>

<script>
import getUserCampaigns from "~/queries/user/getUserCampaigns.gql";
export default {
  name: "UserCampaignsList",
  props: {
    userId: { type: String, default: undefined },
  },
  apollo: {
    user: {
      query: getUserCampaigns,
      variables() {
        return {
          userId: this.userId,
        };
      },
      result({ data }) {
        this.campaigns = data.user.campaigns;
        this.$emit("campaigns-loaded", this.campaigns.length);
      },
      skip() {
        return !this.userId;
      },
      fetchPolicy: "no-cache",
    },
  },
  computed: {
    noCampaignsColor() {
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
</style>