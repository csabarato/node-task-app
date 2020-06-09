const mongoose = require('mongoose')
const validator = require('validator')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

const Task = require('../models/task')

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true,
        validate(value) {
            if (!validator.isEmail(value)){
                throw new Error('Invalid email')
            }
        }
    },
    age: {
        type: Number,
        default: 0,
        validate(value) {
            if (value < 0) {
                throw new Error('Age must be positive')
            }
        }
    },
    password: {
        type: String,
        trim: true,
        required: true,
        minlength: 7,
        validate(value) {
            if (value.toLowerCase().includes('password')) {
                throw new Error('Password too weak!')
            }
        }
    },
    tokens: [{
        token: {
            type: String,
            required: true
        }
    }],
    avatar: {
        type: Buffer
    }
}, {
    timestamps: true
})

userSchema.statics.findByCredentials = async (email, password) => {

    const user = await User.findOne({email: email})

    if (!user) {
        throw new Error('No user found')
    }

    const isPasswordMatch = await bcrypt.compare(password, user.password)
    if (!isPasswordMatch) {
        throw new Error('Incorrect credentials')
    }

    return user
}

userSchema.methods.generateAuthToken = async function () {
    const user = this

    const token = jwt.sign({_id: user.id.toString() }, process.env.JWT_SECRET)

    user.tokens = user.tokens.concat({token})
    await user.save()

    return token
}

userSchema.methods.toJSON = function () {

    const userObject = this.toObject()

    delete userObject.password
    delete userObject.tokens
    delete userObject.avatar

    return userObject
}

// Hash password before save
userSchema.pre('save', async function (next) {
    const user = this

    if (user.isModified('password')) {
        user.password = await bcrypt.hash(user.password, 8)
    }
    next()
})

userSchema.pre('remove', async function (next) {
    await Task.deleteMany({owner: this._id})
    next()
})

userSchema.virtual('tasks', {
    ref: 'Task',
    localField: '_id',
    foreignField: 'owner'
})

const User = mongoose.model('User',userSchema)

module.exports = User;
