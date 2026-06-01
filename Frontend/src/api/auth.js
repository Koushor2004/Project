import API from './axiosConfig';

export const registerUser = ({ name, email, password, role }) =>
    API.post('/auth/register', { name, email, password, role });
export const loginUser = (data) => API.post('/auth/login', data);
export const getMe = () => API.get('/auth/me');
