const express=require('express');
const router=express.Router();
const user=require('../models/user')



router.post('/signup',async (req,res)=>{
    const userData=req.body
    const newuser= new user(userData);
    const saveduser= await newuser.save()
    //   console.log(saveduser);
      res.send(saveduser)
      
})

router.post('/login',async (req,res)=>{
    const useraadharcard= req.body.aadharCardNumber;
    const userpassword=req.body.password
    // const userData= req.body.password
    if(!useraadharcard ||!userpassword)return res.status(400).json({error:" aadhar no. or passord both  is required"})
    // checking first with aadhar no.
    const matchinguser= await user.find({aadharCardNumber:useraadharcard,password:userpassword});
    // if(!matchinguser) return res.status(400).json({error:"invalid user"})
    if (matchinguser.length === 0) return res.status(400).json({ error: "invalid user" });

    // console.log(matchinguser);
    res.send("now you are login")
    
})









module.exports=router