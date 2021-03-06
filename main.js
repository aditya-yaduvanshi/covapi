const express = require('express')
const dotenv = require('dotenv')
const app = express()
const covRouter = require('./covid-api/routes')
dotenv.config()

const port = process.env.PORT || 5000
const host = process.env.HOST || localhost


app.get('/', (req,res)=>{
  res.send("Welcome to COV-API!")
})

app.use('/api/',covRouter)


app.listen(port,()=>console.log(`listening on: http://${host}:${port}`))