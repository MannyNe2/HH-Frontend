<template>
  <div class="d-flex align-center justify-center pa-0">
    <v-menu
      class=""
      :close-on-content-click="false"
      offset-y
      bottom
      :nudge-width="250"
      :nudge-left="125"
      max-width="700"
      transition="slide-y-transition"
    >
      <template v-slot:activator="{ on, attrs }">
        <div v-bind="attrs" v-on="on" class="d-flex justify-end justify-sm-center col-sm pa-sm-0">
          <v-text-field
            label="Search"
            prepend-inner-icon="mdi-magnify"
            solo
            rounded
            hide-details
            v-model="searchInput"
            class="py-1 d-none d-sm-block"
          />
          <v-btn fab small rounded color="paper" class="d-sm-none"
            ><v-icon>mdi-magnify</v-icon></v-btn
          >
        </div>
      </template>
      <div style="max-height: 750px" class="overflow-scroll">
        <v-text-field
          label="Search"
          prepend-inner-icon="mdi-magnify"
          solo
          rounded
          hide-details
          v-model="searchInput"
          class="py-1 d-sm-none"
        />
        <v-list
          v-if="searchInput.length >= minSearchLength"
          class="d-flex flex-column px-2"
        >
          <div class="text-subtitle-2 text-end py-2 px-3">
            <span v-if="campaigns.length + users.length > 0"
              >{{ campaigns.length + users.length }} results found</span
            >
            <span v-else>No results found</span>
          </div>
          <div v-if="campaigns.length > 0 || users.length > 0">
            <v-divider></v-divider>
            <v-list v-if="campaigns.length > 0" class="mt-2">
              <h3 class="text-caption font-weight-light pl-1">Campaigns</h3>
              <SearchCampaignItem
                v-for="campaign in campaigns"
                :key="campaign.id"
                :campaign="campaign"
                class="my-1"
              />
            </v-list>
            <v-list v-if="users.length > 0" class="mt-2">
              <h3 class="text-caption font-weight-light pl-1">Users</h3>
              <SearchUserItem
                v-for="user in users"
                :key="user.id"
                :user="user"
                class="my-1"
              />
            </v-list>
          </div>
        </v-list>
      </div>
    </v-menu>
  </div>
</template>

<script>
import { search } from "~/queries/search.gql";
export default {
  apollo: {
    campaigns_by_title: {
      query: search,
      variables() {
        return {
          query: this.searchInput,
        };
      },
      result({ data }) {
        this.campaigns = data.campaigns_by_title;
      },
      skip() {
        return this.searchInput.length < this.minSearchLength;
      },
      fetchPolicy: "no-cache",
    },
    users: {
      query: search,
      variables() {
        return {
          query: this.searchInput,
        };
      },
      result({ data }) {
        console.log("fetching user results for " + this.searchInput);
        this.users = data.users;
      },
      skip() {
        console.log("input: " + this.searchInput);
        return this.searchInput.length < this.minSearchLength;
      },
      fetchPolicy: "no-cache",
    },
  },
  data() {
    return {
      minSearchLength: 1,
      searchInput: "",
      campaigns: [],
      users: [],
    };
  },
};
</script>

<style>
</style>