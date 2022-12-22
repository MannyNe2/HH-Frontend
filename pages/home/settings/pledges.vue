<template>
  <v-card class="mt-5 pa-8" outlined flat>
    <div v-if="pledges.length > 0" class="">
      <h3 class="text-h6 pb-8">
        Total Pledged: <span class="font-weight-light">{{ pledgeSum }} Br</span>
      </h3>
      <v-simple-table>
        <thead class="text-caption">
          <td class="pb-2 text-uppercase">Campaign</td>
          <td class="pb-2 text-uppercase text-center">Amount</td>
          <td class="pb-2 text-uppercase text-center">Date</td>
          <td class="pb-2 text-uppercase text-center">Rewards</td>
          <td class="pb-2 text-uppercase text-center">Status</td>
        </thead>
        <tbody>
          <UserPledge
            v-for="pledge in pledges"
            :key="pledge.id"
            :pledge="pledge"
          />
        </tbody>
      </v-simple-table>
    </div>
    <h3
      v-else
      class="text-h6 font-weight-light text-center py-5"
      :style="{ color: noPledgesColor }"
    >
      No pledges found
    </h3>
  </v-card>
</template>

<script>
import { getUserPledges } from "~/queries/user/getUserPledges.gql";

export default {
  apollo: {
    user: {
      query: getUserPledges,
      variables() {
        return {
          userId: this.userId,
        };
      },
      result({ data }) {
        this.pledges = data.user.wallet.pledges;
      },
      skip() {
        return !this.userId;
      },
      fetchPolicy: "no-cache",
    },
  },
  computed: {
    noPledgesColor() {
      return this.$themeHelper.setThemeColorOpacity("foreground", 0.5);
    },
    userId() {
      return this.$authHelper.getUserInfo().id;
    },
    pledgeSum() {
      if (this.pledges.length > 0) {
        let sum = 0;
        this.pledges.forEach((pledge) => {
          sum += pledge.amount;
        });
        return this.$money.format(sum);
      }
      return "";
    },
  },
  data() {
    return {
      pledges: [],
    };
  },
};
</script>

<style>
</style>