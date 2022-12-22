<template>
  <div>
    <div class="d-flex align-start">
      <v-icon class="pa-1">{{ prependIcon }}</v-icon>
      <div class="col overflow-x-auto pa-0 pl-1">
        <quill-editor
          :class="`${editorClassList} ${theme} ${color ? color : ''} editor`"
          style="min-height: 250px"
          v-bind:value="value"
          v-on:input="updateText"
          ref="editor"
          :options="options"
        ></quill-editor>
      </div>
    </div>
    <div
      class="
        d-flex
        flex-column-reverse flex-md-row
        ml-8
        text-caption
        grey--text
        py-1
        px-5
      "
    >
      <div
        v-if="errorMessages && errorMessages.length > 0"
        class="col pa-0 mt-3 mt-sm-0 text-center text-lg-left error--text"
      >
        {{ errorMessages[0] }}
      </div>
      <div
        v-if="showHint"
        class="col pa-0 font-italic font-weight-thin text-right"
      >
        Highlight text to show editor toolbar
      </div>
    </div>
  </div>
</template>

<script>
import { quillEditor } from "vue-quill-editor";
import Quill from "quill";
import "quill/dist/quill.core.css";
import "quill/dist/quill.snow.css";
import ImageCompress from "quill-image-compress";

Quill.register("modules/imageCompress", ImageCompress);

var toolbarOptions = [
  [{ font: [] }],
  [{ header: [1, 2, 3, 4, 5, 6, false] }],
  [{ size: ["small", false, "large", "huge"] }], // custom dropdown
  [{ align: [] }],

  ["bold", "italic", "underline", "strike"], // toggled buttons
  [{ color: [] }, { background: [] }],
  ["blockquote", "code-block", "link", "image"],

  [{ list: "ordered" }, { list: "bullet" }],
  [{ script: "sub" }, { script: "super" }], // superscript/subscript
  [{ indent: "-1" }, { indent: "+1" }], // outdent/indent
  [{ direction: "rtl" }], // text direction
];
var toolbarOptionsNoImage = [
  [{ font: [] }],
  [{ header: [1, 2, 3, 4, 5, 6, false] }],
  [{ size: ["small", false, "large", "huge"] }], // custom dropdown
  [{ align: [] }],

  ["bold", "italic", "underline", "strike"], // toggled buttons
  [{ color: [] }, { background: [] }],
  ["blockquote", "code-block", "link"],

  [{ list: "ordered" }, { list: "bullet" }],
  [{ script: "sub" }, { script: "super" }], // superscript/subscript
  [{ indent: "-1" }, { indent: "+1" }], // outdent/indent
  [{ direction: "rtl" }], // text direction
];

export default {
  props: {
    value: { type: String, default: null },
    placeholder: { type: String, default: "" },
    prependIcon: String,
    editorClassList: String,
    showHint: { type: Boolean, default: false },
    errorMessages: Array,
    color: { type: String, default: null },
    foregroundColor: { type: String, default: null },
    enableImages: { type: Boolean, default: false },
  },
  components: {
    quillEditor,
  },
  computed: {
    theme() {
      let themeClass = "";
      themeClass += this.$vuetify.theme.isDark
        ? "editor-dark "
        : "editor-light ";
      themeClass += this.foregroundColor ? `${this.foregroundColor}--text` : "";
      return themeClass;
    },
  },
  data() {
    return {
      options: {
        modules: {
          imageCompress: {},
          toolbar: this.enableImages ? toolbarOptions : toolbarOptionsNoImage,
        },
        placeholder: this.placeholder,
        // readOnly: this.readOnly ? this.readOnly : false,
        theme: "snow",
      },
    };
  },
  methods: {
    updateText(newValue) {
      this.$emit("input", newValue);
    },
  },
};
</script>

<style>
.editor {
  transition: 0.3s;
}
.ql-container,
.ql-toolbar {
  border: none !important;
}
.ql-editor.ql-blank::before {
  font-size: 16px;
}

.editor-light .ql-container .ql-editor.ql-blank::before {
  color: rgba(0, 0, 0, 0.6);
}
.editor-light {
  background-color: #f0f0f0;
}
.editor-dark {
  background-color: #303030;
}
.editor-dark .ql-container .ql-editor.ql-blank::before {
  color: rgba(255, 255, 255, 0.6);
}
.editor-dark .ql-snow .ql-picker {
  color: rgba(255, 255, 255, 0.8);
}
.editor-dark .ql-picker-item {
  color: black;
}
.editor-dark .ql-snow .ql-stroke {
  stroke: rgba(255, 255, 255, 0.5);
}
.editor-dark .ql-snow .ql-fill {
  fill: rgba(255, 255, 255, 0.5);
}
</style>