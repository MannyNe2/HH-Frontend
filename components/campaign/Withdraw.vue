<template>
  <v-card class="" v-if="campaign && campaign.is_ended">
    <h3 class="text-subtitle-1 text-sm-h5">Wiithdrawal Request Confirmation</h3>
    <v-divider class="mt-3 mb-5"></v-divider>
    <div class="" v-if="campaignLoaded">
      <v-banner color="warning" class="black--text mb-5 text-center">
        You are requesting withdrawal of the pledged funds for the campaign.
        <br />
        This action cannot be undone
      </v-banner>
      <h5 class="text-subtitle-2 font-weight-bold py-2">Selected campaign:</h5>
      <CampaignMini class="mb-8" :campaign="campaign" />
      <validation-observer ref="observer" v-slot="{ handleSubmit }">
        <form @submit.prevent="handleSubmit(submit)">
          <div class="">
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
              color="primary"
              large
              :loading="submitting"
              label="Confirm"
              type="submit"
            >
              <v-icon>mdi-check</v-icon>
              <span class="pl-2">Confirm</span>
            </v-btn>
            <div class="d-flex justify-center pt-8">
              <NuxtLink to="/creator">Go back</NuxtLink>
            </div>
          </div>
        </form>
      </validation-observer>
    </div>
    <h3 class="text-h5 text-center py-5 error--text" v-else>
      Campaign not defined
    </h3>
  </v-card>
  <v-card v-else>
    <h3 class="text-h5 text-center">Campaign cannot be withdrawn from</h3>
    <div class="d-flex justify-center pt-8">
      <NuxtLink to="/creator">Go back</NuxtLink>
    </div>
  </v-card>
</template>

<script>
import CampaignMini from "~/components/search/CampaignItem.vue";
import {
  extend,
  setInteractionMode,
  ValidationObserver,
  ValidationProvider,
} from "vee-validate";
import { required, max } from "vee-validate/dist/rules";
import { getCampaign } from "~/queries/campaign/getCampaign.gql";
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

export default {
  name: "WithdrawalRequestDialog",
  apollo: {
    campaign_by_pk: {
      query: getCampaign,
      variables() {
        return {
          campaignId: this.campaignId,
        };
      },
      result({ data }) {
        try {
          this.$store.commit("campaign/setCampaign", data.campaign_by_pk);
          this.campaignLoaded = true;
        } catch (err) {
          console.log(err);
          this.$nuxt.error({ statusCode: 404, message: "Campaign not found" });
        }
      },
      skip() {
        return !this.campaignId;
      },
      fetchPolicy: "no-cache",
    },
  },
  components: {
    ValidationObserver,
    ValidationProvider,
    CampaignMini,
  },
  props: {
    campaignId: { type: String, default: undefined },
  },
  computed: {
    ...mapState({
      campaign: (state) => state.campaign.selected,
    }),
  },
  data() {
    return {
      campaignLoaded: false,
      password: "",
      submitting: false,
      submitError: "",
    };
  },
  methods: {
    async submit() {
      this.submitting = true;
      this.$refs.observer.validate();
      try {
        const result = await this.$store.dispatch(
          "campaign/requestWithdrawal",
          this.password
        );
        if (result) {
        } else {
        }
      } catch (err) {
        console.log(err);
      }
      this.submitting = false;
    },
  },
};
</script>

<style>
</style>