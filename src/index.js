const express = require('express')
const bodyParser = require('body-parser')
require('./db/mongooseConfig')


const userRouter = require('./routers/userRouter')
const taskRouter = require('./routers/taskRouter')

const app = express()
const port = process.env.PORT

app.use(bodyParser.json())
app.use(userRouter)
app.use(taskRouter)

app.listen(port, (error) => {
    if (error) {
        throw error;
    }
    console.log('App listen on port', port)
})


process.on('SIGINT', () => { console.log("App shuts down"); process.exit(); });
