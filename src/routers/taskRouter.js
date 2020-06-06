const express = require('express')
const Task = require('../models/task')
const router = new express.Router()
const auth = require('../middleware/auth')

router.post('/tasks',auth, async (req, res) => {

    const task = new Task({
        ...req.body,
        owner: req.user._id
    })

    try {
        await task.save()
        res.status(201).send(task)
    } catch (e) {
        res.status(400).send(e)
    }

    /*    const task = new Task(req.body)

        task.save().then((task) => {
            res.status(201).send({savedTask: task})

        }).catch((error) => {
            res.status(400).send({error: error})
        })*/
})

router.get('/tasks',auth, async (req, res) => {

    const match = {}
    const sort = {}

    if (req.query.completed) {
        match.completed = req.query.completed
    }

    if (req.query.sortBy) {
        const sortSplitted = req.query.sortBy.split(':')
        sort[sortSplitted[0]] = sortSplitted[1] === 'desc' ? -1 : 1
    }

    try {
        await req.user.populate({
            path: 'tasks',
            match,
            options: {
                limit: parseInt(req.query.limit),
                skip: parseInt(req.query.skip),
                sort
            }
        }).execPopulate()

        res.send(req.user.tasks)
    } catch (e) {
        res.status(500).send(e)
    }

    /*   Task.find({}).then((tasks) => {
           res.send(tasks)
       }).catch((error) => {
           res.send(500).send({error: error})
       })*/
})

router.get('/tasks/:id',auth, async (req, res) => {

    try {
        const task = await Task.findOne({ _id: req.params.id, owner: req.user._id })

        if(!task) {
            return res.status(404).send({error: 'No task found'})
        }
        res.send(task)

    } catch(e) {
        res.status(500).send(e)
    }

    /*  Task.findById(req.params.id).then((task) => {
            if(!task){
                return res.status(404).send({error: 'No task found'})
            }
            res.send(task)
        }).catch((error) => {
            res.status(500).send({error: error})
        })*/
})

router.patch('/tasks/:id',auth, async (req, res) => {

    const updates = Object.keys(req.body)
    const schemaFields = Object.keys(Task.schema.paths)

    const allowUpdate = updates.every((updateField) => schemaFields.includes(updateField))

    if(!allowUpdate) {
        return res.status(400).send({error: 'Provided field not exists'})
    }

    try {
        const task = await Task.findOne({_id: req.params.id, owner: req.user._id})

        if (!task) {
            return res.status(404).send({error: 'Task not found'})
        }

        updates.forEach((updateField => task[updateField] = req.body[updateField]))
        await task.save()
        res.send(task)

    } catch (e) {
        res.status(500).send(e)
    }
})

router.delete('/tasks/:id',auth, async (req, res) => {

    try {
        const task = await Task.findOneAndDelete({_id: req.params.id, owner: req.user._id })
        if (!task){
            return res.status(404).send({error: 'Task not found'})
        }
        res.send({'deleted task': task})

    } catch (e) {
        res.status(500).send(e)
    }
})

module.exports = router
