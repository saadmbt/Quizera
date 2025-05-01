import React from "react";
import { Navigate } from "react-router-dom";
import {jwtDecode} from "jwt-decode";

export default function ProtectedRoute({allowedRoles,children}){
    // get the access_token from localStorage
    const token=localStorage.getItem("access_token")
    const user  = JSON.parse(localStorage.getItem("_us_unr"))

    let decodedToken = null;
    if(token){
        try{
            decodedToken = jwtDecode(token)
            console.log(decodedToken)
        }catch (e){
            console.log(e)
        }
    }
    
    if(!decodedToken){
        return <Navigate to="/auth/login"/>
    }
    if(!user.role){
        return <Navigate to="/auth/UserRoleSelection"/>
    }
    if(!allowedRoles.includes(user.role)){
        return <Navigate to=""/>; 
    }
    return children;

}
