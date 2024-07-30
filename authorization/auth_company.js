const jwt = require("jsonwebtoken");
const company_Register = require("../registers/company_registers.js");

const auth_company = async (req,res,next)=>{
    try{
        const token = req.cookies.jwt; // current token value of the user
        const verifyUser = jwt.verify(token,"tokentokentokentokentokentoken");
        console.log(`\n token verified :- ${JSON.stringify(verifyUser)}`);
        const user = await company_Register.findOne({_id:verifyUser._id});
        console.log(`\n${user.email}`);
        
        req.token = token;
        req.user = user;

        next();
    }catch(error){
        res.status(401).send(error);
    }
}

module.exports = auth_company;