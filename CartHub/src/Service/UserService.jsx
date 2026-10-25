import api from "./Api";

export const checkIsAuthenticated=(user)=>{
    return api.post("/CartHubUser/CheckIsAuthenticated",user);
}

export const GetCountries=()=>{
    return api.get("/CartHubUser/GetCountryDetails");
}

export const GetStates=(countryID)=>{
    return api.get(`/CartHubUser/GetStateDetails/${countryID}`);
}

export const GetCity=(stateID)=>{
    return api.get(`/CartHubUser/GetCityDetails/${stateID}`);
}

export const ChkAttributeExistency=(data)=>{
    return api.post(`/CartHubUser/ChectAttributeExistency`,data);
}