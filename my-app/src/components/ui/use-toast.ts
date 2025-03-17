import { useState } from "react"

type ToastProps = {
  title: string
  description?: string
  duration?: number
}

type ToastState = ToastProps & {
  id: number
  open: boolean
}

const useToast = () => {
  const [toasts, setToasts] = useState<ToastState[]>([])
  let toastId = 0

  const toast = ({ title, description, duration = 3000 }: ToastProps) => {
    const id = toastId++
    setToasts((prevToasts) => [
      ...prevToasts,
      {
        id,
        title,
        description,
        duration,
        open: true,
      },
    ])

    setTimeout(() => {
      dismiss(id)
    }, duration)
  }

  const dismiss = (id: number) => {
    setToasts((prevToasts) => prevToasts.map((toast) => (toast.id === id ? { ...toast, open: false } : toast)))

    setTimeout(() => {
      remove(id)
    }, 500) // Wait for the fade-out animation
  }

  const remove = (id: number) => {
    setToasts((prevToasts) => prevToasts.filter((toast) => toast.id !== id))
  }

  return { toast, dismiss, toasts }
}

export { useToast }

