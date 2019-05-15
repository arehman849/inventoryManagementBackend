const joi = require("joi");
const { model, Schema }  = require("mongoose");

const item = model("Item", new Schema ({
        serialNo: {
            type: String,
            required: true,
            minlength: 5,
            maxlength: 25
        },
        itemName: {
            type: String,
            required: true,
            minlength: 2,
            maxlength: 25
        },
        model: {
            type: String,
            required: true,
            minlength: 3,
            maxlength: 25
        },
        assignedTo: {
            type: String,
            required: true,
            minlength: 5
        },
        condition: {
            type: String,
            required: true,
        }
    }) 
)

const validateItem = (item) => {
    const schema = {
        serialNo: joi.string().min(5).max(25).required(),
        itemName: joi.string().min(2).max(25).required(),
        model: joi.string().min(3).max(25).required(),
        assignedTo: joi.string().min(5).required(),
        condition: joi.string().required()
    }
    return joi.validate(item, schema)
}

exports.validateItem = validateItem;
exports.itemSchema = item;