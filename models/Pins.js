var mongoose = require('mongoose');

var PinSchema = mongoose.Schema({
    name: String,
    location: {},
    caption: String,
    pictureGallery: [String],
    confirmed: Boolean,
    confirmedByUsers: [{type: mongoose.Schema.Types.ObjectId, ref: 'User'}],
    yelpFoodTruck: Boolean,
    pinnedFoodTruck: Boolean,
    ctFoodTruck: Boolean
});

module.exports = mongoose.model('Pin', PinSchema);