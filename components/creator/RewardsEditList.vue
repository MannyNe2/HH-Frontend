<template>
  <div class="d-flex flex-column-reverse flex-lg-row">
    <div
      v-if="!!campaignId"
      class="d-flex flex-wrap justify-center justify-lg-start overflow-auto"
      style="max-height: 700px"
    >
      <RewardEditItem
        v-for="reward in rewards"
        :key="reward.id"
        :amount="reward.pledge_amount"
        :title="reward.title"
        :description="reward.description"
        :rewardType="reward.type"
        :deliveryDate="reward.estimated_delivery_date"
        class="ma-3"
      />
    </div>
    <div
      class="d-flex justify-center flex-column align-center flex-lg-row px-lg-5"
    >
      <v-dialog v-model="createRewardDialog" width="500">
        <template v-slot:activator="{ attrs, on }">
          <v-btn v-on="on" v-bind="attrs" class="" fab color="primary"
            ><v-icon>mdi-plus</v-icon></v-btn
          >
        </template>
        <RewardCreateForm
          v-on:close-create-reward-dialog="createRewardDialog = false"
        />
      </v-dialog>
    </div>
  </div>
</template>

<script>
import RewardEditItem from "~/components/creator/RewardEditItem.vue";
import RewardCreateForm from "~/components/creator/RewardCreateForm.vue";
import { mapState } from "vuex";

export default {
  name: "RewardsEditList",
  components: {
    RewardEditItem,
    RewardCreateForm,
  },
  computed: {
    ...mapState({
      campaignId: (state) => state.campaign.selected.id,
      rewards: (state) => state.campaign.selected.rewards,
    }),
  },
  data() {
    return {
      createRewardDialog: false,
    };
  },
};
</script>

<style>
</style>