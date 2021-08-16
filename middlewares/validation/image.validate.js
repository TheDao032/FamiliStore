const imageValidator = (image) => {
    if (image.mimetype === "image/png" || image.mimetype === "image/jpg" || image.mimetype === "image/jpeg") {
        return true;
    } else {
        return false;
    }
}

const validateImage = (images) => {
    var isValidImage = true
    if (images.length === undefined) {// number of uploaded image is 1
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

const  validateNumberOfFiles = (files) => {
    if (files.length !== undefined) {
        if (files.length > 5)
            return false;
    }
    return true;
}

const validateValidImage = (images) => {
    var errorMessage = ''

    if (images === null) {
        errorMessage = errorMessage + ' Product needs to contain image!'
    } else {
        var images = images.image

        var isValidImage = validateImage(images)

        var isValidNumberOfFile = validateNumberOfFiles(images)
        console.log('test')
        if (!isValidImage)
            errorMessage = errorMessage + " Invalid image!"
        if (!isValidNumberOfFile)
            errorMessage = errorMessage + " Invalid number of files, user can upload maximum 5 images for each product!"
    }
    return errorMessage
}

module.exports = {
    validateValidImage
}