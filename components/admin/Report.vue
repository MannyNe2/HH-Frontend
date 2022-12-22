<template>
  <v-card outlined flat class="pa-5" width="250">
    <div class="d-flex align-center">
      <DynamicAvatar
        :image="report.reporter.avatar"
        :firstName="report.reporter.display_name"
        :isVerified="report.reporter.is_verified"
        :size="30"
      />
      <div class="pl-2">{{ report.reporter.display_name }}</div>
    </div>
    <div class="mt-3">
      <v-row>
        <v-col class="font-weight-bold col-4">Report Date:</v-col>
        <v-col class="">{{ creationDate }}</v-col>
      </v-row>
      <h3 class="text-body-1 py-2 font-weight-bold">Reason:</h3>
      <v-card flat color="background pa-3">
        {{ report.reason }}
      </v-card>
    </div>
  </v-card>
</template>

<script>
import format from "date-fns/esm/format";
import parseISO from "date-fns/esm/fp/parseISO/index.js";
export default {
  props: {
    report: Object,
  },
  computed: {
    wasEdited() {
      return (
        parseISO(this.report.updated_at) > parseISO(this.report.created_at)
      );
    },
    creationDate() {
      const creationDate = parseISO(this.report.created_at);
      return format(creationDate, "MMM d 'at' h:mm aaa");
    },
    displayNameColor() {
      return this.$vuetify.theme.isDark ? "white" : "black";
    },
    roleColor() {
      if (this.report.user.role === "admin") {
        return "red";
      } else if (this.report.user.role === "creator") {
        return "secondary";
      }
    },
    roleIcon() {
      if (this.report.user.role === "admin") {
        return "mdi-shield-star";
      } else if (this.report.user.role === "creator") {
        return "mdi-star-cog";
      }
    },
    currentUserId() {
      return this.$authHelper.getUserInfo().id;
    },
  },
};
</script>

<style>
</style>