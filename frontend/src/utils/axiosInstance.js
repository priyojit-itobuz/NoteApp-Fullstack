axiosInstance.interceptors.response.use(
    async (response) => response,
    async (error) => {
      const originalRequest = error.config;
  
      if (error.response?.status === 401 && !originalRequest._retry) {
        originalRequest._retry = true;
        try {
          const refreshToken = localStorage.getItem('refreshToken');
          const response = await axios.post('http://localhost:3000/getAccessToken', {}, {
            headers: {
              Authorization: `Bearer ${refreshToken}`,
            },
          });
  
          const newAccessToken = response.data.accessToken;
          localStorage.setItem('accessToken', newAccessToken);
  
          // Update headers with the new access token and retry the original request
          axiosInstance.defaults.headers.Authorization = `Bearer ${newAccessToken}`;
          originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
  
          return axiosInstance(originalRequest); // Retry the original request
        } catch (refreshError) {
          toast.error('Session expired. Please log in again.');
          localStorage.removeItem('accessToken');
          localStorage.removeItem('refreshToken');
          window.location.href = '/login'; // Redirect to login
        }
      }
  
      throw error; // Reject the promise for other errors
    }
  );


//   import axiosInstance from '../utils/axiosInstance'; // Use the custom Axios instance (jbhabe use koreb, etak utils folder a rakho)

//   //   to use
//   const res = await axiosInstance.post("/login", data, {
//       headers: { 'Content-type': 'application/json' },
//   });