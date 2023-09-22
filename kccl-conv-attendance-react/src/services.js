import axios from "axios";
import { useLocation } from "react-router-dom";

const BASE_URL = "http://192.168.233.35:3011"

export const appRequest = {
    get: (url) => {
        return new Promise((resolve, reject) => {
            axios.get(BASE_URL + url)
            .then(function (res) {
                resolve(res)
            })
            .catch(function (error) {
                reject(error)
            });
        })
    },
    post: (url, body) => {
        return new Promise((resolve, reject) => {
            axios.post(BASE_URL + url, body)
            .then(function (res) {
                resolve(res)
            })
            .catch(function (error) {
                reject(error?.response?.data)
            });
        })
    }
}

export const getUrlQuery = (location, key) => {
    const queryParams = new URLSearchParams(location.search);
    return queryParams.get(key);
}