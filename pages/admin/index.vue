<template>
  <v-container>
    <h3 class="text-h5 font-weight-light">Website Statistics</h3>
    <v-divider class="mt-3"></v-divider>
    <v-flex class="d-inline-flex flex-wrap justify-center mt-3">
      <v-row>
        <v-col>
          <AdminStatsCard
            :totalNum="totalUsers"
            :calculatedNum="calculatedUsers"
            :typeText="`Number of Users`"
            :mode="typeeUs"
          />
        </v-col>

        <v-col>
          <AdminStatsCard
            :totalNum="totalCreators"
            :calculatedNum="calculatedCreators"
            :typeText="`Number of Creators`"
            :mode="typeeCr"
          />
        </v-col>

        <v-col>
          <AdminStatsCard
            :totalNum="totalCampaigns"
            :calculatedNum="calculatedCampaigns"
            :typeText="`Number of Campaigns`"
            :mode="typeeCa"
          />
        </v-col>
      </v-row>
    </v-flex>

    <v-row>
      <v-col class="mt-4">
        <v-card class="py-7 my-2 rounded-lg" elevation="7">
          <v-list-item three-line>
            <v-list-item-content>
              <div class="text-center mb-8">Successfully Donated</div>
              <v-list-item-title
                class="text-h3 mb-8 font-weight-bold text-center"
              >
                ${{ pledgesWithdrawn === null ? 0 : pledgesWithdrawn }}
              </v-list-item-title>
            </v-list-item-content>
          </v-list-item>
        </v-card>
      </v-col>
      <v-col class="mt-4">
        <v-card class="py-7 my-2 rounded-lg" elevation="7">
          <v-list-item three-line>
            <v-list-item-content>
              <div class="text-center mb-8">Reports Reviewed</div>
              <v-list-item-title
                class="text-h3 mb-8 font-weight-bold text-center"
              >
                {{ campaignReportsReviewed + commentReportsReviewed }}
              </v-list-item-title>
            </v-list-item-content>
          </v-list-item>
        </v-card>
      </v-col>
    </v-row>

    <v-row>
      <v-col class="flex-column">
        <div class="d-flex justify-right align-right">
          <NuxtLink to="/admin/reports">view all</NuxtLink>
        </div>
        <v-simple-table class="elevation-4">
          <template v-slot:default>
            <thead>
              <tr>
                <th class="text-left">Reports</th>
                <th class="text-left">Amount</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="item in ReportsT" :key="item.title">
                <td>{{ item.title }}</td>
                <td>{{ item.value }}</td>
              </tr>
            </tbody>
          </template>
        </v-simple-table>
      </v-col>
      <v-col class="flex-column">
        <div class="d-flex justify-right align-right">
          <NuxtLink to="/admin/requests">view all</NuxtLink>
        </div>
        <v-simple-table class="elevation-4">
          <template v-slot:default>
            <thead>
              <tr>
                <th class="text-left">Verifications</th>
                <th class="text-left">Amount</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="item in RequestsT" :key="item.title">
                <td>{{ item.title }}</td>
                <td>{{ item.value }}</td>
              </tr>
            </tbody>
          </template>
        </v-simple-table>
      </v-col>
    </v-row>
    <v-row>
      <v-col class="d-flex justify-center flex-column flex-sm-row mt-10">
        <div>
          <v-btn outlined color="primary" to="/admin/vouchers" class="mx-5 my-1 my-sm-0">Generate vouchers</v-btn>
          <v-btn outlined color="primary" to="/admin/withdrawal" class="mx-5 my-1 my-sm-0">Withdraw Requests</v-btn>
        </div>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import { sub, format } from "date-fns";
import {
  userAggregate,
  newUserAggregate,
} from "~/queries/admin/stats/users/userAggregate.gql";
import {
  campaignsAggregate,
  newCampaignsAggregate,
} from "~/queries/admin/stats/campaigns/campaignsAggregate.gql";
import {
  creatorAggregate,
  newCreatorAggregate,
} from "~/queries/admin/stats/creator/creatorAggregate.gql";
import {
  allReportsCa,
  reviewedReportsCa,
} from "~/queries/admin/stats/reports/campaign/reports.gql";
import {
  allReportsCo,
  reviewedReportsCo,
} from "~/queries/admin/stats/reports/comment/reports.gql";
import {
  availableRequests,
  resolvedRequests,
} from "~/queries/admin/stats/requests/request.gql";

import { getTotalPledgesWithdrawn } from "~/queries/admin/stats/getTotalPledgesWithdrawn.gql";

export default {
  middleware: "isAdmin",

  apollo: {
    newUsers: {
      query: newUserAggregate,
      variables() {
        return {
          dateC: this.dateComp,
        };
      },
      result({ data }) {
        this.calculatedUsers = data.newUsers.aggregate.count;
        if (this.calculatedUsers === this.prevUs) {
          this.typeeUs = "eq";
          this.prevUs = this.calculatedUsers;
        } else if (this.calculatedUsers > this.prevUs) {
          this.typeeUs = "pos";
          this.prevUs = this.calculatedUsers;
        } else {
          this.typeeUs = "neg";
          this.prevUs = this.calculatedUsers;
        }
      },
      skip() {
        return !this.dateComp;
      },
      fetchPolicy: "no-cache",
    },
    allUsers: {
      query: userAggregate,
      result({ data }) {
        this.totalUsers = data.allUsers.aggregate.count;
      },
      fetchPolicy: "no-cache",
    },

    newCampaign: {
      query: newCampaignsAggregate,
      variables() {
        return {
          dateC: this.dateComp,
        };
      },
      result({ data }) {
        this.calculatedCampaigns = data.newCampaign.aggregate.count;
        if (this.calculatedCampaigns === this.prevCa) {
          this.typeeCa = "eq";
          this.prevCa = this.calculatedCampaigns;
        } else if (this.calculatedCampaigns > this.prevCa) {
          this.typeeCa = "pos";
          this.prevCa = this.calculatedCampaigns;
        } else {
          this.typeeCa = "neg";
          this.prevCa = this.calculatedCampaigns;
        }
      },
      skip() {
        return !this.dateComp;
      },
      fetchPolicy: "no-cache",
    },
    allCampaign: {
      query: campaignsAggregate,
      result({ data }) {
        this.totalCampaigns = data.allCampaign.aggregate.count;
      },
      fetchPolicy: "no-cache",
    },

    newCreator: {
      query: newCreatorAggregate,
      variables() {
        return {
          dateC: this.dateComp,
        };
      },
      result({ data }) {
        this.calculatedCreators = data.newCreator.aggregate.count;
        if (this.calculatedCreators === this.prevCr) {
          this.typeeCr = "eq";
          this.prevCr = this.calculatedCreators;
        } else if (this.calculatedCreators > this.prevCr) {
          this.typeeCr = "pos";
          this.prevCr = this.calculatedCreators;
        } else {
          this.typeeCr = "neg";
          this.prevCr = this.calculatedCreators;
        }
      },
      skip() {
        return !this.dateComp;
      },
      fetchPolicy: "no-cache",
    },
    allCreator: {
      query: creatorAggregate,
      result({ data }) {
        this.totalCreators = data.allCreator.aggregate.count;
      },
      fetchPolicy: "no-cache",
    },

    allCa: {
      query: allReportsCa,
      result({ data }) {
        this.campaignReports = data.allCa.aggregate.count;
      },
      fetchPolicy: "no-cache",
    },
    reviewedCa: {
      query: reviewedReportsCa,
      result({ data }) {
        this.campaignReportsReviewed = data.reviewedCa.aggregate.count;
      },
      fetchPolicy: "no-cache",
    },
    allCo: {
      query: allReportsCo,
      result({ data }) {
        this.commentReports = data.allCo.aggregate.count;
        this.ReportsT.push({
          title: "Requests submitted for review: ",
          value: this.campaignReports + this.commentReports,
        });
        this.ReportsT.push({
          title: "Requests reviewed: ",
          value: this.campaignReportsReviewed + this.commentReportsReviewed,
        });
        this.ReportsT.push({
          title: "Requests left for review: ",
          value:
            this.campaignReports +
            this.commentReports -
            (this.commentReportsReviewed + this.campaignReportsReviewed),
        });
      },
      fetchPolicy: "no-cache",
    },
    reviewedCo: {
      query: reviewedReportsCo,
      result({ data }) {
        this.commentReportsReviewed = data.reviewedCo.aggregate.count;
      },
      fetchPolicy: "no-cache",
    },

    allReq: {
      query: availableRequests,
      result({ data }) {
        this.totalRequests = data.allReq.aggregate.count;
      },
      fetchPolicy: "no-cache",
    },
    resolvedReq: {
      query: resolvedRequests,
      result({ data }) {
        this.reviewedRequests = data.resolvedReq.aggregate.count;
        this.RequestsT.push({
          title: "Requests submitted for review: ",
          value: this.totalRequests,
        });
        this.RequestsT.push({
          title: "Requests reviewed: ",
          value: this.reviewedRequests,
        });
        this.RequestsT.push({
          title: "Requests left for review: ",
          value: this.totalRequests - this.reviewedRequests,
        });
      },
      fetchPolicy: "no-cache",
    },

    pledge_aggregate: {
      query: getTotalPledgesWithdrawn,
      result({ data }) {
        this.pledgesWithdrawn = data.pledge_aggregate.aggregate.sum.amount;
      },
      fetchPolicy: "no-cache",
    },
  },

  computed: {
    dateComp() {
      return format(sub(Date.now(), { days: 2 }), "yyyy-MM-dd");
    },
  },

  data: () => ({
    date: "",
    calculatedUsers: "" || 0,
    totalUsers: "" || 0,
    calculatedCampaigns: "" || 0,
    totalCampaigns: "" || 0,
    calculatedCreators: "" || 0,
    totalCreators: "" || 0,
    repports: "" || 0,
    campaignReports: "" || 0,
    campaignReportsReviewed: "" || 0,
    commentReports: "" || 0,
    commentReportsReviewed: "" || 0,
    totalRequests: "" || 0,
    reviewedRequests: "" || 0,
    pledgesWithdrawn: "",
    ReportsT: [],
    RequestsT: [],
    prevUs: 0,
    prevCa: 0,
    prevCr: 0,
    typeeUs: "",
    typeeCa: "",
    typeeCr: "",

    desserts: [
      {
        name: "Requests submitted for review:",
        calories: 555,
      },
      {
        name: "Requests reviewed:",
        calories: 237,
      },
      {
        name: "Requests left for review:",
        calories: 262,
      },
    ],
  }),
};
</script>