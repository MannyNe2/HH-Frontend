<template>
  <v-list-item outline class="pa-0 rounded">
    <v-card rounded outlined class="pa-0 col">
      <div class="col d-flex align-center pa-2">
        <v-img
          class="grey"
          :aspect-ratio="1"
          :src="campaign.thumbnail"
          max-width="150"
          height="150px"
        >
          <template v-slot:placeholder>
            <v-row
              class="fill-height ma-0 grey"
              align="center"
              justify="center"
            >
              <v-progress-circular
                indeterminate
                color="primary"
              ></v-progress-circular>
            </v-row>
          </template>
        </v-img>
        <div class="col py-2">
          <div class="d-flex mb-1 justify-space-between">
            <NuxtLink
              :to="`/campaign/${campaign.id}`"
              class="text-h5 text-decoration-none primary--text"
              >{{ campaign.title }}</NuxtLink
            >
            <div>
              <NuxtLink :to="`/campaign/${campaign.id}`" class="primary--text"
                >Go to campaign ></NuxtLink
              >
            </div>
          </div>
          <div class="d-flex mt-2 justify-space-between">
            <div class="font-italic font-weight-bold">
              by
              <NuxtLink
                class="foreground--text"
                :to="`/profile/${campaign.creator.id}`"
                >{{ campaign.creator.display_name }}</NuxtLink
              >
            </div>
          </div>
          <div class="d-flex mt-2 justify-space-between">
            <span class="text-h6 text-decoration-none"
              >{{ totAmount }} Br. Pledged</span
            >
          </div>
          <div class="d-flex mt-1 justify-space-between">
            <span class="text-h6 text-decoration-none">{{ratio}}% Like Ratio</span>
            <div
              class="date-container text-caption grey--text font-weight-bold"
            >
              Created {{ creationDate }}
            </div>
          </div>
        </div>
      </div>
    </v-card>
  </v-list-item>
</template>

<script>
import { singleCampaignStats, singleCampaignSentiment } from "~/queries/admin/reports/campaign/singleCampaign.gql";
import { format, parseISO } from "date-fns";
export default {
  props: {
    campaign: Object,
  },
  apollo: {
    campaignInfo: {
      query: singleCampaignStats,
      variables() {
        return {
          campaignId: this.id,
        };
      },
      result({ data }) {
        console.log(data.campaignInfo.totalAmount);
        this.totAmount = data.campaignInfo.totalAmount;
      },
    },
    campaignSentiment: {
      query: singleCampaignSentiment,
      variables() {
        return {
          campaignId: this.id,
        };
      },
      result({ data }) {
        this.ratio = (data.campaignSentiment.likes - data.campaignSentiment.dislikes) / (data.campaignSentiment.likes + data.campaignSentiment.dislikes);
        this.ratio *= 100;
      },
    },
  },
  data() {
    return {
      id: this.$route.params.id,
      totAmount: "",
      ratio: 0
    };
  },
  computed: {
    creationDate() {
      return format(parseISO(this.campaign.created_at), "MMM dd, yyyy");
    },
    requiresStatus() {
      return (
        this.campaign.is_private || this.campaign.is_ended || this.pastDeadline
      );
    },
    pastDeadline() {
      return parseISO(this.campaign.deadline) < Date.now();
    },
    statusColor() {
      if (this.campaign.is_private) {
        return "warning";
      } else if (this.campaign.is_ended) {
        return "primary";
      } else if (this.pastDeadline) {
        return "error";
      } else {
        return "transparent";
      }
    },
    statusText() {
      if (this.campaign.is_private) {
        return "Private";
      } else if (this.campaign.is_ended) {
        return "Ended";
      } else if (this.pastDeadline) {
        return "Expired";
      }
    },
  },
};
</script>

<style>
.outline {
  border: 1px solid rgba(0, 0, 0, 0.3) !important;
}
</style>