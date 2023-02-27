const mongoose = require('mongoose');


const urlSchema = new mongoose.Schema({ 

    longURL:{
        type:String,
        required:[true,"Please enter the original URL"],

    },
    URLid:{
        type:String,
        required:[true,"Please enter the url id"],

    },
    shortURL:{
        type:String,
        required:[true,"Please enter the short url"],
    
    }
},
{ timestamps:true }

);