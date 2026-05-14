import exp from "express";
import { userModel } from "../models/UserModel.js";
import { articleModel } from "../models/ArticleModel.js";
import { verifyToken } from "../middlewares/VerifyToken.js";
export const authorApp = exp.Router()

// Create new Article (protected route)
authorApp.post("/articles", verifyToken("AUTHOR"),async (req, res) => {
    // get articleObj from client
    const articleObj = req.body
    // get user from decoded token
    let user = req.user
    // get author details from DB using author id which is provided in req.body
    let author = await userModel.findById(articleObj.author)
    // Check the author
    if (!author){
        return res.status(404).json({ message: "Invalid Author" })
    }
    // check whether the author who is publishing and who is loged in are same or not.
    if(author.email !== user.email){
        return res.status(403).json({ message: "You are not allowed to publish other author's articles." })
    }
    // Create article document
    const articleDoc = new articleModel(articleObj)
    // save
    await articleDoc.save()
    // send the response
    res.status(201).json({ message: "Article published" })
})

// Read own articles
authorApp.get("/articles",verifyToken("AUTHOR"),async(req,res)=>{
    // get currently loged author's details from decoded token
    const authorIdOfToken = req.user?._id
    // read the document using id
    const articlesList = await articleModel.find({author : authorIdOfToken})
    // send the response
    res.status(200).json({message : "Articles",payload : articlesList})
})

// Update own article
authorApp.put("/articles",verifyToken("AUTHOR"),async(req,res)=>{
    // get the currenlty logged author's details from decoded token
    let authorId = req.user?._id
    // get article from the req body
    const {articleId,title,category,content} = req.body
    // update the article
    const updatedArticle = await articleModel.findOneAndUpdate({_id : articleId,author : authorId},{$set : {title,category,content}},{new : true})
    //if either of the articleId and author are not correct
    if(!updatedArticle){
        return res.status(403).json({message : "You are not authorized to edit the article"})
    }
    // send the response
    res.status(200).json({message : "Article updated",payload : updatedArticle})
})

// Delete own Article by Article ID (soft delete)
authorApp.patch("/articles",verifyToken("AUTHOR"),async(req,res)=>{
    // get the currenlty logged author's id from decoded token
    let authorId = req.user?._id
    // get article from the req body
    const {articleId, isArticleActive} = req.body
    // get article by id
    const articleOfDB = await articleModel.findOne({_id : articleId,author : authorId})
    // check the status
    if(isArticleActive === articleOfDB.isArticleActive){
        return res.status(200).json({message : "Article already exist"})
    }
    articleOfDB.isArticleActive = isArticleActive
    await articleOfDB.save()
    // Send the response
    res.status(200).json({message : "Article modified",payload : articleOfDB})
})
