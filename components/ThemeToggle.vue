<template>
  <div class="d-flex align-center justify-center">
    <v-switch
      v-model="$vuetify.theme.dark"
      :append-icon="icon ? 'mdi-brightness-2' : ''"
    >
    </v-switch>
  </div>
</template>

<script>
export default {
  props: {
    icon: Boolean,
  }
};
</script>

<style>
</style>