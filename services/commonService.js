cloudStorage = require('../utils/cloudStorage')


function imageValidator(image) {
    if (image.mimetype == "image/png" || image.mimetype == "image/jpg" || image.mimetype == "image/jpeg") {
        return true;
    } else {
        return false;
    }
}
module.exports = {
    ImageUploader: function (image) {
        let streamUploader = function (image) {
            console.log(image);
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
    },
   
    validateImage: function (images) {
        var isValidImage = true
        if (images.length == undefined) {// number of uploaded image is 1
            isValidImage = imageValidator(images)
        }
        else {
            for (let i = 0; i < images.length; i++) {
                isValidImage = imageValidator(images[i])
                if (!isValidImage)
                    break
            }
        }
        return isValidImage
    },

    validateNumberOfFiles: function (files){
        if(files.length != undefined){
            if(files.length > 5)
                return false;
            return true;
        }
    }

}