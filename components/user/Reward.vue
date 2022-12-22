<template>
  <v-dialog v-model="dialog" width="500">
    <template v-slot:activator="{ on, attrs }">
      <tr @click="dialog = true" v-bind="attrs" v-on="on">
        <td class="">{{ reward.title }}</td>
        <td class="text-center text-capitalize">{{ reward.type }}</td>
        <td class="text-right">{{ pledgeAmount }} Br</td>
        <td class="text-center">{{ deliveryDate }}</td>
        <td>
          <NuxtLink :to="`/campaign/${reward.campaign.id}`"
            >View campaign</NuxtLink
          >
        </td>
      </tr>
    </template>
    <v-card class="pa-5">
      <h3 class="text-h5 font-weight-light">Reward</h3>
      <h6 class="text-subtitle-2 my-2">ID: {{ reward.id }}</h6>
      <v-divider class="mt-3 mb-5"></v-divider>
      <v-row>
        <v-col class="font-weight-bold col-4">Title:</v-col>
        <v-col>{{ reward.title }}</v-col>
      </v-row>
      <div>
        <h6 class="text-body-1 font-weight-bold mt-5">Description:</h6>
        <v-card color="background" flat outlined class="pa-3 mt-2">
          {{ reward.description }}
        </v-card>
      </div>
      <v-row class="mt-2">
        <v-col class="font-weight-bold col-4">Type:</v-col>
        <v-col class="text-capitalize">{{ reward.type }} Goods</v-col>
      </v-row>
      <v-row>
        <v-col class="font-weight-bold col-4">Minumum Pledge:</v-col>
        <v-col>{{ pledgeAmount }} Br</v-col>
      </v-row>
      <v-row>
        <v-col class="font-weight-bold col-4">Estimated Delivery Date:</v-col>
        <v-col>{{ deliveryDateFull }}</v-col>
      </v-row>
      <v-row>
        <v-col class="font-weight-bold col-4">Campaign:</v-col>
        <v-col>
          <NuxtLink :to="`/campaign/${reward.campaign.id}`"
            >View campaign</NuxtLink
          ></v-col
        >
      </v-row>
    </v-card>
  </v-dialog>
</template>

<script>
import { parseISO, format } from "date-fns";
export default {
  name: "UserReward",
  props: {
    reward: Object,
  },
  computed: {
    pledgeAmount() {
      return this.$money.format(this.reward.pledge_amount);
    },
    deliveryDate() {
      return format(
        parseISO(this.reward.estimated_delivery_date),
        "yyyy/MM/dd"
      );
    },
    deliveryDateFull() {
      return format(
        parseISO(this.reward.estimated_delivery_date),
        "yyyy/MM/dd 'at' h:mm:ss aaa"
      );
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