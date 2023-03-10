<template>
  <v-card class="px-8">
    <h1 class="text-h5 pt-8 font-weight-light">Redeem Voucher</h1>
    <validation-observer ref="observer" v-slot="{ handleSubmit }">
      <form class="py-8" @submit.prevent="handleSubmit(submit)">
        <validation-provider
          name="Code"
          v-slot="{ errors }"
          :rules="{ required: true, max: 50 }"
        >
          <v-text-field
            placeholder="Voucher Code"
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
            >Claim</v-btn
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
        const code = this.voucherCode.replaceAll(/\W/g, "").toUpperCase();
        const res = await this.$apollo
          .mutate({
            mutation: redeemVoucher,
            variables: {
              code: code,
            },
          })
          .then(({ data }) => {
            return data;
          });
        this.submitting = false;
        if (res.claimVoucher) {
          if (res.claimVoucher.success) {
            // TODO: Claim success notification
            this.$notify({
              text: "Voucher Redeemed",
              type: "success white--text text-center"
            })
            this.$emit("voucher-redeemed");
          } else {
            this.submitError = res.claimVoucher.remark;
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