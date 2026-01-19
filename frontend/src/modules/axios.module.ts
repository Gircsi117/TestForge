import axios, { AxiosError } from "axios";

const BASE_URL = import.meta.env.VITE_API_URL;

const ForgeAxios = axios.create({
  baseURL: BASE_URL,
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
});

export type MyAxiosError = AxiosError<{ message: string }>;

ForgeAxios.interceptors.response.use(
  (response) => {
    if (response.status != 200 || !response.data.success) {
      return Promise.reject(new Error("Forge API Error"));
    }

    return response;
  },
  (error: AxiosError) => {
    if (error.status === 401) {
      console.error("Unauthorized access");
      // Handle unauthorized access
    }

    return Promise.reject(error);
  },
);

export default ForgeAxios;
