const express = require('express')
const bodyParser = require('body-parser')
require('./db/mongooseConfig')


const userRouter = require('./routers/userRouter')
const taskRouter = require('./routers/taskRouter')

const app = express()

const port = process.env.PORT || 3000

app.use(bodyParser.json())
app.use(userRouter)
app.use(taskRouter)

app.listen(port, ()=> {
    console.log('App listen on port', port)
})






