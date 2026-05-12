import {Schema,model} from 'mongoose'

const userSchema = new Schema({
    firstName : {
        type : String,
        required : [true,"first name required"]
    },
    lastName : {
        type : String
    },
    email : {
        type : String,
        required : [true,"email required"],
        unique : [true,"email already exist"]
    },
    password : {
        type : String,
        required : [true,"password is required"],
    },
    role : {
        type : String,
        enum : ["USER","AUTHOR","ADMIN"],
        required : [true,`role required`]
    },
    profileImageUrl : {
        type : String
    },
    isUserActive : { // acts like a backup i.e, if you delete you account then you can make the backup
        type : Boolean,
        default : true
    }
},{
    timestamps : true,
    versionKey : false,
    strict : "throw" // If invalid occurs error need to be thrown.
})

// Create UserModel
export const userModel = model("user",userSchema)

