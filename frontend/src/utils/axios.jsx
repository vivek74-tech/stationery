import axios from "axios";


const api = axios.create({

  baseURL:
    import.meta.env.VITE_API_URL ||
    "https://stationery-r217.onrender.com",

  withCredentials:true,

});


api.interceptors.request.use(

(config)=>{

  const token =
    localStorage.getItem("accessToken");


  if(token){

    config.headers.Authorization =
      `Bearer ${token}`;

  }


  return config;

},


(error)=>Promise.reject(error)


);


export default api;