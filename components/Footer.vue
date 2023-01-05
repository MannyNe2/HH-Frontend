<template>
  <v-footer>
    <v-card flat tile class="transparent text-center">
      <v-card-text>
        <v-btn
          v-for="icon in icons"
          :key="icon.icon"
          class="mx-4"
          icon
          :href="icon.link"
          target="_blank"
        >
          <v-icon size="24px">
            {{ icon.icon }}
          </v-icon>
        </v-btn>
      </v-card-text>

      <v-card-text class="pt-0 text-center px-15 font-weight-medium">
        Making it easier for ordinary people to share their stories and support
        causes they care about. Join us to fund creative projects, from all
        types of backgrounds and experiences. Helping Hand enables creators
        looking to find a better way to bring their ideas to life—and to find
        the support they need to make them successful.
      </v-card-text>

      <v-divider></v-divider>

      <v-card-text> &#169; {{ footerText }} </v-card-text>
    </v-card>
  </v-footer>
</template>

<script>
export default {
  name: "Footer",
  data: () => ({
    icons: [
      { icon: "mdi-twitter", link: "https://twitter.com/MannyTheDev69" },
      {
        icon: "mdi-linkedin",
        link: "https://www.linkedin.com/in/amanuel-negussie-845692216/",
      },
      { icon: "mdi-github", link: "https://github.com/MannyNe2" },
    ],
  }),
  computed: {
    footerText() {
      const currentYear = new Date().getFullYear();
      return `2022-${currentYear} Helping Hand Inc. All Rights Reserved`;
    },
  },
};
</script>

<style>
.site-footer {
  position: absolute;
  bottom: 0;
  width: 100%;
}
</style>
