import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
    username:{
        type:String,
        required:[true,"Username is required"],
        trim:true
    },
    email:{
        type:String,
        required:true,
        unique:true,
        match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Please provide a valid email'],
        trim:true
    },
    password:{
        type:String,
        select:false,
        minlength:[6,"Password must be atleast 6 characters long"]
    },
    twoFactorEnabled:{
        type:Boolean,
        default:false
    },
    twoFactorSecret:{
        type:String,
        default:null
    },
    image:{
        type:String,
        default:null
    },
    createdAt:{
        type:Date,
        default:Date.now
    },
    lastLogin:{
        type:Date,
        default:null
    },
    loginHistory:[{
        timestamp:{
            type:Date,
            default:Date.now
        },
        ipAddress:{
            type:String,
            default:null
        },
        // userAgent:{
        //     type:String,
        //     default:null
        // },
        success:{
            type:Boolean,
            default:true
        }
    }
    ],
    passwordLastChanged:{
        type:Date,
        default:Date.now
    }
});



//used optional chaining operator for resolving undefined user model error
const User=mongoose.models?.User || mongoose.model('User',UserSchema);
export default User;