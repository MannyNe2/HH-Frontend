<template>
  <div class="mt-5">
    <v-card
      flat
      outlined
      class="py-3 px-8 d-flex justify-space-between align-center"
    >
      <h3 class="text-subtitle-1 font-weight-regular">Become a Creator</h3>
      <v-tooltip top v-if="userRole === 'creator'">
        <template v-slot:activator="{ on, attrs }">
          <div
            v-bind="attrs"
            v-on="on"
            class="success--text d-flex align-center cursor-regular"
          >
            <span class="pr-2">Creator</span>
            <v-icon color="success">mdi-check</v-icon>
          </div>
        </template>
        <span>You are alreday a creator</span>
      </v-tooltip>
      <v-tooltip top v-else-if="userRole === 'admin'">
        <template v-slot:activator="{ on, attrs }">
          <div
            v-bind="attrs"
            v-on="on"
            class="info--text d-flex align-center cursor-regular"
          >
            <span class="pr-2">Administrator</span>
            <v-icon color="info">mdi-alert-circle-outline</v-icon>
          </div>
        </template>
        <span>Administrators cannot become creators</span>
      </v-tooltip>
      <v-tooltip top v-else-if="lastRequestDate && lastRequestAge < 30">
        <template v-slot:activator="{ on, attrs }">
          <div
            v-bind="attrs"
            v-on="on"
            class="warning--text d-flex align-center cursor-regular"
          >
            <span class="pr-2">Cooldown</span>
            <v-icon color="warning">mdi-alert-outline</v-icon>
          </div>
        </template>
        <span>You must wait at least 30 days between creatorship requests</span>
      </v-tooltip>
      <CreatorRequestForm v-else v-on:submitted="refresh" />
    </v-card>
    <v-card flat outlined class="py-5 px-8 mt-5">
      <h3 class="text-subtitle-1 font-weight-regular">Previous Requests</h3>
      <v-simple-table v-if="creatorRequests.length > 0" class="mt-8">
        <thead :style="{ background: theadBackground }">
          <td class="text-caption text-uppercase font-weight-bold py-2 px-4">
            Requested
          </td>
          <td class="text-caption text-uppercase font-weight-bold py-2 px-4">
            Proccessed
          </td>
          <td
            class="
              text-caption text-uppercase
              font-weight-bold
              py-2
              px-4
              text-center
            "
          >
            Status
          </td>
        </thead>
        <tbody>
          <tr v-for="request in creatorRequests" :key="request.id">
            <td class="text-start">{{ request.created_at }}</td>
            <td class="text-start">
              {{
                request.updated_at === request.created_at
                  ? "N/A"
                  : request.updated_at
              }}
            </td>
            <td class="text-center">
              <v-chip
                small
                class="text-capitalize"
                :color="
                  request.status === 'approved'
                    ? 'success'
                    : request.status === 'denied'
                    ? 'error'
                    : ''
                "
                >{{ request.status }}</v-chip
              >
            </td>
          </tr>
        </tbody>
      </v-simple-table>
      <h3
        v-else
        class="text-h6 font-weight-light text-center py-5"
        :style="{ color: noRequestsColor }"
      >
        No requests found
      </h3>
    </v-card>
  </div>
</template>

<script>
import CreatorRequestForm from "~/components/user/CreatorRequestForm.vue";
import { getUserCreatorRequests } from "~/queries/user/getUserCreatorRequests.gql";
import { format, parseISO, differenceInDays } from "date-fns";

export default {
  components: {
    CreatorRequestForm,
  },
  apollo: {
    user: {
      query: getUserCreatorRequests,
      variables() {
        return {
          id: this.userId,
        };
      },
      result({ data }) {
        this.creatorRequests = [];
        if (data.user.creator_requests.length > 0) {
          data.user.creator_requests.forEach((request) => {
            this.creatorRequests.push({
              id: request.id,
              created_at: format(
                parseISO(request.created_at),
                "yyyy/MM/dd h:mm aaa"
              ),
              updated_at: format(
                parseISO(request.updated_at),
                "yyyy/MM/dd h:mm aaa"
              ),
              status: request.status,
            });
          });
          this.lastRequestDate = parseISO(
            data.user.creator_requests[0].created_at
          );
        }
      },
      skip() {
        return !this.userId;
      },
      fetchPolicy: "no-cache",
    },
  },
  computed: {
    userId() {
      return this.$authHelper.getUserInfo().id;
    },
    userRole() {
      return this.$authHelper.getUserInfo().role;
    },
    theadBackground() {
      return this.$themeHelper.setThemeColorOpacity("reversebackground", 0.05);
    },
    noRequestsColor() {
      return this.$themeHelper.setThemeColorOpacity("foreground", 0.5);
    },
    lastRequestAge() {
      return differenceInDays(
        Date.now(),
        this.lastRequestDate ? this.lastRequestDate : Date.now()
      );
    },
  },
  data() {
    return {
      creatorRequests: [],
      lastRequestDate: undefined,
    };
  },
  methods: {
    refresh() {
      this.$apollo.queries.user.refetch();
    },
  },
};
</script>

<style>
</style>