<template>
  <v-flex class="background pa-0">
    <v-col class="transparent pa-0 container">
      <v-img
        class="d-flex justify-end align-end overflow-visible"
        :src="campaign.selected.banner"
        height="525"
        gradient="to top, rgba(0,0,0,.75), rgba(0,0,0,.2)"
      >
        <div class="d-flex justify-end align-center pa-3">
          <div
            class="
              banner-title
              elevation-5
              d-flex
              align-center
              font-weight-light
              text-subtitle-1
              white--text
            "
          >
            <v-flex class="px-3 shadow-text"> created by </v-flex>
            <NuxtLink
              :to="`/profile/${campaign.selected.creator.id}`"
              class="
                rounded
                elevation-5
                paper
                text-decoration-none
                d-flex
                py-2
                px-3
                justify-center
                align-center
              "
            >
              <h3
                :class="`pr-2 text-subtitle-1 ${creatorTextColor} font-weight-light`"
              >
                {{ campaign.selected.creator.display_name }}
              </h3>
              <DynamicAvatar
                :image="campaign.selected.creator.avatar"
                :firstName="campaign.selected.creator.first_name"
                :lastName="campaign.selected.creator.last_name"
                :isVerified="campaign.selected.creator.is_verified"
                :size="35"
                class="elevation-5"
              />
            </NuxtLink>
          </div>
        </div>
      </v-img>
      <div
        class="
          transparent
          d-flex
          flex-column flex-sm-row
          justify-sm-space-between
          align-sm-center
          px-5
          py-3
        "
      >
        <div class="">
          <div class="d-flex flex-column flex-sm-row align-center">
            <h1 class="px-2 text-h6 text-md-h5">
              {{ campaign.selected.title }}
            </h1>

            <v-btn
              color="primary"
              :outlined="!savedByCurrentUser"
              large
              class="mx-5 d-none d-sm-block"
              @click="save"
            >
              <span v-if="savedByCurrentUser"
                ><v-icon left>mdi-bookmark</v-icon>Saved</span
              >
              <span v-else><v-icon left>mdi-bookmark-outline</v-icon>Save</span>
            </v-btn>
          </div>
          <div class="pl-2 pr-4 pt-5 pb-3">
            <v-progress-linear
              color="accent"
              :value="
                Math.min(
                  (campaign.stats.totalPledged / campaign.selected.goal) * 100,
                  100
                )
              "
            ></v-progress-linear>
            <h3 class="text-h6 accent--text">{{ totalPledged }} Br</h3>
            <h5 class="text-subtitle-2 font-weight-light">
              pledged of {{ goal }} Br goal
            </h5>
          </div>
        </div>
        <div
          class="
            d-flex
            flex-column-reverse flex-md-row
            justify-center
            align-center
          "
        >
          <div class="hidden-sm-and-down">
            <ReportButton
              tooltip
              :targetId="campaignId"
              targetType="campaign"
              activatorClasses="mx-8 my-2"
            />
          </div>
          <div class="hidden-md-and-up">
            <ReportButton
              :targetId="campaignId"
              targetType="campaign"
              activatorClasses="mx-8 my-2"
            />
          </div>
          <v-card outlined color="pa-3">
            <div class="buttons d-flex justify-space-between rounded-lg">
              <v-btn
                rounded
                text
                class="mx-2"
                :color="likedByCurrentUser ? 'primary' : ''"
                @click="like"
                ><v-icon left>mdi-thumb-up</v-icon
                >{{ campaign.sentiment.likes }}</v-btn
              >
              <v-btn
                rounded
                text
                class="mx-2"
                :color="dislikedByCurrentUser ? 'primary' : ''"
                @click="dislike"
                ><v-icon left>mdi-thumb-down</v-icon
                >{{ campaign.sentiment.dislikes }}</v-btn
              >
            </div>
            <v-progress-linear
              v-if="campaign.sentiment.likes + campaign.sentiment.dislikes > 0"
              class="mt-2"
              :value="likeDislikeRatio"
            ></v-progress-linear>
          </v-card>
        </div>
        <v-btn
          color="primary"
          :outlined="!savedByCurrentUser"
          class="my-3 d-sm-none"
          @click="save"
        >
          <span v-if="savedByCurrentUser"
            ><v-icon left>mdi-bookmark</v-icon>Saved</span
          >
          <span v-else><v-icon left>mdi-bookmark-outline</v-icon>Save</span>
        </v-btn>
      </div>
      <v-divider></v-divider>
      <div
        v-if="currentUserIsCampaignCreator"
        class="
          d-sm-flex
          justify-space-between
          align-center
          py-3
          px-5
          elevation--5
        "
        :style="{ background: creatorSettingsBackground }"
      >
        <h3 class="d-none d-sm-block text-subtitle-1 font-weight-light">
          Campaign Options
        </h3>
        <!-- <v-divider class="mb-3 my-1"></v-divider> -->
        <v-divider class="d-none d-sm-block px-3" vertical></v-divider>
        <div
          class="
            d-flex
            flex-wrap flex-sm-nowrap
            justify-center justify-sm-end
            flex-fill
            align-center
          "
        >
          <v-tooltip top class="px-2">
            <span>Edit</span>
            <template v-slot:activator="{ on, attrs }">
              <v-btn
                :to="`/campaign/edit/${campaignId}`"
                class="mr-2 mr-sm-8"
                v-bind="attrs"
                v-on="on"
                icon
              >
                <v-icon>mdi-pencil</v-icon>
              </v-btn>
            </template>
          </v-tooltip>
          <v-divider vertical class="mr-8"></v-divider>
          <div class="d-flex justify-center align-center mr-8">
            <span
              class="
                pr-3
                text-caption
                font-weight-bold
                text-uppercase text-center
              "
              >Privacy</span
            >
            <v-btn
              :color="campaign.selected.is_private ? 'warning' : 'primary'"
              @click="togglePrivacy"
            >
              <span v-if="campaign.selected.is_private">Private</span>
              <span v-else>Public</span>
            </v-btn>
          </div>
          <v-divider vertical class="mr-8 d-none d-sm-block"></v-divider>
          <v-chip
            v-if="campaignEndStatus.ended"
            :color="`${
              campaignEndStatus.status === 'successful' ? 'success' : 'error'
            }`"
            class="rounded-0 ml-3 mr-5 text-uppercase"
          >
            {{ campaignEndStatus.status }}
          </v-chip>
          <CampaignEndButton v-else />
        </div>
      </div>
      <v-divider v-if="currentUserIsCampaignCreator"></v-divider>
    </v-col>
  </v-flex>
</template>

<script>
import { mapState } from "vuex";
import ReportButton from "~/components/campaign/ReportButton.vue";
export default {
  props: {
    bannerImage: String,
    creatorId: String,
    creatorAvatar: String,
    creatorName: String,
    creatorIsVerified: Boolean,
    title: String,
  },
  components: {
    ReportButton,
  },
  computed: {
    campaignId() {
      return this.campaign.selected.id;
    },
    campaignEndStatus() {
      return {
        ended: this.campaign.selected.is_ended,
        status: this.campaign.selected.end_status,
      };
    },
    isPrivate() {
      return this.campaign.selected.is_private;
    },
    creatorSettingsBackground() {
      return this.$themeHelper.setThemeColorOpacity("primary", 0.2);
    },
    currentUserIsCampaignCreator() {
      const currentUser = this.$authHelper.getUserInfo();
      return (
        currentUser && currentUser.role === "creator" &&
        currentUser.id === this.campaign.selected.creator.id
      );
    },
    likedByCurrentUser() {
      if (!this.campaign.stats.currentUserRelation) {
        return false;
      }
      return this.campaign.stats.currentUserRelation.liked;
    },
    dislikedByCurrentUser() {
      if (!this.campaign.stats.currentUserRelation) {
        return false;
      }
      return this.campaign.stats.currentUserRelation.disliked;
    },
    savedByCurrentUser() {
      if (!this.campaign.stats.currentUserRelation) {
        return false;
      }
      return this.campaign.stats.currentUserRelation.saved;
    },
    totalPledged() {
      return this.$money.format(this.campaign.stats.totalPledged, true);
    },
    goal() {
      return this.$money.format(this.campaign.selected.goal, true);
    },
    creatorTextColor() {
      return this.$vuetify.theme.isDark ? "white--text" : "black--text";
    },
    ...mapState({
      campaign: (state) => state.campaign,
    }),
    likeDislikeRatio() {
      const { likes, dislikes } = this.campaign.sentiment;
      if (likes + dislikes === 0) {
        return 0;
      } else {
        return (likes / (likes + dislikes)) * 100;
      }
    },
  },
  methods: {
    like() {
      this.$store.dispatch("campaign/like");
    },
    dislike() {
      this.$store.dispatch("campaign/dislike");
    },
    save() {
      this.$store.dispatch("campaign/save");
    },
    togglePrivacy() {
      this.$store.dispatch(
        "campaign/setPrivacy",
        !this.campaign.selected.is_private
      );
    },
  },
};
</script>
<style>
.shadow-text {
  text-shadow: 0px 0px 3px rgba(0, 0, 0, 1);
}
.banner-title {
  background: rgba(0, 0, 0, 0.2);
  backdrop-filter: blur(15px);
}
</style>