const express = require('express')
const app=express();
const db = require('./db');

const bodyparser= require('body-parser')
const port =3000
app.use(bodyparser.json());

  





app.listen(port,()=>{
    console.log(`server is running on ${port}`)
})