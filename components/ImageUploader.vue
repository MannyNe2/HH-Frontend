<template>
  <div class="d-flex pa-3 justify-center">
    <div class="d-flex flex-column">
      <div class="d-flex justify-center">
        <v-card elevation="5" class="pa-2">
          <v-img
            :src="thumbnail"
            :lazy-src="uploading ? placeholder : ''"
            :aspect-ratio="aspectRatio"
            :width="width"
            :max-width="width"
            height="auto"
          >
            <template v-slot:placeholder>
              <v-row
                v-if="uploading"
                class="fill-height ma-0"
                align="center"
                justify="center"
              >
                <v-progress-circular
                  indeterminate
                  color="primary"
                ></v-progress-circular
              ></v-row>
              <v-img v-else :src="placeholder"></v-img>
            </template>
          </v-img>
        </v-card>
      </div>
      <div class="d-flex justify-center mt-8">
        <v-file-input
          :rules="rules"
          rounded
          filled
          dense
          truncate-length="10"
          v-model="imageFile"
          label="Upload Image"
          prepend-icon="mdi-camera"
          accept="image/png, image/jpeg, image/bmp, image/gif, image/webp"
          @change="handleFileChange($event)"
        ></v-file-input>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "ImageUploader",
  props: {
    width: Number,
    aspectRatio: Number,
    placeholder: String,
  },
  computed: {},
  data() {
    return {
      thumbnail: null,
      dialog: false,
      imageFile: {},
      rules: [
        (value) =>
          !value ||
          value.size < 5000000 ||
          "Image size should be less than 5 MB!",
      ],
      uploading: false,
    };
  },
  methods: {
    async handleFileChange(event) {
      if (!this.imageFile) {
        return;
      }
      this.thumbnail = "";
      this.uploading = true;
      this.$emit("upload-start");
      this.$notify({
        text: "Uploading image",
        type: "reversebackground reverseforeground--text",
      });
      const url = await this.$cloudinaryHelper.uploadImage(this.imageFile);
      if (url) {
        this.thumbnail = url;
        this.$notify({
          text: "Upload successful",
          type: "reversebackground reverseforeground--text",
        });
      } else {
        this.$notify({
          text: "Upload failed",
          type: "reversebackground reverseforeground--text",
        });
      }
      this.$emit("upload-end", url);
      this.uploading = false;
    },
  },
};
</script>

<style>
</style>