cloudStorage = require('../utils/cloudStorage')
const knex = require('../utils/dbConnection')

function imageValidator(image) {
    if (image.mimetype == "image/png" || image.mimetype == "image/jpg" || image.mimetype == "image/jpeg") {
        return true;
    } else {
        return false;
    }
}

function validateImage(images) {
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
}

function validateNumberOfFiles(files) {
    if (files.length != undefined) {
        if (files.length > 5)
            return false;
        return true;
    }
    else if (typeof files == 'object') {
        return true;
    }
    return false;
}

module.exports = {
    ImageUploader: function (image, dependentID, type, oldImageLink, callback) {
        let streamUploader = function (image) {
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
            if (type === 'insert') {
                await knex('tbl_product_images').insert({
                    prod_img_product_id: dependentID,
                    prod_img_data: result.url
                })
            }
            else if (type === 'update') {
                await knex('tbl_product_images')
                    .where('prod_img_data', oldImageLink)
                    .update({
                        prod_img_data: result.url
                    })
            }
        }

        upload(image);
    },
    deleteImage: function (image) {
        //seperate image url to a single string of iamge name
        image = image.split('/')
        image = image[image.length - 1].split(".")
        image = image[0]
        //delete image on cloud
        cloudStorage.cloudinary.api.delete_resources([image, ''], function (error, result) { });
    },
    validateValidImage: function (images) {
        var errorMessage = ''
        if (images == null) {
            errorMessage = errorMessage + ' Product needs to contain image!'
        }
        else {
            var images = images.image

            var isValidImage = validateImage(images)

            var isValidNumberOfFile = validateNumberOfFiles(images)

            if (!isValidImage)
                errorMessage = errorMessage + " Invalid image!"
            if (!isValidNumberOfFile)
                errorMessage = errorMessage + " Invalid number of files!"
        }
        return errorMessage
    },

    getImage: function (images) {
        return images.image
    },

    getImageLength: function (images) {
        if (images.length == undefined) {// number of uploaded image is 1
            return 1;
        }
        else {
            var count = 0;
            for (let i = 0; i < images.length; i++) {
                count++;
            }
            return count;
        }
    }
}