<template>
  <NuxtLink
    :to="`/admin/reports/campaign/${campaignId}`"
    v-if="campaign"
    class="text-decoration-none"
  >
    <v-card
      @mouseenter="thumbMouseEnter"
      @mouseleave="thumbMouseLeave"
      :elevation="elevation"
      :width="width ? width : defaultWidth"
      outlined
      class="campaign-thumb rounded-lg d-flex flex-column pa-0"
    >
      <div class="thumb">
        <v-img
          :aspect-ratio="16 / 9"
          :max-width="width ? width : defaultWidth"
          :src="campaign.thumbnail"
          gradient="to top, rgba(0,0,0,.5), rgba(0,0,0,0), rgba(0,0,0,0), rgba(0,0,0,0)"
          class="d-flex justify-center align-end px-3"
        >
          <div
            v-if="userId && userId === campaign.creator.id"
            class="creator-info white--text"
          >
            <v-chip x-small color="paper rounded-0 elevation-2">Creator</v-chip>
          </div>
          <div class="important-info white--text ma-1">
            <v-chip
              small
              v-if="campaign.is_private"
              class="
                secondary
                elevation-2
                rounded
                font-weight-bold
                text-caption text-uppercase
              "
              >Private</v-chip
            >
            <v-chip
              small
              v-else-if="progress === 100"
              class="
                success
                elevation-2
                rounded
                font-weight-bold
                text-caption text-uppercase
              "
              >Funded</v-chip
            >
            <v-chip
              small
              v-else-if="campaign.is_ended"
              class="
                info
                elevation-2
                rounded
                font-weight-bold
                text-caption text-uppercase
              "
              >Ended</v-chip
            >
            <v-chip
              small
              v-else-if="isExpired"
              class="
                error
                elevation-2
                rounded
                font-weight-bold
                text-caption text-uppercase
              "
              >Expired</v-chip
            >
          </div>
          <NuxtLink
            class="campaign-link white--text"
            :to="`/admin/reports/campaign/${campaignId}`"
          >
            <p class="text-truncate my-2 font-weight-regular text-shadow">
              {{ campaign.title }}
            </p>
          </NuxtLink>
        </v-img>
      </div>
      <div class="d-flex flex-column flex-fill">
        <div class="progress pa-3 d-flex flex-column">
          <div class="amount d-flex pb-1 justify-end text-body-2">
            <span class="pr-1 font-weight-bold">{{ currentStr }}</span>
            /
            <span class="pl-1 font-weight-bold">{{ goalStr }}</span>
            <span class="text-caption pl-2 px-1">Br</span>
          </div>
          <v-progress-linear
            height="5"
            rounded
            :value="progress"
            color="accent"
            class=""
          ></v-progress-linear>
        </div>
        <div
          class="campaign-info d-flex justify-space-between align-center pa-3"
        >
          <div class="sentiment d-flex">
            <div class="likes d-flex align-center mr-3">
              <v-icon
                :color="
                  currentUserRelation && currentUserRelation.liked
                    ? 'primary'
                    : ''
                "
                x-small
                >mdi-thumb-up</v-icon
              ><span class="pl-2 text-caption">{{
                campaignSentiment.likes
              }}</span>
            </div>
            <v-divider vertical></v-divider>
            <div class="dislikes d-flex align-center ml-3">
              <v-icon
                :color="
                  currentUserRelation && currentUserRelation.disliked
                    ? 'primary'
                    : ''
                "
                x-small
                >mdi-thumb-down</v-icon
              ><span class="pl-2 text-caption">{{
                campaignSentiment.dislikes
              }}</span>
            </div>
          </div>
          <div class="pledge-info font-weight-light font-italic text-body-2">
            {{ backersStr }}
          </div>
        </div>
      </div>
    </v-card>
  </NuxtLink>
  <v-card
    v-else
    height="233"
    :elevation="elevation"
    :width="width ? width : defaultWidth"
    class="d-flex justify-center align-center"
  >
    <v-progress-circular></v-progress-circular>
  </v-card>
</template>

<script>
import { getCampaignThumb } from "~/queries/campaign/getCampaignThumb.gql";
export default {
  apollo: {
    campaign: {
      query: getCampaignThumb,
      variables() {
        return {
          campaignId: this.campaignId,
        };
      },
      result({ data }) {
        this.campaign = data.campaign;
        this.campaignInfo = data.campaignInfo;
        this.campaignSentiment = data.campaignSentiment;
      },
      skip() {
        return !this.campaignId;
      },
      fetchPolicy: "no-cache",
    },
  },
  props: {
    campaignId: String,
    // campaign: Object,
    width: Number,
  },
  computed: {
    userId() {
      const id = this.$authHelper.getUserInfo().id;
      return id ? id : false;
    },
    currentUserRelation() {
      return JSON.parse(this.campaignInfo.currentUserRelation);
    },
    backersStr() {
      if (this.campaignInfo) {
        if (this.campaignInfo.backersCount === 0) {
          return "No backers yet";
        }
        if (this.campaignInfo.backersCount === 1) {
          return this.currentUserRelation
            ? this.currentUserRelation.pledge.exists
              ? "Pledged"
              : "1 backer"
            : "1 backer";
        }
        return `${this.campaignInfo.backersCount} backers`;
      }
    },
    currentStr() {
      return this.$money.format(this.campaignInfo.totalAmount);
    },
    goalStr() {
      return this.$money.format(this.campaign.goal);
    },
    progress() {
      if (this.campaign && this.campaignInfo) {
        return Math.min(
          (this.campaignInfo.totalAmount / this.campaign.goal) * 100,
          100
        );
      } else {
        return 0;
      }
    },
    isExpired() {
      return Date.parse(this.campaign.deadline) < Date.now();
    },
  },
  data() {
    return {
      defaultWidth: 350,
      elevation: 0,
      campaign: null,
      campaignInfo: null,
      campaignSentiment: null,
    };
  },
  methods: {
    thumbMouseEnter() {
      this.elevation = 3;
    },
    thumbMouseLeave() {
      this.elevation = 0;
    },
  },
};
</script>

<style>
.campaign-thumb {
  cursor: pointer;
  user-select: none;
  overflow: hidden;
  transition: 0.3s !important;
}

.campaign-thumb:hover {
  filter: brightness(90%);
}

.campaign-link {
  transition: 0.3ms;
}
.campaign-link,
.campaign-link:active {
  text-decoration: none;
}
.campaign-link:hover {
  text-decoration: underline;
}

.text-shadow {
  text-shadow: 0px 0px 2px rgba(0, 0, 0, 1);
}

.important-info {
  position: absolute;
  top: 0;
  right: 0;
  z-index: 6;
}

.creator-info {
  position: absolute;
  top: 0;
  left: 0;
  z-index: 6;
}
</style>