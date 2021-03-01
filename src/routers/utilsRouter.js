// Mesma coisa do eloRouter
const express = require('express')
const router = new express.Router()
const { MongoFind, MongoAdd, MongoDelete, MongoUpdate, MongoFindOne, MongoCount } = require('../db/mongo')
const { randomNotSame, matchmaker } = require('../controllers/utils')

/*
Essa função retorna dois 'índices' aleatórios da collection de players para ser usado nos jogos (para sortear os players).
No moneto o front chama essa função que sorteia e retorna os jogadores pro front. Talvez pareça inútil, pois poderia ser
sorteado direto do front, mas aí seria passível a manipulação. O cara poderia no console do front 'escolher' qual seria o
matchup a ser jogado. Imagina se o matchmaking do dota ficasse dentro do client ao invés dos servidores da valve. Msm coisa
*/
router.get('/coupleRandom', async (req, res) => {
    try {
        const collections = await MongoFindOne("melhorzao", "params", { param: "collectionsList" })
        const collection = collections.value[Math.floor(Math.random() * (collections.value.length))].colName
        var range = await matchmaker(collection)

        var playerA = await MongoFindOne("melhorzao", collection, { rand: range.numberOne }, { projection: { '_id': 0, 'rand': 0 } })

        var auxPlayer
        var playerB = await MongoFindOne("melhorzao", collection, { rand: range.possibleMatches.pop() }, { projection: { '_id': 0, 'rand': 0 } })


        while (range.possibleMatches.length > 0) {
            auxPlayer = await MongoFindOne("melhorzao", collection, { rand: range.possibleMatches.pop() }, { projection: { '_id': 0, 'rand': 0 } })
            // "se o elo do auxplayer for mais proximo que o elo do playerB, playerB recebe auxplayer"
            if (Math.abs(auxPlayer.elo - playerA.elo) < Math.abs(playerB.elo - playerA.elo)) {
                playerB = auxPlayer
            }
        }

        if (playerA.elo > playerB.elo) {
            playerA.elo = 1
            playerB.elo = 0
        } else if (playerA.elo < playerB.elo) {
            playerA.elo = 0
            playerB.elo = 1
        } else {
            playerA.elo = 1
            playerB.elo = 1
        }


        delete playerA.perceivedElo
        delete playerB.perceivedElo


        // Devolve pro front
        res.send({ collection, playerA, playerB })
    } catch (e) {
        console.log(e)
    }
})

/*
Função de matchmaking: escolhe 1 jogador base, sorteia mais 10% da collection e depois retorna o jogador original e o
sorteado com elo mais próximo.
*/
router.post('/match', async (req, res) => {
    try {
        // Pega dois números aleatórios diferentes
        var range = await matchmaker(req.body.collection)

        var playerA = await MongoFindOne("melhorzao", req.body.collection, { rand: range.numberOne }, { projection: { '_id': 0, 'rand': 0 } })

        var auxPlayer
        var playerB = await MongoFindOne("melhorzao", req.body.collection, { rand: range.possibleMatches.pop() }, { projection: { '_id': 0, 'rand': 0 } })


        while (range.possibleMatches.length > 0) {
            auxPlayer = await MongoFindOne("melhorzao", req.body.collection, { rand: range.possibleMatches.pop() }, { projection: { '_id': 0, 'rand': 0 } })
            // "se o elo do auxplayer for mais proximo que o elo do playerB, playerB recebe auxplayer"
            if (Math.abs(auxPlayer.elo - playerA.elo) < Math.abs(playerB.elo - playerA.elo)) {
                playerB = auxPlayer
            }
        }

        if (playerA.elo > playerB.elo) {
            playerA.elo = 1
            playerB.elo = 0
        } else if (playerA.elo < playerB.elo) {
            playerA.elo = 0
            playerB.elo = 1
        } else {
            playerA.elo = 1
            playerB.elo = 1
        }


        delete playerA.perceivedElo
        delete playerB.perceivedElo

        // Devolve pro front
        res.send({ playerA, playerB })
    } catch (e) {
        console.log(e)
    }
})

router.get('/listaCollections', async (req, res) => {
    try {
        // Acha as collections
        const collections = await MongoFindOne("melhorzao", "params", { param: "collectionsList" }, { projection: { '_id': 0 } })

        // Devolve pro front
        res.send(collections)
    } catch (e) {
        console.log(e)
    }
})

// Exportando o roteador (vai ser importado no index.js)
module.exports = router