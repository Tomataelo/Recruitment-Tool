import axios, {type AxiosResponse, type InternalAxiosRequestConfig } from 'axios'

const api = axios.create({
    baseURL: 'http://localhost:8080/api',
    headers: {
        'Content-Type': 'application/json',
    },
})

api.interceptors.request.use((config: InternalAxiosRequestConfig) => {
    const token = localStorage.getItem('token')
    if (token) {
        config.headers.Authorization = `Bearer ${token}`
    }
    return config
})

api.interceptors.response.use(
    (response: AxiosResponse) => response,
    (error: { response?: { status: number }, config?: { url?: string } }) => {
        const isAuthEndpoint = error.config?.url?.includes('/auth/')
        if (error.response?.status === 401 && !isAuthEndpoint) {
            localStorage.removeItem('token')
            localStorage.removeItem('user')
            window.location.href = '/login'
        }
        return Promise.reject(error)
    }
)

export default api