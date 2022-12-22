<template>
  <v-container>
    <h3 class="text-h5 font-weight-light">Campaign Reports</h3>
    <v-divider class="mt-3 mb-5"></v-divider>
    <v-row v-if="reports.length > 0">
      <v-col class="flex-column">
        <v-simple-table>
          <template v-slot:default>
            <thead>
              <tr>
                <th class="text-left">Campaign</th>
                <th class="text-left">First Report</th>
                <th class="text-left">Last Report</th>
                <th class="text-left">Report</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="report in reports" :key="report.id">
                <td>
                  <NuxtLink :to="`campaign/${report.id}`">{{
                    report.title
                  }}</NuxtLink>
                </td>
                <td>{{ changeFormat(report.reports[0].created_at) }}</td>
                <td>
                  {{
                    changeFormat(
                      report.reports[report.reports.length - 1].created_at
                    )
                  }}
                </td>
                <td>{{ report.reports.length }}</td>
              </tr>
            </tbody>
          </template>
        </v-simple-table>
      </v-col>
    </v-row>
    <h2
      v-else
      class="text-h6 font-weight-light text-center py-5"
      :style="{ color: noReportsColor }"
    >
      No reports found
    </h2>
  </v-container>
</template>

<script>
import { allCampaignReports } from "~/queries/admin/reports/campaign/allCampaignReports.gql";
import { format, parseISO } from "date-fns";
export default {
  middleware: "isAdmin",
  apollo: {
    campaign: {
      query: allCampaignReports,
      result({ data }) {
        this.reports = data.campaign;
      },
      fetchPolicy: "no-cache",
    },
  },
  data() {
    return {
      reports: [],
    };
  },
  computed: {
    noReportsColor() {
      return this.$themeHelper.setThemeColorOpacity("foreground", 0.5);
    },
  },
  methods: {
    changeFormat(theDate) {
      return format(parseISO(theDate), "MMM dd, yyyy");
    },
  },
};
</script>