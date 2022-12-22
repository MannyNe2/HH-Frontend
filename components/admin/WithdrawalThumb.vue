<template>
  <v-list-item @click="clicked(withdrawId)" outline class="pa-0 rounded">
    <v-card rounded outlined class="pa-0 col rounded-lg" elevation="7">
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
              <span class="text-h5 text-decoration-none">{{ campaign.title }}</span>
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
              ></span
            >
          </div>
          <div class="d-flex mt-1 justify-space-between">
            <span class="text-h6 text-decoration-none"></span>
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
    withdrawId: String
  },
  data() {
    return {
      id: "",
      totAmount: "",
      ratio: 0
    };
  },
  computed: {
    creationDate() {
      return format(parseISO(this.campaign.created_at), "MMM dd, yyyy");
    },
  },
  methods: {
      clicked(id) {
          this.$router.push("/admin/withdrawal/" + id)
      }
  }
};
</script>

<style>
.outline {
  border: 1px solid rgba(0, 0, 0, 0.3) !important;
}
</style>