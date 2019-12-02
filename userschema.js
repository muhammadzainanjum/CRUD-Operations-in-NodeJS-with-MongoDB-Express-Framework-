const mongoose = require('mongoose');
var userSchema = new mongoose.Schema({
    firstname: {
        type: String,
        required: "This field is required"
    },
    lastname: {
        type: String,
        required: "This field is required"
    },
    email: {
        type: String
    },
    password: {
        type: String,
        required: "This field is required"
    },
    gender: {
        type: String,
        required: true
    },
    dateofbirth: {
        type: Date,
        required: true
    }
});
userSchema.path('email').validate((val) => {
    var emailRegex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    return emailRegex.test(val);
}, "Invalid Email Entered!");
var model = mongoose.model('user', userSchema);
module.exports = model;