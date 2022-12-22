<template>
  <div>
    <div class="profile-img d-flex justify-center py-5">
      <v-card class="" style="">
        <DynamicAvatar
          :image="uploadedAvatar ? uploadedAvatar : avatar"
          :firstName="user.first_name"
          :lastName="user.last_name"
          :isVerified="isVerified"
          :size="75"
        />
      </v-card>
    </div>
    <div class="text-center text-italic text-caption">
      <div class="">
        {{ user.email_address }} (<span class="text-capitalize">{{
          user.role
        }}</span
        >)
      </div>

      <div class="">
        Member since {{ creationDate }} ({{ creationDistance }})
      </div>
    </div>

    <div class="d-flex justify-center mt-3">
      <v-dialog v-model="profilePicDialog" width="500">
        <template v-slot:activator="{ on, attrs }">
          <v-btn v-bind="attrs" v-on="on" color=""
            >{{ user.avatar ? "Change" : "Upload" }} Profile Picture</v-btn
          >
        </template>
        <v-card class="pa-5 pb-12">
          <v-card-title
            class="text-h6 text-center justify-center font-weight-light"
            >Upload Profile Picture</v-card-title
          >
          <v-divider></v-divider>
          <div class="d-flex justify-center">
            <ImageUploader
              class="mt-8"
              :width="200"
              :aspectRatio="1 / 1"
              :placeholder="
                avatar ? avatar : require('~/assets/default-avatar.svg')
              "
              v-on:upload-start="profilePicUploadStart"
              v-on:upload-end="profilePicUploadEnd"
            />
          </div>
          <div class="d-flex justify-center">
            <v-btn x-large color="primary" @click="profilePicDialog = false"
              >Done</v-btn
            >
          </div>
        </v-card>
      </v-dialog>
    </div>

    <div class="mt-8">
      <validation-observer ref="observer" v-slot="{ handleSubmit }">
        <form @submit.prevent="handleSubmit(submit)">
          <div class="d-flex flex-column flex-sm-row justify-space-between">
            <validation-provider
              class="col pa-0"
              name="First Name"
              v-slot="{ errors }"
              :rules="{ required: true, max: 50 }"
            >
              <v-text-field
                rounded
                filled
                dense
                v-model="user.first_name"
                placeholder="First Name"
                type="text"
                prepend-icon="mdi-account"
                :error-messages="errors"
                required
                class="pr-0 pr-sm-3"
              >
              </v-text-field>
            </validation-provider>
            <validation-provider
              class="col pa-0"
              name="Last Name"
              v-slot="{ errors }"
              :rules="{ required: true, max: 50 }"
            >
              <v-text-field
                rounded
                filled
                dense
                v-model="user.last_name"
                placeholder="Last Name"
                type="text"
                :error-messages="errors"
                required
                class="pl-8 pr-0 pr-sm-0 pl-sm-3"
              >
              </v-text-field>
            </validation-provider>
          </div>
          <validation-provider
            v-slot="{ errors }"
            name="Display Name"
            :rules="{ required: true, max: 50 }"
          >
            <v-text-field
              rounded
              filled
              dense
              v-model="user.display_name"
              placeholder="Username"
              prepend-icon="mdi-at"
              type="text"
              :error-messages="errors"
              required
            ></v-text-field>
          </validation-provider>
          <validation-provider
            v-slot="{ errors }"
            name="Gender"
            :rules="{ required: true }"
          >
            <v-select
              class="text-capitalize"
              rounded
              filled
              dense
              v-model="user.gender"
              :items="genders"
              :error-messages="errors"
              placeholder="Gender"
              prepend-icon="mdi-account-details"
              required
            >
            </v-select>
          </validation-provider>

          <validation-provider
            name="Phone"
            v-slot="{ errors }"
            :rules="{ max: 50, numeric: true }"
          >
            <v-text-field
              rounded
              filled
              dense
              v-model="user.phone_number"
              placeholder="Phone Number"
              prepend-icon="mdi-phone"
              type="number"
              :error-messages="errors"
            >
            </v-text-field>
          </validation-provider>
          <validation-provider
            name="Bio"
            v-slot="{ errors }"
            :rules="{ max: 50000 }"
          >
            <Editor
              editorClassList="rounded-xl"
              prependIcon="mdi-information"
              v-model="user.about"
              placeholder="Tell us a bit about yourself"
              :errorMessages="errors"
            />
          </validation-provider>
          <div class="d-flex justify-center">
            <slot>
              <div
                style="width: 300px"
                class="text-center pt-4 error--text"
                v-text="submitError"
              ></div>
            </slot>
          </div>
          <div class="text-center pt-10">
            <v-btn
              color="primary"
              large
              :loading="submitting"
              label="Save Changes"
              type="submit"
              >Save</v-btn
            >
          </div>
        </form>
      </validation-observer>
    </div>
  </div>
</template>

<script>
import { format, formatDistance } from "date-fns";
import ImageUploader from "~/components/ImageUploader.vue";
import {
  extend,
  ValidationProvider,
  ValidationObserver,
  setInteractionMode,
} from "vee-validate";
import { required, max, confirmed, numeric } from "vee-validate/dist/rules";
import { getProfileById } from "~/queries/user/getProfile.gql";
import { updateUserInfo } from "~/queries/user/updateUser.gql";

const allowedPhoneNumberCharsRegex = /[\+\(\)]/;

setInteractionMode("eager");
extend("required", {
  ...required,
  message: "{_field_} is required",
});
extend("max", {
  ...max,
  message: "{_field_} may not be greater than {length} characters",
});
extend("confirmed", {
  ...confirmed,
  message: "Passwords do not match",
});
extend("numeric", {
  ...numeric,
  message:
    "{_field_} is not a valid phone number. Please remove any non-numeric characters",
});
export default {
  components: {
    ValidationProvider,
    ValidationObserver,
    ImageUploader,
  },
  props: {
    userId: String,
  },
  apollo: {
    user_by_pk: {
      query: getProfileById,
      variables() {
        return {
          id: this.userId,
        };
      },
      result({ data }) {
        this.user = data.user_by_pk;
      },
      skip() {
        if (this.userId) {
          return false;
        } else {
          return true;
        }
      },
      fetchPolicy: "no-cache",
    },
  },
  computed: {
    text() {
      console.log(this.user.about);
      return this.user.about ? this.user.about : "";
    },
    isVerified() {
      return localStorage.userIsVerified == "true";
    },
    avatar() {
      return this.user.avatar
        ? this.user.avatar
        : require("~/assets/default-avatar.svg");
    },
    creationDate() {
      if (this.user.created_at) {
        return format(new Date(this.user.created_at), "MMMM d',' y");
      }
    },
    creationDistance() {
      if (this.user.created_at) {
        return formatDistance(new Date(this.user.created_at), Date.now(), {
          addSuffix: true,
        });
      }
    },
  },
  data() {
    return {
      uploadedAvatar: "",
      avatarUploading: false,
      user: "",
      genders: require("~/assets/genders.json").genders,
      submitError: "",
      submitting: false,
      profilePicDialog: false,
    };
  },
  methods: {
    profilePicUploadStart() {
      this.uploadedAvatar = null;
      this.avatarUploading = true;
    },
    profilePicUploadEnd(url) {
      this.avatarUploading = false;
      this.uploadedAvatar = url ? url : null;
    },
    async submit() {
      this.submitting = true;
      this.submitError = "";
      if (this.avatarUploading) {
        this.submitError =
          "Please wait for profile picture to finish uploading";
        this.submitting = false;
        return;
      }
      this.$refs.observer.validate();
      if (this.userId) {
        try {
          const res = await this.$apollo
            .mutate({
              mutation: updateUserInfo,
              variables: {
                id: this.userId,
                firstName: this.user.first_name,
                lastName: this.user.last_name,
                displayName: this.user.display_name,
                avatar: this.uploadedAvatar
                  ? this.uploadedAvatar
                  : this.user.avatar,
                about: this.user.about,
                phoneNumber: this.user.phone_number,
                gender: this.user.gender,
              },
            })
            .then(({ data }) => data && data.update_by_pk_user)
            .catch((err) => {
              this.submitting = false;
              console.log(err);
              if (err.message.startsWith("GraphQL error: ")) {
                this.submitError = err.message.substring(15);
              } else {
                this.submitError = "Internal error. Please try again later";
              }
            });

          this.submitting = false;
          if (res.id) {
            this.$apollo.queries.user_by_pk.refetch();
            this.$authHelper.updateUserInfo({
              displayName: this.user.display_name,
              firstName: this.user.first_name,
              lastName: this.user.last_name,
              avatarUrl: this.uploadedAvatar
                ? this.uploadedAvatar
                : this.user.avatar,
            });
            this.$notify({
              text: "Changes Saved",
              type: "reversebackground reverseforeground--text text-center",
            });
          } else {
            this.submitError = "Unable to update information. Try again later.";
          }
        } catch (err) {
          console.log(err);
          this.$notify({
            title: "Error",
            text: "Unable to complete request",
            type: "error white--text",
          });
        }
      } else {
        await this.$apollHelpers.onLogout().then(() => {
          this.$authHelper.cleanupUserInfo();
        });
      }
    },
  },
};
</script>

<style>
.v-select-list {
  text-transform: capitalize !important;
}
.verified-icon {
  display: none;
  max-height: 25px;
  position: absolute;
  z-index: 5;
  bottom: -10px;
  right: -10px;
}
</style>