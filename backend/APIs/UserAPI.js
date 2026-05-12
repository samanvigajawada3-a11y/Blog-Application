import exp from "express";
import {articleModel} from "../models/ArticleModel.js"
import {verifyToken} from "../middlewares/VerifyToken.js"
export const userApp = exp.Router()

// Read articles of all the authors
userApp.get("/articles",verifyToken("USER"),async(req,res)=>{
    // Read articles
    const articlesList = await articleModel
                            .find({isArticleActive : true})
                            .populate("comments.user")
    // send the response
    res.status(200).json({message : "Articles",payload : articlesList})

})

// Add comment to an article
userApp.put("/articles",verifyToken("USER"),async (req,res) => {
   try{
    // get the body from req
    const {articleId,comment} = req.body
    // check the article
    const articleDocument = await articleModel
                          .findOne({ _id: articleId, isArticleActive: true })
    // if article not found
    if(!articleDocument){
        return res.status(404).json({message : "Article unavailable"})
    }
    // get user id
    const userId = req.user?._id
    // add comment to comments array of articleDocument
    articleDocument.comments.push({user : userId,comment : comment})
    // save article
    await articleDocument.save()

    // 🔥 IMPORTANT: populate AFTER saving
    const updatedArticle = await articleModel
      .findOne({ _id: articleId })
      .populate("comments.user");

    // send response
    res.status(200).json({message : "Comment added successfully",payload : updatedArticle})
   }catch (err) {
    res.status(500).json({ message: "Error adding comment" });
  }
})