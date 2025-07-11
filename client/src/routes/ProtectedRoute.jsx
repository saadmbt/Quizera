import React from "react";
import { Navigate, useNavigate } from "react-router-dom";
import {jwtDecode} from "jwt-decode";

export default function ProtectedRoute({allowedRoles,children}){
    // get the access_token from localStorage
    const token=localStorage.getItem("access_token") || null;
    const user = JSON.parse(localStorage.getItem("_us_unr")) || null;
    const navigate = useNavigate();
    
    if (!token) {
        console.error("User not found in localStorage");
        localStorage.clear();
        navigate("/auth/login");
    }
    let decodedToken = null;
    if(token){
        try{
            decodedToken = jwtDecode(token)
            // console.log(decodedToken)
        }catch (e){
            console.error("Invalid token:", e);
            localStorage.clear();
            navigate("/auth/login");
        }
    } else {
        navigate("/auth/login");
    }
    
    if(!user || !user?.role){
        navigate("/auth/UserRoleSelection");
    }
    if(!user?.emailVerified){
        navigate("/auth/verify-email");
    }
    const userRole = user?.role.toLowerCase();
    const allowedRolesLower = allowedRoles.map(role => role.toLowerCase());

    if(!allowedRolesLower.includes(userRole)){
        navigate("/");
    }
    return children;

}
