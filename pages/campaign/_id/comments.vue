<template>
  <div class="col-auto px-3 pl-md-8 pr-md-5">
    <div class="d-flex flex-column">
      <h3
        class="text-h5 font-weight-light pb-5"
        v-if="comments && comments.length > 0"
      >
        Comments ({{ comments.length }})
      </h3>
      <h3 class="text-h5 font-weight-light pb-5" v-else>
        Nothing here yet. Be the first to comment!
      </h3>
      <CampaignCommentBox v-if="!campaign.is_private" />
      <CampaignComment
        class="mb-4"
        v-for="comment in comments"
        :key="comment.id"
        :comment="comment"
      />
    </div>
  </div>
</template>

<script>
import { mapState } from "vuex";
export default {
  computed: {
    comments() {
      return this.campaign.comments;
    },
    ...mapState({
      campaign: (state) => state.campaign.selected,
    }),
  },
};
</script>

<style>
</style>