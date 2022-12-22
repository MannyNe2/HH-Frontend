<template>
  <validation-observer ref="observer" v-slot="{ handleSubmit }">
    <form @submit.prevent="handleSubmit(submit)">
      <validation-provider
        name="Old Password"
        v-slot="{ errors }"
        :rules="{ required: true, max: 50 }"
      >
        <v-text-field
          rounded
          filled
          dense
          v-model="oldPassword"
          placeholder="Old Password"
          prepend-icon="mdi-key-remove"
          type="password"
          :error-messages="errors"
          required
        ></v-text-field>
      </validation-provider>
      <validation-provider
        vid="password"
        name="New Password"
        v-slot="{ errors }"
        :rules="{ required: true, max: 50 }"
      >
        <v-text-field
          rounded
          filled
          dense
          v-model="password"
          data-vv-delay="100"
          placeholder="New Password"
          prepend-icon="mdi-key"
          type="password"
          :error-messages="errors"
          required
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
          prepend-icon="mdi-shield-key"
          type="password"
          :error-messages="errors"
          required
        ></v-text-field>
      </validation-provider>
      <slot>
        <div
          style="width: 250px"
          class="text-center pt-4 error--text"
          v-text="submitError"
        ></div>
      </slot>
      <div class="text-center pt-10">
        <v-btn
          color="error"
          large
          :loading="submitting"
          label="Create an Account"
          type="submit"
          >Change Password</v-btn
        >
      </div>
    </form>
  </validation-observer>
</template>

<script>
import {
  extend,
  ValidationProvider,
  ValidationObserver,
  setInteractionMode,
} from "vee-validate";
import { required, email, max, confirmed } from "vee-validate/dist/rules";
import { changePassword } from "~/queries/user/updateUser.gql";

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
  message: "New passwords do not match",
});
export default {
  name: "ChangePasswordForm",
  components: {
    ValidationProvider,
    ValidationObserver,
  },
  data() {
    return {
      oldPassword: "",
      password: "",
      passwordConfirm: "",
      submitError: "",
      submitting: false,
    };
  },
  methods: {
    async submit() {
      this.submitting = true;
      this.submitError = "";
      this.$refs.observer.validate();
      try {
        const res = await this.$apollo
          .mutate({
            mutation: changePassword,
            variables: {
              oldPassword: this.oldPassword,
              newPassword: this.password,
            },
          })
          .then(({ data }) => data && data.changePassword);
        if (res && res.success) {
          // TODO: Success notification
          this.$notify({
            text: "Password changed",
            type: "reversebackground reverseforeground--text",
          });
          this.submitting = false;
        } else {
          this.submitError = "Unable to change password. Try again later.";
          this.submitting = false;
        }
      } catch (err) {
        console.log(err);
        this.$notify({
          title: "Error",
          text: "Unable to complete request",
          type: "error white--text",
        });
        if (err.message.startsWith("GraphQL error: ")) {
          this.submitError = err.message.substring(15);
          this.submittting = false;
        } else {
          this.submitError = "Internal error. Please try again later";
          this.submittting = false;
        }
      }
      this.submitting = false;
    },
  },
};
</script>

<style>
</style>