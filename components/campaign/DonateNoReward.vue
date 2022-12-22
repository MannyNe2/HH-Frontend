<template>
  <v-card
    elevation="0"
    outlined
    class="flex-column align-space-between pa-5"
    style="width: 250px; height: 260px"
  >
    <div class="overflow-hidden" style="height: 40px">
      <h1 class="text-subtitle-2 font-weight-bold">Pledge without a reward</h1>
      <v-divider class="mt-3"></v-divider>
    </div>
    <div class="flex-fill flex-column d-flex" style="height: 175px">
      <validation-observer ref="observer" v-slot="{ handleSubmit }">
        <form action="" @submit.prevent="handleSubmit(submit)">
          <validation-provider
            name="Pledge"
            :rules="{
              required: true,
              min_value: 1,
              max_value: 10000000,
              max: 10,
              numeric: true,
            }"
          >
            <v-text-field
              ref="textfield"
              v-model="pledgeAmount"
              prepend-icon="mdi-cash"
              type="number"
              filled
              dense
              rounded
              placeholder="10"
              prefix="Br"
              reverse
              class="mt-5"
              v-on:input="onInput"
            ></v-text-field>
          </validation-provider>
          <slot>
            <div
              style="width: 300px"
              class="text-center pt-4 error--text"
              v-text="submitError"
            ></div>
          </slot>
          <h3
            class="text-caption font-weight-regular text-center primary--text"
          >
            Pledge because you believe in it!
          </h3>
          <v-btn
            :disabled="pledgeAmount < 1"
            type="submit"
            label="continue"
            :loading="submitting"
            color="primary"
            block
            class="mt-5"
            >Continue</v-btn
          >
        </form>
      </validation-observer>
    </div>
  </v-card>
</template>

<script>
import {
  extend,
  setInteractionMode,
  ValidationProvider,
  ValidationObserver,
} from "vee-validate";
import {
  required,
  min_value,
  max_value,
  max,
  numeric,
} from "vee-validate/dist/rules";

setInteractionMode("eager");
extend("required", {
  ...required,
  message: "{_field_} pledge cannot be empty",
});
extend("max", {
  ...max,
  message: "{_field_} may not be over {max} digits",
});
extend("min_value", {
  ...min_value,
  message: "{_field_} may not be under {min} br",
});
extend("max_value", {
  ...max_value,
  message: "{_field_} may not be over {max} br",
});
extend("numeric", {
  ...numeric,
  message: "{_field_} must be a number",
});

export default {
  components: {
    ValidationProvider,
    ValidationObserver,
  },
  data() {
    return {
      pledgeAmount: 10,
      submitError: "",
      submitting: false,
    };
  },
  methods: {
    async submit() {
      this.submitting = true;
      this.$refs.observer.validate();
      this.$store.dispatch("campaign/back", {
        amount: this.pledgeAmount,
        acceptRewards: false,
      });
      this.submitting = false;
    },
    onInput(newValue) {
      this.$refs.observer.validate();
      console.log(newValue);
    },
  },
};
</script>

<style>
.v-text-field__prefix {
  padding-left: 12px !important;
}
</style>