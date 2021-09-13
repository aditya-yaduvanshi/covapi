const { default: axios } = require('axios')
const express = require('express')
const crypto = require('crypto')
const router = express.Router()
var authtxnId = ""
var authToken = ""
var vacToken = ""
var vactxnId = ""

axios.defaults.baseURL = "https://cdn-api.co-vin.in/api/"
axios.defaults.headers = {}
axios.defaults.headers = {
  "Content-Type":"application/json"
}

// default page
router.get('/',(req,res)=>{
  res.send("Get response from covid-api")
})
// meta apis starts here
// get states
router.get('/states',(req,res)=>{
  axios.get('v2/admin/location/states')
  .then(result => {
    return res.json(result.data)
  })
  .catch(err=>{
    console.log(err)
  })
})
// get districts by state id
router.get('/dist/:id',(req,res)=>{
  axios.get(`v2/admin/location/districts/${req.params.id}`)
  .then(result => {
    return res.json(result.data)
  })
  .catch(err=>{
    console.log(err)
  })
})
// meta apis ends here
// appointment apis starts here
// get appointment by pincode
router.get('/appoint/pin',(req,res)=>{
  axios.get(`v2/appointment/sessions/public/findByPin?pincode=${req.query.code}&date=${req.query.date}`)
  .then(result => {
    return res.json(result.data)
  })
  .catch(err=>{
    console.log(err)
  })
})
// get appointment by district
router.get('/appoint/dist',(req,res)=>{
  axios.get(`v2/appointment/sessions/public/findByDistrict?district_id=${req.query.distId}&date=${req.query.date}`)
  .then(result => {
    return res.json(result.data)
  })
  .catch(err=>{
    console.log(err)
  })
})
// get appointment by maps location i.e latitude & longitude
router.get('/appoint/map',(req,res)=>{
  axios.get(`v2/appointment/centers/public/findByLatLong?lat=${req.query.lat}&long=${req.query.long}`)
  .then(result => {
    return res.json(result.data)
  })
  .catch(err=>{
    console.log(err)
  })
})
// appointment for 7 days by calendar starts here
// get appointment by calendar by district id
router.get('/appoint/cal/dist',(req,res)=>{
  axios.get(`v2/appointment/sessions/public/calendarByDistrict?district_id=${req.query.distId}&date=${req.query.date}`)
  .then(result => {
    return res.json(result.data)
  })
  .catch(err=>{
    console.log(err)
  })
})
// get appointment by calendar by pincode
router.get('/appoint/cal/pin',(req,res)=>{
  axios.get(`v2/appointment/sessions/public/calendarByPin?pincode=${req.query.code}&date=${req.query.date}`)
  .then(result => {
    return res.json(result.data)
  })
  .catch(err=>{
    console.log(err)
  })
})
// get appointment by calendar by center id
router.get('/appoint/cal/center',(req,res)=>{
  axios.get(`v2/appointment/sessions/public/calendarByCenter?center_id=${req.query.centerId}&date=${req.query.date}`)
  .then(result => {
    return res.json(result.data)
  })
  .catch(err=>{
    console.log(err)
  })
})
// appointment for 7 days by calendar ends here
// appointment apis ends here
// auth apis starts here
// auth generate otp
router.post('/auth/gen',(req,res)=>{
  axios.post('v2/auth/public/generateOTP',{
    "mobile": req.body.mobile
  })
  .then(result => {
    authtxnId = result.data.txnId
    return res.json(result.data)
  })
  .catch(err=>{
    console.log(err)
  })
})
// auth confirm otp
router.post('/auth/conf',(req,res)=>{
  let hashotp = crypto.createHash('sha256').update(req.body.otp).digest('hex')
  axios.post('v2/auth/public/confirmOTP',{
    "otp": hashotp,
    "txnId": req.body.txnId ? req.body.txnId : authtxnId
  })
  .then(result => {
    authToken = result.data.token
    return res.json(result.data)
  })
  .catch(err=>{
    console.log(err)
  })
})
// auth apis ends here
// vaccine apis starts here
// vaccine generate otp
router.post('/vaccine/gen',(req,res)=>{
  axios.post('v3/vaccination/generateOTP',{
    "mobile_number": req.body.mobile,
    "full_name": req.body.full_name,
    "email": req.body.email
  })
  .then(result => {
    vactxnId = result.data.txnId
    return res.json(result.data)
  })
  .catch(err=>{
    console.log(err)
  })
})
// vaccine confirm otp
router.post('/vaccine/conf',(req,res)=>{
  let hashotp = crypto.createHash('sha256').update(req.body.otp).digest('hex')
  axios.post('v3/vaccination/confirmOTP',{
    "otp": hashotp,
    "txnId": req.body.txnId ? req.body.txnId : vactxnId
  })
  .then(result => {
    vacToken = result.data.token
    return res.json(result.data)
  })
  .catch(err=>{
    console.log(err)
  })
})
router.get('/vaccine/status',(req,res)=>{
  let config = {
    headers: {
      "Authorization": vacToken ? vacToken : req.headers.authorization
    }
  }
  axios.get('v3/vaccination/status',config)
  .then(result => {
    return res.json(result.data)
  })
  .catch(err=>{
    console.log(err)
  })
})
router.get('/vaccine/cert',(req,res)=>{
  let config = {
    headers: {
      "Authorization": vacToken ? vacToken : req.headers.authorization
    }
  }
  axios.get(`v2/registration/certificate/public/download?beneficiary_reference_id=${req.query.refId}`,config)
  .then(result => {
    return res.json(result.data)
  })
  .catch(err=>{
    console.log(err)
  })
})
// vaccine apis ends here

module.exports = router
