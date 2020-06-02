const express = require('express')
const User = require('../models/user')
const router = new express.Router()

router.post('/users' , async (req, res) => {

    const user = new User(req.body)
    try {
        await user.save()
        res.status(201).send(user)
    } catch (e) {
        res.status(500).send(e)
    }

    /*    user.save().then((user) => {
            res.status(201).send({savedUser: user})
        }).catch((error) => {
            res.status(400).send({error: error})
        })*/
})

router.post('/users/login', async (req, res) => {

    try {
        const user = await User.findByCredentials(req.body.email, req.body.password)

        const token = await user.generateAuthToken()

        res.send({user, token})
    } catch (e) {
        res.status(400).send({error: e.message})
    }
})


router.get('/users' ,async (req, res) => {

    try {
        const users = await User.find({})
        res.send(users)
    } catch (e) {
        res.status(500).send(e)
    }

    /*    User.find({}).then((users) => {
            res.send(users)
        }).catch((error) => {
            res.status(500).send({error: error})
        })*/
})


router.get('/users/:id',async (req, res) => {

    try {
        const user = await User.findById(req.params.id)
        if (!user) {
            return res.status(404).send()
        }
        res.send(user)

    } catch (e) {
        res.status(500).send(e)
    }

    /*    User.findById(req.params.id).then((user) => {
            if(!user){
                return res.status(404).send({error: 'user not found'})
            }
            res.send(user)

        }).catch((error) => {
            res.send({error: error})
        })*/
})

router.patch('/users/:id', async (req, res) => {

    const updates = Object.keys(req.body)
    const schemaFields = Object.keys(User.schema.paths)

    const allowUpdate = updates.every((updateField) => schemaFields.includes(updateField))

    if(!allowUpdate) {
        return res.status(400).send({error: 'Provided field not exists'})
    }

    try {
        const user = await User.findById(req.params.id)

        if (!user) {
            return res.status(404).send({error: 'User not found'})
        }

        updates.forEach((updateField) => user[updateField] = req.body[updateField])
        await user.save()
        res.send(user)
    } catch (e) {
        res.status(500).send(e)
    }
})

router.delete('/users/:id',async (req, res) => {

    try {
        const user = await User.findByIdAndDelete(req.params.id)
        if (!user){
            return res.status(404).send({error: 'User not found'})
        }
        res.send({'deleted user': user})

    } catch (e) {
        res.status(500).send(e)
    }
})

module.exports = router
