<template>
  <v-list-item outline :to="`/profile/${user.id}`" class="pa-0 rounded">
    <v-card rounded outlined class="pa-0 col">
      <div class="col background d-flex align-center px-2 py-0">
        <DynamicAvatar
          :size="50"
          :image="user.avatar"
          :firstName="user.first_name"
          :lastName="user.last_name"
          :isVerified="user.isVerified"
        />
        <div class="col py-2">
          <div class="d-flex mb-1 justify-space-between">
            <NuxtLink
              :to="`/profile/${user.id}`"
              class="
                text-caption text-sm-subtitle-2 text-decoration-none
                font-weight-medium
                primary--text
              "
              >{{ user.display_name }}</NuxtLink
            >
            <div>
              <v-chip
                v-if="user.role !== 'user'"
                tile
                x-small
                class="text-capitalize white--text rounded-0"
                :color="roleColor"
                >{{ user.role }}</v-chip
              >
            </div>
          </div>
          <div class="d-flex mt-1 justify-space-between">
            <div class="name-container font-weight-light text-caption">
              <h3 class="text-caption foreground--text">
                {{ user.first_name }} {{ user.last_name }}
              </h3>
            </div>
            <div
              v-if="user.is_banned"
              class="
                role-container
                font-italic
                text-caption
                grey--text
                font-weight-light
                text-capitalize
              "
            >
              Banned
            </div>
          </div>
        </div>
      </div>
    </v-card>
  </v-list-item>
</template>

<script>
export default {
  props: {
    user: Object,
  },
  computed: {
    roleColor() {
      if (this.user.role === "admin") {
        return "red";
      } else if (this.user.role === "creator") {
        return "secondary";
      } else {
        return "transparent";
      }
    },
  },
};
</script>

<style>
.outline {
  border: 1px solid rgba(0, 0, 0, 0.3) !important;
}
</style>