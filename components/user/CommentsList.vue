<template>
  <div v-if="comments.length > 0" class="d-flex flex-column">
    <NuxtLink
      v-for="comment in comments"
      :key="comment.id"
      class="text-decoration-none"
      :to="`/campaign/${comment.campaign_id}/comments`"
    >
      <CampaignComment :comment="comment" class="mb-3" />
    </NuxtLink>
  </div>
  <h2
    v-else
    class="text-h6 font-weight-light text-center py-5"
    :style="{ color: noCommentsColor }"
  >
    No comments found
  </h2>
</template>

<script>
import { getUserComments } from "~/queries/user/getUserComments.gql";
export default {
  props: {
    userId: String,
  },
  apollo: {
    user_comments: {
      query: getUserComments,
      variables() {
        return {
          userId: this.userId,
        };
      },
      result({ data }) {
        this.comments = data.user_comments.comments;
        this.$emit("comments-loaded", this.comments.length);
      },
      skip() {
        if (this.userId) {
          return false;
        } else {
          return true;
        }
      },
      fetchPolicy: "no-cache",
    },
  },
  computed: {
    noCommentsColor() {
      return this.$themeHelper.setThemeColorOpacity("foreground", 0.5);
    },
  },
  data() {
    return {
      comments: [],
    };
  },
};
</script>

<style>
</style>