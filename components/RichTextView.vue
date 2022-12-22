<template>
  <!-- <quill-editor
    :content="content"
    :enable="false"
    contentType="html"
    v-on:input="updateText"
    ref="editor"
    :options="options"
  ></quill-editor> -->
  <div class="ql-bubble overflow-auto">
    <div class="ql-editor pa-1" v-html="content"></div>
  </div>
</template>

<script>
import { quillEditor } from "vue-quill-editor";
import "quill/dist/quill.core.css";
import "quill/dist/quill.bubble.css";

export default {
  name: "RichTextView",
  props: {
    content: String,
  },
  components: {
    quillEditor,
  },
  data() {
    return {
      options: {
        modules: {
          toolbar: [],
        },
        placeholder: "",
        readOnly: true,
        enable: false,
        theme: "bubble",
      },
    };
  },
  methods: {
    updateText(newValue) {
      if (newValue) {
        this.$emit("input", newValue);
      }
    },
  },
};
</script>

<style>
</style>