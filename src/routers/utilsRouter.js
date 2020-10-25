const express = require('express')
const router = new express.Router()
const { MongoFind, MongoAdd, MongoDelete, MongoUpdate, MongoFindOne, MongoCountPlayers } = require('../db/mongo')
const { randomNotSame } = require('../controllers/utils')

router.get('/coupleRandom', async (req, res) => {
    try {
        const range = await randomNotSame()

        res.send(range)
    } catch (e) {
        console.log(e)
    }
})


module.exports = router