<template>
  <v-dialog width="500" v-model="dialog">
    <template v-slot:activator="{ on, attrs }">
      <v-btn
        small
        v-on="on"
        v-bind="attrs"
        @click="dialog = true"
        color="primary"
        >Request Form</v-btn
      >
    </template>
    <v-card class="pa-8 overflow-auto">
      <h3 class="text-h5 font-weight-regular">Creator Request</h3>
      <!-- <v-divider class="mt-3 mb-5"></v-divider> -->
      <v-banner color="info" class="mt-3">
        Please include a recent photo of yourself holding a form of legal
        identification for verification purposes. This is done to ensure the
        accountablility of the people creating campaigns and to maintain a
        standard of quality on the platform
      </v-banner>
      <ImageUploader
        class="mt-3"
        :aspectRatio="1 / 1"
        :width="200"
        v-on:upload-start="uploadStart"
        v-on:upload-end="uploadEnd"
      />
      <validation-observer ref="observer" v-slot="{ handleSubmit }">
        <form @submit.prevent="handleSubmit(submit)">
          <div class="">
            <validation-provider
              name="Password"
              v-slot="{ errors }"
              :rules="{ required: true }"
            >
              <v-text-field
                rounded
                filled
                dense
                v-model="password"
                placeholder="Password"
                prepend-icon="mdi-key"
                type="password"
                :error-messages="errors"
                required
              ></v-text-field>
            </validation-provider>
          </div>
          <div class="d-flex justify-center">
            <slot>
              <div
                style="width: 300px"
                class="text-center pt-4 error--text"
                v-text="submitError"
              ></div>
            </slot>
          </div>
          <div class="text-center pt-5 pb-5">
            <v-btn
              color="error"
              large
              :loading="submitting"
              label="Save Changes"
              type="submit"
            >
              Send Request
            </v-btn>
          </div>
        </form>
      </validation-observer>
    </v-card>
  </v-dialog>
</template>

<script>
import ImageUploader from "~/components/ImageUploader.vue";
import {
  extend,
  setInteractionMode,
  ValidationObserver,
  ValidationProvider,
} from "vee-validate";
import { required, max } from "vee-validate/dist/rules";
import { requestCreatorship } from "~/queries/user/requestCreatorship.gql";

setInteractionMode("eager");
extend("required", {
  ...required,
  message: "{_field_} is required",
});
extend("max", {
  ...max,
  message: "{_field_} may not be greater than {length} characters",
});
export default {
  name: "CreatorRequestForm",
  components: {
    ImageUploader,
    ValidationObserver,
    ValidationProvider,
  },
  data() {
    return {
      dialog: false,
      uploading: false,
      imageUrl: undefined,
      password: "",
      submitting: false,
      submitError: "",
    };
  },
  methods: {
    uploadStart() {
      this.uploading = true;
    },
    uploadEnd(url) {
      this.uploading = false;
      if (url) {
        this.imageUrl = url;
      }
    },
    async submit() {
      this.$refs.observer.validate();
      if (this.uploading) {
        this.submitError =
          "Please wait for the verification image to finish uploading";
        this.submitting = false;
        return;
      }
      if (!this.imageUrl) {
        this.submitError = "Verification image is required";
        this.submitting = false;
        return;
      }
      try {
        const res = await this.$apollo
          .mutate({
            mutation: requestCreatorship,
            variables: {
              image: this.imageUrl,
              password: this.password,
            },
          })
          .then(({ data }) => data && data.requestCreatorship);
        if (res.requestId) {
          this.$notify({
            text: "Creator request submitted",
            type: "success white--text",
          });
        }
        this.submitting = false;
        this.dialog = false;
        this.$emit("submitted");
      } catch (err) {
        console.log(err);
        if (err.message.startsWith("GraphQL error: ")) {
          this.$notify({
            title: "Error",
            text: err.message.substring(15),
            type: "error white--text",
          });
        } else {
          this.$notify({
            title: "Critical Error",
            text: "Connection error or invalid state detected",
            type: "error white--text",
          });
        }
      }
    },
  },
};
</script>

<style>
.cursor-regular {
  cursor: default;
}
</style>