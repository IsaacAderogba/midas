const cloudinary = require("cloudinary");

const cloudinaryUpload = async ({ stream, public_id }) => {
  try {
    return await new Promise((resolve, reject) => {
      const streamLoad = cloudinary.v2.uploader.upload_stream(
        {
          public_id,
          width: 100,
          quality: "auto",
          fetch_format: "auto",
          crop: "scale",
        },
        (error, result) => {
          if (result) {
            resolve(result);
          } else {
            reject(error);
          }
        }
      );

      stream.pipe(streamLoad);
    });
  } catch (err) {
    throw new Error(`Failed to upload profile picture ! Err:${err.message}`);
  }
};

module.exports = {
  cloudinaryUpload,
};
