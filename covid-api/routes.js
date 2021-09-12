const express = require('express')
const app = express()
const router = express.Router()

router.get('/',(req,res)=>{
  res.send("Get response from covid-api")
})

module.exports = router
