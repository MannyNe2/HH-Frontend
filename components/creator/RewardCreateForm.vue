<template>
  <div>
    <div class="warning-banner">
      <v-banner
        color="warning black--text text-center pr-4 d-flex justify-center"
      >
        <div class="">
          <h5 class="font-weight-bold text-subtitle-1 text-uppercase">
            Warning
          </h5>
          <span class="text-justify">
            In order to protect our community and prevent scams and rug-pulls,
            we have made it so that rewards cannot be deleted or modified after
            they've been created. Please be very careful about the promises you
            make. For any mistakes during creation, you will need to contact the
            administrators.
          </span>
        </div>
      </v-banner>
    </div>
    <v-card class="pa-5">
      <h3 class="text-h5 font-weight-light">Add Reward</h3>
      <v-divider class="mt-3 mb-8"></v-divider>
      <validation-observer ref="observer" v-slot="{ handleSubmit }">
        <form @submit.prevent="handleSubmit(submit)">
          <validation-provider
            name="Title"
            v-slot="{ errors }"
            :rules="{ required: true, max: 50 }"
          >
            <v-text-field
              rounded
              filled
              dense
              placeholder="Title"
              prepend-icon="mdi-cursor-text"
              v-model="title"
              :error-messages="errors"
            ></v-text-field>
          </validation-provider>

          <validation-provider
            name="Description"
            v-slot="{ errors }"
            :rules="{ required: true, max: 100 }"
          >
            <v-text-field
              rounded
              filled
              dense
              placeholder="Description"
              prepend-icon="mdi-image-text"
              v-model="description"
              :error-messages="errors"
            ></v-text-field>
          </validation-provider>

          <validation-provider
            name="Minimum Pledge"
            v-slot="{ errors }"
            :rules="{
              required: true,
              max: 10,
              min_value: 1,
              max_value: campaign.goal,
              numeric: true,
            }"
          >
            <v-text-field
              rounded
              filled
              dense
              placeholder="Minimum Pledge"
              prepend-icon="mdi-cash"
              v-model="minPledge"
              :error-messages="errors"
            ></v-text-field>
          </validation-provider>

          <v-menu
            ref="datePickerMenu"
            v-model="datePickerMenu"
            :close-on-content-click="false"
            transition="scale-transition"
            offset-y
            max-width="290px"
            min-width="auto"
          >
            <template v-slot:activator="{ on, attrs }">
              <validation-provider
                name="Estimated Delivery Date"
                v-slot="{ errors }"
                :rules="{ required: true }"
              >
                <v-text-field
                  rounded
                  filled
                  dense
                  v-model="estimatedDeliveryDate"
                  placeholder="Estimated Delivery Date"
                  persistent-hint
                  prepend-icon="mdi-calendar"
                  readonly
                  v-bind="attrs"
                  v-on="on"
                  :error-messages="errors"
                ></v-text-field>
              </validation-provider>
            </template>
            <v-date-picker
              v-model="estimatedDeliveryDate"
              no-title
              @input="datePickerMenu = false"
            ></v-date-picker>
          </v-menu>

          <validation-provider
            name="Reward Type"
            v-slot="{ errors }"
            :rules="{ required: true }"
          >
            <v-select
              rounded
              filled
              dense
              v-model="typeSelection"
              :items="typeItems"
              label="Type"
              prepend-icon="mdi-gift"
              placeholder="Reward Type"
              :error-messages="errors"
            ></v-select>
          </validation-provider>

          <div class="d-flex justify-center">
            <slot>
              <div
                style="width: 300px"
                class="text-center pt-2 error--text"
                v-text="submitError"
              ></div>
            </slot>
          </div>

          <div class="d-flex justify-center mt-5">
            <v-btn large type="submit" color="primary">Save</v-btn>
          </div>
        </form>
      </validation-observer>
    </v-card>
  </div>
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
import { mapState } from "vuex";

setInteractionMode("eager");
extend("required", {
  ...required,
  message: "{_field_} is required",
});
extend("max", {
  ...max,
  message: "{_field_} may not be greater than {length} characters",
});
extend("numeric", {
  ...numeric,
  message:
    "{_field_} must be numeric. Please remove any non-numeric characters",
});
extend("min_value", {
  ...min_value,
  message: "{_field_} can not be below {min} Br",
});
extend("max_value", {
  ...max_value,
  message: "{_field_} can not be more than {max} Br",
});

export default {
  name: "RewardCreateForm",
  components: {
    ValidationProvider,
    ValidationObserver,
  },
  data() {
    return {
      minPledge: "",
      title: "",
      description: "",
      estimatedDeliveryDate: "",
      typeSelection: "Digital Goods",
      typeItems: ["Digital Goods", "Physical Goods"],
      datePickerMenu: false,
      submitting: false,
      submitError: "",
    };
  },
  computed: {
    ...mapState({
      campaign: (state) => state.campaign.selected,
    }),
  },
  methods: {
    async submit() {
      this.submitting = true;
      this.submitError = "";
      this.$refs.observer.validate();
      if (Date.parse(this.estimatedDeliveryDate) <= Date.now()) {
        this.submitError = "Deadline must be after the current date";
        this.submitting = false;
        return;
      }
      const actionEnded = await this.$store.dispatch("campaign/addReward", {
        campaignId: this.campaign.id,
        title: this.title,
        description: this.description,
        estimatedDeliveryDate: this.estimatedDeliveryDate,
        rewardType:
          this.typeSelection === "Digital Goods" ? "digital" : "physical",
        minPledge: this.minPledge,
      });
      if (!!actionEnded) {
        this.submitting = false;
        this.$emit("close-create-reward-dialog");
      }
    },
  },
};
</script>

<style>
</style>