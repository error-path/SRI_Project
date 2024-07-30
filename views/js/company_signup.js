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
    var post = document.forms['form1']["post"].value;
    if (post == ""){
        seterror("post", "*Enter the available POST");
        return false;
    }
    var cpi = document.forms['form1']["req_cpi"].value;
    if (cpi == ""){
        seterror("cpi", "*Enter the required CPI");
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
    var package = document.forms['form1']["package"].value;
    if (package == ""){
        seterror("package", "*Enter the Package");
        return false;
    }
    else if(package<0){
        seterror("package", "*Package must be positive");
        return false;
    }
    var website = document.forms['form1']["website"].value;
    if (website == ""){
        seterror("website", "*Enter Company Website");
        return false;
    }
    var description = document.forms['form1']["description"].value;
    if (description == ""){
        seterror("description", "*Enter Company Description");
        return false;
    }
    var address = document.forms['form1']["address"].value;
    if (address == ""){
        seterror("address", "*Enter Company Address");
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

