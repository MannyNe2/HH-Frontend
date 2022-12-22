<template>
  <v-container class="px-0 px-sm-3" v-if="user">
    <v-card flat color="transparent" class="pa-3 pa-sm-8 mx-sm-8">
      <v-banner
        v-if="user.is_banned === true"
        color="error white--text text-center mb-8 text-uppercase text-subtitle-2"
        >Banned</v-banner
      >
      <div class="d-flex justify-center">
        <DynamicAvatar
          :image="imageUrl"
          :firstName="user.first_name"
          :lastName="user.last_name"
          :isVerified="user.is_verified"
          :size="100"
          :rounded="false"
          imageClass="elevation-5"
        />
      </div>
      <h3 class="text-h6 text-center font-weight-light pt-6">
        {{ user.first_name }} {{ user.last_name }}
      </h3>
      <h4 class="text-body-2 text-center grey--text">
        Joined {{ creationDate }} &#40;{{ creationDistance }}&#41;
      </h4>
      <v-card
        flat
        color="transparent"
        class="mt-5 py-3 d-flex justify-center align-center"
      >
        <div class="d-flex justify-center flex-wrap">
          <div class="py-1 px-3">
            <v-icon small>mdi-shield</v-icon>
            <span class="pl-2 text-capitalize">{{ user.role }}</span>
          </div>
          <v-divider vertical></v-divider>
          <div class="py-1 px-3">
            <v-icon small>mdi-account</v-icon>
            <span class="pl-2">{{ user.display_name }}</span>
          </div>
          <v-divider vertical></v-divider>
          <div class="py-1 px-3">
            <v-icon small>mdi-at</v-icon>
            <a :href="`mailto:${user.email_address}`" class="pl-2">{{
              user.email_address
            }}</a>
          </div>
          <v-divider vertical></v-divider>
          <div class="py-1 px-3" v-if="user.phone_number">
            <v-icon small>mdi-phone</v-icon>
            <span class="pl-2 text-capitalize">{{ user.phone_number }}</span>
          </div>
          <v-divider vertical v-if="user.phone_number"></v-divider>
          <div class="py-1 px-3">
            <v-icon small>mdi-account-details</v-icon>
            <span class="pl-2 text-capitalize">{{ user.gender }}</span>
          </div>
        </div>
      </v-card>
    </v-card>
    <div class="d-flex justify-center">
      <v-card
        flat
        outlined
        class="col-md-12 col-12 py-3 px-0 px-sm-3 rounded-lg"
      >
        <v-tabs v-model="tab" centered>
          <v-tab>Bio</v-tab>
          <v-tab>
            <v-badge
              v-if="commentsCount && commentsCount > 0"
              color="primary"
              :content="`${commentsCount}`"
              inline
              >Comments</v-badge
            >
            <span v-else>Comments</span>
          </v-tab>
          <v-tab>
            <v-badge
              v-if="campaignsCount && campaignsCount > 0"
              color="primary"
              :content="`${campaignsCount}`"
              inline
              >Campaigns</v-badge
            >
            <span v-else>Campaigns</span>
          </v-tab>
        </v-tabs>
        <v-tabs-items
          class="pa-2 pa-sm-5"
          v-model="tab"
          style="min-height: 80vh"
        >
          <v-tab-item>
            <div
              v-if="user.about && user.about !== ''"
              class="d-flex justify-center pa-3"
            >
              <RichTextView :content="user.about" />
            </div>
            <h2
              v-else
              class="text-h6 font-weight-light text-center py-5"
              :style="{ color: noBioColor }"
            >
              No bio found
            </h2>
          </v-tab-item>
          <v-tab-item>
            <UserCommentsList
              v-on:comments-loaded="setCommentCount"
              :userId="userId"
            />
          </v-tab-item>
          <v-tab-item>
            <UserCampaignsList
              v-on:campaigns-loaded="setCampaignCount"
              :userId="userId"
            />
          </v-tab-item>
        </v-tabs-items>
      </v-card>
    </div>
  </v-container>
</template>

<script>
import DynamicAvatar from "~/components/DynamicAvatar.vue";
import RichTextView from "~/components/RichTextView.vue";
import UserCampaignsList from "~/components/user/Campaigns.vue";
import { getProfileById } from "~/queries/user/getProfile.gql";
import { format, formatDistance } from "date-fns";

export default {
  name: "Profile",
  props: {
    userId: { type: String, default: undefined },
  },
  components: {
    DynamicAvatar,
    RichTextView,
    UserCampaignsList,
  },
  apollo: {
    user_by_pk: {
      query: getProfileById,
      variables() {
        return {
          id: this.userId,
        };
      },
      result({ data }) {
        try {
          this.user = data.user_by_pk;
        } catch (err) {
          console.log(err);
          this.$nuxt.error({ statusCode: 404, message: "User not found" });
        }
      },
      skip() {
        return !this.userId;
      },
      fetchPolicy: "no-cache",
    },
  },
  computed: {
    imageUrl() {
      return this.user && this.user.avatar
        ? this.user.avatar
        : require("~/assets/default-avatar.svg");
    },
    noBioColor() {
      return this.$themeHelper.setThemeColorOpacity("foreground", 0.5);
    },
    creationDate() {
      if (this.user.created_at) {
        return format(new Date(this.user.created_at), "MMMM d',' y");
      }
    },
    creationDistance() {
      if (this.user.created_at) {
        return formatDistance(new Date(this.user.created_at), Date.now(), {
          addSuffix: true,
        });
      }
    },
  },
  data() {
    return {
      user: undefined,
      commentsCount: 0,
      campaignsCount: 0,
      tab: null,
    };
  },
  methods: {
    setCommentCount(count) {
      this.commentsCount = count;
    },
    setCampaignCount(count) {
      this.campaignsCount = count;
    },
  },
};
</script>

<style>
</style>