const joi = require("joi");
const { model, Schema }  = require("mongoose");
const jwt = require('jsonwebtoken');
const config = require('config');

const userSchema = new Schema({
    empId: {
        type: String,
        required: true,
        minlength: 5,
        maxlength: 25,
        unique: true
    },
    empName: {
        type: String,
        required: true,
        minlength: 3,
        maxlength: 30
    },
    empDesk: {
        type: String,
        minlength: 3,
        maxlength: 25
    },
    isAdmin: {
        type: Boolean,
        default: false,
        required: true
    },
    password: {
        type: String,
        required: true,
        minlength: 5,
        maxlength: 1024
    }
})

userSchema.methods.generateAuthToken = function () {
    let obj = {
        id: this._id,
        isAdmin: this.isAdmin
    }
    return jwt.sign(obj, config.get("jwtPrivateKey"))
}

const user = model('User', userSchema);

const validateUser = (user) => {
    const schema = {
        empId: joi.string().min(5).max(25).required(),
        empName: joi.string().min(3).max(30).required(),
        empDesk: joi.string().min(3).max(25).required(),
        password: joi.string().min(5).max(255).required(),
        isAdmin: joi.bool().required()
    }
    return joi.validate(user, schema)
}

exports.validateUser= validateUser;
exports.userSchema = user;