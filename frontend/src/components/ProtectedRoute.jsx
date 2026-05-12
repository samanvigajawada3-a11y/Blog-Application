import {useAuth} from "../store/authStore"
import { Navigate, redirect } from "react-router";
import { toast } from "react-hot-toast";
import { Children } from "react";

function ProtectedRoute({children,allowedRoles}) {
    // get user login status from store
    const {loading,currentUser,isAuthenticated} = useAuth();
    // loading state 
    if(loading){
      return <p>Loading...</p>
    }
    // if user not loggedin
    if(!isAuthenticated){
      toast.error("Redirecting to Login")
      // redirect to login
      return <Navigate to="/login" replace/>
    }
    // check roles
    if(allowedRoles && !allowedRoles.includes(currentUser?.role)){
      // redirecting to login
      return <Navigate to="/unauthorized" replace state={{redirectTo:"/"}}/>
    }
  return children
}

export default ProtectedRoute;