<template>
  <v-card elevation="0" outlined class="pa-5" style="max-width: 300px">
    <h1 class="text-subtitle-2 font-weight-bold">Response to reports</h1>
    <v-divider class="mt-3"></v-divider>

    <v-text-field
      v-model="resolveReason"
      ref="textfield"
      type="text"
      filled
      dense
      placeholder="Resolution Remark"
      class="mt-5"
    ></v-text-field>

    <v-btn :disabled="resolveReason === ''" color="error" block @click="Ban()"
      >Ban</v-btn
    >

    <v-btn
      :disabled="resolveReason === ''"
      color="primary"
      block
      class="mt-5"
      @click="NoBan()"
      >No Ban</v-btn
    >
  </v-card>
</template>

<script>
export default {
  data() {
    return {
      resolveReason: "",
    };
  },
  methods: {
    Ban() {
      this.$notify({
        text: "Campaign Banned!",
        type: "success white--text text-center",
      });
    },
    NoBan() {
      this.$notify({
        text: "Campaign Not Banned!",
        type: "success white--text text-center",
      });
    },
  },
};
</script>

<style>
.v-text-field__prefix {
  padding-left: 12px !important;
}
</style>