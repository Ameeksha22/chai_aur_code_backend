import mongoose, { SchemaType }  from "mongoose";
import jwt from "jsonwebtoken"
import bcrypt from "bcrypt"

const userSchema=new Schema(
    {
      username:{
        type:String,
        required:true,
        unique:true,
        lowercase:true,
        trim:true,
        index:true//field searchable...searching enable
      }, 
      email:{
        type:String,
        required:true,
        unique:true,
        lowercase:true,
        trim:true,
      },
      fullName:{
        type:String,
        required:true,
        trim:true,
        index:true
      } ,
      Avatar:{
        type:String,//cloudinary url use krnge
        required:true,
      } ,
      coverImage:{
        type:String,//cloudinary url
      },
      watchHistory:[//is a object array
        {
            type:Schema.Types.ObjectId,
            ref:"Video"
        }
        ],
      password:{
        type:String,
        required:[true,'password is required']//custom msg also 
      },
      refreshToken:{
        type:String,
      }
    },{
        timestamps:true
    }
)
//jbbhi  data save hora ho use phle kuch kam krana h
userSchema.pre("save", async function (next) {//complex method->takes tym
    if(!this.isModified("password")) return next();//modify ni hua h to direct next return krdo else //password k modification bhju tbhi run krna h otherwise nhi krna h
    this.password = await bcrypt.hash(this.password, 10)//10 rounds//modify hua h to chnge kro run hojyga .... thn next krdo
    next()
})

//kuch methods dalne pdnge 
//user ko import kraye jb puchle password shi h ya nhi h
//custom methods

userSchema.methods.isPasswordCorrect = async function(password){
    return await bcrypt.compare(password, this.password)//logic password kaise check hoga...bcrypt hash bhi krti h and passowrd bhi check krti h
}

userSchema.methods.generateAccessToken = function(){
    return jwt.sign(//jwt has sign method who genrate tokens
        {
            _id: this._id,//found from mongodb
            email: this.email,
            username: this.username,
            fullName: this.fullName
        },
        process.env.ACCESS_TOKEN_SECRET,//2.access token k secret
        {
            expiresIn: process.env.ACCESS_TOKEN_EXPIRY
        }
    )
}
userSchema.methods.generateRefreshToken = function(){//has less info
    return jwt.sign(
        {
            _id: this._id,
            
        },
        process.env.REFRESH_TOKEN_SECRET,
        {
            expiresIn: process.env.REFRESH_TOKEN_EXPIRY
        }
    )
}


export const User=mongoose.model("User",userSchema)

//access token not stored in database