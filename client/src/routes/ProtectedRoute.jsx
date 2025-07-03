import React from "react";
import { Navigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";

export default function ProtectedRoute({allowedRoles,children}){
    // get the access_token from localStorage
    const token=localStorage.getItem("access_token")
    const userStr = localStorage.getItem("_us_unr")
    let user = null;
    try {
        user = userStr ? JSON.parse(userStr) : null;
    } catch (e) {
        console.error("Failed to parse user from localStorage:", e);
    }

    let decodedToken = null;
    if(token){
        try{
            decodedToken = jwtDecode(token)
            console.log(decodedToken)
        }catch (e){
            console.error("Invalid token:", e);
            return <Navigate to="/auth/login"/>
        }
    } else {
        return <Navigate to="/auth/login"/>
    }
    
    if(!user || !user.role){
        return <Navigate to="/auth/UserRoleSelection"/>
    }
    const userRole = user.role.toLowerCase();
    const allowedRolesLower = allowedRoles.map(role => role.toLowerCase());

    if(!allowedRolesLower.includes(userRole)){
        return <Navigate to="/"/>; 
    }
    return children;

}
