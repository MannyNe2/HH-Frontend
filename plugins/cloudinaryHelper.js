export default function ({ $cloudinary }, inject) {
  const readData = (f) =>
    new Promise((resolve) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result);
      reader.readAsDataURL(f);
    });

  const uploadImage = async (imageFile) => {
    const data = await readData(imageFile);
    const instance = await $cloudinary.upload(data, {
      folder: "Crowdfunding",
      uploadPreset: "cct71sjg",
    });
    return instance.url;
  };

  const cloudinaryHelper = { uploadImage };

  inject("cloudinaryHelper", cloudinaryHelper);
}
