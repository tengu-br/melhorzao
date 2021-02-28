/*
Este é apenas um arquivo auxiliar para colocar funções de lógica que podem se aplicar
em vários lugares do código.
*/

// Importando as funções para manipular o banco de dados
const { MongoFind, MongoAdd, MongoDelete, MongoUpdate, MongoFindOne, MongoCount } = require('../db/mongo')

/*
Retorna dois números dentre 1 e a qtd de itens da coleção
Já que vamos ter collections diferentes no futuro, precisamos refatorar a função para passar
a coleção como parametro da função. Perceba que a função não faz nenhum count no banco de dados,
só um FindOne na collection de parametros. Isso é pq por organização e performance, eu guardo a qtd
de itens em um campo já pronto para ser lido. Quando um item for adicionado na coleção, basta dar
um +1 nesse parâmetro também. Por enquanto só tem um documento na collection de params chamado "counter"
mas vamos fazer um document separado para cada collection. Exemplo:

COLLECTION: PARAMS
[
    {
        collection:"atores",
        counter:"83"
    },
    {
        collections:"jogos",
        counter:"16"
    }
]
*/
async function randomNotSame(collection) {
    const min = 1
    var max = await MongoFindOne("melhorzao", "params", { param: "collectionsList" })
    max.value.forEach(col => {
        if (col.colName === collection)
            max = col.counter
    });
    var numberOne = 0, numberTwo = 0

    if (max != 0) {
        numberOne = Math.floor(Math.random() * (max - min + 1) + min);
        do {
            numberTwo = Math.floor(Math.random() * (max - min + 1) + min);
        } while (numberOne === numberTwo)
    }
    return ({ randA: numberOne, randB: numberTwo })
}

// Exportando
module.exports = {
    randomNotSame
}