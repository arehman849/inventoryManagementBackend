const { userSchema, validateUser } = require("../models/users");
const auth = require("../middleware/auth");
const admin = require("../middleware/admin");
const { Router } = require("express");
const _ = require("lodash");
const bcrypt = require("bcrypt");
const router = Router();

router.get("/", async (req, res) => {
    const users = await userSchema.find();
    res.send(users);
})

router.get("/:empId", async (req, res) => {
    const user = await userSchema.find({"empId": req.params.empId});
    if(!user) return res.status(404).send("user with given id was not found");
    res.send(user);
})

router.get('/me', auth, async(req, res) => {
    const user = await userSchema.findById(req.user._id).select('-password');
    res.send(user);
})


router.post("/", async (req, res) => {
    const { error } = validateUser(req.body); 
    if (error) return res.status(400).send(error.details[0].message);
    let user = await userSchema.findOne({empId: req.body.empId});

    if (user) return res.status(400).send("User already registered");
    user = new userSchema(_.pick(req.body, ["empId", "empName", "empDesk", "password", "isAdmin"]));
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(user.password, salt);

    await user.save();
    res.header('x-auth-token', user.generateAuthToken())
        .send(_.pick(user, ["_id", "empId", "empName", "empDesk"]));
})

router.put("/:id", auth, async(req, res) => {
    const {error} = validateUser(req.body)
    if (error) return res.status(400).send(error.details[0].message);

    let item = await itemSchema.findByIdAndUpdate(req.params.id, {
        serialNo: req.body.serialNo,
        itemName: req.body.itemName,
        model: req.body.model,
        assignedTo: req.body.assignedTo,
        condition: req.body.condition
    }, {new: true})

    if (!item) return res.status(404).send('The item with the given ID was not found.');
    res.send(item);
})

router.delete("/:id", [auth, admin], async(req, res) => {
    const user = await userSchema.findByIdAndRemove(req.params.id);
    if (!user) return res.status(404).send('The user with the given ID was not found.');
    res.send(user);
})

module.exports = router;