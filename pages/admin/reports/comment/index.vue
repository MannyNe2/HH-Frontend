<template>
  <v-container>
    <h3 class="text-h5 font-weight-light">
      Comment Reports
    </h3>
    <v-divider class="mt-3 mb-5"></v-divider>
    <v-row v-if="reports.length > 0">
      <v-col class="flex-column">
        <v-simple-table>
          <template v-slot:default>
            <thead>
              <tr>
                <th class="col-5 text-left">Comment</th>
                <th class="text-left">First Report</th>
                <th class="text-left">Last Report</th>
                <th class="text-left">Report</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="report in reports" :key="report.id">
                <td>
                  <NuxtLink :to="`comment/${report.id}`">{{
                    report.text.substring(0, 100) + "..."
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
import { allCommentReports } from "~/queries/admin/reports/comment/allCommentReports.gql";
import { format, parseISO } from "date-fns";
export default {
  middleware: "isAdmin",
  apollo: {
    comment: {
      query: allCommentReports,
      result({ data }) {
        this.reports = data.comment;
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