/* 
AINDA SOB AVALIAÇÃO. Talvez o cors baste como segurança.
To-do: fazer hash de segurança usando: salt + rand1 + rand2 
    1 - Criar e passar esse hash no request q manda os players pro front
    2 - Passar esse hash de volta pra essa página aqui
    3 - Validar se o hash bate com os players e agir de acordo
*/

const express = require('express')
// Instanciando o roteador que vai ser exportado no fim do arquivo
const router = new express.Router()
// Importando funções de outros arquivos nossos
const { matchup } = require('../controllers/elo')
const { MongoFind, MongoAdd, MongoDelete, MongoUpdate, MongoFindOne } = require('../db/mongo')

/*
Essa rota atualiza os elos de maneira SÍNCRONA, por isso matchupSync.
Ela é síncrona pq tem o await de cada MongoUpdate antes do res.send, então a rota só vai responder depois
que atualizar no banco. Usar apenas para teste interno. Em produção deve ser criada uma outra função igual
só que sem o await. Isso vai liberar stress no servidor pq vai ter menos conexões abertas em um determinado
momento. E já que o novo elo não é de interesse pro usuário, não precisamos mandar de volta. Basta iniciar
a função que vai atualizar o elo (MongoUpdate) e seguir com a vida (de maneira Assíncrona - Async). Colocar
await é criar gargalos desnecessários.
*/
router.post('/matchupSync', async (req, res) => {
    try {

        const winner = await MongoFindOne("melhorzao", req.body.collection, { name: req.body.winner })
        const loser = await MongoFindOne("melhorzao", req.body.collection, { name: req.body.loser })

        results = matchup(winner.elo, loser.elo, 1)

        await MongoUpdate("melhorzao", req.body.collection, { name: req.body.winner }, { $set: { elo: results.playerA, counter: winner.counter + 1 } })
        await MongoUpdate("melhorzao", req.body.collection, { name: req.body.loser }, { $set: { elo: results.playerB, counter: loser.counter + 1 } })

        res.send({
            winner: {
                name: req.body.winner,
                elo: results.playerA
            },
            loser: {
                name: req.body.loser,
                elo: results.playerB
            }
        })
    } catch (e) {
        console.log(e)
    }
})

router.post('/matchup', async (req, res) => {
    try {

        const winner = await MongoFindOne("melhorzao", req.body.collection, { name: req.body.winner })
        const loser = await MongoFindOne("melhorzao", req.body.collection, { name: req.body.loser })

        results = matchup(winner.elo, loser.elo, 1)

        MongoUpdate("melhorzao", req.body.collection, { name: req.body.winner }, { $set: { elo: results.playerA, counter: winner.counter + 1 } })
        MongoUpdate("melhorzao", req.body.collection, { name: req.body.loser }, { $set: { elo: results.playerB, counter: loser.counter + 1 } })

        res.sendStatus(200)
    } catch (e) {
        console.log(e)
        res.sendStatus(600)
    }
})

router.post('/perceivedMatchup', async (req, res) => {
    try {

        const winner = await MongoFindOne("melhorzao", req.body.collection, { name: req.body.winner })
        const loser = await MongoFindOne("melhorzao", req.body.collection, { name: req.body.loser })

        results = matchup(winner.perceivedElo, loser.perceivedElo, 1)

        MongoUpdate("melhorzao", req.body.collection, { name: req.body.winner }, { $set: { perceivedElo: results.playerA } })
        MongoUpdate("melhorzao", req.body.collection, { name: req.body.loser }, { $set: { perceivedElo: results.playerB } })

        res.sendStatus(200)
    } catch (e) {
        console.log(e)
        res.sendStatus(600)
    }
})

/*
Rota só para testes. Deleta tudo das collections de params e players e adiciona
uns valores para teste. Pelo amor de Deus tirar isso antes de fazer deploy.
*/
// router.get('/init', async (req, res) => {
//     try {
//         MongoDelete("melhorzao", "params", {})
//         MongoAdd("melhorzao", "params", [
//             { param: "counter", value: 5 },
//         ])
//         MongoDelete("melhorzao", "players", {})
//         MongoAdd("melhorzao", "players", [
//             { name: "vitor", elo: 1200, rand: 1, url: "http://api.higherlowergame.com/_client/images/general/the-diary-of-anne-frank.jpg" },
//             { name: "lucas", elo: 1200, rand: 2, url: "http://api.higherlowergame.com/_client/images/general/water-polo.jpg" },
//             { name: "daniel", elo: 1200, rand: 3, url: "http://api.higherlowergame.com/_client/images/general/rich.jpg" },
//             { name: "luan", elo: 1200, rand: 4, url: "http://api.higherlowergame.com/_client/images/general/pac-man.jpg" },
//             { name: "giovanni", elo: 1200, rand: 5, url: "http://api.higherlowergame.com/_client/images/general/rottweiler.jpg" }
//         ])
//         res.send("Inicializado")
//     } catch (e) {
//         console.log(e)
//     }
// })

// Exportando o roteador (vai ser importado no index.js)
module.exports = router