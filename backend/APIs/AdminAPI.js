import exp from "express";
import {userModel} from "../models/UserModel.js"
export const adminApp = exp.Router()

// Read all USERS and AUTHORS (email)

adminApp.get("/users",async(req,res)=>{
    // Read all the users from the DB
    const users = await userModel.find({role : {$in : ["AUTHOR","USER"]}})
    // Send the response
    res.status(200).json({message : "Users List",payload : users})
})

// Block or Activate User and Author
adminApp.patch("/edit",async(req,res)=>{
    // get email from the body
    const {email,isUserActive} = req.body;
    // get ther doucument from the DB
    const userDoc = await userModel.findOne({email : email})
    // If status is different then change it.
    userDoc.isUserActive = isUserActive
    // save it in the document.
    await userDoc.save()
    // send the response
    res.status(200).json({message : "Status changed",payload : userDoc})


})