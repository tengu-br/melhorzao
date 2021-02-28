/*
Este é apenas um arquivo auxiliar para colocar funções de lógica que podem se aplicar
em vários lugares do código.
*/

// Importando as funções para manipular o banco de dados
const { MongoFind, MongoAdd, MongoDelete, MongoUpdate, MongoFindOne, MongoCount } = require('../db/mongo')

/*
Retorna dois números dentre 1 e a qtd de itens da coleção
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

/*
Escolhe 1 jogador base, sorteia mais 10% da collection
*/
async function matchmaker(collection) {
    const min = 1
    var max = await MongoFindOne("melhorzao", "params", { param: "collectionsList" })
    max.value.forEach(col => {
        if (col.colName === collection)
            max = col.counter
    });
    // Quantidade de jogadores adicionais a serem sorteados = 10% da collection
    tenPercent = Math.ceil(max / 10)
    var numberOne = 0, numberTwo = 0, possibleMatches = []

    if (max != 0) {
        // Jogador original
        numberOne = Math.floor(Math.random() * (max - min + 1) + min);
        do {
            do {
                // Garantindo que não há números repetidos
                numberTwo = Math.floor(Math.random() * (max - min + 1) + min);
            } while (numberOne === numberTwo || possibleMatches.includes(numberTwo))
            // Array de números sorteados
            possibleMatches.push(numberTwo)
        } while (possibleMatches.length < tenPercent)
        // console.log(`MAX: ${max} \n 10%: ${tenPercent} \n nº1: ${numberOne} \n matches: ${possibleMatches}`)
    }
    return ({ numberOne, possibleMatches })
}

// Exportando
module.exports = {
    randomNotSame,
    matchmaker
}