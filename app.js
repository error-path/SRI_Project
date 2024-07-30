require('dotenv').config();
const express = require('express');
const app = express();
const path = require('path');
//bcrypt hashing
const bcrypt = require('bcryptjs');
const jwt = require("jsonwebtoken");
const cookieParser = require("cookie-parser");
const session = require('express-session');
var flash = require('connect-flash');
const hostname = '127.0.0.1';
const port = process.env.PORT || 6010;
const student_Register = require("./registers/students_registers.js") //used in post/register
const company_Register = require("./registers/company_registers.js") //used in post/register
const auth_student = require("./authorization/auth_student.js");
const auth_company = require("./authorization/auth_company.js");
require("./db/loginsignup");
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({extended:false}));
app.use('/static',express.static('views')) //to access css files stored in ./views/css
app.use(session({
    secret:'flashblog',
    saveUninitialized: true,
    resave: true
}));
app.use(flash());

console.log(__dirname)
// app.set('views',path.join(__dirname,'views'))
const static_path = path.join(__dirname+"/views");
app.set('view engine', 'ejs');

app.get('/',(req,res)=>{
    res.status(200).render('home',{message:''});
});
app.get('/company_signup',(req,res)=>{
    res.status(200).render('company_signup',{message:''});
});
app.get('/company_login',(req,res)=>{
    res.status(200).render('company_login',{message:''});
});
app.get('/student_login',(req,res)=>{
    res.status(200).render('student_login',{message:''});
});
app.get('/student_signup',(req,res)=>{
    res.status(200).render('student_signup',{message:''});
});
//SIGNUP
app.post('/student_signup_register',async (req,res)=>{
    try{
        const password = req.body.password;
        const cpassword = req.body.confirmpassword;

        if(password === cpassword){
            //get data 
            const registerUser = new student_Register({
                name:req.body.name,
                email:req.body.email,
                age:req.body.age,
                gender:req.body.gender,
                cpi:req.body.cpi,
                batch:req.body.batch,
                techstack:req.body.techstack,
                password:password,
                confirmpassword:cpassword
            })
            //generate token
            const token = await registerUser.generateAuthToken();
            
            console.log(`User data:-${registerUser}`);
            
            //get token and store in cookies
            res.cookie("jwt",token); //cookie name and token value to add

            //password hashing

            //save data to database
            const registerd = await registerUser.save();
            
            res.status(201).render("student_profile",{user_info:registerUser,message:''}) // 201 status code if we create something
        }
        else{
            res.send("Passwords are not matching"); // not goona work used because js is used in html
        }

    }catch(error){
        req.flash('already_email','The Account is already registered, Login to continue!')
        res.status(201).render("student_signup",{message:req.flash('already_email')});
    }
})
app.post('/company_signup_register',async (req,res)=>{
    try{
        const password = req.body.password;
        const cpassword = req.body.confirmpassword;
        
        if(password === cpassword){
            //get data 
            const registerUser = new company_Register({
                name:req.body.name,
                email:req.body.email,
                required_cpi:req.body.req_cpi,
                website:req.body.website,
                position_required:req.body.post,
                package:req.body.package,
                description:req.body.description,
                address:req.body.address,
                password:password,
                confirmpassword:cpassword
            })
            const token = await registerUser.generateAuthToken();
            
            console.log(`User data:-${registerUser}`);
            
            res.cookie("jwt",token);
            
            const registerd = await registerUser.save();
            res.status(201).render("company_profile",{user_info:registerUser,message:''}); // 201 status code if we create something
        }
        else{
            res.send("Passwords are not matching");
        }
    }catch(error){
        req.flash('already_email','The Company is already registered, Login to continue!')
        res.status(201).render("company_signup",{message:req.flash('already_email')});
    }
})
//LOGIN
app.post('/student_login_register',async (req,res)=>{
    try{
        const email = req.body.email;
        const password = req.body.password;

        const user_email = await student_Register.findOne({email:email});

        const is_password_match = await bcrypt.compare(password,user_email.password);

        const token = await user_email.generateAuthToken();
        console.log(`\ntoken :- ${token}\n`);
        
        res.cookie("jwt",token);

        if(is_password_match){
            res.status(201).render("student_profile",{user_info:user_email,message:''});
            console.log(`student email:${email}`);
        }else{
            req.flash('password_not_match', 'Wrong Password!');
            res.status(201).render("student_login",{message:req.flash('password_not_match')});
        }
        
    }catch(error){
        req.flash('no_email','Account not found in the Database!')
        res.status(201).render("student_login",{message:req.flash('no_email')});
    }
    
})
app.post('/company_login_register',async (req,res)=>{
    try{
        const email = req.body.email;
        const password = req.body.password;

        const user_email = await company_Register.findOne({email:email});
        const is_password_match = await bcrypt.compare(password,user_email.password);

        const token = await user_email.generateAuthToken();
        console.log(`\ntoken :- ${token}\n`);

        res.cookie("jwt",token);

        if(is_password_match){
            res.status(201).render("company_profile",{user_info:user_email,message:''});
            console.log(`student email:${email}`);
        }else{
            req.flash('password_not_match', 'Wrong Password!');
            res.status(201).render("company_login",{message:req.flash('password_not_match')});
        }
        
    }catch(error){
            req.flash('no_email','Account not found in the Database!')
            res.status(201).render("company_login",{message:req.flash('no_email')});
    }
})
app.get("/delete_student/:id",auth_student,async (req,res)=>{
    try{
        const _id = req.params.id;
        const deleteUser = await student_Register.findByIdAndDelete(_id);
        if(!_id){
            return res.status(400).send();
        }
        req.flash('delete','Account deleted successfully!')
        res.status(200).render('home',{message:req.flash('delete')});
        console.log(`Account ${deleteUser.email} Deleted`);
    }catch(error){
        res.status(500).send(error);
    }
})
app.get("/delete_company/:id",auth_company,async (req,res)=>{
    try{
        const _id = req.params.id;
        const deleteUser = await company_Register.findByIdAndDelete(_id);
        if(!_id){
            return res.status(400).send();
        }
        req.flash('delete','Account deleted successfully!')
        res.status(200).render('home',{message:req.flash('delete')});
        console.log(`Account ${deleteUser.email} Deleted`);
    }catch(error){
        res.status(500).send(error);
    }
})
app.get("/edit_student/:id",auth_student,async(req,res)=>{
    try{
        const user_id = req.params.id;
        const user_info = await student_Register.findOne({_id:user_id});
        if(!user_id){
            return res.status(400).send();
        }
        console.log(`\ntoken :- ${req.cookies.jwt}`);
        res.status(201).render("student_edit",{user_info:user_info,message:''})
    }catch(error){
        res.status(500).send(error.message);
    }
})
app.post("/edit_student/:id", async(req,res)=>{
    
    const user_id = req.params.id;
    const user_info = await student_Register.findOne({_id:user_id});
    try{
        const updates = req.body;
        if(!user_id){
            return res.status(400).send(error);
        }
        const updateUser = await student_Register.findByIdAndUpdate(user_id,updates);
        req.flash('updated','Account updated sucessfully!');
        console.log(`Account ${updateUser.email} Updated`);
        res.status(201).render("student_profile",{user_info:updates,message:req.flash('updated')});
    }catch(error){
        req.flash('taken_email','Account already exists in the Database!')
        res.status(201).render("student_edit",{user_info:user_info,message:req.flash('taken_email')});
    }
})
app.get("/edit_company/:id",auth_company,async(req,res)=>{
    try{
        const user_id = req.params.id;
        const user_info = await company_Register.findOne({_id:user_id});
    if(!user_id){
        return res.status(400).send();
    }
    console.log(`\ntoken :- ${req.cookies.jwt}`);
    res.status(201).render("company_edit",{user_info:user_info,message:''})
    }catch(error){
        res.status(500).send(error.message);
    }
})
app.post("/edit_company/:id", async(req,res)=>{

    const user_id = req.params.id;
    const user_info = await company_Register.findOne({_id:user_id});
    try{
        const updates = req.body; 
        if(!user_id){
            return res.status(400).send();
        }
        const updateUser = await company_Register.findByIdAndUpdate(user_id,updates);
        req.flash('updated','Account updated sucessfully!');
        console.log(`Account ${updateUser.email} Updated`);
        res.status(201).render("company_profile",{user_info:updates,message:req.flash('updated')});
    }catch(error){
        req.flash('taken_email','Account already exists in the Database!')
        res.status(201).render("company_edit",{user_info:user_info,message:req.flash('taken_email')});
    }
})
app.get("/eligible_company/:id",auth_student,async(req,res)=>{
    try{
        const user_id = req.params.id;
        const user_info = await student_Register.findOne({_id:user_id});
        if(!user_id){
            return res.status(400).send();
        }
        
    const comp_data = await company_Register.find( // used as array in eligible_companies.ejs
        {
        "$and":[
        {required_cpi:{$lte:user_info.cpi}}
        ]})
        res.status(201).render("eligible_companies",{comp_data:comp_data});
    }catch(error){
        res.status(500).send(error.message);
    }
})
app.get("/logout_student",auth_student,async(req,res)=>{
    try{
        console.log(`${req.token}`);
        req.user.tokens = req.user.tokens.filter((currentToken)=>{
            return currentToken.token != req.token;// req.token = current token
        })//clear from database

        res.clearCookie("jwt"); // clears only from site
        console.log(`logout successfully`);
        await req.user.save();
        req.flash('logout','Logged out successfully!');
        res.status(201).render('home',{message:req.flash('logout')});
    }catch(error){
        res.status(500).send(error);
    }
})
app.get("/logout_company",auth_company,async(req,res)=>{
    try{
        console.log(`${req.user}`);
        console.log(`${req.token}`);
        req.user.tokens = req.user.tokens.filter((currentToken)=>{
            return currentToken.token != req.token;// req.token = current token
        })//clear from database
        res.clearCookie("jwt"); // clears only from site
        console.log(`logout successfully`);
        await req.user.save();
        req.flash('logout','Logged out successfully!');
        res.status(201).render('home',{message:req.flash('logout')});
    }catch(error){
        res.status(500).send(error);
    }
})
app.listen(port,()=>{
    console.log('Server running at http://'+hostname+':'+port+'/');
});