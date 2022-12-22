<template>
  <v-flex class="flex-column justify-center">
    <h1 class="font-weight-thin">Under Construction</h1>
    <div class="mt-10">
      <h3>Current User Information</h3>
      <v-row class="d-flex justify-start mt-3">
        <v-col class="font-weight-bold col-auto">Token</v-col>
        <v-col class="col-3">{{ $apolloHelpers.getToken() }}</v-col>
      </v-row>
      <v-row class="d-flex justify-start mt-3">
        <v-col class="font-weight-bold col-auto">User Id</v-col>
        <v-col class="col-3">{{ userId }}</v-col>
      </v-row>
      <v-row class="d-flex justify-start mt-3">
        <v-col class="font-weight-bold col-auto">Username</v-col>
        <v-col class="col-3">{{ displayName }}</v-col>
      </v-row>
      <v-row class="d-flex justify-start mt-3">
        <v-col class="font-weight-bold col-auto">Role</v-col>
        <v-col class="col-3">{{ role }}</v-col>
      </v-row>
      <v-row class="d-flex justify-start mt-3">
        <v-col class="font-weight-bold col-auto">First Name</v-col>
        <v-col class="col-3">{{ firstName }}</v-col>
      </v-row>
      <v-row class="d-flex justify-start mt-3">
        <v-col class="font-weight-bold col-auto">Last Name</v-col>
        <v-col class="col-3">{{ lastName }}</v-col>
      </v-row>
      <v-row class="d-flex justify-start mt-3">
        <v-col class="font-weight-bold col-auto">Avatar URL</v-col>
        <v-col class="col-3">{{ avatarUrl }}</v-col>
      </v-row>
      <v-row class="d-flex justify-start mt-3">
        <v-col class="font-weight-bold col-auto">Verified</v-col>
        <v-col class="col-3">{{ isVerified }}</v-col>
      </v-row>
      <v-row class="d-flex justify-start mt-3">
        <v-col class="font-weight-bold col-auto">Banned</v-col>
        <v-col class="col-3">{{ isBanned }}</v-col>
      </v-row>
    </div>
    <div class="mt-10">
      <v-btn color="primary" @click="signOut">Sign Out</v-btn>
    </div>
  </v-flex>
</template>

<script>
export default {
  computed: {
    userId() {
      return localStorage.userId;
    },
    userId() {
      return localStorage.userId;
    },
    displayName() {
      return localStorage.userDisplayName;
    },
    role() {
      return localStorage.userRole;
    },
    firstName() {
      return localStorage.userFirstName;
    },
    lastName() {
      return localStorage.userLastName;
    },
    avatarUrl() {
      return localStorage.userAvatarUrl;
    },
    isVerified() {
      return localStorage.userIsVerified;
    },
    isBanned() {
      return localStorage.userIsBanned;
    },
  },
  methods: {
    signOut() {
      this.$apolloHelpers.onLogout();
      localStorage.userId = null;
      localStorage.userDisplayName = null;
      localStorage.userFirstName = null;
      localStorage.userLastName = null;
      localStorage.userAvatarUrl = null;
      localStorage.userRole = null;
      localStorage.userIsVerified = null;
      localStorage.userIsBanned = null;
      this.$router.push("/");
    },
  },
};
</script>

<style>
</style>