import React from "react";
import { Navigate } from "react-router-dom";
import jwtDecode from "jwt-decode";

export default function ProtectedRoute({allowedRoles,children}){
    // get the access_token from localStorage
    const token=localStorage.getItem("access_token") || null;
    const userStr = localStorage.getItem("_us_unr")
    let user = null;
    try {
        user = userStr ? JSON.parse(userStr) : null;
    } catch (e) {
        console.error("Failed to parse user from localStorage:", e);
    }
    if (!token) {
        console.error("User not found in localStorage");
        localStorage.clear();
        return <Navigate to="/auth/login" />;
    }
    let decodedToken = null;
    if(token){
        try{
            decodedToken = jwtDecode(token)
            // console.log(decodedToken)
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
    // if(!user.emailVerified){
    //     return <Navigate to="/auth/verify-email" />
    // }
    const userRole = user.role.toLowerCase();
    const allowedRolesLower = allowedRoles.map(role => role.toLowerCase());

    if(!allowedRolesLower.includes(userRole)){
        return <Navigate to="/"/>; 
    }
    return children;

}
