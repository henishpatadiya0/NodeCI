// const mongoose = require('mongoose');
// const User = mongoose.model('User');

let User = require('../../models/User');

module.exports = () => {
    return new User({}).save();
}