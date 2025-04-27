import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

 const NotAccessibleRoute = ({ condition, redirectTo, children }) => {
    const navigate = useNavigate();
  
    useEffect(() => {
      if (!condition) {
        navigate(redirectTo);
      }
    }, [condition, navigate, redirectTo]);
  
    return condition ? children : null;
  };
export default NotAccessibleRoute;