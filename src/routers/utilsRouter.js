const express = require('express')
const router = new express.Router()
const { MongoFind, MongoAdd, MongoDelete, MongoUpdate, MongoFindOne, MongoCount } = require('../db/mongo')
const { randomNotSame } = require('../controllers/utils')

router.get('/coupleRandom', async (req, res) => {
    try {
        const range = await randomNotSame()
        const players = {
            playerA: await MongoFindOne("melhorzao", "players", { rand: range.randA }, { projection: { '_id': 0, 'rand': 0 } }),
            playerB: await MongoFindOne("melhorzao", "players", { rand: range.randB }, { projection: { '_id': 0, 'rand': 0 } })
        }
        res.send(players)
    } catch (e) {
        console.log(e)
    }
})


module.exports = router