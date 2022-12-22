<template>
  <div class="d-flex flex-column flex-lg-row mx-3 mx-lg-0">
    <v-col class="background col-lg-2">
      <v-list color="transparent d-flex d-lg-block">
        <v-list-item class=""><v-btn tile block color="primary" elevation="0" :text="selection != 'story'" @click="select('story')">Story</v-btn></v-list-item>
        <v-list-item class=""><v-btn tile block color="primary" elevation="0" :text="selection != 'risks'" @click="select('risks')">Risks</v-btn></v-list-item>
      </v-list>
    </v-col>
    <v-divider class="d-sm-none" vertical></v-divider>
    <v-col v-if="selection === 'story'" class="paper rounded pa-5 pa-sm-8">
      <h2 class="text-h5 primary--text font-weight-light">Story</h2>
      <v-divider class="mt-3"></v-divider>
      <RichTextView class="pt-3" :content="campaign.description" />
    </v-col>
    <v-col v-if="selection === 'risks'" class="paper rounded pa-8">
      <h2 class="text-h5 primary--text font-weight-light">Risks</h2>
      <v-divider class="mt-3"></v-divider>
      <div class="pt-3">
        {{ risks.risksText }}
      </div>
    </v-col>
  </div>
</template>

<script>
import { mapState } from "vuex";
export default {
  computed: {
    ...mapState({
      campaign: (state) => state.campaign.selected,
      sentiment: (state) => state.campaign.sentiment,
    }),
  },
  data() {
    return {
      selection: 'story',
      risks: require('~/assets/risks.json')
    }
  },
  methods: {
    select(menu) {
      this.selection = menu;
    }
  }
};
</script>

<style>
</style>