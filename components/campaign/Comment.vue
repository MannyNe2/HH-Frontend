<template>
  <v-card outlined class="d-flex py-2 px-4">
    <v-col class="d-flex pa-0 pt-1 flex-column col-auto">
      <div class="d-flex justify-center">
        <DynamicAvatar
          :image="comment.user.avatar"
          :firstName="comment.user.display_name"
          :isVerified="comment.user.is_verified"
          :size="30"
        />
      </div>
    </v-col>
    <v-col class="d-flex flex-column pa-0 pl-4">
      <div class="d-flex justify-space-between">
        <div class="d-flex justify-start align-center">
          <NuxtLink
            :class="`${displayNameColor}--text font-weight-medium`"
            :to="`/profile/${comment.user.id}`"
            >{{ comment.user.display_name }}</NuxtLink
          >
          <div
            v-if="comment.user.role !== 'user'"
            class="d-flex justify-center ml-3"
          >
            <v-chip
              :color="roleColor"
              x-small
              label
              class="px-1 py-0 white--text"
              ><v-icon class="pr-1" x-small>{{ roleIcon }}</v-icon>
              <div class="text-capitalize">{{ comment.user.role }}</div></v-chip
            >
          </div>
          <div
            v-if="comment.user.id === currentUserId"
            class="d-flex justify-center ml-3"
          >
            <v-chip
              outlined
              color="info"
              x-small
              label
              class="px-1 py-0 white--text"
            >
              <div class="text-capitalize">You</div></v-chip
            >
          </div>
        </div>
        <div>
          <ReportButton tooltip xsmall :targetId="comment.id" targetType="comment" activatorClasses="" />
        </div>
      </div>
      <!-- <v-divider class="mt-2"></v-divider> -->
      <div class="mt-1 pb-1">
        <RichTextView class="pa-0" :content="comment.text" />
      </div>
      <v-divider></v-divider>
      <div class="text-caption text-right grey--text">
        {{ creationDate }}<span v-if="wasEdited">(Edited)</span>
      </div>
    </v-col>
  </v-card>
</template>

<script>
import format from "date-fns/esm/format";
import parseISO from "date-fns/esm/fp/parseISO/index.js";
import ReportButton from "~/components/campaign/ReportButton.vue";
export default {
  props: {
    comment: Object,
  },
  components: {
    ReportButton
  },
  computed: {
    wasEdited() {
      return (
        parseISO(this.comment.updated_at) > parseISO(this.comment.created_at)
      );
    },
    creationDate() {
      const creationDate = parseISO(this.comment.created_at);
      return format(creationDate, "MMM d 'at' h:mm aaa");
    },
    displayNameColor() {
      return this.$vuetify.theme.isDark ? "white" : "black";
    },
    roleColor() {
      if (this.comment.user.role === "admin") {
        return "red";
      } else if (this.comment.user.role === "creator") {
        return "secondary";
      }
    },
    roleIcon() {
      if (this.comment.user.role === "admin") {
        return "mdi-shield-star";
      } else if (this.comment.user.role === "creator") {
        return "mdi-star-cog";
      }
    },
    currentUserId() {
      return this.$authHelper.getUserInfo().id;
    },
  },
};
</script>

<style>
</style>