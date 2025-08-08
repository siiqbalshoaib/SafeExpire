import express from "express"
import cors from "cors"
import cookieParser from "cookie-parser"

const app = express()

app.use(cors({
    origin: process.env.CORS_ORIGIN,
    methods: ['GET', 'POST'],
    credentials: true
}))

//app.set('trust proxy', true);// for checking ip
 
app.use(express.json({limit: "16kb"}))
app.use(express.urlencoded({extended: true, limit: "16kb"}))
app.use(express.static("public"))
app.use(cookieParser())
// Catch-all for React routes


//routes import
import userRouter from './route/userRoute.js'
import linkRouter from './route/linkRoute.js'
import contactRouter from "./route/contactRoute.js"
//routes declaration


// user routes
app.use("/api/v1/users", userRouter)

// link routes
app.use("/api/v1/link", linkRouter)

// contact routes
app.use('/api/v1/contact', contactRouter)



export { app }