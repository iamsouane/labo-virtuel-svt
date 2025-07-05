//src/lib/notification
import { toast } from "react-toastify"

export const notifySuccess = (message: string) => {
    toast.success(message, {
        position: "top-right",
        autoClose: 4000,
        hideProgressBar: false,
        pauseOnHover: true,
        draggable: true,
        theme: "colored",
    })
}

export const notifyError = (message: string) => {
    toast.error(message, {
        position: "top-right",
        autoClose: 4000,
        hideProgressBar: false,
        pauseOnHover: true,
        draggable: true,
        theme: "colored",
    })
}

export const notifyInfo = (message: string) => {
    toast.info(message, {
        position: "top-right",
        autoClose: 4000,
        hideProgressBar: false,
        pauseOnHover: true,
        draggable: true,
        theme: "colored",
    })
}