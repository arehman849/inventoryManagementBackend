const { Router } = require("express");
const router = Router();
const { assign, validate } = require("../models/assign");
const auth = require('../middleware/auth');

router.get("/:itemId", (req, res) => {
    const itemHistory = await assign.find({'itemId': req.params.itemId});
    if(!itemHistory) return res.status(404).send("item history for the given item id is not found");
    res.send(itemHistory);
})

router.post("/", auth, (req, res) => {
    const { error } = validate(req.body);
    if(error) return res.status(400).send(error.details[0].message);

    let itemHistory = new assign({
        assignee: req.body.assignee,
        assignor: req.body.assignor,
        itemId: req.body.itemId
    })

    itemHistory = await itemHistory.save()
    res.send(itemHistory);
})