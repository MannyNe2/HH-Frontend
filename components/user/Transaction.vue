<template>
  <v-dialog v-model="dialog" width="500">
    <template v-slot:activator="{ on, attrs }">
      <tr @click="dialog = true" v-bind="attrs" v-on="on">
        <td class="text-capitalize">{{ transactionDate }}</td>
        <td class="text-capitalize text-right">{{ transactionAmount }} Br</td>
        <td class="text-capitalize text-right">{{ startingBalance }} Br</td>
        <td class="text-capitalize text-right">{{ finalBalance }} Br</td>
      </tr>
    </template>
    <v-card class="pa-5">
      <h3 class="text-h5 font-weight-light">Transaction</h3>
      <h6 class="text-subtitle-2 my-2">ID: {{ transaction.id }}</h6>
      <v-divider class="mt-3 mb-5"></v-divider>
      <v-row>
        <v-col class="font-weight-bold col-4">Date:</v-col>
        <v-col>{{ transactionDateFull }}</v-col>
      </v-row>
      <v-row>
        <v-col class="font-weight-bold col-4">Transaction:</v-col>
        <v-col>{{ transactionAmountFullText }}</v-col>
      </v-row>
      <v-row>
        <v-col class="font-weight-bold col-4">Starting Balance:</v-col>
        <v-col>{{ startingBalance }} Br</v-col>
      </v-row>
      <v-row>
        <v-col class="font-weight-bold col-4">Final Balance:</v-col>
        <v-col>{{ finalBalance }} Br</v-col>
      </v-row>
      <div>
        <h6 class="text-body-1 font-weight-bold mt-5">System Message:</h6>
        <v-card color="background" flat outlined class="pa-3 mt-2">
          {{ transaction.remark }}
        </v-card>
      </div>
    </v-card>
  </v-dialog>
</template>

<script>
import { format, parseISO } from "date-fns";
export default {
  name: "UserTransaction",
  props: {
    transaction: Object,
  },
  computed: {
    transactionDate() {
      return format(parseISO(this.transaction.transaction_date), "yyyy/MM/dd");
    },
    transactionDateFull() {
      return format(
        parseISO(this.transaction.transaction_date),
        "yyyy/MM/dd 'at' h:mm:ss aaa"
      );
    },
    transactionAmount() {
      let amount = this.$money.format(this.transaction.amount);
      if (this.transaction.amount > 0) {
        amount = `+${amount}`;
      }
      return amount;
    },
    transactionAmountFullText() {
      const amount = Math.abs(this.transaction.amount);
      return `${
        this.transaction.amount > 0 ? "Debited" : "Credited"
      } ${this.$money.format(amount)} Br`;
    },
    startingBalance() {
      return this.$money.format(this.transaction.starting_balance);
    },
    finalBalance() {
      return this.$money.format(this.transaction.final_balance);
    },
  },
  data() {
    return {
      dialog: false,
    };
  },
};
</script>

<style>
</style>