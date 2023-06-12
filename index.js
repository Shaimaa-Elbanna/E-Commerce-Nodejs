import express  from 'express'
import  initServer from './src/app.routes.js'
import * as dotenv from 'dotenv'
dotenv.config()
const app = express()
const port = process.env.PORT||5000

app.get('/', (req, res) => res.send('Hello World!'))
initServer(express,app)
app.listen(port, () => console.log(`Example app listening on port ${port}!`))


