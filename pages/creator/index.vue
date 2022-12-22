<template>
  <v-container>
    <div
      v-if="campaigns"
      class="d-flex flex-column flex-sm-row justify-space-around"
    >
      <v-card class="pa-3 rounded-lg" elevation="3" width="300">
        <h3 class="text-h5 text-center pa-3">
          <span class="text-h4 font-weight-bold pr-2">{{
            campaigns.length
          }}</span>
          campaigns
        </h3>
        <!-- <v-divider></v-divider> -->
        <div class="d-flex justify-space-around grey--text">
          <div class="pa-3 d-flex flex-column justify-center">
            <h4 class="font-weight-regular py-2 text-body-2">
              <v-icon small class="pr-3" color="green">mdi-check</v-icon>
              {{ campaignStats.successful }}
              successful
            </h4>
            <h4 class="font-weight-regular py-2 text-body-2">
              <v-icon small class="pr-3" color="info">mdi-update</v-icon>
              {{ campaignStats.pending }}
              pending
            </h4>
            <h4 class="font-weight-regular py-2 text-body-2">
              <v-icon small class="pr-3" color="error">mdi-close</v-icon>
              {{ campaignStats.failed }}
              failed
            </h4>
          </div>
          <v-divider vertical class="mx-2 transparent"></v-divider>
          <div class="pa-3 d-flex flex-column">
            <h4 class="font-weight-regular text-right py-2 text-body-2">
              {{ campaignStats.likes }}
              likes<v-icon small class="pl-3" color="grey">mdi-thumb-up</v-icon>
            </h4>
            <h4 class="font-weight-regular text-right py-2 text-body-2">
              {{ campaignStats.dislikes }}
              dislikes<v-icon small class="pl-3" color="grey"
                >mdi-thumb-down</v-icon
              >
            </h4>
            <h4 class="font-weight-regular text-right py-2 text-body-2">
              {{ campaignStats.ratio }}
              <v-icon small class="pl-3" color="grey">mdi-emoticon-neutral-outline</v-icon>
            </h4>
          </div>
        </div>
      </v-card>
      <v-card class="pa-3 rounded-lg mt-3 mt-sm-0" elevation="3" width="300">
        <h3 class="text-h5 text-center pa-3">
          <span class="text-h4 font-weight-bold pr-2">{{
            campaignStats.pledges
          }}</span>
          pledges
        </h3>
        <div class="grey--text">
          <div class="pa-3 d-flex flex-column justify-center">
            <h4 class="font-weight-regular py-2 text-body-2 text-center">
              <v-icon small class="pr-3" color="green">mdi-cash</v-icon>
              {{ campaignStats.pledgeTotal }}
              Br value
            </h4>
            <h4 class="font-weight-regular py-2 text-body-2 text-center">
              <v-icon small class="pr-3" color="warning">mdi-gift</v-icon>
              {{ campaignStats.rewards }}
              rewards promised
            </h4>
          </div>
        </div>
      </v-card>
    </div>
    <v-divider class="mt-8"></v-divider>
    <div class="pa-5 mt-8">
      <div class="d-flex justify-space-between">
        <h2 class="text-h5">My Campaigns</h2>
        <v-btn color="primary" to="/campaign/create">
          <v-icon>mdi-plus</v-icon>
          <span class="d-none d-sm-inline pl-2">New Campaign</span>
        </v-btn>
      </div>
      <!-- <v-divider class="mt-5"></v-divider> -->
      <div class="mt-10 d-flex">
        <v-row class="d-flex">
          <div
            class="d-flex reversebackground pa-1 rounded-lg ma-3"
            v-for="campaign in campaigns"
            :key="campaign.id"
          >
            <div class="d-sm-none">
              <Thumbnail
                :width="175"
                :campaignId="campaign.id"
                :to="`/campaign/${campaign.id}`"
              />
            </div>
            <div class="d-none d-sm-block">
              <Thumbnail
                :width="250"
                :campaignId="campaign.id"
                :to="`/campaign/${campaign.id}`"
              />
            </div>
            <div class="d-flex flex-column justify-space-around px-1">
              <v-tooltip top class="px-2">
                <span>Edit</span>
                <template v-slot:activator="{ on, attrs }">
                  <v-btn
                    :to="`/campaign/edit/${campaign.id}`"
                    class="mx-2"
                    color="reverseforeground"
                    v-bind="attrs"
                    v-on="on"
                    icon
                    small
                  >
                    <v-icon>mdi-pencil</v-icon>
                  </v-btn>
                </template>
              </v-tooltip>
              <v-tooltip v-if="campaign.is_ended" top class="px-2">
                <span>Withdraw Funds</span>
                <template v-slot:activator="{ on, attrs }">
                  <v-btn
                    @click="withdrawDialog = true"
                    class="mx-2"
                    color="reverseforeground"
                    v-bind="attrs"
                    v-on="on"
                    icon
                    small
                    :to="`/campaign/withdraw/${campaign.id}`"
                  >
                    <v-icon>mdi-upload</v-icon>
                  </v-btn>
                </template>
              </v-tooltip>
            </div>
          </div>
        </v-row>
      </div>
    </div>
  </v-container>
</template>

<script>
import { getCreatorCampaigns } from "~/queries/campaign/getCreatorCampaigns.gql";
import Thumbnail from "~/components/campaign/Thumbnail.vue";
import WithdrawalRequestDialog from "~/components/campaign/Withdraw.vue";
export default {
  middleware: "isCreator",
  components: {
    Thumbnail,
    WithdrawalRequestDialog,
  },
  apollo: {
    campaign: {
      query: getCreatorCampaigns,
      variables() {
        return {
          creatorId: this.userId,
        };
      },
      result({ data }) {
        this.campaigns = data.campaign;
      },
      skip() {
        return !this.userId;
      },
      fetchPolicy: "no-cache",
    },
  },
  computed: {
    userId() {
      return this.$authHelper.getUserInfo()
        ? this.$authHelper.getUserInfo().id
        : false;
    },
    campaignStats() {
      if (!this.campaigns) {
        return 0;
      }
      let successful = 0,
        failed = 0,
        pending = 0,
        pledges = 0,
        pledgeTotal = 0,
        rewards = 0,
        likes = 0,
        dislikes = 0;

      console.log(this.campaigns);
      this.campaigns.forEach((campaign) => {
        pledges += campaign.pledges.length;
        rewards += campaign.rewards.length;
        likes += campaign.likes.length;
        dislikes += campaign.dislikes.length;
        campaign.pledges.forEach((pledge) => {
          pledgeTotal += pledge.amount;
        });
        if (campaign.is_ended) {
          if (campaign.end_status === "successful") {
            successful += 1;
          } else {
            failed += 1;
          }
        } else {
          pending += 1;
        }
      });
      const ratio =
        dislikes === 0
          ? likes === 0
            ? "N/A"
            : "100% positive"
          : Math.floor((likes / (likes + dislikes) * 100)) + "% positive";
      return {
        successful: successful,
        failed: failed,
        pending: pending,
        pledges: pledges,
        pledgeTotal: this.$money.format(pledgeTotal),
        rewards: rewards,
        likes: likes,
        dislikes: dislikes,
        ratio: ratio,
      };
    },
  },
  data() {
    return {
      campaigns: undefined,
      withdrawDialog: false,
    };
  },
};
</script>

<style>
</style>