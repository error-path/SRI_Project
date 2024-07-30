const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const userSchema2 = new mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true,
        unique:true
    },
    position_required:{
        type:String,
        required:true
    },
    required_cpi:{
        type:mongoose.Types.Decimal128,
        required:true
    },
    package:{
        type:String,
        required:true
    },
    website:{
        type:String,
        required:true,
    },
    description:{
        type:String,
        required:true
    },
    address:{
        type:String,
        required:true
    },
    password:{
        type:String,
        required:true
    },
    confirmpassword:{
        type:String,
        
    },
    tokens:[{
        token:{
            type:String,
            required:true
        }
    }]
})

userSchema2.methods.generateAuthToken = async function(){
    try{
        const token = jwt.sign({_id:this._id.toString()},process.env.SECRET_TOKEN_KEY);
        this.tokens = this.tokens.concat({token:token});
        await this.save();
        return token;
    }catch(error){
        console.log(error);
    }
}

userSchema2.pre("save", async function(next){// to execute before "save"

    if(this.isModified("password")){ // if a user changes its password then only it will hash
        const hashed_password = await bcrypt.hash(this.password,10); //this.password = the password of the current template
        console.log(`hashed password :- ${hashed_password}`);
        this.password=hashed_password;
        this.confirmpassword=undefined;
        next(); // to execute the next line of code in app.js
    } 
})


const company_signup_register = new mongoose.model("Company Register",userSchema2) 
// collection name

module.exports=company_signup_register;
