const express = require('express')
var cors = require('cors')
// require('./db/mongoose')
const eloRouter = require('./routers/eloRouter')

const app = express()

app.use(cors())
app.use(express.json())
app.use(eloRouter)

const port = 3001

app.listen(port, () => { console.log('Servidor no ar!') })