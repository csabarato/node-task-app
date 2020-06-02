const mongodb = require('mongodb')
const MongoClient = mongodb.MongoClient
const ObjectID = mongodb.ObjectID


const connectionUrl = 'mongodb://127.0.0.1:27017'
const dbName = 'task-manager'

const id = new ObjectID()

MongoClient.connect(connectionUrl, {useNewUrlParser: true, useUnifiedTopology: true}, (error, client) => {
    if (error) {
        return console.log('Unable to connect to mongo');
    }

    console.log('Connected to mongodb successfully')

    const db = client.db(dbName);

    // Insert

    /*db.collection('users').insertOne( {
        name: 'Andrew',
        age: 27
    }, (error, result) => {
        if(error) {
            return console.log('Unable to insert user')
        }
        console.log(result.ops)
    })

    db.collection('users').insertMany( [
        {
            name: 'Csebo',
            age: 23
        },
        {
            name: 'Besic',
            age: 22
        }
    ], (error, result) => {
        if(error) {
            console.log('Unable to insert users')
        }
        console.log(result.ops)
    })

    db.collection('tasks').insertMany( [
        {
            desc: 'task1',
            completed: false
        },
        {
            desc: 'task2',
            completed: true
        }
    ], (error, result) => {
        if(error) {
            console.log('Unable to insert tasks')
        }
        console.log(result.ops)
    })*/

    // Find

/*    db.collection('users').findOne( {name: 'Andrew', age: 27 } , (error, result) => {
        if(error) {
            console.log('Unable to query')
        }
        console.log(result)
    })

    db.collection('users').find( {age: 27} ).toArray( (error, users) => {
        console.log(users)
    })

    db.collection('users').find( {age: 27} ).count( (error, count) => {
        console.log(count)
    })

    db.collection('users').findOne( {_id : new ObjectID("5ecd38f0cf290524c5fc7166") }, (error, result) => {
        console.log(result);
    });

    db.collection('tasks').find( {completed : false }).toArray( (error, results) => {
        console.log(results)
    })*/


    // Update
    db.collection('users').updateOne( { _id: new ObjectID('5ecd2b82f4021123e72ba6f5') },
         { $inc: {
             age: 1
             }
         }).then( (result) => {
                console.log(result)
         }).catch( (error) => {
             console.log(error)
         })

    db.collection('tasks').updateMany( { completed: false },
        { $set: {
            completed: true
            }
        }).then( (result) => {
        console.log(result)
    }).catch( (error) => {
        console.log(error)
    })

    db.collection('users').deleteMany( {age: 27} )
        .then( (result) => {

        }).catch( (error) => {
            console.log(error)
    })



})


