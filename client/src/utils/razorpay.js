let razorpayPromise;

export const getIndianPhone10 = (value) => {
    const digits = String(value || '').replace(/\D/g, '');
    if (digits.length === 12 && digits.startsWith('91')) {
        return digits.slice(2);
    }
    if (digits.length === 11 && digits.startsWith('0')) {
        return digits.slice(1);
    }
    if (digits.length > 10) {
        return digits.slice(-10);
    }
    return digits;
};

export const buildRazorpayPrefill = (user = {}) => {
    const contact = getIndianPhone10(user.phoneNumber || user.phone);

    return {
        name: user.fullname || user.name || 'Customer',
        email: user.email || '',
        ...(contact.length === 10 ? { contact } : {})
    };
};

export const loadRazorpay = () => {
    if (window.Razorpay) {
        return Promise.resolve(true);
    }

    if (!razorpayPromise) {
        razorpayPromise = new Promise((resolve) => {
            const script = document.createElement('script');
            script.src = 'https://checkout.razorpay.com/v1/checkout.js';
            script.async = true;
            script.onload = () => resolve(true);
            script.onerror = () => resolve(false);
            document.body.appendChild(script);
        });
    }

    return razorpayPromise;
};
