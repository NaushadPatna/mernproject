const mongoose = require("mongoose");

mongoose.connect("mongodb://localhost:27017/clientRegistration",{
    // useCreateIndex:true,
    // useNewUrlParser:true,
    // useUnifiedTopology:true,
    // useFindAndModify:true
}).then( ()=>{
    console.log("connection is successfull");
}).catch((err)=>{
    console.log(err);
});


