/*
Esse arquivo controla a conexão com o banco de dados e as funções dele.
Essa maneira é a mais raiz também. Na linha de código abaixo o driver do MongoDB
está sendo importado e a gente usa ele pra fazer os CRUDs da vida. Normalmente tb
pode se utilizar o mongoose, que é uma interface de programação pro mongo que facilita
algumas queries e principalmente modelagem de objetos.
O mongoose por trás também usa o MongoClient, então dá no mesmo, por via de regra minha
lógica é a seguinte: eu preciso de modelar os objetos como se fosse um banco de dados relacional?
Se sim, eu uso mongoose, pq ele ajuda mt a traçar as dependencias de um obj pra outro. Se não, eu
uso o driver nativo do mongoDB.
*/
const { MongoClient } = require("mongodb");

// TO-DO: trocar para variável de ambiente e encapsular em try catch
const uri = "mongodb://localhost:27017";
const client = new MongoClient(uri);
client.connect();

/*
Perceba que EU que fiz essas funções MongoFind, MongoDelete etc... O driver do mongo mesmo é o que tá dentro delas.
Eu só criei essas funções pra organizar, abstrair e tirar um pouco o código boilerplate de todo lugar que teria que
fazer conexao com o banco, escolher db e collection etc... E todo arquivo que fizesse isso teria que importar o driver
que nem a primeira linha de código desse arquivo. Exemplo: nos outros arquivos que quiserem inserir algo no banco, só
precisa chamar: MongoAdd(banco, collection, query) e pronto.
*/ 

async function MongoFind(db, col, query, options) {
    try {
        const database = client.db(db);
        const collection = database.collection(col);
        const cursor = collection.find(query, options);
        cursor.forEach(console.dir);
    } catch (e) {
        console.log(`DB Error: ${e}`)
    }
}

async function MongoFindOne(db, col, query, options) {
    try {
        const database = client.db(db);
        const collection = database.collection(col);
        const result = collection.findOne(query, options);
        return result
    } catch (e) {
        console.log(`DB Error: ${e}`)
    }
}

async function MongoAdd(db, col, query, options) {
    try {
        const database = client.db(db);
        const collection = database.collection(col);
        const results = collection.insertMany(query, options);
        // console.log(results)
    } catch (e) {
       console.log(`DB Error: ${e}`)
    }
}

async function MongoDelete(db, col, query, options) {
    try {
        const database = client.db(db);
        const collection = database.collection(col);
        const results = collection.deleteMany(query, options);
        // console.log(results)
    } catch (e) {
        console.log(`DB Error: ${e}`)
    }
}

async function MongoUpdate(db, col, query, options) {
    try {
        const database = client.db(db);
        const collection = database.collection(col);
        const results = await collection.updateOne(query, options);
        // console.log(results)
    } catch (e) {
        console.log(`DB Error: ${e}`)
    }
}

async function MongoCount(db, col) {
    try {
        const database = client.db(db);
        const collection = database.collection(col);
        const results = await collection.countDocuments({})
        // console.log(results)
        return results
    } catch (e) {
        console.log(`DB Error: ${e}`)
    }
}

module.exports = {
    MongoAdd,
    MongoFind,
    MongoDelete,
    MongoUpdate,
    MongoFindOne,
    MongoCount
}