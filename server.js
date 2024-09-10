const express = require('express')
const app=express();
const db = require('./db');
const userrouter=require('./routes/userRouter')
const CandidateRouter=require('./routes/candidateRouter')
const bodyparser= require('body-parser')
const port =3000
app.use(bodyparser.json());
 
  



app.use('/user',userrouter)
app.use('/Candidate',CandidateRouter)

app.listen(port,()=>{
    console.log(`server is running on ${port}`)
})