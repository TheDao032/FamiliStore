const cloudinary = require('cloudinary').v2
const streamifier = require('streamifier')
const env = require('../environments/environment')
cloudinary.config({
    cloud_name: env.CLOUDINARY_CLOUD_NAME,
    api_key: env.CLOUDINARY_API_KEY,
    api_secret: env.CLOUDINARY_API_SECRET
});

module.exports = {
    cloudinary,
    streamifier
}