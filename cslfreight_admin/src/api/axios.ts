import axios, { AxiosInstance } from "axios";

export const axios_instance : AxiosInstance = axios.create({
    baseURL: "https://api.cslfreightgh.com"
});

export const axios_instance_token : AxiosInstance = axios.create({
    baseURL: "https://api.cslfreightgh.com"
});

// export const axios_instance : AxiosInstance = axios.create({
//     baseURL: "http://localhost:3000"
// });

// export const axios_instance_token : AxiosInstance = axios.create({
//     baseURL: "http://localhost:3000"
// });
