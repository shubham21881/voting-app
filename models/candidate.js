
const  mongoose = require('mongoose');


const CandidateSChema= new mongoose.Schema({
    ame: {
        type: String,
        required: true
    },
    party: {
        type: String,
        required: true
    },
    age: {
        type: Number,
        required: true
    },
    voter:[{
        user:{
            type:mongoose.Schema.Types.ObjectId,
            ref:'user',
            required:true
        },
        votedAt:{
            type:Date,
            default:Date.now()
        }
    }],
    voteCount:{
        type:Number,
        default:0
    }
},{timestamps:true})

const Candidate = mongoose.model('Candidate',CandidateSChema);
module.exports=Candidate;