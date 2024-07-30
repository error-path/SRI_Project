function clearErrors(){
    errors = document.getElementsByClassName('formerror');
    for(let item of errors)
    {
        item.innerHTML = "";
    }
}
function seterror(id, error){
    //sets error inside tag of id 
    element = document.getElementById(id);
    element.getElementsByClassName('formerror')[0].innerHTML = error;

}

function validateForm(){
    var returnval = true;
    clearErrors();

    //perform validation and if validation fails, set the value of returnval to false
    var name = document.forms['form1']["name"].value;
    if (name.length == 0){
        seterror("name", "*Enter your name");
        return false;
    }
    var email = document.forms['form1']["email"].value;
    const validRegex = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    if(email.match(validRegex)){
        
    }
    else{
        seterror("email", "*Invalid Email Adddress");
        return false;
    }
    var age = document.forms['form1']["age"].value;
    if (age == ""){
        seterror("age", "*Enter your age");
        return false;
    }
    else if(age<0){
        seterror("age", "*age must be positive");
        return false;
    }
    var batch = document.forms['form1']["batch"].value;
    if (batch == ""){
        seterror("batch", "*Enter your batch");
        return false;
    }
    else if(batch<2000){
        seterror("batch", "*Batch must be more than 2000");
        return false;
    }
    else if(batch>2023){
        seterror("batch", "*Batch must be less than 2024");
        return false;
    }
    var gender = document.forms['form1']["gender"].value;
    if (gender == ""){
        seterror("gender", "*Select your gender");
        return false;
    }
    var cpi = document.forms['form1']["cpi"].value;
    if (cpi == ""){
        seterror("cpi", "*Enter your CPI");
        return false;
    }
    else if(isNaN(cpi)){
        seterror("cpi", "*Invalid CPI");
        return false;
    }
    else if(cpi>10){
        seterror("cpi", "*CPI must be under 10");
        return false;
    }
    else if(cpi<0){
        seterror("cpi", "*CPI must be more than 0");
        return false;
    }
    var techstack = document.forms['form1']["techstack"].value;
    if (techstack == ""){
        seterror("techstack", "*Enter your TechStack");
        return false;
    }
    var password = document.forms['form1']["password"].value;
    if (password.length == 0 ){

        seterror("password", "*Enter your password");
        return false;
    }

    var cpassword = document.forms['form1']["confirmpassword"].value;
    if (cpassword != password){
        seterror("confirmpassword", "*Password and Confirm password should match!");
        return false;
    }

    return returnval;
}

