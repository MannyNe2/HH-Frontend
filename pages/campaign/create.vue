<template>
  <v-container class="px-0 px-sm-10">
    <h1 class="text-h4 text-center font-weight-light">Start a new campaign</h1>
    <v-stepper class="paper mt-8" v-model="currentStep">
      <v-stepper-header>
        <v-stepper-step :complete="currentStep > 1" step="1"
          >Create Campaign</v-stepper-step
        >
        <v-divider></v-divider>
        <v-stepper-step :complete="currentStep > 2" step="2"
          >Add Rewards</v-stepper-step
        >
      </v-stepper-header>
      <v-stepper-items>
        <v-stepper-content class="rounded-lg" step="1">
          <v-card elevation="0" class="paper px-3 py-8 pa-sm-16 rounded-lg">
            <h3 class="text-h5 text-center font-weight-light mb-16">
              Tell us what your campaign is about!
            </h3>
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
                    v-model="title"
                    :error-messages="errors"
                  ></v-text-field>
                </validation-provider>
                <validation-provider
                  name="Description"
                  v-slot="{ errors }"
                  :rules="{ required: true }"
                >
                  <Editor
                    v-model="description"
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
                            :placeholder="thumbPlaceholder"
                          />
                        </div>
                        <div class="hidden-md-and-down">
                          <ImageUploader
                            v-on:upload-start="thumbnailUploadStart"
                            v-on:upload-end="thumbnailUploadEnd"
                            :width="250"
                            :aspectRatio="16 / 10"
                            :placeholder="thumbPlaceholder"
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
                            :placeholder="bannerPlaceholder"
                          />
                        </div>
                        <div class="hidden-md-and-down">
                          <ImageUploader
                            v-on:upload-start="bannerUploadStart"
                            v-on:upload-end="bannerUploadEnd"
                            :width="400"
                            :aspectRatio="21 / 9"
                            :placeholder="bannerPlaceholder"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <validation-provider
                  name="Goal"
                  v-slot="{ errors }"
                  :rules="{
                    required: true,
                    max: 10,
                    min_value: 1,
                    numeric: true,
                  }"
                >
                  <v-text-field
                    rounded
                    filled
                    dense
                    placeholder="Pledge Goal"
                    prepend-icon="mdi-flag-checkered"
                    suffix="Br"
                    v-model="goal"
                    :error-messages="errors"
                    class="mt-4"
                  ></v-text-field>
                </validation-provider>
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
                        v-model="deadline"
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
                    v-model="deadline"
                    no-title
                    @input="datePickerMenu = false"
                  ></v-date-picker>
                </v-menu>
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
                  <v-btn x-large type="submit" color="primary">Next</v-btn>
                </div>
              </form>
            </validation-observer>
          </v-card>
        </v-stepper-content>
        <v-stepper-content step="2">
          <v-card elevation="0" class="paper px-3 py-8 pa-sm-16 rounded-lg">
            <h3 class="text-h6 text-center font-weight-light mb-16">
              Most successful campaigns reward their backers for believing in
              them.<br />Add rewards now...or later down the line, no pressure
              :&#41;
            </h3>
            <div class="d-flex justify-center">
              <RewardsEditList v-if="currentStep > 1" class="py-5" />
            </div>
            <div class="d-flex justify-center mt-16">
              <v-btn x-large color="primary" @click="finish">Finish</v-btn>
            </div>
          </v-card>
        </v-stepper-content>
      </v-stepper-items>
    </v-stepper>
  </v-container>
</template>

<script>
import {
  extend,
  setInteractionMode,
  ValidationProvider,
  ValidationObserver,
} from "vee-validate";
import { required, min_value, max, numeric } from "vee-validate/dist/rules";
import ImageUploader from "~/components/ImageUploader.vue";
import RewardsEditList from "~/components/creator/RewardsEditList.vue";

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
      currentStep: 1,
      createdCampaignId: undefined,
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
      if (Date.parse(this.deadline) <= Date.now()) {
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
        title: this.title,
        description: this.description,
        thumbnail: this.thumbnail,
        banner: this.banner,
        goal: this.goal,
        isPrivate: this.privacy === "Private",
        deadline: this.deadline,
      };
      // console.log(campaign);
      this.createdCampaignId = await this.$store.dispatch(
        "campaign/create",
        campaign
      );
      if (this.createdCampaignId) {
        const fetchSuccess = await this.$store.dispatch(
          "campaign/fetch",
          this.createdCampaignId
        );
        if (fetchSuccess) {
          this.currentStep = 2;
        }
      }
      this.submitting = false;
    },
    finish() {
      this.$router.push(`/campaign/${this.createdCampaignId}`);
    },
  },
};
</script>

<style>
</style>