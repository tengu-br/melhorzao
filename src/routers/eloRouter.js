const express = require('express')
const router = new express.Router()
const { matchup } = require('../controllers/elo')
const { MongoFind, MongoAdd, MongoDelete, MongoUpdate, MongoFindOne } = require('../db/mongo')

router.post('/matchupSync', async (req, res) => {
    try {
        results = matchup(req.body.playerA.elo, req.body.playerB.elo, 0)
        console.log(results)
        await MongoUpdate("melhorzao", "players", { name: req.body.playerA.name }, { $set: { elo: results.playerA } })
        await MongoUpdate("melhorzao", "players", { name: req.body.playerB.name }, { $set: { elo: results.playerB } })
        res.send("OK")
    } catch (e) {
        console.log(e)
    }
})

router.get('/init', async (req, res) => {
    try {
        MongoDelete("melhorzao", "params", {})
        MongoAdd("melhorzao", "params", [
            { param: "counter", value: 5 },
        ])
        MongoDelete("melhorzao", "players", {})
        MongoAdd("melhorzao", "players", [
            { name: "vitor", elo: 1200, rand: 1 },
            { name: "lucas", elo: 1200, rand: 2 },
            { name: "daniel", elo: 1200, rand: 3 },
            { name: "luan", elo: 1200, rand: 4 },
            { name: "giovanni", elo: 1200, rand: 5 }
        ])
        res.send("Inicializado")
    } catch (e) {
        console.log(e)
    }
})

module.exports = router