<template>
  <v-card class="mt-5 pa-8" outlined flat>
    <div v-if="transactions.length > 0" class="">
      <div class="d-flex justify-space-between">
        <h3 class="text-h6 pb-8">
          Spent: <span class="font-weight-light">{{ total.spending }} Br</span>
        </h3>
        <h3 class="text-h6 pb-8">
          Added: <span class="font-weight-light">{{ total.income }} Br</span>
        </h3>
      </div>
      <v-simple-table>
        <thead class="text-caption">
          <td class="pb-2 text-uppercase">Date</td>
          <td class="pb-2 text-uppercase text-right">Amount</td>
          <td class="pb-2 text-uppercase text-right">Starting Balance</td>
          <td class="pb-2 text-uppercase text-right">Final Balance</td>
        </thead>
        <tbody>
          <UserTransaction
            v-for="transaction in transactions"
            :key="transaction.id"
            :transaction="transaction"
          />
        </tbody>
      </v-simple-table>
    </div>
    <h3
      v-else
      class="text-h6 font-weight-light text-center py-5"
      :style="{ color: noTransactionsColor }"
    >
      No transactions found
    </h3>
  </v-card>
</template>

<script>
import UserTransaction from "~/components/user/Transaction.vue";
import { getUserTransactions } from "~/queries/user/getUserTransactions.gql";
export default {
  components: {
    UserTransaction,
  },
  apollo: {
    user: {
      query: getUserTransactions,
      variables() {
        return {
          userId: this.userId,
        };
      },
      result({ data }) {
        this.transactions = data.user.wallet.transactions;
      },
      skip() {
        return !this.userId;
      },
      fetchPolicy: "no-cache",
    },
  },
  computed: {
    noTransactionsColor() {
      return this.$themeHelper.setThemeColorOpacity("foreground", 0.5);
    },
    userId() {
      return this.$authHelper.getUserInfo().id;
    },
    total() {
      let spending = 0,
        income = 0;
      this.transactions.forEach((transaction) => {
        if (transaction.amount > 0) {
          income += transaction.amount;
        } else {
          spending -= transaction.amount;
        }
      });
      return {
        spending: this.$money.format(spending),
        income: this.$money.format(income),
      };
    },
  },
  data() {
    return {
      transactions: [],
    };
  },
};
</script>

<style>
</style>