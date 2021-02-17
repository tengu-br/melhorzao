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
        results = matchup(req.body.playerA.elo, req.body.playerB.elo, 1)
        console.log(results)
        await MongoUpdate("melhorzao", "players", { name: req.body.playerA.name }, { $set: { elo: results.playerA } })
        await MongoUpdate("melhorzao", "players", { name: req.body.playerB.name }, { $set: { elo: results.playerB } })
    
        res.send({
            playerA: {
                name: req.body.playerA.name,
                elo: results.playerA
            },
            playerB: {
                name: req.body.playerB.name,
                elo: results.playerB
            }
        })
    } catch (e) {
        console.log(e)
    }
})

/*
Rota só para testes. Deleta tudo das collections de params e players e adiciona
uns valores para teste. Pelo amor de Deus tirar isso antes de fazer deploy.
*/ 
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

// Exportando o roteador (vai ser importado no index.js)
module.exports = router