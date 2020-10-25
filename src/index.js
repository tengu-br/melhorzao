const express = require('express')
var cors = require('cors')
// require('./db/mongoose')
const eloRouter = require('./routers/eloRouter')
const utilsRouter = require('./routers/utilsRouter')

const app = express()

app.use(cors())
app.use(express.json())
app.use(eloRouter)
app.use(utilsRouter)

const port = 3001

app.listen(port, () => { console.log('Servidor no ar!') })