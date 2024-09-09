const  mongoose = require('mongoose');

const   mongodbURL="mongodb://127.0.0.1:27017/votingAPP"
mongoose.connect(mongodbURL).then(()=>{
    console.log("db connection successful")
})
db=mongoose.connection
module.exports=db;
