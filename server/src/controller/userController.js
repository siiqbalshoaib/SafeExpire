import { asyncHandler } from "../utils/asyncHandler.js";
import {ApiError} from "../utils/ApiError.js"
import { User} from "../models/userModel.js"
import { ApiResponse } from "../utils/ApiResponse.js";


const generateAccessToken = async(userId) =>{
    try {
        const user = await User.findById(userId)
        const accessToken = user.generateAccessToken()
       
        await user.save({ validateBeforeSave: false })

        return {accessToken}


    } catch (error) {
        throw new ApiError(500, "Something went wrong while generating referesh and access token")
    }
}


const registerUser = asyncHandler(async(req, res) =>{
    const {email, password, name} = req.body;
    if (
      //[name, email, password].some((field) => field?.trim() === "")
      
       [name, email, password].some((field) => String(field).trim() === "")


    ) {
        throw new ApiError(400, "All fields are required")
    }
    // checking if user existed
    const existedUser = await User.findOne({
        $or: [{ email }]
    })

    if (existedUser) {
        throw new ApiError(409, "User with email or username already exists")
    }


    // create user 
    const user = await User.create({
        email,
        name,
        password
        
    })

    const createdUser = await User.findById(user._id).select(
        "-password -refreshToken"
    )

    if (!createdUser) {
        throw new ApiError(500, "Something went wrong while registering the user")
    }

    return res.status(201).json(
        new ApiResponse(200, createdUser, "User registered Successfully")
    )


})

const loginUser = asyncHandler(async(req,res)=>{
    const{email,password} = req.body;
    if (!email) {
        throw new ApiError(400, "username or email is required")
    }
    const user = await User.findOne({
        $or: [{email}]
    })
    if (!user) {
        throw new ApiError(404, "User does not exist")
    }

    const isPasswordValid = await user.isPasswordCorrect(password)

   if (!isPasswordValid) {
    throw new ApiError(401, "Invalid user credentials")
    }

    const {accessToken} = await generateAccessToken(user._id)

   
    const loggedInUser = await User.findById(user._id).select("-password -accessToken")

    
     return res
     .json(
        new ApiResponse(
            200, 
            {
                user: loggedInUser, accessToken
            },
            "User logged In Successfully"
        )
    );

})

const logoutUser = asyncHandler(async(req, res) => {
    await User.findByIdAndUpdate(
        req.user._id,
        {
            $unset: {
                accessToken: 1 // this removes the field from document
            }
        },
        {
            new: true
        }
    )

    

    return res
    .status(200)
    .clearCookie("accessToken")
    
    .json(new ApiResponse(200, {}, "User logged Out"))
})
export {
    registerUser,
    loginUser,
    logoutUser
    
}