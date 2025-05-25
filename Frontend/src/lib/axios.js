import axios from "axios"

export const axiosInstance =  axios.create({
    baseURL: import.meta.env.MODE === "devlopment" ? "http://localhost:8001/api/v1" : "/api/v1",
    withCredentials:true,
})