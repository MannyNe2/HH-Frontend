<template>
  <v-list-item outline :to="`/campaign/${campaign.id}`" class="pa-0 rounded">
    <v-card rounded outlined class="pa-0 col">
      <div class="col background d-flex align-center pa-2">
        <v-img
          class="grey"
          :aspect-ratio="1"
          :src="campaign.thumbnail"
          max-width="65"
          height="65px"
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
              class="
                text-caption text-sm-subtitle-2 text-decoration-none
                font-weight-medium
                primary--text
              "
              >{{ campaign.title }}</NuxtLink
            >
            <div>
              <v-chip
                style="min-width: 10px"
                tile
                x-small
                class="rounded-0"
                :color="statusColor"
                >{{ statusText }}</v-chip
              >
            </div>
          </div>
          <div class="d-flex mt-1 justify-space-between">
            <div
              class="user-container font-italic font-weight-light text-caption"
            >
              by
              <NuxtLink
                class="foreground--text"
                :to="`/profile/${campaign.creator.id}`"
                >{{ campaign.creator.display_name }}</NuxtLink
              >
            </div>
            <div
              class="date-container text-caption grey--text font-weight-light"
            >
              {{ creationDate }}
            </div>
          </div>
        </div>
      </div>
    </v-card>
  </v-list-item>
</template>

<script>
import { format, parseISO } from "date-fns";
export default {
  name: "CampaignItemMini",
  props: {
    campaign: Object,
  },
  computed: {
    creationDate() {
      return format(parseISO(this.campaign.created_at), "MMM ''yy");
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