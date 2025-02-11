import axios from "axios";

const axiosInstance = axios.create({
    baseURL: "http://localhost:3000/",
    headers: {
        "Content-Type": "application/json",
    },
});

// Request Interceptor
axiosInstance.interceptors.request.use(
    (request) => {
        const accessToken = localStorage.getItem("accessToken");
        if (accessToken) {
            request.headers["Authorization"] = `Bearer ${accessToken}`;
        }
        return request;
    },
    (error) => Promise.reject(error)
);

// Response Interceptor
axiosInstance.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;
        if (error.response?.status === 401 && !originalRequest._retry) {
                originalRequest._retry = true;
                try {
                    const authHeader = localStorage.getItem("refreshToken");
                    if (!authHeader) {
                        throw new Error("No refresh token available");
                    }
                    
                    const res = await axios.get("http://localhost:3000/getAccessToken", {
                        headers: { Authorization: `Bearer ${authHeader}` },
                    });

                    if (res.data.success) {
                        localStorage.setItem("accessToken", res.data.accessToken);
                        originalRequest.headers["Authorization"] = `Bearer ${res.data.accessToken}`;
                        return axios(originalRequest);
                    }
                } catch (refreshError) {
                    console.error("Token refresh failed", refreshError);
                }
            localStorage.removeItem("accessToken");
            localStorage.removeItem("refreshToken");
        }
        return Promise.reject(error);
    }
);

export default axiosInstance;
