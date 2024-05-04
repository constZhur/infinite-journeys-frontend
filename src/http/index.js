import axios from 'axios';

export const API_URL = 'http://localhost:8080'

const $api = axios.create({
    withCredentials: true,
    baseURL: API_URL,
    headers: {
        'Access-Control-Allow-Origin': "*", // Заголовок для разрешения доступа к ресурсу со всех доменов
        'Access-Control-Allow-Headers': 'Origin, X-Requested-With, Content-Type, Accept', // Заголовок для разрешения доступа к ресурсу со всех доменов
        'Access-Control-Allow-Methods': 'GET, POST, PATCH, PUT, DELETE, OPTIONS', // Заголовок для разрешения доступа к ресурсу со всех доменов
        'Content-Type': 'application/json', // Заголовок для указания типа передаваемых данных
    }
})


$api.interceptors.request.use((config) => {
    let token = localStorage.getItem('token')
    if (token !== null) {
        config.headers.Authorization = `Bearer ${token})}`
    }
    return config;
} )

export default $api;