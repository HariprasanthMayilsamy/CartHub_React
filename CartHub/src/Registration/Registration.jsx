import { useEffect, useState } from 'react';
import './Registration.css';
import { GetCity, GetCountries, GetStates,ChkAttributeExistency } from '../Service/UserService';

function Registration(){
    const [error,setErrors]=useState({});

    const [countries,setCountries]=useState([]);
    const[states,setStates]=useState([]);
    const[cities,setCities]=useState([]);

    const[CountryID,setCountryID]=useState("");
    const[StateID,setStateID]=useState("");
    const[CityID,setCityID]=useState("");
    const initailFormData={
        Title:"",
        Name:"",
        Gender:"",
        Age:"",
        Mobile:"",
        Email:"",
        UserName:"",
        Password:"",
        ConfirmPassword:"",
        CountryID:"",
        StateID:"",
        CityID:"",
        Address:"",
        ProfileImage:"",
        Education:[]
    }
    const[formData,setFormData]=useState({
        Title:"",
        Name:"",
        Gender:"",
        Age:"",
        Mobile:"",
        Email:"",
        UserName:"",
        Password:"",
        ConfirmPassword:"",
        CountryID:"",
        StateID:"",
        CityID:"",
        Address:"",
        ProfileImage:"",
        Education:[]
        
    });
    const handleChange=(e)=>{
        const{name,value}=e.target;
        if(name==="Age" && !/^\d*$/.test(value)){
            return;
        }
        if(name==="Mobile" && !/^\d*$/.test(value)){
            return;
        }
        
        setFormData({
            ...formData,
            [name]:value
        });
        console.log(formData);
    };

     //#region  SaveEductaion
    const handleEducationChange=(e)=>{
        const{value,checked}=e.target;

        setFormData(prev=>({
            ...prev,Education:checked?[...prev.Education,value]:prev.Education.filter(item=>item!==value)
        }));
        console.log(formData);
    }
    //#endregionSaveEductaion
    const handleUserNameExists=async(e)=>{
        const value=e.target.value;
        const data={
            ActionType:1,
            AttributeValue:value
        }
        
        if(value!=null){
            const response=await ChkAttributeExistency(data);
            let newerrors={};
            if(response.data==true){
                newerrors.UserName="UserName Already Exists";
                setFormData(prev=>({
                    ...prev,UserName:""
                }))
            }
            else{
                newerrors.UserName="";
                setFormData(prev=>({
                    ...prev,UserName:value
                }))
            }
            setErrors(prev=>({
                ...prev,newerrors
            }));
        }
    }

    const handleMobileExists=async(e)=>{
        const value=e.target.value;
        const data={
            ActionType:2,
            AttributeValue:value
        }
        if(value!=null){
            const response=await ChkAttributeExistency(data);
            let newerrors={};
            if(response.data==true){
                newerrors.Mobile="Mobile No Already Exists";
                setFormData(prev=>({
                    ...prev,Mobile:""
                }))
            }
            else{
                newerrors.Mobile="";
                setFormData(prev=>({
                    ...prev,Mobile:value
                }))
            }
            setErrors(prev=>({
                ...prev,newerrors
            }));
        }
    }
    const handleEmailExists=async(e)=>{
        const value=e.target.value;
        let newerrors={};
        var data={
            ActionType:3,
            AttributeValue:value
        }
        if(value!=null){
            const response=await ChkAttributeExistency(data);
            if(response.data==true){
                newerrors.Email="Email ID Already Exists"
                setFormData(prev=>({
                    ...prev,Email:""
                }))
            }
            else{
                newerrors.Email=""
                setFormData(prev=>({
                    ...prev,Email:value
                }))
            }
            setErrors(prev=>({
                ...prev,newerrors
            }));
        }
    }
    const handlePasswordCompare=(e)=>{
        const value=e.target.value;
        let newerrors={};
        if(formData.Password!=""){
            if(formData.Password!=value){
                newerrors.ConfirmPassword="Password Mismatch";
                setFormData(prev=>({
                    ...prev,ConfirmPassword:""
                }))
            }
            else{
                newerrors.ConfirmPassword="";
                setFormData(prev=>({
                    ...prev,ConfirmPassword:value
                })
            )}
           setErrors(prev=>({
                ...prev,newerrors
            }));
        }
    }
    const handleReset=async()=>{
        e.preventDefault();
        setStates([]);
        setCities([]);
        setFormData({...initailFormData  })
    }
    //#region  BindCountryDropdown
    useEffect(()=>{
        bindCountries();
    },[])

    const bindCountries=async()=>{
        try{
            const response=await GetCountries();
            setCountries(response.data);
        }
        catch(error){
            console.error("bindCountries",error);
        }
    }
    //#endregion BindCountryDropdown
    //#region  BindStateDropdown
    const handleCountryChange=async(e)=>{
        const selectedCountryID=e.target.value;
        setCountryID(selectedCountryID);
        setStateID("");
        setStates([]);
        setCities([]);
        setFormData(prev=>({
            ...prev,
            CountryID:selectedCountryID,
            StateID:"",
            CityID:""
        }));
        console.log(formData)
        if(selectedCountryID==""){
            setStates([]);
            return;
        }
        try{
            const response=await GetStates(selectedCountryID);
            // console.log(response.data);
            setStates(response.data); 
        }
        catch(error){
            console.error("BindStateDropdown",error)
        }
    }
    //#endregion BindStateDropdown

    //#region BindCityDropdown
    const handleStateChange=async(e)=>{
        const SelectedStateID=e.target.value;
        setStateID(SelectedStateID);
        setCityID("");
        setCities([]);
        setFormData(prev=>({
            ...prev,
            StateID:SelectedStateID,
            CityID:"",
        }))
        if(SelectedStateID==""){
            return;
        }
        try{
            const response= await GetCity(SelectedStateID);
            setCities(response.data);
        }
        catch(error){
            console.error("BindCityDropdown",error)
        }
    }
    //#endregion BindCityDropdown

    //#region FormSubmit
    const handleSubmit=async(e)=>{
        e.preventDefault();
        const EmailRegx = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        const MobileRegx = /^[6-9]\d{9}$/;
        let newerrors={};
        if(!formData.Title.trim()){
            newerrors.Title="Please Select Title";
        }
        else{
            newerrors.Title="";
        }
        if(!formData.Name.trim()){
            newerrors.Name="Please Enter Name";
        }
        else{
            newerrors.Name="";
        }
        if(!formData.Gender.trim()){
            newerrors.Gender="Please Select Gender";
        }
        else{
            newerrors.Gender="";
        }
        if(!formData.Age.trim()){
            newerrors.Age="Please Enter Age";
        }
        else{
            newerrors.Age="";
        }
         if(!formData.Mobile.trim()){
            newerrors.Mobile="Please Enter Mobile Number";
        }
        else if(!MobileRegx.test(formData.Mobile)){
            newerrors.Mobile="Please Enter a Valid Mobile Number";
        }
        else{
            newerrors.Mobile="";
        }
         if(!formData.Email.trim()){
            newerrors.Email="Please Enter Email";
        }
        else if(!EmailRegx.test(formData.Email)){
            newerrors.Email="Please Enter a Valid Email"
        }
        else{
            newerrors.Email="";
        }
         if(!formData.UserName.trim()){
            newerrors.UserName="Please Enter UserName";
        }
        else{
            newerrors.UserName="";
        }
         if(!formData.Password.trim()){
            newerrors.Password="Please Enter Password";
        }
        else{
            newerrors.Password="";
        }
        if(!formData.ConfirmPassword.trim()){
            newerrors.ConfirmPassword="Please Enter Confirm Password";
        }
        else{
            newerrors.ConfirmPassword="";
        }
        if(!formData.CountryID.trim()){
            newerrors.CountryID="Please Select Country";
        }
        else{
            newerrors.CountryID="";
        }
        if(!formData.StateID.trim()){
            newerrors.StateID="Please Select State";
        }
        else{
            newerrors.StateID="";
        }
        if(!formData.CityID.trim()){
            newerrors.CityID="Please Select City";
        }
        else{
            newerrors.CityID="";
        }
        if(!formData.Address.trim()){
            newerrors.Address="Please Enter Address";
        }
        else{
            newerrors.Address="";
        }
        if(!formData.ProfileImage.trim()){
            newerrors.ProfileImage="Please Select ProfileImage";
        }
        else{
            newerrors.ProfileImage="";
        }
        if(formData.Education.length==0){
            newerrors.Education="Please Select Education";
        }
        else{
            newerrors.Education="";
        }
        setErrors(newerrors);
    }
    //#endregion
   
    return(
        <div className='reg-background'>
            <div className="container">
                <div className="row">
                    <div className="col-md-12 d-flex justify-content-center align-items-center white">
                        <h4>Register Here...</h4>
                    </div>
                </div>
                <br></br>
                
            <form onSubmit={handleSubmit} autoComplete='off'>
                <div className="row">
                    <div className="col-md-4">
                        <div>
                            <label className="form-label white">Title:<span className='red'>*</span></label><br></br>
                            <select className='form-select border-control' name='Title' value={formData.Title} onChange={handleChange}>
                                <option>--Please Select Title--</option>
                                <option value="Mr.">Mr.</option>
                                <option value="Ms.">Ms.</option>
                                <option value="Mrs.">Mrs.</option>
                            </select>
                            <span className='red'>{error.Title}</span>
                        </div>
                    </div>
                    <div className="col-md-4">
                        <div>
                            <label className='form-label white'>Name:<span className='red'>*</span></label>
                            <input name='Name' className='form-control border-control' type='text' 
                            placeholder='Please Enter Name' value={formData.Name} onChange={handleChange} autoComplete='off'></input>
                            <span className='red'>{error.Name}</span>
                        </div>
                    </div>
                    
                    <div className='col-md-4'>
                        <div>
                            <label className='form-label white'>Gender:<span className='red'>*</span></label><br></br>
                            <div style={{display:"flex",gap:"4px"}}>
                                <input type='radio' name='Gender' className='form-check-input' value="Male" checked={formData.Gender=='Male'} onChange={handleChange}></input><label className='form-check-label white'>Male</label>
                                <input type='radio' name='Gender' className='form-check-input' value="Female" checked={formData.Gender=='Female'} onChange={handleChange}></input><label className='form-check-label white'>Female</label>
                            </div>
                            <span className='red'>{error.Gender}</span>
                        </div>
                    </div>
                    <div className="col-md-4">
                        <div>
                            <label className='form-label white'>Age:<span className='red'>*</span></label>
                            <input name='Age' className='form-control border-control' 
                            type='text' maxLength={3} placeholder='Please Enter Age' value={formData.Age} onChange={handleChange}></input>
                            <span className='red'>{error.Age}</span>
                        </div>
                    </div>
                    <div className='col-md-4'>
                        <div>
                            <label className='form-label white'>Mobile:<span className='red'>*</span></label>
                            <input name='Mobile' type='text' className='form-control border-control' autoComplete='off' 
                            maxLength={13} placeholder='Please Enter Mobile Number' value={formData.Mobile} onChange={handleChange} onBlur={handleMobileExists}></input>
                            <span className='red'>{error.Mobile}</span>
                        </div>
                    </div>
                    <div className='col-md-4'>
                        <div>
                             <label className='form-label white'>Email:<span className='red'>*</span></label>
                             <input name='Email' type='text' className='form-control border-control' autoComplete='off'
                              placeholder='Please Enter Email' value={formData.Email} onChange={handleChange} onBlur={handleEmailExists}></input>
                             <span className='red'>{error.Email}</span>
                        </div>
                    </div>
                    <div className='col-md-4'>
                        <div>
                            <label className='form-label white'>UserName:<span className='red'>*</span></label>
                            <input name='UserName' type='text' className='form-control border-control' autoComplete='off' 
                            placeholder='Please Enter UserName' value={formData.UserName} onChange={handleChange} onBlur={handleUserNameExists}></input>
                            <span className='red'>{error.UserName}</span>
                        </div>
                    </div>
                    <div className='col-md-4'>
                        <div>
                            <label className='form-label white'>Password:<span className='red'>*</span></label>
                            <input name='Password' type='password' className='form-control border-control' 
                            placeholder='Please Enter Password' value={formData.Password} onChange={handleChange}></input>
                            <span className='red'>{error.Password}</span>
                        </div>
                    </div>
                    <div className='col-md-4'>
                        <div>
                            <label className='form-label white'>Confirm Password:<span className='red'>*</span></label>
                            <input name='ConfirmPassword' type='password' className='form-control border-control' 
                            placeholder='Please Re-Enter Password' value={formData.ConfirmPassword} onChange={handleChange} onBlur={handlePasswordCompare}></input>
                            <span className='red'>{error.ConfirmPassword}</span>
                        </div>
                    </div>
                    <div className="col-md-4">
                        <div>
                            <label className="form-label white">Country:<span className='red'>*</span></label><br></br>
                            <select name='CountryID' className='form-select border-control' value={CountryID} onChange={handleCountryChange}>
                                <option>--Please Select Country--</option>
                                {countries.map((country)=>(
                                    <option
                                        key={country.countryID}
                                        value={country.countryID}
                                    >
                                        {country.countryName}
                                    </option>
                                ))

                                }
                            </select>
                            <span className='red'>{error.CountryID}</span>
                        </div>
                    </div>
                    <div className="col-md-4">
                        <div>
                            <label className="form-label white">State:<span className='red'>*</span></label><br></br>
                            <select name='StateID' className='form-select border-control' value={StateID} onChange={handleStateChange}>
                                <option>--Please Select State--</option>
                                {states.map((state)=>(
                                    <option
                                        key={state.stateID}
                                        value={state.stateID}
                                    >
                                        {state.stateName}
                                    </option>
                                ))}
                            </select>
                            <span className='red'>{error.StateID}</span>
                        </div>
                    </div>
                    <div className="col-md-4">
                        <div>
                            <label className="form-label white">City:<span className='red'>*</span></label><br></br>
                            <select name='CityID' className='form-select border-control' value={formData.CityID} onChange={handleChange}>
                                <option>--Please Select City--</option>
                                {cities.map((city)=>(
                                    <option
                                        key={city.cityID}
                                        value={city.cityID}
                                    >
                                        {city.cityName}
                                    </option>
                                ))
                                }
                            </select>
                            <span className='red'>{error.CityID}</span>
                        </div>
                    </div>
                    <div className='col-md-4'>
                        <div>
                             <label className='form-label white'>Address:<span className='red'>*</span></label>
                             <input name='Address' type='text' className='form-control border-control' 
                             placeholder='Please Enter Address' value={formData.Address} onChange={handleChange}></input>
                             <span className='red'>{error.Address}</span>
                        </div>
                    </div>
                    <div className='col-md-8'>
                        <div>
                             <label className='form-label white'>Profile Image:<span className='red'>*</span></label>
                             <input name='ProfileImage' type='file' 
                             className='form-control border-control' accept='image/*' value={formData.ProfileImage}></input>
                             <span className='red'>{error.ProfileImage}</span>
                        </div>
                    </div>
                    <div className='col-md-12'>
                        <div>
                            <label className='form-label white'>Select Your Completed Qualification:<span className='red'>*</span></label>
                            <br></br>
                            <div style={{display:'flex',gap:'3px'}}>
                                <input type='checkbox' className='form-check-input' value="SSLC" checked={formData.Education.includes("SSLC")} onChange={handleEducationChange}></input><label className='form-check-label white'>SSLC</label>
                                <input type='checkbox' className='form-check-input' value="HSC" checked={formData.Education.includes("HSC")} onChange={handleEducationChange}></input><label className='form-check-label white'>HSC</label>
                                <input type='checkbox' className='form-check-input' value="Diplomo" checked={formData.Education.includes("Diplomo")} onChange={handleEducationChange}></input><label className='form-check-label white'>Diplomo</label>
                                <input type='checkbox' className='form-check-input' value="Under Graduate" checked={formData.Education.includes("Under Graduate")} onChange={handleEducationChange}></input><label className='form-check-label white'>Under Graduate</label>
                                <input type='checkbox' className='form-check-input' value="Post Graduate" checked={formData.Education.includes("Post Graduate")} onChange={handleEducationChange}></input><label className='form-check-label white'>Post Graduate</label>
                                <input type='checkbox' className='form-check-input' value="MBA" checked={formData.Education.includes("MBA")} onChange={handleEducationChange}></input><label className='form-check-label white'>MBA</label>
                                <input type='checkbox' className='form-check-input' value="None of the Above" checked={formData.Education.includes("None of the Above")} onChange={handleEducationChange}></input><label className='form-check-label white'>None of the Above</label>
                            </div>
                            <span className='red'>{error.Education}</span>
                        </div>
                    </div>
                </div>
                <br></br>
                <div className='row d-flex justify-content-center text-align-center'>
                    <div className='col-md-1'>
                        <button className='btn btn-primary' type='submit'>Submit</button>
                    </div>
                    <div className='col-md-1'>
                        <button className='btn btn-danger' type='reset' onClick={handleReset}>Reset</button>
                    </div>
                </div>
            </form>
               
        </div>
        </div>
    )
}

export default Registration;