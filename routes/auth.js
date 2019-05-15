const joi = require("joi");
const { userSchema } = require("../models/users");
const { Router } = require("express");
const _ = require("lodash");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const config = require("config");
const router = Router();

router.post("/", async (req, res) => {
    const { error } = validateUser(req.body); 
    if (error) return res.status(400).send(error.details[0].message);
    let user = await userSchema.findOne({empId: req.body.empId});
    if (!user) return res.status(400).send("Invalid email or password");
    console.log(user);
    const validPassword = await bcrypt.compare(req.body.password, user.password);
    if(!validPassword) return res.status(400).send("Invalid email or password");

    const token = user.generateAuthToken()

    res.send(token);
})

const validateUser = (user) => {
    const schema = {
        empId: joi.string().min(5).max(25).required(),
        password: joi.string().min(5).max(255).required()
    }
    return joi.validate(user, schema)
}

module.exports = router;