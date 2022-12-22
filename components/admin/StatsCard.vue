<template>
  <v-card
    class="py-7 my-2 mx-2 rounded-lg d-flex flex-column pa-0"
    elevation="7"
  >
    <v-list-item three-line>
      <v-list-item-content class="mx-5">
        <div class="text-h3 mb-8 font-weight-bold">
          {{ totalNum }}
        </div>
        <v-list-item-title class="text-h5 mb-5 font-weight-light">
          {{ typeText }}
        </v-list-item-title>
        <v-list-item-subtitle v-if="informativeText">{{
          informativeText
        }}</v-list-item-subtitle>
        <v-list-item-subtitle v-else
          >Information over the past 48hrs</v-list-item-subtitle
        >
      </v-list-item-content>
      <v-chip
        v-if="mode === 'pos'"
        class="ma-2"
        color="green"
        text-color="white"
      >
        <v-icon left> mdi-trending-up </v-icon>
        {{ calculatedNum }}
      </v-chip>
      <v-chip v-else-if="mode === 'neg'" class="ma-2" color="red" text-color="white">
        <v-icon left> mdi-trending-down </v-icon>
        {{ calculatedNum }}
      </v-chip>
      <v-chip v-else class="ma-2" color="primary" text-color="white">
        <v-icon left> mdi-minus </v-icon>
        {{ calculatedNum }}
      </v-chip>
    </v-list-item>
  </v-card>
</template>

<script>
export default {
  props: {
    totalNum: Number,
    calculatedNum: Number,
    typeText: String,
    informativeText: String,
    mode: String,
  },
};
</script>
