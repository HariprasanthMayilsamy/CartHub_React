import { useState } from "react";
import { checkIsAuthenticated } from "../Service/UserService";

function Login(){
    const[errors,setErrors]=useState({});

    const[formData,setFormData]=useState({
        UserName:"",
        Password:""
    });

    const handleChange=(e)=>{
        const{name,value}=e.target;
        setFormData({
            ...formData,
            [name]:value
        });
    };

    const handleSubmit=async (e)=>{
        e.preventDefault();
        let newErrors={};
        if(!formData.UserName.trim())
            newErrors.UserName="UserName is Required";
        else
            newErrors.UserName="";
        if(!formData.Password.trim())
            newErrors.Password="Password is Required";
        else
            newErrors.Password="";

        setErrors(newErrors);

        if((Object.keys(newErrors).length==0)||(newErrors.UserName=="" && newErrors.Password=="")){
            try{
                const response=await checkIsAuthenticated(formData);
                if(response.status==200){
                    alert("OK");
                    if(response.data!=null){
                        
                    }
                }
            }
            catch(error){
                if(error.status==401){
                      alert("Account can be Deleted or InActive");
                }
                else if(error.status==404){
                    alert("InValid Credentais");
                }
                //  console.log("API Error:", error);
                //  console.log("Response:", error.response?.data);
            }
        }
    }
return(
    <div className="login-background">
        <div className="container">
        <div className="row">
            <div className="col-2 col-md-2"></div>
            <div className="col-8 col-md-8">
                <div className="login-welcome">
                    <h4>Welcome to CartHub</h4>
                </div>
            </div>
            <div className="col-2 col-md-2"></div>
        </div>
        <div className="row">
                <div className="col-2 col-md-3"></div>
                <div className="col-8 col-md-6">
                    <div className="login">
                       <form onSubmit={handleSubmit}>
                            <div className="login-form">
                                <input name="UserName" className="login-textbox form-control"  placeholder="Enter UserName" type="text" value={formData.UserName} onChange={handleChange}></input>
                                <span style={{width:"100%",textAlign:"left",color:"red",fontFamily:"cursive"}}>{errors.UserName}</span>
                                <input name="Password" className="login-textbox form-control" placeholder="Enter Password" type="password" value={formData.Password} onChange={handleChange}></input>
                                <span style={{width:"100%",textAlign:"left",color:"red",fontFamily:"cursive"}}>{errors.Password}</span>
                                <div style={{display:"flex",float:"left",width:"350px"}}>
                                    <input type="checkbox" className="form-check-input" name="chkRememberme"></input>
                                    <span style={{color:"white"}}>Remember Me</span>
                                    <button className="btn btn-link" style={{display:"contents",color:"white",display:"none"}}>Forgot Password?</button>
                                </div>
                                <div>
                                    <button type="submit" className="btn btn-primary" style={{width:"100%"}}>Login</button>
                                    <span style={{color:"white",marginLeft:"30px"}}>Don't have an Account?</span><button className="btn btn-link" style={{color:"white",display:"contents"}}>Register Now</button>
                                </div>
                            </div>
                       </form>
                    </div>
                </div>
                <div className="col-2 col-md-3"></div>
            </div>
    </div>
    </div>
)
}


export default Login