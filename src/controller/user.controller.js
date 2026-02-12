import { asyncHandler } from "../utils/asyncHandler.js";
import {ApiError} from "../utils/ApiError.js"
import { User} from "../models/user.model.js"
import {uploadOnCloudinary} from "../utils/cloudinary.js"
import { ApiResponse } from "../utils/ApiResponse.js";
import jwt from "jsonwebtoken"
import mongoose from "mongoose";


const generateAccessAndRefereshTokens = async(userId) =>{
    try {
        const user = await User.findById(userId)
        const accessToken = user.generateAccessToken()
        const refreshToken = user.generateRefreshToken()

        user.refreshToken = refreshToken
        await user.save({ validateBeforeSave: false })

        return {accessToken, refreshToken}


    } catch (error) {
        throw new ApiError(500, "Something went wrong while generating referesh and access token")
    }
}

const registerUser = asyncHandler( async (req, res) => {
    // get user details from frontend
    // validation - not empty
    // check if user already exists: username, email
    // check for images, check for avatar
    // upload them to cloudinary, avatar
    // create user object - create entry in db
    // remove password and refresh token field from response
    // check for user creation
    // return res


    const {fullName, email, username, password } = req.body
    //console.log("email: ", email);

    if (
        [fullName, email, username, password].some((field) => field?.trim() === "")
    ) {
        throw new ApiError(400, "All fields are required")
    }

    const existedUser = await User.findOne({
        $or: [{ username }, { email }]
    })

    if (existedUser) {
        throw new ApiError(409, "User with email or username already exists")
    }
    //console.log(req.files);

    const avatarLocalPath = req.files?.avatar[0]?.path;
    //const coverImageLocalPath = req.files?.coverImage[0]?.path;

    let coverImageLocalPath;
    if (req.files && Array.isArray(req.files.coverImage) && req.files.coverImage.length > 0) {
        coverImageLocalPath = req.files.coverImage[0].path
    }
    

    if (!avatarLocalPath) {
        throw new ApiError(400, "Avatar file is required")
    }

    const avatar = await uploadOnCloudinary(avatarLocalPath)
    const coverImage = await uploadOnCloudinary(coverImageLocalPath)

    if (!avatar) {
        throw new ApiError(400, "Avatar file is required")
    }
   

    const user = await User.create({
        fullName,
        avatar: avatar.url,
        coverImage: coverImage?.url || "",
        email, 
        password,
        username: username.toLowerCase()
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

} )

// //export registeruser
export {
    registerUser,
};



























// import {asyncHandler} from "../utils/asyncHandler.js";
// import { ApiError } from "../utils/ApiError.js";
// import { User } from "../models/user.model.js";//check user exist or not firstly import
// import {uploadOnCloudinary} from "../utils/cloudinary.js"
// import { ApiResponse } from "../utils/ApiResponse.js";
// const registerUser=asyncHandler(async (req,res)=>{
//     // return res.status(200).json({
//     //     message:"ok"
//     // })

//                   //steps to register user
//     //1.get user details from frontend
//     //2. validation-not empty
//     //3.check if user already exist:- useername,email{unique}
//     //4. check for image,avatar,
//     //5.upload on cloudinary
//     //6. create user object -create entry in db
//     //7. remove pass and refresh token not send to user
//     //8.check fro user creation if created return res else return error

//                //1. get user details from frontend
//     const {fullName,email,username,password}=req.body
//     console.log("email: ",email);
//     //console.log("fullName: ",fullName,"email: ",email,"username: ",username,"password: ",password);

//                //2. validation
//     // (a) if (fullName==="") {
//     //     throw new ApiError(400,"fullname is required")
//     // })//status and msg from Apierror file 

//     if (
//         [fullName,email,username,password].some((field)=>
//             field?.trim()==="")//if feild here so trim if trim krne k bd bhi empty h to true return hoga works on whole array...ek bhi feild n true return kiya means vo filed empty tha
//     ) {
//         throw new ApiError(400,"all fields are required")
//     }
//     // if (email.includes("@")) {
//     // console.log("Valid: Email contains @");
//     // }
//     // else {
//     // console.log("Invalid: Email does not contain @");
//     // }

//              //3.check user exist

//     const existedUser= await User.findOne({
//         $or: [{username},{email}]
//     })
//     //if existed user there throw error 
//     if (existedUser) {
//         throw new ApiError(409,"user with email or userename already exists");
//     }

//                 //4. check for avatar and coverimage
//     //taken localpaths
//     //multer n proper path upload kiya h vo miljyga...avatarlocalpath cuz nown it is not in cloudinary
//     const avatarLocalPath = req.files?.avatar?.[0]?.path;
//     const coverImageLocalPath = req.files?.coverImage?.[0]?.path;
//     //check avatar properly came or not
//     if (!avatarLocalPath) {
//         throw new ApiError(400,"avatar file is required");
//     }
//     console.log("req.files:", req.files);
//     //5. upload into cloudinary
//     const avatar=await uploadOnCloudinary(avatarLocalPath);
//     console.log("cloudinary response :",avatar);
    
//     const coverImage=await uploadOnCloudinary(coverImageLocalPath);

//     //again check avatar pproperly gya h ya nhi
//     if(!avatar){
//         throw new ApiError(400,"avatar file is required");
//     }

//     //6.create userobject
//     const user=await User.create({
//         fullName,
//         avatar:avatar.url,//100% validation avatar h hi h cuz we checked 2 tyms 
//         coverImage:coverImage?.url || "",//take care of coverimage
//         email,
//         username:username.toLowerCase(),
//         password
//     })

//     //7.remove refreshtoken and password
//     const createdUser=await User.findById(user._id).select(//select k use krke jojo field pass krni h vovo slect krdo insshort refreshtoken and password so dont select these 2
//     "-password -refreshToken"//negtive means nhi chAHIYE
//     )
//     //now check actual m user aya h ya nhi
//     if(!createdUser){
//         throw new ApiError(500,"something went wrong while registering the user ")
//     }

//     //8.response         apiresponse m allow h data bhjna
//     return res.status(201).json(
//         new ApiResponse(200,createdUser,"user registered successfully")
//     )
//     //create new object apiresponse k give status code data h ki nhi h , msg 

//         //ALGO SUCCESSFULLY DONE

// })
// //export registeruser
// export {
//     registerUser,
// };






























