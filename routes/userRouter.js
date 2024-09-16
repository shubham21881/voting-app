const express=require('express');
const router=express.Router();
const user=require('../models/user')
const {jwtAuthMiddleware, generateToken} = require('../Auth');
const bcrypt = require('bcrypt');




//  post route to add a person
router.post('/signup', async(req,res)=>{
     
    const data=req.body;
    const adminUser= await user.findOne({role:'admin'})
    if(data.role==='admin'&& adminUser){
        return res.status(400).json({error:'admin user already exists '})
    }

    if(!/^\d{12}$/.test(data.aadharCardNumber)){
        return res.status(400).json({error:"aadhar card must be 12 digit"})

    }
     
    const existingUser= await user.findOne({aadharCardNumber:data.aadharCardNumber})

    if(existingUser){
        return res.status(400).json({ error: 'User with the same Aadhar Card Number already exists' });

    }

     // Create a new User document using the Mongoose model
     const newUser = new user(data);
     const response = await newUser.save();
     console.log('data saved');

      const payload={
        id:response.id
      }
      console.log(JSON.stringify(payload));
       const token = generateToken(payload)
       console.log(token)

        res.status(200).json({response: response, token: token});
 
})


// login route
 
router.post('/login',async (req,res)=>{
        // Extract aadharCardNumber and password from request body
   const {aadharCardNumber,password}=req.body
        // Check if aadharCardNumber or password is missing
        if(!aadharCardNumber||!password){
            return res.status(400).json({error:"Aadhar Card Number and password are required"})
        }
        // Find the user by aadharCardNumber
      const User= await user.findOne({aadharCardNumber:aadharCardNumber});
        // If user does not exist or password does not match, return error
   if(!User||!(await User.comparePassword(password))){
     return res.status(401).json({error:"invalid  aadhar card number or password"})
   }
    // generate Token 
    const payload = {
        id: User.id,
    }
    const token = generateToken(payload);
    // return token  as response 
    res.json({token})

  
})

// Profile route
router.get('/profile', jwtAuthMiddleware,async (req,res)=>{
    const userData= req.User;
    console.log(userData)
    const userId= userData.id;
    const User= await user.findById(userId);
    res.status(200).json({User});
})


router.put('/profile/password', jwtAuthMiddleware, async (req, res) => {
  try {
      const userId = req.User.id; // Extract the id from the token
      const { currentPassword, newPassword } = req.body; // Extract current and new passwords from request body

      // Check if currentPassword and newPassword are present in the request body
      if (!currentPassword || !newPassword) {
          return res.status(400).json({ error: 'Both currentPassword and newPassword are required' });
      }

      // Find the user by userID
      const user = await user.findById(userId);

      // If user does not exist or password does not match, return error
      if (!user || !(await User.comparePassword(currentPassword))) {
          return res.status(401).json({ error: 'Invalid current password' });
      }

      // Update the user's password
      user.password = newPassword;
      await user.save();

      console.log('password updated');
      res.status(200).json({ message: 'Password updated' });
  } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Internal Server Error' });
  }
});


module.exports=router