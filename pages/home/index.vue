<template>
  <div>
    <h3 class="text-h4 font-weight-light">
      Welcome back,
      <span class="font-weight-bold">{{ userInfo.firstName }}</span>
    </h3>
    <v-divider class="mt-5 mb-10"></v-divider>
    <div class="d-flex align-center justify-space-around flex-column flex-sm-row">
      <v-card to="home/settings/transactions" class="pa-3 my-3 my-sm-0 rounded-lg" elevation="3" width="220">
        <h6 class="text-subtitle-1 grey--text">Balance</h6>
        <h5 class="px-5 pt-6 pb-10 text-h4 text-right">
          {{ userBalance }}
          <span class="pl-2 text-h6 font-weight-regular">Br</span>
        </h5>
      </v-card>
      <v-card to="home/settings/pledges" class="pa-3 my-3 my-sm-0 rounded-lg" elevation="3" width="220">
        <h6 class="text-subtitle-1 grey--text">Pledged</h6>
        <h5 class="px-5 pt-6 pb-10 text-h4 text-right">
          {{ pledgeSum }}
          <span class="pl-2 text-h6 font-weight-regular">Br</span>
        </h5>
      </v-card>
      <v-card to="home/settings/rewards" class="pa-3 my-3 my-sm-0 rounded-lg" elevation="3" width="220">
        <h6 class="text-subtitle-1 grey--text">Rewards</h6>
        <h5 class="px-5 pt-6 pb-10 text-h4 text-right">3</h5>
      </v-card>
    </div>
    <div class="d-flex justify-center flex-column flex-sm-row mt-10">
      <v-btn outlined color="primary" to="/home/bookmarks" class="mx-5 my-1 my-sm-0"
        >Saved Campaigns</v-btn
      >
      <v-dialog width="500" v-model="dialog">
        <template v-slot:activator="{ on, attrs }">
          <v-btn
            outlined
            color="primary"
            v-bind="attrs"
            v-on="on"
            @click="dialog = true"
            class="mx-5 my-1 my-sm-0"
            >Refill Funds</v-btn
          >
        </template>
        <RedeemVoucherDialog
          v-on:close-redeem-voucher-dialog="dialog = false"
        />
      </v-dialog>
      <v-btn
        v-if="campaigns.length > 0"
        outlined
        color="primary"
        :to="randomCampaignLink"
        class="mx-5 my-1 my-sm-0"
        >I'm Feeling Lucky</v-btn
      >
    </div>
    <v-divider class="mt-10 mb-5"></v-divider>
    <div class="pa-3 mt-5">
      <v-flex>
        <h1 class="text-h5 font-weight-light">Latest Campaigns</h1>
        <span class="font-weight-light"
          >{{ campaigns.length }} campaigns available</span
        >
      </v-flex>
      <!-- <v-divider /> -->
      <v-row class="d-flex mt-3">
        <v-col
          class="col-12 col-sm-4 col-md-4 col-lg-3 col-xl-2"
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
    </div>
  </div>
</template>

<script>
import { discoverCampaigns } from "~/queries/discoverCampaigns.gql";
import { getUserStats } from "~/queries/user/getUserStats.gql";
export default {
  middleware: "isAuth",
  apollo: {
    campaign: {
      query: discoverCampaigns,
      result({ data }) {
        // console.log(data);
        this.campaigns = data.campaign;
      },
      fetchPolicy: "no-cache",
    },
    user: {
      query: getUserStats,
      variables() {
        return {
          userId: this.userInfo.id,
        };
      },
      result({ data }) {
        console.log(data.user.pledges)
        this.user = data.user;
      },
      skip() {
        return !(this.userInfo && this.userInfo.id);
      },
      fetchPolicy: "no-cache",
    },
  },
  computed: {
    userInfo() {
      return this.$authHelper.getUserInfo();
    },
    userBalance() {
      return this.user
        ? this.$money.format(this.user.wallet.useable_balance)
        : "";
    },
    pledgeSum() {
      if (!this.user) {
        return 0;
      }
      let pledgeSum = 0;
      this.user.wallet.pledges.forEach((pledge) => {
        pledgeSum += pledge.amount;
      });
      return this.$money.format(pledgeSum);
    },
    randomCampaignLink() {
      if (this.campaigns.length > 0) {
        const randIndex = Math.floor(Math.random() * this.campaigns.length);
        return `/campaign/${this.campaigns[randIndex].id}`;
      }
    },
  },
  data() {
    return {
      campaigns: [],
      user: undefined,
      dialog: false,
    };
  },
};
</script>

<style>
</style>