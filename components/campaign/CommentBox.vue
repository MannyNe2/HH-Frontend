<template>
  <div class="py-5">
    <validation-observer ref="observer" v-slot="{ handleSubmit }">
      <form action="" @submit.prevent="handleSubmit(submit)">
        <validation-provider
          name="Comment"
          :rules="{ required: true, min: 12, max: 2000 }"
        >
          <Editor
            editorClassList="rounded-lg"
            color="paper"
            foregroundColor="foreground"
            v-model="commentText"
            placeholder="Type a comment"
          />
        </validation-provider>
        <div class="d-flex justify-end">
          <v-btn type="submit" :disabled="commentText.length < 12" color="primary"
            >Comment</v-btn
          >
        </div>
      </form>
    </validation-observer>
  </div>
</template>

<script>
import {
  ValidationObserver,
  ValidationProvider,
  setInteractionMode,
  extend,
} from "vee-validate";
import { required, max, min } from "vee-validate/dist/rules";

setInteractionMode("eager");
extend("required", {
  ...required,
  message: "{_field_} pledge cannot be empty",
});
extend("min", {
  ...min,
  message: "{_field_} must be a minimum of {min} characters",
});
extend("max", {
  ...max,
  message: "{_field_} must not be mpre than {max} characters",
});

export default {
  components: {
    ValidationObserver,
    ValidationProvider,
  },
  data() {
    return {
      commentText: "",
    };
  },
  methods: {
    async submit() {
      this.$refs.observer.validate();
      await this.$store.dispatch("campaign/comment", this.commentText);
      this.commentText = ""
    },
  },
};
</script>

<style>
</style>