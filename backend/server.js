import exp from "express"
import { config } from 'dotenv'
import { connect } from 'mongoose'
import cookieParser from "cookie-parser"
import { userApp } from "./APIs/UserAPI.js"
import { authorApp } from "./APIs/AuthorAPI.js"
import { adminApp } from "./APIs/AdminAPI.js"
import { commonApp } from "./APIs/CommonAPI.js"
import cors from "cors"
config()

const app = exp()
// add cors middleware
app.use(cors({
    origin : [
        "http://localhost:5173",
        "https://blog-application-ymgz.vercel.app"
    ],
    credentials : true
}))


// add cookie parser middleware
app.use(cookieParser())

// body parser middleware
app.use(exp.json())

// path level middlewares
app.use("/user-api", userApp)
app.use("/author-api", authorApp)
app.use("/admin-api", adminApp)
app.use("/auth", commonApp)

// Connect to DB
const connectDB = async () => {
    try {
        await connect(process.env.DB_URL)
        console.log("DB connected")
        // assign port number
        const port = process.env.PORT || 4000
        app.listen(port,() => console.log(`Server listening on port ${port}.....`))
    } catch (err) { console.log("Error occured in DB : ", err) }
}

connectDB()

// to handle invalid path
app.use((req, res, next) => {
    res.status(404).json({ message: `path ${req.url} is invalid` })
})

//Error handling middleware
app.use((err, req, res, next) => {
  console.log("Error is :", err);
  ("Full error:", JSON.stringify(err, null, 2));
  //ValidationError
  if (err.name === "ValidationError") {
    return res.status(400).json({ message: "error occurred", error: err.message });
  }
  //CastError
  if (err.name === "CastError") {
    return res.status(400).json({ message: "error occurred", error: err.message });
  }
  const errCode = err.code ?? err.cause?.code ?? err.errorResponse?.code;
  const keyValue = err.keyValue ?? err.cause?.keyValue ?? err.errorResponse?.keyValue;

  if (errCode === 11000) {
    const field = Object.keys(keyValue)[0];
    const value = keyValue[field];
    return res.status(409).json({
      message: "error occurred",
      error: `${field} "${value}" already exists`
    });
  }

  //send server side error
  res.status(500).json({ message: "error occurred", error: "Server side error" });
});
