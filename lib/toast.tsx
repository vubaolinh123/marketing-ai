import toast, { Toaster as HotToaster } from 'react-hot-toast';

/**
 * Toast notification utilities
 * Provides consistent styling across the application
 */

// Success toast
export const showSuccess = (message: string) => {
    toast.success(message, {
        duration: 3000,
        style: {
            background: '#10B981',
            color: '#fff',
            fontWeight: 500,
        },
        iconTheme: {
            primary: '#fff',
            secondary: '#10B981',
        },
    });
};

// Error toast
export const showError = (message: string) => {
    toast.error(message, {
        duration: 4000,
        style: {
            background: '#EF4444',
            color: '#fff',
            fontWeight: 500,
        },
        iconTheme: {
            primary: '#fff',
            secondary: '#EF4444',
        },
    });
};

// Loading toast - returns id for dismiss
export const showLoading = (message: string) => {
    return toast.loading(message, {
        style: {
            background: '#3B82F6',
            color: '#fff',
            fontWeight: 500,
        },
    });
};

// Dismiss toast by id
export const dismissToast = (toastId: string) => {
    toast.dismiss(toastId);
};

// Info toast
export const showInfo = (message: string) => {
    toast(message, {
        duration: 3000,
        icon: '💡',
        style: {
            background: '#F59E0B',
            color: '#fff',
            fontWeight: 500,
        },
    });
};

// Toaster component with default config
export const Toaster = () => (
    <HotToaster
        position= "top-right"
reverseOrder = { false}
gutter = { 12}
toastOptions = {{
    duration: 3000,
        style: {
        borderRadius: '12px',
            padding: '12px 16px',
                boxShadow: '0 10px 40px rgba(0,0,0,0.15)',
            },
}}
    />
);

export default toast;
