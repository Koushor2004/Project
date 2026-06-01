export const getErrorMessage = (err, fallback = 'Something went wrong.') => {
    const data = err?.response?.data;
    if (!data) return fallback;
    if (Array.isArray(data.errors) && data.errors.length > 0) {
        return data.errors.map((e) => e.message).join(', ');
    }
    return data.message || fallback;
};
