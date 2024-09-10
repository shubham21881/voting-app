const express=require('express');
const router=express.Router();
const Candidate= require('../models/candidate')
const user=require('../models/user')
 
//  function for checking admin
const Checkingadmin=()=>{
    const data=req.body.role;
    if(data==="admin") {
        return true
    }
    else{
        return false
    }
    
}


// post candidate details
 
router.post('/',async (req,res)=>{
    const data= req.body
    const newCandidate= new Candidate(data);
    const savedCandidate= await newCandidate.save();
    res.send(savedCandidate)
    // res.status(200).json({error:"candidate succussefull saved"})
    
})

//  update routes for Candidate 
router.put('/:CandidateID', async (req,res)=>{
    const data=req.params.CandidateID
    updateddata=req.body;
    const response= await Candidate.findByIdAndUpdate(data,updateddata,{
        new: true, // Return the updated document
        runValidators: true, // Run Mongoose validation)
})

if (!response) {
    return res.status(404).json({ error: 'Candidate not found' });
}
console.log('candidate data updated');
res.status(200).json(response);

})

// delete routes   for candidate
 
router.delete('/:CandidateID', async (req,res)=>{
    const data=req.params.CandidateID
    const response = await Candidate.findByIdAndDelete(data)
    if (!response) {
        return res.status(404).json({ error: 'Candidate not found' });
    }

    console.log('candidate deleted');
    res.status(200).json(response);
    
    

})


// let start voting
 
router.get('/vote/:candidateID/:userID', async (req,res)=>{
      
     const  candidateID = req.params.candidateID;
      const       userId = req.params.userID;

      // Find the Candidate document with the specified candidateID
      const candidate = await Candidate.findById(candidateID);
      if(!candidate){
          return res.status(404).json({ message: 'Candidate not found' });
      }
       
      const User = await user.findById(userId);
        if(!User){
            return res.status(404).json({ message: 'user not found' });
        }
       
        if(User.role == 'admin'){
            return res.status(403).json({ message: 'admin is not allowed'});
        }
        if(User.isVoted){
            return res.status(400).json({ message: 'You have already voted' });
        }
     
        // Update the Candidate document to record the vote
        candidate.voter.push({user: userId})
        candidate.voteCount++;
        await candidate.save();

        // update the user document

        User.isVoted = true
        await User.save();

        return res.status(200).json({ message: 'Vote recorded successfully' });




})

// vote counting
router.get('/vote/count', async (req,res)=>{
    // Find all candidates and sort them by voteCount in descending order
    const candidate = await Candidate.find().sort({voteCount: 'desc'});
    // Map the candidates to only return their name and voteCount
    const voteRecord = candidate.map((data)=>{
        return {
            party: data.party,
            count: data.voteCount
        }
    });

    return res.status(200).json(voteRecord);
})

// Get List of all candidates with only name and party fields
router.get('/', async (req,res)=>{
     // Find all candidates and select only the name and party fields, excluding _id
     const candidates = await Candidate.find({}, 'name party _id ');
     res.status(200).json(candidates);

})


module.exports=router
