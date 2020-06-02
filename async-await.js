
const add = (a,b) => {
    return new Promise( (resolve , reject) => {
        setTimeout(() => {

            if (a < 0 || b < 0) {
                return reject('Numbers must be positive')
            }
            resolve(a+b)
        }, 5)
    })
}


// Async function always returns a Promise
const doWork = async () => {

    const sum = await add(-3,99)
    const sum2 = await add(sum, 50)
    const sum3 = await add(sum2, 33)

    return sum3
}

doWork().then((res) => console.log(res)).catch(err => console.log('error: ', err))
