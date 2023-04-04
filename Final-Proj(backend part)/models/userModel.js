const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const crypto = require('crypto');

const userSchema = new mongoose.Schema({

    firstName:{
        type:String,
        required:[true,"Please enter your first name"],
        trim:true,
    },

    lastName:{
        type:String,
        required:[true,"Please enter your last name"],
        trim:true,
    },

    userName:{
        type:String,
        required:[true,"Please enter your username"],
        trim:true,
        unique:true,
        minLength:5,
        maxLength:20
    },

    email:{
        type:String,
        required:[true,"Please enter your email"],
        trim:true,
        unique:true,
        lowercase:true,
    },

    password:{
        type:String,
        trim:true,
        minLength:8,
        maxLength:60
    },
    passwordConfirm:{
        type:String,
        trim:true,
        minLength:8,
        maxLength:60
    },
    
    isAdmin: Boolean,
    
    passwordChangedAt: Date,
    passwordResettoken: String,
    passwordResetExpires: Date,

    profilePicture: {
        type: String
    },

    favoriteRecipes:[
        {
            type:Schema.Types.ObjectId,
            ref:'Recipe'
        },
    ],
},

{ timestamps:true });

//function will create a random reset token
userSchema.methods.generatePasswordResetToken = function () {

    const resetToken = crypto.randomBytes(32).toString('hex'); //sent via email
    //saved in db in a hashed way
    this.passwordResettoken = crypto.createHash('sha256').update(resetToken).digest('hex'); 

    this.passwordResetExpires = Date.now() + 10 * 60 * 1000; //10 minutes
    return resetToken;
};

//check if password was changed after issuing jwt token
userSchema.methods.passwordChanged = function (JWTTimestamp) {
    if(this.passwordChangedAt){
        const passChangeTime = parseInt(
            this.passwordChangedAt.getTime() / 1000,
            10
        );
        
        return passChangeTime > JWTTimestamp;
    }
    return false;
};

module.exports = mongoose.model('User',userSchema);