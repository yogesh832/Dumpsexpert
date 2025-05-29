import axios from "axios";
const apiUrl = import.meta.env.VITE_HOSTED_API_URL;


export const instance = axios.create({
    baseURL: apiUrl,
    withCredentials: true,
    headers: { 'Content-Type': 'application/json' }
});

instance.interceptors.response.use(
    (response) => response,
    (error)=>{
        if(error.response?.status === 401){
            console.warn("Unauthorized access. Logging out...");
        }
        return Promise.reject(error);
    }
)