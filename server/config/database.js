const mongoose= require('mongoose');
require('dotenv').config();

exports.connectWithDb= ()=>{
    mongoose.connect(process.env.DATABASE_URL,{
        useNewUrlParser: true,
        useUnifiedTopology: true,
    })
    .then(()=>{
        console.log("Connected to database successfully!");
    })
    .catch((error)=>{
        console.log("Error in database connection");
        console.log(error);
        process.exit(1);
    })
}

//module.exports = connectWithDb;
