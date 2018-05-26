import { toast, ToastOptions, ToastContent } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

class Toast {
    public readonly onClose: Promise<void>;

    constructor(private id: number) {
        this.onClose = new Promise<void>((resolve) => {
            toast.update(this.id, {
                onClose: () => resolve()
            });
        });
    }

    public update(options: ToastOptions) {
        toast.update(this.id, options);
    }

    public dismiss() {
        toast.dismiss(this.id);
    }
}

type ToastFunction = (content: ToastContent, options?: ToastOptions) => Toast;

export const normal: ToastFunction = (content, options) => new Toast(toast(content, {
    ...options,
    className: 'toast',
    bodyClassName: 'default'
}));

export const success: ToastFunction = (content, options) => new Toast(toast.success(content, {
    ...options,
    className: 'toast',
    bodyClassName: 'success'
}));

export const info: ToastFunction = (content, options) => new Toast(toast.info(content, {
    ...options,
    className: 'toast',
    bodyClassName: 'info'
}));

export const warning: ToastFunction = (content, options) => new Toast(toast.warn(content, {
    ...options,
    className: 'toast',
    bodyClassName: 'warn'
}));

export const error: ToastFunction = (content, options) => new Toast(toast.error(content, {
    ...options,
    className: 'toast',
    bodyClassName: 'error'
}));
