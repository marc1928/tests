import axios from "axios";

const axiosClient = axios.create({
    baseURL: `${process.env.REACT_APP_API_URL}/api`,
    headers: {
      'Content-Type': 'application/json',
    },
});

axiosClient.interceptors.request.use((config)=>{
    const token = localStorage.getItem("access_token");
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

axiosClient.interceptors.response.use((response)=> {
    return response;
    }, 
    (error) => {
        try {
            const {response} = error;
            if (response.status === 401) {
                localStorage.removeItem('access_token');
            }
        } catch (error) {
            console.error(error);
        }

        throw error;
    }
)


export default axiosClient;