<template>
  <v-container>
    <v-row>
      <v-col v-if="campaignReports.length > 0" class="flex-column">
        <div class="d-flex justify-space-between">
          Campaign Report
          <NuxtLink to="reports/campaign">view all</NuxtLink>
        </div>
        <v-simple-table>
          <template v-slot:default>
            <thead class="font-weight-bold div-contain">
              <tr>
                <th class="text-left">Campaign</th>
                <th class="text-left">Report</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="report in campaignReports" :key="report.id">
                <td>{{ report.title }}</td>
                <td>{{ report.reports.length }}</td>
              </tr>
            </tbody>
          </template>
        </v-simple-table>
      </v-col>
      <v-col v-else>
        <h2
          class="text-h6 font-weight-light text-center py-5"
          :style="{ color: noReportsColor }"
        >
          No campaign reports found
        </h2>
      </v-col>
      <v-col v-if="commentReports.length > 0" class="flex-column">
        <div class="d-flex justify-space-between">
          Comment Report
          <NuxtLink to="reports/comment">view all</NuxtLink>
        </div>
        <v-simple-table>
          <template v-slot:default>
            <thead>
              <tr>
                <th class="text-left">Comment</th>
                <th class="text-left">Report</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="report in commentReports" :key="report.id">
                <td>{{ report.text.substring(0, 50) + "..." }}</td>
                <td>{{ report.reports.length }}</td>
              </tr>
            </tbody>
          </template>
        </v-simple-table>
      </v-col>
      <v-col v-else>
        <h2
          class="text-h6 font-weight-light text-center py-5"
          :style="{ color: noReportsColor }"
        >
          No comment reports found
        </h2>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import { limitedCampaignReports } from "~/queries/admin/reports/campaign/limitedCampaignReports.gql";
import { limitedCommentReports } from "~/queries/admin/reports/comment/limitedCommentReports.gql";
export default {
  middleware: "isAdmin",
  apollo: {
    campaign: {
      query: limitedCampaignReports,
      result({ data }) {
        this.campaignReports = data.campaign;
      },
      fetchPolicy: "no-cache",
    },
    comment: {
      query: limitedCommentReports,
      result({ data }) {
        this.commentReports = data.comment;
      },
      fetchPolicy: "no-cache",
    },
  },
  computed: {
    noReportsColor() {
      return this.$themeHelper.setThemeColorOpacity("foreground", 0.5);
    },
  },
  data() {
    return {
      campaignReports: [],
      commentReports: [],
    };
  },
};
</script>

<style>
</style>
