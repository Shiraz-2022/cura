const { v2: cloudinary } = require('cloudinary')

cloudinary.config({
    cloud_name: 'dkjwhvkyu',
    api_key: '216472122882582',
    api_secret: 'FQujbNMe7YgqwJCc0ngrJcY0p3M'
})

module.exports = cloudinary