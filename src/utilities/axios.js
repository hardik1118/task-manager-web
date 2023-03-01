import axios from 'axios'

import toast from 'react-hot-toast'

export const axiosInstance = axios.create({
    baseURL: 'http://localhost:5000',
    timeout: 15000
})
const getGenericErrorMessage = (e) => {
    if (e?.message === 'Aborting') {
        return
    }
    const text = e.response?.data?.errors
        ? Object.values(e.response?.data?.errors)[0]
        : e.response?.data?.message || 'Something went wrong!'
    toast.error(text)
}
axiosInstance.interceptors.request.use(request => {
    return request
})

axiosInstance.interceptors.response.use(
    res => {
        return res
    },

    error => {
        if (error?.response?.status === 500) {
            toast.error('Internal Server Error')

            // Router.push('/500')
        } else {
            if (error?.response?.status !== 422) {
                getGenericErrorMessage(error)
            }
        }
        throw error
    }
)
