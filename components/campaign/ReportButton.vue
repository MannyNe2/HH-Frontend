<template>
  <v-dialog
    v-if="
      targetType &&
      (targetType === 'campaign' || targetType === 'comment') &&
      targetId
    "
    class="overflow-auto mx-0 px-0"
    v-model="reportDialog"
    width="500"
  >
    <template v-slot:activator="{ on, attrs }">
      <!-- Small button -->
      <v-tooltip v-if="tooltip" top v-bind="attrs" v-on="on" class="px-2">
        <span>Report</span>
        <template v-slot:activator="{ on, attrs }">
          <v-btn
            @click="openDialog"
            :class="`${activatorClasses}`"
            v-bind="attrs"
            :small="small"
            :x-small="xsmall"
            v-on="on"
            icon
          >
            <v-icon>mdi-flag</v-icon>
          </v-btn>
        </template>
      </v-tooltip>
      <!-- Full button -->
      <v-btn
        v-else
        outlined
        small
        color="error"
        v-bind="attrs"
        v-on="on"
        @click="openDialog"
        :class="`${activatorClasses}`"
      >
        <v-icon left>mdi-flag</v-icon>
        <span class="pl-2">Report</span>
      </v-btn>
    </template>
    <v-card class="px-4 px-sm-8">
      <h1 class="text-h6 text-sm-h5 font-weight-light text-capitalize pt-8">
        Report {{ targetType }}
      </h1>
      <v-divider class="mt-3 mb-8"></v-divider>
      <validation-observer ref="observer" v-slot="{ handleSubmit }">
        <form @submit.prevent="handleSubmit(submit)">
          <div class="">
            <validation-provider
              name="Reason"
              v-slot="{ errors }"
              :rules="{ required: true, max: 120 }"
            >
              <v-text-field
                rounded
                filled
                dense
                v-model="reason"
                placeholder="Reason"
                prepend-icon="mdi-alert"
                :error-messages="errors"
              ></v-text-field>
            </validation-provider>
          </div>
          <div class="d-flex justify-center">
            <slot>
              <div
                style="width: 300px"
                class="text-center pt-4 error--text"
                v-text="submitError"
              ></div>
            </slot>
          </div>
          <div class="text-center pt-8 pb-8">
            <v-btn
              color="error"
              large
              :loading="submitting"
              label="Report"
              type="submit"
            >
              Report</v-btn
            >
          </div>
        </form>
      </validation-observer>
    </v-card>
  </v-dialog>
  <v-icon v-else>mdi-alert</v-icon>
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

setInteractionMode("lazy");
extend("required", {
  ...required,
  message: "{_field_} is required",
});
extend("max", {
  ...max,
  message: "{_field_} may not be greater than {length} characters",
});
export default {
  name: "ReportButton",
  components: {
    ValidationObserver,
    ValidationProvider,
  },
  props: {
    tooltip: { type: Boolean, default: false },
    small: { type: Boolean, default: false },
    xsmall: { type: Boolean, default: false },
    targetType: { type: String, default: undefined },
    targetId: { type: String, default: undefined },
    activatorClasses: { type: String, default: "" },
  },
  computed: {
    ...mapState({
      campaign: (state) => state.campaign.selected,
    }),
  },
  data() {
    return {
      reportDialog: false,
      reason: "",
      submitError: "",
      submitting: false,
    };
  },
  methods: {
    openDialog() {
      // this.reason = "";
      this.reportDialog = true;
    },
    async submit() {
      this.submitting = true;
      this.submitError = "";
      this.$refs.observer.validate();
      if (this.targetType === "campaign") {
        await this.$store.dispatch("campaign/report", this.reason);
        this.reportDialog = false;
      } else if (this.targetType === "comment") {
        await this.$store.dispatch("campaign/reportComment", {
          commentId: this.targetId,
          reason: this.reason,
        });
        this.reportDialog = false;
      } else {
        console.error("Invalid target type");
      }
      this.submitting = false;
    },
  },
};
</script>

<style>
.v-dialog--active {
  overflow: hidden !important;
}
</style>