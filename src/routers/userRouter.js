const express = require('express')
const User = require('../models/user')
const router = new express.Router()

const auth = require('../middleware/auth')

router.post('/users' , async (req, res) => {

    const user = new User(req.body)
    try {

        const token = await user.generateAuthToken()

        await user.save()

        res.status(201).send({user, token})
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

router.post('/users/logout', auth, async (req, res) => {

    try {

        req.user.tokens = req.user.tokens.filter(token => {
            return token.token !== req.token
        })

        await req.user.save()
        res.send({msg: 'User logged out'})

    } catch (e) {
        res.status(500).send(e)
    }
})

router.post('/users/logoutAll', auth, async (req, res) => {

    try {
        req.user.tokens = []
        await req.user.save()
        res.send({msg: 'User logged out from all device'})
    } catch (e) {
        res.status(500).send(e)
    }

})

router.get('/users/me', auth ,async (req, res) => {
    res.send(req.user)
})

/*
    No longer used

router.get('/users/:id',async (req, res) => {
       User.findById(req.params.id).then((user) => {
            if(!user){
                return res.status(404).send({error: 'user not found'})
            }
            res.send(user)

        }).catch((error) => {
            res.send({error: error})
        })
}) */

router.patch('/users/me',auth, async (req, res) => {

    const updates = Object.keys(req.body)
    const schemaFields = Object.keys(User.schema.paths)

    const allowUpdate = updates.every((updateField) => schemaFields.includes(updateField))

    if(!allowUpdate) {
        return res.status(400).send({error: 'Provided field not exists'})
    }

    try {
        updates.forEach((updateField) => req.user[updateField] = req.body[updateField])
        await req.user.save()
        res.send(req.user)
    } catch (e) {
        res.status(500).send(e)
    }
})

router.delete('/users/me', auth ,async (req, res) => {

    try {
        await req.user.remove()
        res.send({'deleted user': req.user})

    } catch (e) {
        res.status(500).send(e)
    }
})

module.exports = router
