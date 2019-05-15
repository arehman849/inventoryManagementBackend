const { itemSchema, validateItem } = require("../models/inventoryItems");
const auth = require("../middleware/auth");
const admin = require("../middleware/admin");
const { Router } = require("express");
const router = Router();


router.get('/', async (req, res) => {
    const items = await itemSchema.find();
    res.send(items);
})

router.get('/findById/:id', async (req, res) => {
    const item = await itemSchema.findById(req.params.id);
    if(!item) return res.status(404).send("item with given id not found");
    res.send(item);
})

router.get('/findByAssigned/:assignedTo', async (req, res) => {
    const item = await itemSchema.find({'assignedTo': req.params.assignedTo});
    if(!item) return res.status(404).send("no items found for the given user");
    res.send(item);
})

router.get('/:serialNo', async (req, res) => {
    const item = await itemSchema.find({'serialNo': req.params.serialNo});
    if(!item) return res.status(404).send("item with given serial no not found");
    res.send(item);
})

router.post("/", [auth, admin], async (req, res) => {
    const { error } = validateItem(req.body); 
    if (error) return res.status(400).send(error.details[0].message);

    let item = new itemSchema({
        serialNo: req.body.serialNo,
        itemName: req.body.itemName,
        model: req.body.model,
        assignedTo: req.body.assignedTo,
        condition: req.body.condition
    })

    item = await item.save();
    res.send(item);
})

router.put("/:id", auth, async (req, res) => {
    const {error} = validateItem(req.body)
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

router.delete("/:id", [auth, admin], async (req, res) => {
    const item = await itemSchema.findByIdAndRemove(req.params.id);
    if (!item) return res.status(404).send('The item with the given ID was not found.');
    res.send(item);
})


module.exports = router;