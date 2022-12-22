<template>
  <v-container class="">
    <h3 class="text-h5 font-weight-light">Creator Requests</h3>
    <v-divider class="mt-3 mb-5"></v-divider>
    <div v-if="requests.length > 0" class="mt-5">
      <AdminCreatorRequest
        class="ma-3"
        v-for="request in requests"
        :key="request.id"
        :campaign="request"
      />
    </div>
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
import { creatorRequest } from "~/queries/admin/requests/creatorRequest.gql";
export default {
  middleware: "isAdmin",
  apollo: {
    creator_request: {
      query: creatorRequest,
      result({ data }) {
        this.requests = data.creator_request;
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
      mode: "campaign",
      requests: [],
      reports: [],
      length: "",
      id: this.$route.params.id,
    };
  },
};
</script>

<style>
.action-bar {
  position: fixed;
  bottom: 0;
  left: 0;
  width: 100%;
}
</style>