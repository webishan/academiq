import { toast, ToastOptions } from 'react-toastify';

const defaultOptions: ToastOptions = {
	position: 'bottom-right',
	autoClose: 5000,
	hideProgressBar: false,
	closeOnClick: true,
	pauseOnHover: true,
	draggable: true,
	progress: undefined,
	theme: 'dark',
};

export const CustomToast = {
	success: (message: string, options?: ToastOptions) => {
		toast.success(message, { ...defaultOptions, ...options });
	},
	error: (message: string, options?: ToastOptions) => {
		toast.error(message, { ...defaultOptions, ...options });
	},
	info: (message: string, options?: ToastOptions) => {
		toast.info(message, { ...defaultOptions, ...options });
	},
	warning: (message: string, options?: ToastOptions) => {
		toast.warning(message, { ...defaultOptions, ...options });
	},
	default: (message: string, options?: ToastOptions) => {
		toast(message, { ...defaultOptions, ...options });
	},
};
