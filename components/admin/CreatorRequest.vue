<template>
  <v-list-item @click="clickX()" class="pa-0 rounded">
    <v-card rounded outlined class="pa-0 col rounded-lg" elevation="7">
      <div class="col d-flex align-center pa-2">
        <DynamicAvatar
          :image="campaign.requestor.avatar"
          :firstName="campaign.requestor.first_name"
          :lastName="campaign.requestor.last_name"
          :isVerified="campaign.requestor.is_verified"
          :size="100"
        >
          <template v-slot:placeholder>
            <v-row
              class="fill-height ma-0 grey"
              align="center"
              justify="center"
            >
              <v-progress-circular
                indeterminate
                color="primary"
              ></v-progress-circular>
            </v-row>
          </template>
        </DynamicAvatar>
        <div class="col py-2">
          <div class="d-flex mb-1 justify-space-between">
            <NuxtLink
              :to="`/profile/${campaign.requestor.id}`"
              class="text-h5 text-decoration-none primary--text"
              >{{
                campaign.requestor.first_name +
                " " +
                campaign.requestor.last_name
              }}</NuxtLink
            >
          </div>
          <div class="d-flex mt-2 justify-space-between">
            <div class="font-italic font-weight-bold">
              {{ campaign.requestor.display_name }}
            </div>
            <div
              class="date-container text-caption grey--text font-weight-bold"
            >
              Created {{ creationDate }}
            </div>
          </div>
        </div>
      </div>
    </v-card>
    <div class="text-center">
      <v-dialog v-model="dialog" scrollable width="500">
        <v-card>
          <v-card-title class="text-h5 grey lighten-2">
            Request by
            {{
              campaign.requestor.first_name + " " + campaign.requestor.last_name
            }}
          </v-card-title>

          <v-card-text class="pt-4">
            <h3 class="text-h5 font-weight-light">Verification Image</h3>
            <v-divider class="mb-3"></v-divider>

            <v-img
              class="grey"
              :aspect-ratio="1"
              :src="campaign.identification_image"
            >
              <template v-slot:placeholder>
                <v-row
                  class="fill-height ma-0 grey"
                  align="center"
                  justify="center"
                >
                  <v-progress-circular
                    indeterminate
                    color="primary"
                  ></v-progress-circular>
                </v-row>
              </template>
            </v-img>
          </v-card-text>

          <v-divider></v-divider>

          <div class="d-flex justify-center">
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn
                color="primary"
                text
                @click="approve(campaign.requestor.id)"
              >
                Approve
              </v-btn>
              <v-btn color="red" text @click="deny(campaign.requestor.id)">
                Deny
              </v-btn>
            </v-card-actions>
          </div>
        </v-card>
      </v-dialog>
    </div>
  </v-list-item>
</template>

<script>
import format from "date-fns/esm/format";
import parseISO from "date-fns/esm/fp/parseISO/index.js";
export default {
  props: {
    campaign: Object,
  },
  data() {
    return {
      dialog: false,
    };
  },
  methods: {
    clickX() {
      this.dialog = true;
    },
    approve(id) {
      console.log(id);
      this.$store.commit("report/setSelectedRequest", id);
      this.finalApprove();
    },
    deny(id) {
      console.log(id);
      this.$store.commit("report/setSelectedRequest", id);
      this.finalDeny();
    },
    finalApprove() {
      try {
        this.$store.dispatch("report/approveRequest");
      } catch (err) {
        console.log(err);
        this.$nuxt.error({ statusCode: 404, message: "Comment not found" });
      }
      this.dialog = false;
    },
    finalDeny() {
      try {
        this.$store.dispatch("report/denyRequest");
      } catch (err) {
        console.log(err);
        this.$nuxt.error({ statusCode: 404, message: "Comment not found" });
      }
      this.dialog = false;
    },
  },
  computed: {
        creationDate() {
      const creationDate = parseISO(this.campaign.created_at);
      return format(creationDate, "MMM d 'at' h:mm aaa");
    },
  }
};
</script>

<style>
.outline {
  border: 1px solid rgba(0, 0, 0, 0.3) !important;
}
</style>