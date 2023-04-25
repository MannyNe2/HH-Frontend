<template>
  <v-card class="px-8">
    <h1 class="text-h5 pt-8 font-weight-light">Refill Funds</h1>
    <validation-observer ref="observer" v-slot="{ handleSubmit }">
      <form class="py-8" @submit.prevent="handleSubmit(submit)">
        <validation-provider
          name="Code"
          v-slot="{ errors }"
          :rules="{ required: true, max: 50 }"
        >
          <v-text-field
            placeholder="Amount"
            v-model="voucherCode"
            type="text"
            filled
            rounded
            dense
            prepend-icon="mdi-credit-card"
            :error-messages="errors"
            required
          ></v-text-field>
        </validation-provider>
        <slot>
          <div
            style="width: 300px"
            class="text-center pt-4 error--text"
            v-text="submitError"
          ></div>
        </slot>
        <v-card-actions class="d-flex justify-end">
          <v-btn color="primary" :loading="submitting" type="submit"
            >Refill</v-btn
          >
          <v-btn color="error" text @click.stop="closeDialogEvent"
            >Cancel</v-btn
          >
        </v-card-actions>
      </form>
    </validation-observer>
  </v-card>
</template>

<script>
import {
  extend,
  ValidationProvider,
  ValidationObserver,
  setInteractionMode,
} from "vee-validate";
import { required, max } from "vee-validate/dist/rules";
import { redeemVoucher } from "~/queries/user/redeemVoucher.gql";
import { refill } from "~/queries/user/refill.gql";

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
  middleware: "isAuth",
  components: {
    ValidationProvider,
    ValidationObserver,
  },
  data() {
    return {
      voucherCode: "",
      submitting: false,
      submitError: "",
    };
  },
  methods: {
    closeDialogEvent() {
      this.$emit("close-redeem-voucher-dialog");
    },
    async submit() {
      this.submitting = true;
      this.submitError = "";
      this.$refs.observer.validate();
      try {
        const code = this.voucherCode;
        const res = await this.$apollo
          .query({
            query: refill,
            variables: {
              refillAmount: code,
            },
          })
          .then(({ data }) => {
            return data;
          });
        this.submitting = false;
        if (res.triggerRefill) {
          if (res.triggerRefill.session) {
            // TODO: Claim success notification
            this.$emit("voucher-redeemed");
            console.log(res.triggerRefill.session);
            window.location.href = res.triggerRefill.session;
          }
        }
      } catch (err) {
        console.log(err);
        this.submitting = false;
        if (err.message.startsWith("GraphQL error: ")) {
          this.submitError = err.message.substring(15);
        } else {
          this.submitError = "Internal error. Please try again later";
        }
      }
    },
  },
};
</script>

<style>
</style>