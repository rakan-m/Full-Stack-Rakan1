const User = require('../models/userModel');
const bcrypt = require('bcrypt');
const crypto = require('crypto'); 
const jwt = require('jsonwebtoken');
const sendMail = require("../utils/email").sendMail;
const dotenv =  require('dotenv');
const validator = require("validator");
const {promisify} = require("util");

const signToken = (id) =>{
    return jwt.sign({id}, process.env.JWT_SECRET, { expiresIn:process.env.JWT_EXPIRES_IN });
};

const createSendToken = (user,statusCode,res,msg) => {

    const token = signToken(user._id);

    res.status(statusCode).json({
        status: "Success",
        msg,
        token,
        data: {
            user,
        },
    });
};

exports.registerUsers = async(req,res) => {
    try{
        //Check if the email is valid
        let email = req.body.email;

        if(!validator.isEmail(email)){
            return res.status(400).json({message: "Invalid email."});
        }

        //check if user exists
        const user = await User.findOne({
            $or: [{email: req.body.email}, {userName: req.body.userName}],
        });
        if(user){
            return res.status(409).json({message:"User already exists."});
        }
        //check username between 5 and 10 characters
        if(req.body.userName.length < 5 || req.body.userName.length > 10){
            return res.status(400).json({ message:"Username must be between 5 and 10 characters." });
        }

        //password of minimum 8 and max 20 char
        let password = req.body.password;
        if(password.length < 8 || password.length > 20){
            return res.status(400).json({ message:"Password must be between 8 and 20 characters." });
        }

        //check if the password and passwordConfirm are the same
        
        let confirm = req.body.passwordConfirm;
        if(password !== confirm){
            return res.status(400).json({message:"Password and passwordConfirm aren't the same."});
        }

        // Hash the user's password
        const hashedPassword = await bcrypt.hash(password, 12);

        // everything is okay create the user
        const newUser = await User.create(
            {
                firstName: req.body.firstName,
                lastName: req.body.lastName,
                userName: req.body.userName,
                email: req.body.email,
                password: hashedPassword,
                profilePicture: req.body.profilePicture
            }
        );

        const msg = "User created Succesfully!!"
        createSendToken(newUser, 201, res, msg);

    }catch(err){
        console.error(err);
        res.status(500).json({ message: 'Internal Server Error' });
    }
}

exports.login = async(req,res) => {
        try{
            //1-Check if the email or username exists in the database
            const user = await User.findOne({
                $or: [{email: req.body.email}, {userName: req.body.userName}],
            });

            if(!user){
                return res.status(401).json({message: "Incorrect credentials."});
            }
    
            //2-Check if the entered password is matching with the hashed stored password
    
            const comparePasswords = await bcrypt.compare( req.body.password, user.password );
    
            if(!comparePasswords){
                return res.status(401).json({message: "Incorrect credentials."});
            }
    
            //3-If everything is ok, Log the user in
            const msg = "You are logged in succesfully!"
            createSendToken(user, 200, res, msg);  
    
        }catch(err){
            console.error(err);
            res.status(500).json({ message: 'Internal Server Error' });
        }
}

exports.forgotPassword = async(req,res) => {
    try{
        //1.check if user with the provided email exist

        const user = await User.findOne({ email:req.body.email });

        if(!user){
            return res.status(404).json({message: "The user with the provided email does not exist."});
        }
        //2.create the reset token to be send via email
        
        const resetToken = user.generatePasswordResetToken();

        await user.save({validateBeforeSave:false}); 

        //3.send the token via email

        const url = `${req.protocol}://${req.get("host")}/api/resetPassword/${resetToken}`;
        const msg = `forgot Your password? Reset it by the following link: ${url}`;

        try{
            await sendMail({
                email:user.email,
                subject: "Your password reset token: (Valid for 10 minutes)",
                message: msg
            });
            res.status(200).json({message:"The reset Link was delivered Successfully"});
        }catch{
            user.passwordResettoken = undefined;
            user.passwordResetExpires = undefined;
            await user.save({validateBeforeSave:false});
            res.status(500).json({ message: 'Error occured, Try again' });
        }

    }catch(err){
        console.error(err);
        res.status(500).json({ message: 'Internal Server Error' });
    }
}

exports.resetPassword = async(req,res) => {
    try{
        const hashedToken = crypto.createHash("sha256").update(req.params.token).digest("hex");
        const user = await User.findOne({
            passwordResettoken: hashedToken, 
            passwordResetExpires: {$gt: Date.now()}
        });
    if(!user){
        return res.status(400).json({message: "The token is invalid or expired, please request a new one."});
    }

    if(req.body.password.length < 8 || req.body.password.length > 20){
        return res.status(400).json({message: "Password Length must be between 8 and 20 characters."});
    }

    if(req.body.password !== req.body.passwordConfirm){
        return res.status(400).json({message: "Password and passwordConfirm aren't the same."});
    }
    user.password = req.body.password;
    user.passwordConfirm = req.body.passwordConfirm;
    user.passwordResettoken = undefined;
    user.passwordResetExpires = undefined;
    user.passwordChangedAt = Date.now();

    await user.save();

    const msg = "Password changed Successfully."
    createSendToken(user, 200, res, msg);

 }catch(err){
    console.error(err);
    res.status(500).json({ message: 'Internal Server Error' });
 }
}

exports.protect = async (req,res,next) =>{
    try{
        //1-Check if the token owner still exists
        let token;
        
        if(req.headers.authorization && req.headers.authorization.startsWith("Bearer")){
            token = req.headers.authorization.split(" ")[1];
        }

        if(!token){
            return res.status(401).json({message:"You aren't logged in. Please login to get access"});

        }
        //2-Verify the token (by decoding the token)
        let decoded;
        try{
            decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);

        }catch(error){
            console.log(error);
            if(error.name === "JsonWebTokenError"){
                return res.status(401).json({message:"Invalid token, login again"});
            }
            else if(error.name === "TokenExpiredError"){
                return res.status(401).json({message: "Your session token has expired. Please login again"});
            }
        }

        //3-Check if the token owner exist
        const currentUser = await User.findById(decoded.id);
        if(!currentUser){
            return res.status(401).json({message:"The user belonging to this session no longer exist"});
        }

        //4-Check if the owner changed the password after the token was created

        if(currentUser.passwordChanged(decoded.iat)){ //iat: time when token was issued 

            return res.status(401).json({message:"Your password has been changed! Please login again"});

        }

        //5-If everything is ok: ADD the user to all the requests (req.user = currentUser)
        req.user = currentUser;
        next();

    }catch(err){
        console.error(err);
        res.status(500).json({ message: 'Internal Server Error' });
    }
};

//Social media sharing buttons, allowing users to share recipes with friends and family.