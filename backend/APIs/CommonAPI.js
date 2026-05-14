import exp from "express";
import {hash,compare} from "bcryptjs";
import {verifyToken} from "../middlewares/VerifyToken.js";
import {userModel} from "../models/UserModel.js"
// import {verifyToken} from "../middlewares/VerifyToken.js";
import jwt from "jsonwebtoken"
const {sign} = jwt

import {upload} from "../config/multer.js"
import {uploadToCloudinary} from "../config/cloudinaryUpload.js"
import cloudinary from "../config/cloudinary.js"
import {config} from "dotenv"
config()

export const commonApp = exp.Router()

// Route for registration(USER, AUTHOR)
commonApp.post("/users",upload.single("profileImageUrl"),async(req,res)=>{
    let cloudinaryResult;
    try{
        // Check the role because admin should have authorization
        const allowedRoles = ["USER","AUTHOR"]
        // get user from req
        const newUser = req.body
        if(!allowedRoles.includes(newUser?.role)){
            return res.status(400).json({message : "Invalid role"})
        }
        // Upload image to cloudinary from memoryStorage
        if(req.file){
            cloudinaryResult = await uploadToCloudinary(req.file.buffer)
        }
        // add CDN link(secure_url) of image to newUserObj
        newUser.profileImageUrl = cloudinaryResult?.secure_url

        // To check whether the password is empty or not run validators.
        // run validators manually. Reason : To check the data sent by the client is valid or not.
        // hash password and replace plain with hashed one
        newUser.password = await hash(newUser.password,12)
        // create new user document
        const newUserDoc = new userModel(newUser)
        // save the document
        await newUserDoc.save() // validators run here. NOTE : validators run while saving but not while updating.
        // send the response
        res.status(201).json({message : "User created"})
    }catch(err){}

})
 
// Route for login(USER, AUTHOR, ADMIN) - Submit credentials and get the token
commonApp.post("/login",async(req,res)=>{
    // No need to check the roles again beause we've already verified them while registering.
    // get user credentials
    const {email,password} = req.body
    // verify email
    const user = await userModel.findOne({email : email})
    if(!user){
        return res.status(404).json({message : "Invalid email"})
    }
    // if email is valid then verify passwords
    const isMatched = await compare(password,user.password) // first - plain string then hashed password
    if(!isMatched){
        return res.status(404).json({message : "Invalid password"})
    } 
    // If both email and password verified then generate the token
    const signedToken = sign({_id : user._id,
            email : user.email,
            role : user.role,
            firstName: user.firstName,
            lastName: user.lastName,
            profileImageUrl: user.profileImageUrl,
        },
        process.env.SECRET_KEY,{expiresIn : "7d"})
    // Add this info to the header part of the token
    const isProd = process.env.NODE_ENV === "production"
    res.cookie("token",signedToken,{httpOnly : true, secure : isProd, sameSite : isProd ? "none" : "lax"})
    // After login, show you details but not password. So, delete the password
    const userObj = user.toObject() // Convert document to object
    delete userObj.password // delete the password
    // send the response after deleting the password
    res.status(200).json({message : "Login Successful",payload : userObj})
})

// Route for logout - Delete the token
commonApp.get("/logout",(req,res)=>{
    // delete the token from the cookie storage
    const isProd = process.env.NODE_ENV === "production"
    res.clearCookie("token",{
        httpOnly : true,
        secure : isProd,
        sameSite : isProd ? "none" : "lax"
    })
    // send the response
    res.status(200).json({message : "Logout successful"})
})

// Page refresh
commonApp.get("/check-auth",verifyToken("USER","AUTHOR","ADMIN"),(req,res)=>{
    res.status(200).json({message : "authenticated",payload : req.user})
})


// Route to change password
commonApp.put("/password",verifyToken("USER","AUTHOR","ADMIN"),async(req,res)=>{
    // check the current password and new password are same
    const {currentPassword,newPassword} = req.body
    if(currentPassword === newPassword){
        return res.status(200).json({message : "Current and new passwords are same"})
    }
    // get current password  of user/admin/author
    const email = req.user?.email
    const userDB = await userModel.findOne({email : email})
    // check the current password of req and user not same
    const isMatch = await compare(currentPassword,userDB.password)  // current password : plain password, userDB.password : hashed one
    if(!isMatch){
        return res.status(404).json({message : "Current password is invalid"})
    }
    // hash the new password
    const hashedPassword = await hash(newPassword,12)
    // replace current password with hased new password
    userDB.password = hashedPassword
    // save
    await userDB.save()
    // send the response
    res.status(200).json({message : "Password changed"})
})
