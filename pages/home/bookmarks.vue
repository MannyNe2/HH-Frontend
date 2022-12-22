<template>
  <v-container v-if="!savedCampaigns" class="d-flex justify-center">
    <v-progress-circular indeterminate size="64"></v-progress-circular>
  </v-container>
  <v-container v-else>
    <h3 class="text-h4 font-weight-light">
      Saved Campaigns{{
        savedCampaigns && savedCampaigns.length > 0
          ? ` (${savedCampaigns.length})`
          : ""
      }}
    </h3>
    <v-divider class="my-3"></v-divider>
    <div v-if="savedCampaigns.length > 0">
      <v-row class="d-flex mt-3">
        <v-col
          class="col-12 col-sm-4 col-md-4 col-lg-3 col-xl-2"
          v-for="savedCampaign in savedCampaigns"
          :key="savedCampaign.campaign_id"
        >
          <Thumbnail
            class="ma-2 d-flex justify-center"
            :width="275"
            :campaignId="savedCampaign.campaign_id"
            :to="`/campaign/${savedCampaign.campaign_id}`"
          />
        </v-col>
      </v-row>
    </div>
    <h2
      v-else
      class="text-h6 font-weight-light text-center py-5"
      :style="{ color: noBookmarksColor }"
    >
      No saved campaigns found
    </h2>
  </v-container>
</template>

<script>
import Thumbnail from "~/components/campaign/Thumbnail.vue";
import { getSavedCampaigns } from "~/queries/user/getSavedCampaigns.gql";

export default {
  components: {
    Thumbnail,
  },
  apollo: {
    user: {
      query: getSavedCampaigns,
      variables() {
        return {
          id: this.userId,
        };
      },
      result({ data }) {
        console.log(data);
        try {
          this.savedCampaigns = data.user.saved_campaigns;
        } catch (err) {
          console.log(err);
          this.$nuxt.error({
            statusCode: 500,
            message: "An error has occured",
          });
        }
      },
      skip() {
        return !this.userId;
      },
      fetchPolicy: "no-cache",
    },
  },
  computed: {
    noBookmarksColor() {
      return this.$themeHelper.setThemeColorOpacity("foreground", 0.5);
    },
    userId() {
      return this.$authHelper.getUserInfo().id;
    },
  },
  data() {
    return {
      savedCampaigns: undefined,
    };
  },
};
</script>

<style>
</style>