import {asyncHandler} from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { User } from "../models/user.model.js";//check user exist or not firstly import
import {uploadOnCloudinary} from "../utils/cloudinary.js"
import { ApiResponse } from "../utils/ApiResponse.js";
const registerUser=asyncHandler(async (req,res)=>{
    // return res.status(200).json({
    //     message:"ok"
    // })

                  //steps to register user
    //1.get user details from frontend
    //2. validation-not empty
    //3.check if user already exist:- useername,email{unique}
    //4. check for image,avatar,
    //5.upload on cloudinary
    //6. create user object -create entry in db
    //7. remove pass and refresh token not send to user
    //8.check fro user creation if created return res else return error

               //1. get user details from frontend
    const {fullName,email,username,password}=req.body
    console.log("email: ",email);
    //console.log("fullName: ",fullName,"email: ",email,"username: ",username,"password: ",password);

               //2. validation
    // (a) if (fullName==="") {
    //     throw new ApiError(400,"fullname is required")
    // })//status and msg from Apierror file 

    if (
        [fullName,email,username,password].some((field)=>
            field?.trim()==="")//if feild here so trim if trim krne k bd bhi empty h to true return hoga works on whole array...ek bhi feild n true return kiya means vo filed empty tha
    ) {
        throw new ApiError(400,"all fields are required")
    }
    // if (email.includes("@")) {
    // console.log("Valid: Email contains @");
    // }
    // else {
    // console.log("Invalid: Email does not contain @");
    // }

             //3.check user exist

    const existedUser= User.findOne({
        $or: [{username},{email}]
    })
    //if existed user there throw error 
    if (existedUser) {
        throw new ApiError(409,"user with email or userename already exists");
    }

                //4. check for avatar and coverimage
    //taken localpaths
    const avatarLocalPath=req.files?.Avatar[0]?.path;//multer n proper path upload kiya h vo miljyga...avatarlocalpath cuz nown it is not in cloudinary
    const coverImageLocalPath=req.files?.coverImage[0]?.path;
    //check avatar properly came or not
    if (!Avatar) {
        throw new ApiError(400,"avatar file is required");
    }

    //5. upload into cloudinary
    const Avatar=await uploadOnCloudinary(avatarLocalPath)
    const coverImage=await uploadOnCloudinary(coverImageLocalPath)

    //again check avatar pproperly gya h ya nhi
    if(!Avatar){
        throw new ApiError(400,"avatar file is required");
    }

    //6.create userobject
    const user=await User.create({
        fullName,
        Avatar:Avatar.url,//100% validation avatar h hi h cuz we checked 2 tyms 
        coverImage:coverImage?.url || "",//take care of coverimage
        email,
        username:username.toLowerCase(),
        password
    })

    //7.remove refreshtoken and password
    const createdUser=await User.findById(user._id).select(//select k use krke jojo field pass krni h vovo slect krdo insshort refreshtoken and password so dont select these 2
    "-password -refreshToken"//negtive means nhi chAHIYE
    )
    //now check actual m user aya h ya nhi
    if(!createdUser){
        throw new ApiError(500,"something went wrong while registering the user ")
    }

    //8.response         apiresponse m allow h data bhjna
    return res.status(201).json(
        new ApiResponse(200,createdUser,"user registered successfully")
    )
    //create new object apiresponse k give status code data h ki nhi h , msg 

        //ALGO SUCCESSFULLY DONE

})
//export registeruser
export {
    registerUser,
};






























