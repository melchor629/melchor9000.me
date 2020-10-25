import type { ReactText } from 'react'
import { toast, ToastContent, ToastOptions } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

class Toast {
  public readonly onClose: Promise<void>

  constructor(private readonly id: ReactText) {
    this.onClose = new Promise<void>((resolve) => {
      toast.update(this.id, { onClose: () => resolve() })
    })
  }

  public update(options: ToastOptions) {
    toast.update(this.id, options)
  }

  public dismiss() {
    toast.dismiss(this.id)
  }
}

type ToastFunction = (content: ToastContent, options?: ToastOptions) => Toast
const className = 'toastify-toast'

export const normal: ToastFunction = (content, options) => new Toast(toast(content, {
  ...options,
  className,
  bodyClassName: 'default',
}))

export const success: ToastFunction = (content, options) => new Toast(toast.success(content, {
  ...options,
  className,
  bodyClassName: 'success',
}))

export const info: ToastFunction = (content, options) => new Toast(toast.info(content, {
  ...options,
  className,
  bodyClassName: 'info',
}))

export const warning: ToastFunction = (content, options) => new Toast(toast.warn(content, {
  ...options,
  className,
  bodyClassName: 'warn',
}))

export const error: ToastFunction = (content, options) => new Toast(toast.error(content, {
  ...options,
  className,
  bodyClassName: 'error',
}))
