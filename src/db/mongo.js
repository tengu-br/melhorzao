const { MongoClient } = require("mongodb");

const uri = "mongodb://localhost:27017";
const client = new MongoClient(uri);
client.connect();

async function MongoFind(query, options) {
    try {
        const database = client.db("melhorzao");
        const collection = database.collection("players");
        const cursor = collection.find(query, options);
        cursor.forEach(console.dir);
    } catch (e) {
        console.log(`DB Error: ${e}`)
    }
}

async function MongoFindOne(query, options) {
    try {
        const database = client.db("melhorzao");
        const collection = database.collection("players");
        const result = collection.findOne(query, options);
        return result
    } catch (e) {
        console.log(`DB Error: ${e}`)
    }
}

async function MongoAdd(query, options) {
    try {
        const database = client.db("melhorzao");
        const collection = database.collection("players");
        const results = collection.insertMany(query, options);
        // console.log(results)
    } catch (e) {
        console.log(`DB Error: ${e}`)
    }
}

async function MongoDelete(query, options) {
    try {
        const database = client.db("melhorzao");
        const collection = database.collection("players");
        const results = collection.deleteMany(query, options);
        // console.log(results)
    } catch (e) {
        console.log(`DB Error: ${e}`)
    }
}

async function MongoUpdate(query, options) {
    try {
        const database = client.db("melhorzao");
        const collection = database.collection("players");
        const results = await collection.updateOne(query, options);
        // console.log(results)
    } catch (e) {
        console.log(`DB Error: ${e}`)
    }
}

exports.MongoFind = MongoFind
exports.MongoAdd = MongoAdd
exports.MongoDelete = MongoDelete
exports.MongoUpdate = MongoUpdate
exports.MongoFindOne = MongoFindOne