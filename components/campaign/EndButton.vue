<template>
  <v-dialog
    class="overflow-auto mx-0 px-0"
    v-model="endCampaignDialog"
    width="500"
  >
    <template v-slot:activator="{ on, attrs }">
      <v-tooltip v-if="mode === 'dash'" top class="px-2">
        <span>End</span>
        <template v-slot:activator="{ on, attrs }">
          <v-btn
            @click="endCampaignDialog = true"
            class="mx-2"
            color="reverseforeground"
            v-bind="attrs"
            v-on="on"
            icon
            small
          >
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </template>
      </v-tooltip>
      <v-btn
        v-else
        color="error"
        v-bind="attrs"
        v-on="on"
        @click="endCampaignDialog = true"
        class="mt-3 mt-sm-0"
      >
        <v-icon>mdi-alert-circle</v-icon>
        <span class="pl-2">End Campaign</span>
      </v-btn>
    </template>
    <v-card class="px-4 px-sm-8">
      <h1 class="text-h6 text-sm-h5 font-weight-light pt-8">End Campaign</h1>
      <div
        class="
          text-body-2 text-sm-subtitle-1
          font-weight-light
          text-center
          black--text
          pa-1
          mt-5
          mb-8
          warning
        "
      >
        <span class="text-uppercase font-weight-bold">Warning:</span
        ><span class="pl-3">This action cannot be undone</span>
      </div>
      <validation-observer ref="observer" v-slot="{ handleSubmit }">
        <form @submit.prevent="handleSubmit(submit)">
          <div class="">
            <validation-provider
              v-slot="{ errors }"
              name="Status"
              :rules="{ required: true }"
            >
              <v-select
                class="text-capitalize"
                rounded
                filled
                dense
                v-model="endStatus"
                :items="endStatusOptions"
                :error-messages="errors"
                placeholder="Status"
                prepend-icon="mdi-information"
                required
              ></v-select>
            </validation-provider>
            <validation-provider
              name="Password"
              v-slot="{ errors }"
              :rules="{ required: true, max: 50 }"
            >
              <v-text-field
                rounded
                filled
                dense
                v-model="password"
                placeholder="Password"
                prepend-icon="mdi-key"
                type="password"
                :error-messages="errors"
                required
              ></v-text-field>
            </validation-provider>
          </div>
          <slot>
            <div
              style="width: 300px"
              class="text-center pt-4 error--text"
              v-text="submitError"
            ></div>
          </slot>
          <div class="text-center pt-8 pb-8">
            <v-btn
              color="error"
              large
              :loading="submitting"
              label="Save Changes"
              type="submit"
            >
              <v-icon>mdi-check</v-icon>
              <span class="pl-2">Confirm</span></v-btn
            >
          </div>
        </form>
      </validation-observer>
    </v-card>
  </v-dialog>
</template>

<script>
import { mapState } from "vuex";
import {
  extend,
  setInteractionMode,
  ValidationObserver,
  ValidationProvider,
} from "vee-validate";
import { required, max } from "vee-validate/dist/rules";

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
  components: {
    ValidationObserver,
    ValidationProvider,
  },
  props: {
    mode: { type: String, default: "regular" },
  },
  computed: {
    isGoalMet() {
      return this.campaignTotalPledged >= this.campaignGoal;
    },
    ...mapState({
      campaignGoal: (state) => state.campaign.selected.goal,
      campaignTotalPledged: (state) => state.campaign.stats.totalPledged,
    }),
  },
  data() {
    return {
      endCampaignDialog: false,
      endStatus: "", // this.isGoalMet ? "successful" : "failed",
      endStatusOptions: require("~/assets/endStatusOptions.json")
        .endStatusOptions,
      password: "",
      submitError: "",
      submitting: false,
    };
  },
  methods: {
    submit() {
      // console.log(this.password)
      this.$store.dispatch("campaign/end", {
        status: this.endStatus,
        password: this.password,
      });
    },
  },
};
</script>

<style>
.v-dialog--active {
  overflow: hidden !important;
}
</style>