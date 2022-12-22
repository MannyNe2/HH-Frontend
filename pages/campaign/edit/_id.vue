<template>
  <v-container v-if="campaign" class="px-0 px-sm-10">
    <v-card class="paper px-3 py-8 pa-sm-16 rounded-lg">
      <h1 class="text-h5 font-weight-light">Edit Campaign</h1>
      <v-divider class="mt-3 mb-8"></v-divider>
      <validation-observer ref="observer" v-slot="{ handleSubmit }">
        <form @submit.prevent="handleSubmit(submit)">
          <validation-provider
            name="Title"
            v-slot="{ errors }"
            :rules="{ required: true, max: 100 }"
          >
            <v-text-field
              rounded
              filled
              dense
              placeholder="Title"
              prepend-icon="mdi-cursor-text"
              v-model="campaign.title"
              :error-messages="errors"
            ></v-text-field>
          </validation-provider>

          <validation-provider
            name="Description"
            v-slot="{ errors }"
            :rules="{ required: true }"
          >
            <Editor
              v-model="campaign.description"
              prependIcon="mdi-image-text"
              editorClassList="rounded-xl"
              placeholder="Description"
              :enableImages="true"
              :errorMessages="errors"
            />
          </validation-provider>

          <div class="d-flex flex-column mt-2">
            <div class="d-flex">
              <v-icon class="pr-3 pt-1">mdi-image</v-icon>
              <h3 class="text-h6 font-weight-regular">Campaign Images</h3>
            </div>
            <div class="pl-sm-8">
              <div
                class="
                  d-flex
                  flex-column flex-md-row
                  input
                  pt-8
                  pb-5
                  rounded-xl
                  mt-2
                  justify-space-around
                "
              >
                <div class="d-flex flex-column">
                  <h3
                    class="
                      text-center text-subtitle-1
                      font-weight-bold
                      text-uppercase
                    "
                  >
                    Thumbnail
                  </h3>
                  <div class="hidden-lg-and-up">
                    <ImageUploader
                      v-on:upload-start="thumbnailUploadStart"
                      v-on:upload-end="thumbnailUploadEnd"
                      :width="150"
                      :aspectRatio="16 / 10"
                      :placeholder="campaign.thumbnail"
                    />
                  </div>
                  <div class="hidden-md-and-down">
                    <ImageUploader
                      v-on:upload-start="thumbnailUploadStart"
                      v-on:upload-end="thumbnailUploadEnd"
                      :width="250"
                      :aspectRatio="16 / 10"
                      :placeholder="campaign.thumbnail"
                    />
                  </div>
                </div>
                <div class="d-flex flex-column">
                  <h3
                    class="
                      text-center text-subtitle-1
                      font-weight-bold
                      text-uppercase
                    "
                  >
                    Banner
                  </h3>
                  <div class="hidden-lg-and-up">
                    <ImageUploader
                      v-on:upload-start="bannerUploadStart"
                      v-on:upload-end="bannerUploadEnd"
                      :width="200"
                      :aspectRatio="21 / 9"
                      :placeholder="campaign.banner"
                    />
                  </div>
                  <div class="hidden-md-and-down">
                    <ImageUploader
                      v-on:upload-start="bannerUploadStart"
                      v-on:upload-end="bannerUploadEnd"
                      :width="400"
                      :aspectRatio="21 / 9"
                      :placeholder="campaign.banner"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          <validation-provider
            name="Privacy"
            v-slot="{ errors }"
            :rules="{ required: true }"
          >
            <v-select
              rounded
              filled
              dense
              v-model="privacy"
              :items="privacyOptions"
              prepend-icon="mdi-eye"
              placeholder="Privacy"
              class="mt-4"
              :error-messages="errors"
            ></v-select>
          </validation-provider>

          <v-menu
            ref="datePickerMenu"
            v-model="datePicker"
            :close-on-content-click="false"
            transition="scale-transition"
            offset-y
            max-width="290px"
            min-width="auto"
          >
            <template v-slot:activator="{ on, attrs }">
              <validation-provider
                name="Deadline"
                v-slot="{ errors }"
                :rules="{ required: true }"
              >
                <v-text-field
                  rounded
                  filled
                  dense
                  v-model="campaign.deadline"
                  placeholder="Deadline"
                  persistent-hint
                  prepend-icon="mdi-calendar"
                  readonly
                  v-bind="attrs"
                  v-on="on"
                  :error-messages="errors"
                ></v-text-field>
              </validation-provider>
            </template>
            <v-date-picker
              v-model="campaign.deadline"
              no-title
              @input="datePickerMenu = false"
            ></v-date-picker>
          </v-menu>

          <div class="">
            <div class="d-flex align-start">
              <v-icon class="pr-3 pt-1">mdi-gift</v-icon>
              <h3 class="text-h6 font-weight-regular">Rewards</h3>
            </div>

            <div class="d-flex align-start">
              <div class="flex-fill pl-sm-8">
                <RewardsEditList
                  class="background px-0 pa-5 flex-fill mt-2 rounded-xl"
                />
              </div>
            </div>
          </div>
          <div class="d-flex justify-center">
            <slot>
              <div
                style="width: 300px"
                class="text-center pt-2 error--text"
                v-text="submitError"
              ></div>
            </slot>
          </div>

          <div class="d-flex justify-center mt-5">
            <v-btn x-large type="submit" color="primary">Save Changes</v-btn>
          </div>
        </form>
      </validation-observer>
    </v-card>
  </v-container>
</template>

<script>
import RewardsEditList from "~/components/creator/RewardsEditList.vue";
import {
  extend,
  setInteractionMode,
  ValidationProvider,
  ValidationObserver,
} from "vee-validate";
import { required, min_value, max, numeric } from "vee-validate/dist/rules";
import ImageUploader from "~/components/ImageUploader.vue";
import { getCampaign } from "~/queries/campaign/getCampaign.gql";

setInteractionMode("eager");
extend("required", {
  ...required,
  message: "{_field_} is required",
});
extend("max", {
  ...max,
  message: "{_field_} may not be greater than {length} characters",
});
extend("numeric", {
  ...numeric,
  message:
    "{_field_} must be numeric. Please remove any non-numeric characters",
});
extend("min_value", {
  ...min_value,
  message: "{_field_} can not be below {min} Br",
});

export default {
  components: {
    ValidationProvider,
    ValidationObserver,
    ImageUploader,
    RewardsEditList,
  },
  middleware: "isCreator",
  apollo: {
    campaign_by_pk: {
      query: getCampaign,
      variables() {
        return {
          campaignId: this.id,
        };
      },
      result({ data }) {
        if (
          data.campaign_by_pk.creator.id === this.$authHelper.getUserInfo().id
        ) {
          this.campaign = data.campaign_by_pk;
          this.thumbnail = data.campaign_by_pk.thumbnail;
          this.banner = data.campaign_by_pk.banner;
          this.privacy = data.campaign_by_pk.is_private ? "Private" : "Public";
          this.$store.commit(
            "campaign/setCampaign",
            JSON.parse(JSON.stringify(data.campaign_by_pk))
          );
        } else {
          error({ statusCode: 404, message: "Page not found" });
        }
      },
      skip() {
        return !this.id;
      },
      fetchPolicy: "no-cache",
    },
  },
  computed: {
    thumbPlaceholder() {
      return require("~/assets/images/campaign-thumb-placeholder-new.jpg");
    },
    bannerPlaceholder() {
      return require("~/assets/images/campaign-banner-placeholder-new.jpg");
    },
  },
  data() {
    return {
      id: this.$route.params.id,
      campaign: null,
      title: "",
      description: "",
      goal: "",
      banner: "",
      thumbnail: "",
      thumbnailUploading: false,
      bannerUploading: false,
      privacy: "Private",
      privacyOptions: ["Public", "Private"],
      deadline: "",
      deadlineText: "",
      datePicker: false,
      submitting: false,
      submitError: "",
      createRewardDialog: false,
    };
  },
  methods: {
    thumbnailUploadStart() {
      this.thumbnail = "";
      this.thumbnailUploading = true;
    },
    thumbnailUploadEnd(url) {
      this.thumbnail = url;
      this.thumbnailUploading = false;
    },
    bannerUploadStart() {
      this.banner = "";
      this.bannerUploading = true;
    },
    bannerUploadEnd(url) {
      this.banner = url;
      this.bannerUploading = false;
    },
    async submit() {
      this.submitting = true;
      this.submitError = "";
      this.$refs.observer.validate();
      if (Date.parse(this.campaign.deadline) <= Date.now()) {
        this.submitError = "Deadline must be after the current date";
        this.submitting = false;
        return;
      }
      if (this.thumbnailUploading) {
        this.submitError = "Please wait for the thumbnail to finish uploading";
        this.submitting = false;
        return;
      }
      if (this.bannerUploading) {
        this.submitError = "Please wait for the banner to finish uploading";
        this.submitting = false;
        return;
      }
      if (!this.thumbnail) {
        this.submitError = "Thumbnail required";
        this.submitting = false;
        return;
      }
      if (!this.banner) {
        this.submitError = "Banner required";
        this.submitting = false;
        return;
      }
      const campaign = {
        campaignId: this.id,
        title: this.campaign.title,
        thumbnail: this.thumbnail,
        isPrivate: this.privacy === "Private",
        description: this.campaign.description,
        deadline: this.campaign.deadline,
        banner: this.banner,
      };
      console.log(campaign);
      await this.$store.dispatch("campaign/edit", campaign);
      this.submitting = false;
    },
  },
};
</script>

<style>
</style>