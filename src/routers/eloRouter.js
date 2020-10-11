const express = require('express')
const router = new express.Router()
const { matchup } = require('../controllers/elo')
const { MongoFind, MongoAdd, MongoDelete, MongoUpdate, MongoFindOne } = require('../db/mongo')

router.get('/', async (req, res) => {
    try {
        // MongoAdd([{ name: "Sicilian pizza", shape: "square" },
        // { name: "New York pizza", shape: "round" },
        // { name: "Grandma pizza", shape: "square" }])
        // MongoDelete({ name: "New York pizza" })
        // MongoDelete({ name: "Grandma pizza" })
        // MongoDelete({ name: "Sicilian pizza" })
        // await MongoFind({}, {
        //     sort: { elo: -1 },
        //     projection: { _id: 0, name: 1, elo: 1 },
        // })
        // await MongoUpdate({ name: "vitor" }, { $set: { elo: 1400, } })
        // await MongoFind({}, {
        //     sort: { elo: -1 },
        //     projection: { _id: 0, name: 1, elo: 1 },
        // })
        playerA = await MongoFindOne({ name: "vitor" })
        playerB = await MongoFindOne({ name: "lucas" })
        results = matchup(playerA.elo, playerB.elo, 0.5)
        console.log(results)
        MongoUpdate({ name: playerA.name }, { $set: { elo: results.playerA } })
        MongoUpdate({ name: playerB.name }, { $set: { elo: results.playerB } })
        res.send("OK")
    } catch (e) {
        console.log(e)
    }
})

module.exports = router