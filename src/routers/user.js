const express = require('express')
const router = new express.Router()
const User = require('../models/user')

//Users
router.get("/users", async(req, res) => {
    try {

        const users = await User.find({})
        if (!users) {
            return res.status(404).send()
        }
        res.send(users)
    } catch (e) {
        res.status(500).send(e)
    }
});

router.get("/users/:id", async(req, res) => {
    const _id = req.params.id;

    try {
        const user = await User.findById(_id)
        if (!user) {
            return res.status(400).send();
        }
        res.send(user)
    } catch (e) {
        res.status(500).send(e)
    }
});

router.post("/users", async(req, res) => {
    const user = new User(req.body);
    try {
        await user.save()
        res.status(201).send(user)
    } catch (e) {
        res.status(400).send(e)
    }
});

router.patch('/users/:id', async(req, res) => {
    const updates = Object.keys(req.body)
    const allowedUpdates = ['name', 'age', 'email', 'password']
    const isValidOperation = updates.every((update) => allowedUpdates.includes(update))
    console.log(updates, isValidOperation);
    if (!isValidOperation) {
        return res.status(400).send({ error: "Invalid Updates!" })
    }
    try {
        //const user = await User.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true })
        const user = await User.findById(req.params.id)
        updates.forEach((update) => user[update] = req.body[update])
        await user.save()
        if (!user) {
            return res.status(404).send();
        }
        res.send(user)
    } catch (e) {
        res.status(400).send(e)
    }
})

router.delete('/users/:id', async(req, res) => {

    try {
        const user = await User.findByIdAndDelete(req.params.id)
        if (!user) {
            return res.status(404).send()
        }
        res.send(user)
    } catch (e) {
        res.status(400).send(e)
    }
})

router.post('/users/login', async(req, res) => {
    try {
        console.log(req.body.email, req.body.password)
        const user = await User.findByCredentials(req.body.email, req.body.password)
        const token = await User.generateAuthToken()
        console.log({ user, token })
        if (!user) {
            res.status(404).send({ error: "Can't login!" })
        }
        res.send({ user, token })
    } catch (e) {
        res.status(400).send({ "error": e })
    }
})

module.exports = router