import express from 'express'
import cors from 'cors'
import bodyParser from 'body-parser'
import adminRouter from './routers/admin.js'
import dinerRouter from './routers/diner.js'
import authRouter from './routers/auth.js'

const app = express()
app.use(cors({
    origin: '*'
}))
app.use((err, req, res, next) => {
    if (err) {
        res.status(400).send('Error parsing data')
    } else {
        next()
    }
})
app.use(bodyParser.json())
app.use('/auth', authRouter)
app.use('/admin', adminRouter)
app.use('/diner', dinerRouter)

const PORT = process.env.PORT || 8080

app.listen(PORT, () => {
    console.log(`Listening on port ${PORT}`)
})