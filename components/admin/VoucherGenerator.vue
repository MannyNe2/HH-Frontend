<template>
  <v-dialog v-model="dialog" width="500">
    <template v-slot:activator="{ on, attrs }">
      <v-btn color="primary" v-bind="attrs" v-on="on" @click="dialog = true"
        ><v-icon left>mdi-plus</v-icon><span>Generate Vouchers</span></v-btn
      >
    </template>
    <v-card class="px-8">
      <h1 class="text-h5 pt-8 font-weight-thin">Generate Voucher Codes</h1>
      <validation-observer ref="observer" v-slot="{ handleSubmit }">
        <form class="py-8" @submit.prevent="handleSubmit(submit)">
          <validation-provider
            name="Count"
            v-slot="{ errors }"
            :rules="{ required: true }"
          >
            <v-text-field
              v-model="vouchersCount"
              label="Number of Codes"
              type="number"
              filled
              rounded
              dense
              prepend-icon="mdi-pound"
              :error-messages="errors"
              required
            ></v-text-field>
          </validation-provider>
          <validation-provider
            name="CodeLength"
            v-slot="{ errors }"
            :rules="{ required: true }"
          >
            <v-text-field
              label="Code Length"
              v-model="codeLength"
              type="number"
              filled
              rounded
              dense
              prepend-icon="mdi-ruler"
              :error-messages="errors"
              required
            ></v-text-field>
          </validation-provider>
          <validation-provider
            name="Value"
            v-slot="{ errors }"
            :rules="{ required: true }"
          >
            <v-select
              transition="slide-y-transition"
              rounded
              filled
              dense
              v-model="value"
              :items="values"
              placeholder="Value (ETB)"
              type="number"
              prepend-icon="mdi-cash-multiple"
              :error-messages="errors"
              required
            ></v-select>
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
              >Generate</v-btn
            >
            <v-btn color="error" text @click="dialog = false">Cancel</v-btn>
          </v-card-actions>
        </form>
      </validation-observer>
    </v-card>
  </v-dialog>
</template>

<script>
import {
  extend,
  ValidationProvider,
  ValidationObserver,
  setInteractionMode,
} from "vee-validate";
import { required, max } from "vee-validate/dist/rules";
import { generateVouchers } from "~/queries/admin/voucher/generateVouchers.gql";

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
  middleware: "isAdmin",
  components: {
    ValidationProvider,
    ValidationObserver,
  },
  data() {
    return {
      dialog: false,
      vouchersCount: 1,
      codeLength: 16,
      value: 50,
      values: [50, 100, 200, 500, 1000, 5000, 10000],
      submitting: false,
      submitError: "",
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
            mutation: generateVouchers,
            variables: {
              count: this.vouchersCount,
              codeLength: this.codeLength,
              value: this.value,
            },
          })
          .then(({ data }) => {
            // console.log(JSON.stringify(`data: ${JSON.stringify(data)}`))
            // data && data.generateVouchers;
            return data;
          })
          .catch((err) => {
            console.log(err);
            this.submitting = false;
            this.submitError = err.message;
          });

        // console.log("reading response" + res.generateVouchers);

        this.submitting = false;
        if (res.generateVouchers.success) {
          // TODO: Generation success notification
          this.$emit("voucher-generated");
          this.dialog = false;
        } else {
          // TODO: Generation failure notification?
          this.submitError = "Generation Error";
        }
      } catch (err) {
        console.log(err);
        this.submitting = false;
        this.submitError = "Unknown Error";
      }
    },
  },
};
</script>

<style>
</style>