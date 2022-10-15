import express from 'express'
import cors from 'cors'
import bodyParser from 'body-parser'
import db from "./config.js"
import { addDoc, getDocs, collection, query, where } from 'firebase/firestore'
import router from './routers/auth.js'
import foodRouter from './routers/menu.js'

const app = express()
app.use(cors({
    origin: '*'
}))
app.use(bodyParser.json())
app.use('/', foodRouter)

const PORT = process.env.PORT | 8080

app.listen(PORT, () => {
    console.log(`Listening on port ${PORT}`)
})