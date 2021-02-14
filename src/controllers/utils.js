const { MongoFind, MongoAdd, MongoDelete, MongoUpdate, MongoFindOne, MongoCount } = require('../db/mongo')

async function randomNotSame() {
    const min = 1
    const max = (await MongoFindOne("melhorzao", "params", { param: "counter" })).value
    var numberOne = 0, numberTwo = 0
    
    if (max != 0) {
        numberOne = Math.floor(Math.random() * (max - min + 1) + min);
        do {
            numberTwo = Math.floor(Math.random() * (max - min + 1) + min);
        } while (numberOne === numberTwo)
    }
    return ({ randA: numberOne, randB: numberTwo })
}

module.exports = {
    randomNotSame
}