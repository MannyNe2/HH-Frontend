<template>
  <div
    class="
      rounded-lg
      paper
      d-flex
      justify-space-between
      elevation-5
      align-center
      py-0
      px-5
    "
  >
    <h5 class="text-h5 font-weight-bold hidden-sm-and-down">Action</h5>
    <div class="d-flex align-center">
      <v-select
        v-model="selected"
        v-if="campaigns === 'campaign'"
        :items="campaign"
        label="Choice"
        dense
        class="mt-5"
        rounded
        filled
      ></v-select>
      <v-select
        v-model="selected"
        v-else
        :items="comment"
        label="Choice"
        class="mt-5"
        rounded
        filled
        dense
      ></v-select>

      <div class="text-center">
        <v-dialog v-model="dialog" width="500" v-if="selected !== 'Do Nothing' && campaigns ==='campaign'">
          <template v-slot:activator="{ on, attrs }">
            <v-btn
              :disabled="selected === ''"
              color="primary"
              class="ml-5"
              v-bind="attrs"
              v-on="on"
            >
              Confirm
            </v-btn>
          </template>
          <v-card>
            <v-card-title class="text-h5 grey lighten-2">
              Authorization
            </v-card-title>
            <v-card-text class="pt-4">
              <h3 class="text-h5 font-weight-light">Password Form</h3>
              <v-divider class="mb-3"></v-divider>
              <div class="mt-9">
                <validation-observer ref="observer" v-slot="{ handleSubmit }">
                  <form @submit.prevent="handleSubmit(act(campaigns))">
                    <validation-provider
                      name="Admin password"
                      v-slot="{ errors }"
                      :rules="{ required: true }"
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
                        class="mx-7"
                      ></v-text-field>
                    </validation-provider>
                    <div
                      class="
                        mx-7
                        d-flex
                        flex-column
                        justify-center
                        align-center
                      "
                    >
                      <v-btn
                        color="primary"
                        large
                        :loading="submitting"
                        label="Create an Account"
                        type="submit"
                        class="mx-"
                      >
                        <v-icon left> mdi-check </v-icon>
                        Confirm
                      </v-btn>
                    </div>
                  </form>
                </validation-observer>
              </div>
            </v-card-text>
          </v-card>
        </v-dialog>
        <v-btn v-else :disabled="selected === ''" color="primary" class="ml-5" @click="act(campaigns)">
          confirm
        </v-btn>
      </div>
    </div>
  </div>
</template>

<script>
import {
  extend,
  ValidationProvider,
  ValidationObserver,
  setInteractionMode,
} from "vee-validate";
import { required } from "vee-validate/dist/rules";

setInteractionMode("eager");
extend("required", {
  ...required,
  message: "{_field_} is required",
});

export default {
  middleware: "isAdmin",
  components: {
    ValidationProvider,
    ValidationObserver,
  },
  props: {
    campaigns: String,
  },
  data: () => ({
    selected: "",
    adminPassword: "",
    campaign: ["Stop Campaign", "Stop Campaign and Ban Creator", "Do Nothing"],
    comment: ["Ban User", "Mute User", "Do Nothing"],
    dialog: false,
    submitting: false,
  }),
  methods: {
    act(typeText) {
      this.submitting = true;
      if(this.$refs.observer){
        this.$refs.observer.validate();
      }
      if (typeText === "campaign") {
        this.$store.commit("report/setTempAdminPass", this.adminPassword);
        if (this.selected === "Stop Campaign") {
          this.$store.dispatch("report/stopCampaign");
        } else if (this.selected === "Stop Campaign and Ban Creator") {
          this.$store.dispatch("report/stopCampaignAndBan");
        } else if (this.selected === "Do Nothing") {
          this.$store.dispatch("report/doNothingCa");
        } else {
          console.log("error: from campaign");
        }
        this.$store.commit("report/setTempAdminPass", "");
      } else if (typeText === "comment") {
        this.$store.commit("report/setTempAdminPass", this.adminPassword);
        if (this.selected === "Ban User") {
          this.$store.dispatch("report/banUser");
        } else if (this.selected === "Mute User") {
          this.$store.dispatch("report/muteUser");
        } else if (this.selected === "Do Nothing") {
          this.$store.dispatch("report/doNothingCo");
        } else {
          console.log("error: from comment");
        }
        this.$store.commit("report/setTempAdminPass", "");
      } else {
        console.log("No Type!");
      }
      this.submitting = false;
    },
  },
};
</script>