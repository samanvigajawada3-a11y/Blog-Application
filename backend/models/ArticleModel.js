import {Schema,model,Types} from 'mongoose'

const commentSchema = new Schema({
    user : {
        type : Types.ObjectId,
        ref : "user",
        required : [true,"User ID required"]
    },
    comment : {
        type : String,
        required : [true,"Enter a comment"]
    }
},{
    timestamps : true
})

const articleSchema = new Schema({
    author : {
        type : Types.ObjectId,
        ref : "user",
        required : [true,"Author Id required"]
    },
    title : {
        type : String,
        required : [true,"Title required"]
    },
    category : {
        type : String,
        required : [true,"Category required"]
    },
    content : {
        type : String,
        required : [true,"Content required"]
    },
    comments : [{type : commentSchema,default : []}],// When an author register his account his comments should be empty by default.
    isArticleActive : { // acts like a backup i.e, if you delete you account then you can make the backup
        type : Boolean,
        default : true
    }
},{
    versionKey : false,
    timestamps : true,
    strict : "throw"
})

// Create article model
export const articleModel = model("article",articleSchema)