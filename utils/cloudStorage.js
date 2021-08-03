const cloudinary = require('cloudinary').v2
const streamifier = require('streamifier')
cloudinary.config({
    cloud_name: 'dhbc009wq',
    api_key: '851879458196736',
    api_secret: 'Vg77l60OMf0rxtIVBf1lGMPolXI'
});

module.exports = {
    cloudinary,
    streamifier
}