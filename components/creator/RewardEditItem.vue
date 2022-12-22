<template>
  <v-card
    elevation="0"
    outlined
    class="flex-column align-space-between pa-5"
    style="width: 250px"
  >
    <div class="overflow-hidden" style="height: 220px">
      <h1 class="text-subtitle-2 text-truncate font-weight-bold">
        Pledge {{ amount }} Br or more
      </h1>
      <v-divider class="my-3"></v-divider>

      <div class="overflow-hidden" style="max-height: 50px">
        <h2 class="text-subtitle-1 font-weight-bold">{{ title }}</h2>
      </div>
      <div class="overflow-auto">
        <!-- <RichTextView class="" :content="description" /> -->
        {{ description }}
      </div>
    </div>
    <div class="" style="height: 50px">
      <v-divider class="my-3"></v-divider>
      <div class="d-flex justify-lg-space-between align-center">
        <div>
          <h3 class="grey--text text-uppercase text-caption">
            Estimated Delivery
          </h3>
          <h4 class="text-body-2 font-weight-bold">
            {{ deliveryDateFormatted }}
          </h4>
        </div>
        <div>
          <h3 class="grey--text text-right text-uppercase text-caption">
            Type
          </h3>
          <h4 class="text-body-2 font-weight-bold text-capitalize">
            {{ rewardType }} Goods
          </h4>
        </div>
      </div>
    </div>
  </v-card>
</template>

<script>
import { format, parseISO } from "date-fns";
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
  name: "RewardEditItem",
  components: {
    ValidationProvider,
    ValidationObserver,
  },
  props: {
    amount: Number,
    title: String,
    description: String,
    rewardType: String,
    deliveryDate: String,
  },
  computed: {
    deliveryDateFormatted() {
      return format(parseISO(this.deliveryDate), "MMM y");
    },
  },
  data() {
    return {
      pledgeAmount: this.amount,
      submitError: "",
      submitting: false,
    };
  },
  methods: {
    async submit() {
      this.submitting = true;
      console.log("hmmm");
      this.$refs.observer.validate();
      this.$store.dispatch("campaign/back", {
        amount: this.pledgeAmount,
        acceptRewards: true,
      });
      this.submitting = false;
    },
    onInput(newValue) {
      // console.log(this.$refs.observer)
      this.$refs.observer.validate();
      console.log(newValue);
    },
  },
};
</script>

<style>
</style>