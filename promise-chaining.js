
require('./src/db/mongooseConfig')

const User = require('./src/models/user')
const Task = require('./src/models/task')

// 5ed218c957777a32baa5304f

/*User.findByIdAndUpdate('5ed218c957777a32baa5304f', {age: 1}).then(user => {
    console.log(user)
    return User.countDocuments( {age: 1})
}).then(resultCount => {
    console.log(resultCount)
}).catch(error => {
    console.log(error)
})*/

Task.findByIdAndRemove('5ed20388553ba72208188e9f').then(task => {

    console.log(task)
    return Task.countDocuments({completed: false})

}).then(count => {
    console.log(count)
}).catch(error => {
    console.log(error)
})

const updateAgeAndCount = async (id, age) => {

    const user = await User.findByIdAndUpdate(id, {age: age})
    const count = await User.countDocuments({age : age})
    return count
}

updateAgeAndCount('5ed203be84d4012220f2d4d6', 2).then(count => {
    console.log(count)
}).catch(err => console.log(err))



const deleteteTaskByIdAndCount = async (id) => {
    await Task.findByIdAndRemove(id)
    return await Task.countDocuments({completed: false})
}

deleteteTaskByIdAndCount('5ed203ae2d85fa22180e8cdd')
    .then(count => console.log(count))
    .catch(e => console.log(e))


/*
const add = (a,b) => {
    return new Promise( (resolve , reject) => {
        setTimeout(() => {
            resolve(a+b)
        }, 5)
    })
}
*/

/*add(1,2).then(sum => {
    console.log(sum)

    add(sum, 5).then(sum2 => {
        console.log(sum2)
    }).catch(e => {
        console.log(e)
    })

}).catch(e => {
    console.log(e)
})*/

// promise chaining
/*
add(1,1).then((sum) => {
    console.log(sum)

    return add(sum, 4)

}).then(sum2 => {
    console.log(sum2)
}).catch(e => {
    console.log(e)
})
*/
