const mongoose = require('mongoose')

const verifTokenSchema = new mongoose.Schema({

    user: {
        type: mongoose.Schema.Types.ObjectID,
        required: true,
        ref: 'User'
    },
    verifToken: {
        type: String,
        required: true
    }
    },{timestamps: true})

module.exports = mongoose.model('VerificatonToken', verifTokenSchema)
