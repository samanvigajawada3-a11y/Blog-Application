import jwt from "jsonwebtoken"
const {verify} = jwt

export const verifyToken = (...allowedRoles)=>{
    return (req,res,next)=>{
        try{
        // Get token from cookie
        const token = req.cookies?.token
        // if request is from unauthorised user then token is undefined
        if(!token){
            return res.status(401).json({message : "Please login to the application"})
        }
        // Validate the token - decode it
        // If token exists then ckeck whether it is expired or not
        // verify token throws error if the token is invalid.
        const decodedToken = verify(token,process.env.SECRET_KEY)
        // check the role is same as role in decodedToken
        if(!allowedRoles.includes(decodedToken.role)){
            return res.status(403).json({message : "You are not authorised"})
        }
        // add decoded token 
        req.user = decodedToken // req.user has _id, email and role.
        next()
    }catch(err){
        res.status(401).json({message : "Invalid Token. Please relogin!"})
    }
    }
}