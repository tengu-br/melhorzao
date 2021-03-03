require('dotenv').config();

// módulo de servidor web
const express = require('express')
/* 
CORS é um protocolo de segurança q só permite chamadas a serem feitas de um certo domínio 
por exemplo: se a gente lançar nossa aplicação sob o domínio melhorzao.com , dá pra gente
restringir nossa API a só responder requests vindo desse domínio. Isso previne que alguém
abra um postman da vida e comece a fazer uns requests adoidados e cagar com nosso matchmaking
(AINDA NÃO ESTÁ CONFIGURADO)
*/
var cors = require('cors')
const rateLimit = require("express-rate-limit");

/* 
Routers são os arquivos onde ficam expostos as rotas ('routes', por isso o nome de router)
da nossa aplicação, nesse caso, da nossa API. é boas práticas ter arquivos de router separados
para cada funcionalidade ou 'tema', pra n deixar a aplicação inteira com um só routers de 9999 linhas
*/
const eloRouter = require('./routers/eloRouter')
const utilsRouter = require('./routers/utilsRouter')

// Instanciando o servidor
const app = express()

// Configurando coisas básicas. Falando pra usar cors, os roteadores, e aceitar json.
const corsOptions = {
    origin: process.env.FRONT_ADDR,
    optionsSuccessStatus: 200
}

const limiter = rateLimit({
    windowMs: 10000, // 10 segundos
    max: 10 // limit each IP to 10 requests per windowMs
})

app.use(limiter)
app.use(cors(corsOptions))
app.use(express.json())
app.use(eloRouter)
app.use(utilsRouter)


const port = 3001

// deploy
app.listen(port, () => { console.log('Servidor no ar!') })