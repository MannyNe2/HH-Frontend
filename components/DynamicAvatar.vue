<template>
  <div class="d-flex">
    <v-card class="elevation-0 transparent">
      <v-avatar :class="`${imageClass}`" :color="avatarColor" :size="size" :rounded="rounded">
        <img v-if="image" :src="image" />
        <span
          v-else
          :class="`white--text text-uppercase text-h${fontLevel} initials`"
          >{{ initials }}</span
        >
      </v-avatar>
      <img
        v-if="isVerified"
        class="verified-icon-da"
        :style="{ bottom: styleBottomRight, right: styleBottomRight }"
        :src="require('~/assets/images/verified.png')"
        :height="`${parseInt((size / sizeDivisor).toString())}`"
      />
    </v-card>
  </div>
</template>

<script>
export default {
  props: {
    image: String,
    firstName: String,
    lastName: String,
    isVerified: { type: Boolean, default: false },
    size: { type: Number, default: 50 },
    imageClass: { type: String, default: "" },
    rounded: { type: Boolean, default: true },
  },
  computed: {
    sizeDivisor() {
      return this.rounded ? (this.size <= 50 ? 2.25 : 2.9) : 3;
    },
    initials() {
      const firstInitial = this.firstName ? this.firstName[0] : "";
      const lastInitial = this.lastName ? this.lastName[0] : "";
      return `${firstInitial}${lastInitial}`;
    },
    avatarColor() {
      return this.$avatarColors.random();
    },
    fontLevel() {
      return this.size
        ? Math.abs(Math.min(Math.floor(10 - this.size / 10), 8))
        : 5;
    },
    styleBottomRight() {
      const divisor = this.rounded ? 7.5 : 20;
      return `-${parseInt((this.size / divisor).toString())}px`;
    },
  },
};
</script>

<style>
.initials {
  text-shadow: 0 0 2px black;
}

.verified-icon-da {
  position: absolute;
  z-index: 5;
}
</style>