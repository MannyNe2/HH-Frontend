<template>
  <v-container
    class="d-flex flex-column pa-0 rounded-lg overflow-hidden outlined"
    v-if="campaign && sentiment"
  >
    <CampaignBanner
      :bannerImage="campaign.banner"
      :creatorAvatar="campaign.creator.avatar"
      :creatorName="campaign.creator.display_name"
      :creatorIsVerified="campaign.creator.isVerified"
      :creatorId="campaign.creator.id"
      :title="campaign.title"
    />
    <nav class="campaign-tabs">
      <v-tabs centered background-color="background">
        <v-tab :to="`/campaign/${id}`">Campaign</v-tab>
        <v-tab :to="`/campaign/${id}/comments`">Comments</v-tab>
      </v-tabs>
    </nav>
    <div class="d-flex flex-column-reverse flex-md-row py-8 background">
      <v-col class="background px-0 py-3 col">
        <NuxtChild />
      </v-col>
      <v-col
        v-if="campaign.is_private || campaign.is_ended"
        class="
          background
          d-flex d-md-block
          justify-center
          col-auto col-md-4 col-lg-3 col-xl-2
          px-5
          py-3
        "
      >
        <v-banner v-if="campaign.is_private" color="warning" class="white--text"
          >Private Campaign</v-banner
        >
        <v-banner
          v-if="campaign.is_ended"
          :color="`${
            campaign.end_status === 'successful' ? 'success' : 'error'
          }`"
          class="white--text mt-2"
          >Campaign
          {{
            campaign.end_status === "successful" ? "funded" : "failed"
          }}</v-banner
        >
      </v-col>
      <v-col
        v-else-if="pastDeadline"
        class="
          background
          d-flex d-md-block
          justify-center
          col-auto col-md-4 col-lg-3 col-xl-2
          px-5
          py-3
        "
      >
        <v-banner color="error" class="white--text">Campaign Expired</v-banner>
      </v-col>
      <v-col
        v-else-if="isOwnCampaign"
        class="
          background
          d-flex d-md-block
          justify-center
          col-auto col-md-4 col-lg-3 col-xl-2
          px-5
          py-3
        "
      >
        <v-banner color="info" class="white--text"
          >Cannot Pledge to Own Campaign</v-banner
        >
      </v-col>
      <div class="overflow-y-auto" v-else style="max-height: 120vh">
        <div class="hidden-sm-and-down">
          <div
            class="
              d-flex
              flex-column
              background
              overflow-y-auto overflow-x-hidden
              px-3
              py-3
            "
          >
            <CampaignDonateNoReward class="" />
            <CampaignDonateWithReward
              v-for="reward in campaign.rewards"
              :key="reward.id"
              :amount="reward.pledge_amount"
              :title="reward.title"
              :description="reward.description"
              :rewardType="reward.type"
              :deliveryDate="reward.estimated_delivery_date"
              class="mt-3"
            />
          </div>
        </div>
        <div class="hidden-md-and-up">
          <div class="d-flex background overflow-auto px-3 py-3">
            <div>
              <CampaignDonateNoReward class="" />
            </div>
            <div v-for="reward in campaign.rewards" :key="reward.id">
              <CampaignDonateWithReward
                :amount="reward.pledge_amount"
                :title="reward.title"
                :description="reward.description"
                :rewardType="reward.type"
                :deliveryDate="reward.estimated_delivery_date"
                class="ml-3"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  </v-container>
  <v-container v-else class="d-flex justify-center align-center">
    <v-progress-circular indeterminate size="64"></v-progress-circular>
  </v-container>
</template>

<script>
import { getCampaign } from "~/queries/campaign/getCampaign.gql";
import { getCampaignInfo } from "~/queries/campaign/getCampaignInfo.gql";
import { mapState } from "vuex";
import { compareAsc, parseISO } from "date-fns";

export default {
  apollo: {
    campaign_by_pk: {
      query: getCampaign,
      variables() {
        return {
          campaignId: this.id,
        };
      },
      result({ data }) {
        try {
          this.$store.commit("campaign/setCampaign", data.campaign_by_pk);
        } catch (err) {
          console.log(err);
          this.$nuxt.error({ statusCode: 404, message: "Campaign not found" });
        }
      },
      skip() {
        return !this.id;
      },
      fetchPolicy: "no-cache",
    },
    getCampaignSentiment: {
      query: getCampaignInfo,
      variables() {
        return {
          campaignId: this.id,
        };
      },
      result({ data }) {
        try {
          this.$store.commit(
            "campaign/setSentiment",
            data.getCampaignSentiment
          );
          this.$store.commit("campaign/setStats", data.getCampaignStats);
        } catch (err) {
          console.log(err);
          this.$nuxt.error({ statusCode: 404, message: "Campaign not found" });
        }
      },
      skip() {
        return !this.id;
      },
      fetchPolicy: "no-cache",
    },
  },
  computed: {
    isOwnCampaign() {
      let user = this.$authHelper.getUserInfo() === null ? 'nonexistingid' : this.$authHelper.getUserInfo().id;
      if(user !== 'nonexistingid'){
        return this.$authHelper.getUserInfo().id === this.campaign.creator.id;
      }
      return false;
    },
    pastDeadline() {
      return compareAsc(Date.now(), parseISO(this.campaign.deadline)) > 0;
    },
    ...mapState({
      campaign: (state) => state.campaign.selected,
      sentiment: (state) => state.campaign.sentiment,
    }),
  },
  data() {
    return {
      id: this.$route.params.id,
    };
  },
};
</script>

<style>
.pledges-container {
  max-height: 150vh;
  top: 0;
}
.outlined {
  border: 2px solid var(--v-selection-base);
}
</style>