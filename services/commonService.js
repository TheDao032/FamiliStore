cloudStorage = require('../utils/cloudStorage')

module.exports = {
    ImageUploader: function (image) {
        let streamUploader = function (image) {
            console.log(process.env.CLOUDINARY_CLOUD_NAME)
            return new Promise(function (resolve, reject) {
                let stream = cloudStorage.cloudinary.uploader.upload_stream(
                    function (error, result) {
                        if (result) {
                            resolve(result);
                        } else {
                            reject(error);
                        }
                    }
                );
                cloudStorage.streamifier.createReadStream(image.data).pipe(stream);
            });
        };

        async function upload(image) {
            let result = await streamUploader(image);
            console.log(result.url);
        }

        upload(image);
    }

}