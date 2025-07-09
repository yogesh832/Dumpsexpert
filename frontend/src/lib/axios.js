import axios from "axios";
const apiUrl = import.meta.env.VITE_HOSTED_API_URL;
console.log(`API Base URL: ${apiUrl}`);

export const instance = axios.create({
    baseURL: apiUrl,
    withCredentials: true,
    headers: { 
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET,PUT,POST,DELETE,PATCH,OPTIONS'
    }
});

instance.interceptors.response.use(
    (response) => response,
    (error)=>{
        if(error.response?.status === 401){
            console.warn("Unauthorized access. Logging out...");
        }
        console.error("API Error:", error.response || error);
        return Promise.reject(error);
    }
)