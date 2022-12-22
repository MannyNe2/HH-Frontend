<template>
  <v-flex class="funding-bar d-flex flex-column">
    <div class="amount d-flex py-1 justify-end text-body-2">
      <span class="text-caption">ETB</span>
      <span class="pl-2 pr-1 font-weight-bold">{{ currentStr }}</span>
      /
      <span class="pl-1 font-weight-bold">{{ goalStr }}</span>
    </div>
    <div class="bar-wrapper">
      <div class="bar-back rounded-pill">
        <div
          class="bar rounded-pill"
          :style="{ maxWidth: `${progressWidth}` }"
        ></div>
      </div>
    </div>
  </v-flex>
</template>

<script>
export default {
  props: {
    current: Number,
    goal: Number,
  },
  computed: {
    progressWidth() {
      const width =
        this.current < this.goal
          ? `${(this.current / this.goal) * 100}%`
          : "100%";
      console.log(width);
      return width;
    },
    currentStr() {
      return this.$money.format(this.current);
    },
    goalStr() {
      return this.$money.format(this.goal);
    },
  },
};
</script>

<style>
.funding-bar {
  overflow: hidden;
}
.bar-back,
.bar {
  width: 100%;
}
.bar-back {
  background-color: #81c784;
}

.bar {
  background-color: #2e7d32;
  height: 5px;
}
</style>