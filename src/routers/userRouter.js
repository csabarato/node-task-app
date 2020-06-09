const express = require('express')
const User = require('../models/user')
const router = new express.Router()
const multer = require('multer')
const sharp = require('sharp')

const auth = require('../middleware/auth')
const {sendWelcomeEmail, sendUserCancellationEmail} = require('../emails/account')


//setup multer
const avatarUpload = multer({
    limits: {
        fileSize: 1000000
    },
    fileFilter(req, file, cb) {
        allowedTypes = ['image/png', 'image/jpeg']
        if(!allowedTypes.includes(file.mimetype)) {
            return cb(new Error('uploaded file not an image'))
        }
        cb(undefined, true)
    }
})

router.post('/users' , async (req, res) => {

    const user = new User(req.body)
    try {

        const token = await user.generateAuthToken()

        await user.save()
        sendWelcomeEmail(user.email, user.name)

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
        sendUserCancellationEmail(req.user.email, req.user.name)
    } catch (e) {
        res.status(500).send(e)
    }
})

router.post('/users/me/avatar',auth, avatarUpload.single('avatar'),async (req, res) => {

    const buffer = await sharp(req.file.buffer).resize(250,250).png().toBuffer()

    req.user.avatar = buffer
    await req.user.save()
    res.send()
}, (error, req, res, next) => {
     res.status(400).send({error: error.message})
})

router.delete('/users/me/avatar', auth, async (req, res) => {

    req.user.avatar = undefined
    await req.user.save()
    res.send({msg: 'avatar deleted'})
})

router.get('/users/:id/avatar', async (req, res) => {
    
    try {
        const user = await User.findById(req.params.id)

        if(!user || !user.avatar){
            throw new Error()
        }

        res.set('Content-Type', 'image/png')
        res.send(user.avatar)

    } catch (e) {
        res.status(404).send()
    }
})

module.exports = router
