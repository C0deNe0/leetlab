import {create} from "zustand";
import {axiosInstance} from "../lib/axios.js";
import {toast} from "react-hot-toast"


export const useAuthStore = create((set)=>({
    authUser :null,
    isSigninUp:false,
    isLoggingIn:false,
    isCheckingAuth:false,


    checkAuth: async() =>{
        set({isCheckingAuth:true});
    
        try {
            const res = await axiosInstance.get("/auth/check")
            console.log("checkauth response", res.data)
        } catch (error) {
            console.error("Error checking auth: ",error)
            set({authUser:null})
        }finally{
            set({isCheckingAuth:false})
        }
    },

    login:async (data) =>{
        set({isLoggingIn:true});
        try {
            const res = await axiosInstance.post("/auth/login",data);

            set({authUser:res.data.user});
            toast.success(res.data.message);

        } catch (error) {
            console.log("Error logging in: ",error)
            toast.error("Error Loggin in");
            
        }finally{
            set({isLoggingIn:false})
        }
    },

    
    signup:async (data) =>{
        set({isSigninUp:true});
        try {
            const res = await axiosInstance.post("/auth/register",data);

            set({authUser:res.data.user});
            toast.success(res.data.message);

        } catch (error) {
            console.log("Error signing in: ",error)
            toast.error("Error signing in");
            
        }finally{
            set({isSigninUp:false})
        }
    },

    logout:async ()=>{
        try {
            await axiosInstance.post("/auth/logout")
            set({authUser:null})

            toast.success("logout successfull")
        } catch (error) {
            console.log("Error loggin out", error)
            toast.error("Error logging out");
        }
    }

}))