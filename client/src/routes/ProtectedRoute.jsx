import React, { useContext } from "react";
import { Navigate } from "react-router-dom";
import { AuthContext } from "./AuthContext";
export default function ProtectedRoute({allowedRoles,children}){
    const {user}=useContext(AuthContext)
    const{isSelected}=useContext(AuthContext)

    if(!user){
        return <Navigate to="login"/>;
    }
    if(!allowedRoles.includes(user.role)){
        return <Navigate to="*"/>;
    }
    return children;

}