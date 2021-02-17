// Mesma coisa do eloRouter
const express = require('express')
const router = new express.Router()
const { MongoFind, MongoAdd, MongoDelete, MongoUpdate, MongoFindOne, MongoCount } = require('../db/mongo')
const { randomNotSame } = require('../controllers/utils')

/*
Essa função retorna dois 'índices' aleatórios da collection de players para ser usado nos jogos (para sortear os players).
No moneto o front chama essa função que sorteia e retorna os jogadores pro front. Talvez pareça inútil, pois poderia ser
sorteado direto do front, mas aí seria passível a manipulação. O cara poderia no console do front 'escolher' qual seria o
matchup a ser jogado. Imagina se o matchmaking do dota ficasse dentro do client ao invés dos servidores da valve. Msm coisa
*/
router.get('/coupleRandom', async (req, res) => {
    try {
        // Pega dois números aleatórios diferentes
        const range = await randomNotSame()
        // Acha os jogadores com esses números (indices)
        const players = {
            // Esse é um exemplo de função que PRECISA ser síncrona pq vc QUER retornar os jogadores pro front. Então tem q esperar
            // o banco terminar de achar os jogadores através da keyword 'await'.
            playerA: await MongoFindOne("melhorzao", "players", { rand: range.randA }, { projection: { '_id': 0, 'rand': 0 } }),
            playerB: await MongoFindOne("melhorzao", "players", { rand: range.randB }, { projection: { '_id': 0, 'rand': 0 } })
        }
        // Devolve pro front
        res.send(players)
    } catch (e) {
        console.log(e)
    }
})

// Exportando o roteador (vai ser importado no index.js)
module.exports = router