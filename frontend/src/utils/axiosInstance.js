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
        if (error.response?.status === 401) {
            const originalRequest = error.config;
            if (!originalRequest._retry) {
                originalRequest._retry = true;
                try {
                    const authHeader = localStorage.getItem("refreshToken");
                    if (!authHeader) {
                        throw new Error("No refresh token available");
                    }
                    
                    const { data } = await axios.get("http://localhost:3000/getAccessToken", {
                        headers: { Authorization: `Bearer ${authHeader}` },
                    });

                    if (data.success) {
                        localStorage.setItem("accessToken", data.accessToken);
                        axiosInstance.defaults.headers.common["Authorization"] = `Bearer ${data.accessToken}`;
                        originalRequest.headers["Authorization"] = `Bearer ${data.accessToken}`;
                        return axiosInstance(originalRequest);
                    }
                } catch (refreshError) {
                    console.error("Token refresh failed", refreshError);
                }
            }
            localStorage.removeItem("accessToken");
            localStorage.removeItem("refreshToken");
            // localStorage.removeItem("userDetails");
            window.location.href = "/login";
        }
        return Promise.reject(error);
    }
);

export default axiosInstance;
