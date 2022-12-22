<template>
  <div class="d-inline-flex flex-column justify-center px-10 pt-12">
    <div class="text-h5 font-weight-light text-center">
      Tell us about yourself!
    </div>
    <v-row class="mt-8">
      <v-col>
        <validation-observer ref="observer" v-slot="{ handleSubmit }">
          <form @submit.prevent="handleSubmit(submit)">
            <div class="d-md-flex justify-space-between">
              <validation-provider
                name="First Name"
                v-slot="{ errors }"
                :rules="{ required: true, max: 50 }"
              >
                <v-text-field
                  rounded
                  filled
                  dense
                  v-model="firstName"
                  placeholder="First Name"
                  type="text"
                  prepend-icon="mdi-account"
                  :error-messages="errors"
                  required
                  class="pr-md-2"
                >
                </v-text-field>
              </validation-provider>
              <validation-provider
                name="Last Name"
                v-slot="{ errors }"
                :rules="{ required: true, max: 50 }"
              >
                <v-text-field
                  rounded
                  filled
                  dense
                  v-model="lastName"
                  placeholder="Last Name"
                  type="text"
                  :error-messages="errors"
                  required
                  class="pl-md-2 pl-8"
                >
                </v-text-field>
              </validation-provider>
            </div>
            <validation-provider
              v-slot="{ errors }"
              name="Display Name"
              :rules="{ required: true, max: 20 }"
            >
              <v-text-field
                rounded
                filled
                dense
                v-model="displayName"
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
                rounded
                filled
                dense
                v-model="genderSelection"
                :items="genders"
                :error-messages="errors"
                placeholder="Gender"
                prepend-icon="mdi-account-details"
                required
              ></v-select>
            </validation-provider>

            <validation-provider
              name="Email"
              v-slot="{ errors }"
              :rules="{ required: true, email: true, max: 50 }"
            >
              <v-text-field
                rounded
                filled
                dense
                v-model="emailAddress"
                placeholder="Email"
                prepend-icon="mdi-email"
                type="text"
                :error-messages="errors"
                required
              >
              </v-text-field>
            </validation-provider>
            <div class="d-md-flex justify-space-between">
              <validation-provider
                vid="password"
                name="Password"
                v-slot="{ errors }"
                :rules="{ required: true, max: 50 }"
              >
                <v-text-field
                  rounded
                  filled
                  dense
                  v-model="password"
                  data-vv-delay="100"
                  placeholder="Password"
                  prepend-icon="mdi-key"
                  type="password"
                  :error-messages="errors"
                  required
                  class="pr-md-2"
                ></v-text-field>
              </validation-provider>
              <validation-provider
                name="Password Confirmation"
                v-slot="{ errors }"
                rules="required|confirmed:password"
              >
                <v-text-field
                  rounded
                  filled
                  dense
                  v-model="passwordConfirm"
                  placeholder="Confirm Password"
                  type="password"
                  :error-messages="errors"
                  required
                  class="pl-md-2 pl-8"
                ></v-text-field>
              </validation-provider>
            </div>
            <div class="d-flex justify-center">
              <slot>
                <div
                  style="width: 200px"
                  class="text-center pt-4 error--text"
                  v-text="submitError"
                ></div>
              </slot>
            </div>
            <div class="text-center pt-10">
              <v-btn
                color="primary"
                x-large
                :loading="submitting"
                label="Create an Account"
                type="submit"
                >Create an Account</v-btn
              >
            </div>
            <div class="text-center pt-10 pb-8">
              Already have an account?
              <br />
              <NuxtLink to="/auth/login">Click here</NuxtLink>
              to login
            </div>
          </form>
        </validation-observer>
      </v-col>
    </v-row>
  </div>
</template>

<script>
import {
  extend,
  ValidationProvider,
  ValidationObserver,
  setInteractionMode,
} from "vee-validate";
import { required, email, max, confirmed } from "vee-validate/dist/rules";
import { createUser } from "~/queries/auth/signUp";

setInteractionMode("eager");
extend("required", {
  ...required,
  message: "{_field_} is required",
});
extend("email", {
  ...email,
  message: "Please insert a valid email address",
});
extend("max", {
  ...max,
  message: "{_field_} may not be greater than {length} characters",
});
extend("confirmed", {
  ...confirmed,
  message: "Passwords do not match",
});
export default {
  components: {
    ValidationProvider,
    ValidationObserver,
  },
  data() {
    return {
      emailAddress: "",
      password: "",
      passwordConfirm: "",
      firstName: "",
      lastName: "",
      displayName: "",
      genderSelection: "",
      genders: ["Male", "Female", "Non-binary"],
      submitting: false,
      submitError: "",
      alreadyLoggedIn: true,
    };
  },
  methods: {
    async submit() {
      this.submitting = true;
      this.submitError = "";
      this.$refs.observer.validate();
      console.log(this.genderSelection);
      await this.$apolloHelpers.onLogout().then(async (_) => {
        try {
          const res = await this.$apollo
            .mutate({
              mutation: createUser,
              variables: {
                emailAddress: this.emailAddress,
                password: this.password,
                firstName: this.firstName,
                lastName: this.lastName,
                displayName: this.displayName,
                gender: this.genderSelection,
              },
            })
            .then(({ data }) => data && data.signUp)
            .catch((err) => {
              this.submitting = false;
              console.log(err);
              if (err.message.startsWith("GraphQL error: ")) {
                this.submitError = err.message.substring(15);
              } else {
                this.submitError = "Internal error. Please try again later";
              }
            });

          await this.$apolloHelpers.onLogin(res.accessToken);
          this.$authHelper.storeUserInfo(res);
          // localStorage.userId = res.userId;
          // localStorage.userDisplayName = res.displayName;
          // localStorage.userFirstName = res.firstName;
          // localStorage.userLastName = res.lastName;
          // localStorage.userAvatarUrl = res.avatarUrl;
          // localStorage.userRole = res.role;
          // localStorage.userIsVerified = res.isVerified;
          // localStorage.userIsBanned = res.isBanned;

          this.submitting = false;
          this.$router.push("/home");
        } catch (err) {
          this.submitting = false;
          console.log("Unknown error");
          console.log(err);
        }
      });
    },
    onLoginClick() {
      this.$router.push("/auth/login");
    },
  },
};
</script>

<style>
</style>