<template>
  <tr>
    <td class="text-capitalize">
      <NuxtLink :to="`/campaign/${pledge.campaign.id}`"
        >{{ pledge.campaign.title }}
      </NuxtLink>
    </td>
    <td class="text-capitalize text-right">{{ pledgeAmount }} Br</td>
    <td class="text-capitalize text-right">{{ pledgeDate }}</td>
    <td class="text-capitalize text-center">
      {{ pledge.accept_rewards ? "Accept" : "Reject" }}
    </td>
    <td class="text-capitalize text-center">{{ pledge.status }}</td>
  </tr>
</template>

<script>
import { format, parseISO } from "date-fns";

export default {
  props: {
    pledge: Object,
  },
  computed: {
    pledgeDate() {
      return format(parseISO(this.pledge.created_at), "yyyy/MM/dd");
    },
    pledgeAmount() {
      return this.$money.format(this.pledge.amount);
    },
  },
};
</script>

<style>
</style>