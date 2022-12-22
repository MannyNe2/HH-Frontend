<template>
  <div class="d-flex flex-column rounded-lg justify-center px-10 pt-12">
    <div class="text-h5 font-weight-light text-center">
      Let's get you signed in!
    </div>
    <v-row class="mt-8">
      <v-col>
        <validation-observer ref="observer" v-slot="{ handleSubmit }">
          <form @submit.prevent="handleSubmit(submit)">
            <validation-provider
              name="Email"
              v-slot="{ errors }"
              :rules="{ required: true, email: true, max: 50 }"
            >
              <v-text-field
                v-model="emailAddress"
                placeholder="Email"
                type="text"
                prepend-icon="mdi-email"
                filled
                rounded
                dense
                :error-messages="errors"
                required
              >
              </v-text-field>
            </validation-provider>
            <validation-provider
              name="Password"
              v-slot="{ errors }"
              :rules="{ required: true, max: 50 }"
            >
              <v-text-field
                filled
                rounded
                dense
                v-model="password"
                placeholder="Password"
                type="password"
                prepend-icon="mdi-key"
                :error-messages="errors"
                required
              ></v-text-field>
            </validation-provider>
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
                label="Login"
                type="submit"
                >Login</v-btn
              >
            </div>
            <div class="text-center pt-10 pb-8">
              Don't have an account?
              <br />
              <NuxtLink to="/auth/signup">Click here</NuxtLink>
              to create a new one
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
import { required, email, max } from "vee-validate/dist/rules";
import { signIn } from "~/queries/auth/signIn";

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
export default {
  components: {
    ValidationProvider,
    ValidationObserver,
  },
  data() {
    return {
      emailAddress: "",
      password: "",
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
      await this.$apolloHelpers.onLogout().then(async (_) => {
        try {
          const res = await this.$apollo
            .query({
              query: signIn,
              variables: {
                emailAddress: this.emailAddress,
                password: this.password,
              },
            })
            .then(({ data }) => data && data.signIn)
            .catch((err) => {
              this.submitting = false;
              console.log(err);
              if (err.message.startsWith("GraphQL error: ")) {
                this.submitError = err.message.substring(15);
              } else {
                this.submitError = "Internal error. Please try again later";
              }
            });
          // console.log(res)
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
    onSignupClick() {
      this.$router.push("/auth/signup");
    },
  },
};
</script>

<style>
</style>