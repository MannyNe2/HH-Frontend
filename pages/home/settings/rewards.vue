<template>
  <v-card class="mt-5 pa-8" outlined flat>
    <div v-if="!rewards" class="d-flex justify-center">
      <v-progress-circular indeterminate size="64"></v-progress-circular>
    </div>
    <v-simple-table v-else-if="rewards.length > 0">
      <thead class="text-caption font-weight-bold text-uppercase">
        <td class="px-2">Title</td>
        <td class="text-center px-2">Type</td>
        <td class="text-right px-2">Pledge</td>
        <td class="text-center px-2">Ships</td>
        <td></td>
      </thead>
      <tbody>
        <UserReward
          v-for="reward in rewards"
          :key="reward.id"
          :reward="reward"
        />
      </tbody>
    </v-simple-table>
    <h3
      v-else
      class="text-h6 font-weight-light text-center py-5"
      :style="{ color: noRewardsColor }"
    >
      No rewards available
    </h3>
  </v-card>
</template>

<script>
import { getRewards } from "~/queries/user/getRewards.gql";
import UserReward from "~/components/user/Reward.vue";

export default {
  components: {
    UserReward,
  },
  apollo: {
    user: {
      query: getRewards,
      variables() {
        return {
          id: this.userId,
        };
      },
      result({ data }) {
        console.log(data);
        try {
          this.rewards = [];
          data.user.eligible_rewards.forEach((eligibileReward) => {
            this.rewards.push(eligibileReward.reward);
          });
        } catch (err) {
          console.log(err);
          this.rewards = undefined;
          this.$nuxt.error({
            statusCode: 500,
            message: "Catastrophic failure when attempting to fetch rewards",
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
    userId() {
      return this.$authHelper.getUserInfo().id;
    },
    noRewardsColor() {
      return this.$themeHelper.setThemeColorOpacity("foreground", 0.5);
    },
  },
  data() {
    return {
      rewards: undefined,
    };
  },
};
</script>

<style>
</style>