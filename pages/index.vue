<template>
  <v-container class="">
    <div
      class="
        pa-0
        d-flex
        flex-column-reverse flex-sm-row
        justify-center
        align-center
        white--text
      "
    >
      <div class="mt-5 py-5 px-md-10 col-sm-7 col-md-6">
        <span
          class="
            text-h6 text-lg-h4 text-center text-sm-justify
            font-weight-black
            text-uppercase
            py-5
          "
          >Where the dream ends,<br />and reality begins</span
        >
        <p class="text-subtitle-1 text-lg-h6 font-weight-regular py-5">
          A community full of talent, passion and burning desire is waiting for
          you.<br />Click below to view the most popular campaigns, and start
          funding now!
        </p>
        <div class="discover-btn d-flex justify-center justify-sm-start">
          <v-btn to="/discover" color="secondary" rounded large
            >Discover Campaigns
            <v-icon right>mdi-menu-right</v-icon>
          </v-btn>
        </div>
      </div>
      <div class="d-flex justify-center align-center pa-0">
        <img class="img-contain" :src="require('/assets/images/banner.png')" />
      </div>
    </div>
    <div class="px-2 px-lg-8 background py-10 mt-8 rounded-lg">
      <h3 class="text-h4 font-weight-light text-center primary--text py-5">
        Why Helping Hand?
      </h3>
      <div class="blurbs d-flex flex-wrap justify-center mt-5">
        <v-card
          elevation="8"
          class="pa-6 ma-5 col-10 col-sm-5 col-lg-3 rounded-lg paper"
        >
          <div class="blurb-thumb pa-3 d-flex justify-center align-center">
            <img
              class="img-contain my-5"
              :src="require('/assets/images/landing-thumbs/01.png')"
              height="100px"
            />
          </div>
          <div
            class="
              blurb-title
              text-h6
              primary--text
              text-uppercase text-center
              font-weight-black
              pb-2
              py-5
            "
          >
            A Win-Win for Everyone Involved
          </div>
          <div class="blurb-description pt-2 text-center text-body-2">
            This isn't just chipping in and calling it a day. Most creators will
            have multiple rewards prepared so you won't just be spending on
            nothing.
          </div>
        </v-card>
        <v-card
          elevation="8"
          class="pa-6 ma-5 col-10 col-sm-5 col-lg-3 rounded-lg paper"
        >
          <div class="blurb-thumb pa-3 d-flex justify-center align-center">
            <img
              class="img-contain my-5"
              :src="require('/assets/images/landing-thumbs/02.png')"
              height="100px"
            />
          </div>
          <div
            class="
              blurb-title
              text-h6
              primary--text
              text-uppercase text-center
              font-weight-black
              pb-2
              py-5
            "
          >
            Safe and Trustworthy Backing
          </div>
          <div class="blurb-description pt-2 text-center text-body-2">
            Your funds are safe and sound until the campaign meets its goal.
            Creators are also vetted by the admins before being verified, and
            campaigns are all subject to reviews and comments from the
            community. There will be no room for fraudsters.
          </div>
        </v-card>
        <v-card
          elevation="8"
          class="pa-6 ma-5 col-10 col-sm-5 col-lg-3 rounded-lg paper"
        >
          <div class="blurb-thumb pa-3 d-flex justify-center align-center">
            <img
              class="img-contain my-5"
              :src="require('/assets/images/landing-thumbs/03.png')"
              height="100px"
            />
          </div>
          <div
            class="
              blurb-title
              text-h6
              primary--text
              text-uppercase text-center
              font-weight-black
              pb-2
              py-5
            "
          >
            Supporting Ethiopian Innovation
          </div>
          <div
            class="blurb-description pt-2 text-center align-center text-body-2"
          >
            By Ethiopians, for Ethiopians.
          </div>
        </v-card>
      </div>
    </div>
  </v-container>
</template>

<script>
export default {
  name: "IndexPage",
  layout: "landing",
  middleware: "isNotAuth",
  computed: {
    containerWidth() {
      return getComputedStyle(document.querySelector(".landing-gradient"))
        .innerWidth;
    },
    background() {
      return this.$themeHelper.getColor("background");
    },
  },
};
</script>

<style lang="sass">
.blurb-description
  min-height: 140px

.banner-img, .banner-text
  max-width: 50%
</style>