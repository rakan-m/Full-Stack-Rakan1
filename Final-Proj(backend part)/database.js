const mongoose = require('mongoose');
const dotenv =  require('dotenv');

dotenv.config();

exports.connectDB = async () => {
    try{
        await mongoose.connect(process.env.DB_URL);
        console.log("Connected to Database!");
    }catch(error){
        console.log(error);
        process.exit(1);
    }
} 