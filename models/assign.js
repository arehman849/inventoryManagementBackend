const joi = require("joi");
const { model, Schema }  = require("mongoose");

exports.assign = model(new Schema({
    assignee:{
        type: String,
        required: true,
        minlength: 15,
        maxlength: 255
    },
    assignor: {
        type: String,
        required: true,
        minlength: 15,
        maxlength: 255
    },
    date: {
        type: Date,
        default: Date.now
    },
    itemId: {
        type: String,
        required: true,
        minlength: 15,
        maxlength: 255
    }
}))

exports.validate = (assignObj) => {
    const schema = {
        assignee: joi.string().min(5).max(25).required(),
        assignor: joi.string().min(3).max(30).required(),
        date: joi.string().min(3).max(25).required(),
        itemId: joi.string().min(5).max(255).required()
    }
    return joi.validate(assignObj, schema)
}