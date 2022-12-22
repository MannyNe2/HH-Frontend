<template>
  <div class="mt-5 d-flex justify-center">
    <v-card flat class="pa-8 mt-5 rounded-lg" elevation="3" outlined>
      <h3 class="text-h5 font-weight-regular mb-2">Withdrawal Confirmation</h3>
      <v-divider></v-divider>
      <div class="mt-15">
        <validation-observer ref="observer" v-slot="{ handleSubmit }">
          <form @submit.prevent="handleSubmit(submit)">
            <validation-provider
              name="Admin password"
              v-slot="{ errors }"
              :rules="{ required: true, max: 50 }"
            >
              <v-text-field
                rounded
                filled
                dense
                v-model="adminPassword"
                placeholder="Admin Password"
                prepend-icon="mdi-key"
                type="password"
                :error-messages="errors"
                required
              ></v-text-field>
            </validation-provider>
            <validation-provider
              name="Creator password"
              v-slot="{ errors }"
              :rules="{ required: true, max: 50 }"
            >
              <v-text-field
                rounded
                filled
                dense
                v-model="creatorPassword"
                data-vv-delay="100"
                placeholder="Creator Password"
                prepend-icon="mdi-key"
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
            <div class="text-center pt-5 flex-column d-flex">
              <v-btn
                color="primary"
                large
                :loading="submitting"
                label="Create an Account"
                type="submit"
                class="mx-13"
                >
                <v-icon left> mdi-check </v-icon>
                Confirm
              </v-btn>
              <NuxtLink :to='`/admin/withdrawal`' class="mt-8">Go Back</NuxtLink>
            </div>
          </form>
        </validation-observer>
      </div>
    </v-card>
  </div>
</template>

<script>
import {
  extend,
  ValidationProvider,
  ValidationObserver,
  setInteractionMode,
} from "vee-validate";
import { required, max } from "vee-validate/dist/rules";
import { withdraw } from "~/queries/admin/withdrawal/withdraw.gql";

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
  name: "ConfirmationForm",
  components: {
    ValidationProvider,
    ValidationObserver,
  },
  data() {
    return {
      adminPassword: "",
      creatorPassword: "",
      id: this.$route.params.id,
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
            mutation: withdraw,
            variables: {
                adminPass: this.adminPassword,
                creatorPass: this.creatorPassword,
                withdrawRequestId: this.id
            },
            fetchPolicy: "no-cache",
          })
          .then(({ data }) => data && data.approveWithdrawal);
        if (res && res.status === 'withdrawn') {
          this.$notify({
            text: "Withdraw Successful!",
            type: "success",
          });
          this.submitting = false;
          this.$router.push('/admin/withdrawal')
        } else {
          this.submitError = "Withdraw Unsuccessul, internal error.";
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