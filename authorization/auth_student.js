const jwt = require("jsonwebtoken");
const student_Register = require("../registers/students_registers.js");

const auth_student = async (req,res,next)=>{
    try{
        const token = req.cookies.jwt; // current token value of the user
        console.log(`${token}`);
        const verifyUser = jwt.verify(token,"tokentokentokentokentokentoken");
        console.log(`\n token verified :- ${JSON.stringify(verifyUser)}`);
        const user = await student_Register.findOne({_id:verifyUser._id});
        console.log(`\n${user.email}`);
        
        req.token = token;
        req.user = user;

        next();
    }catch(error){
        res.status(401).send(error);
    }
}

module.exports = auth_student;