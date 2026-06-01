import API from './axiosConfig';

export const fetchTasks = (params) => API.get('/tasks', { params });
export const createTask = (data) => API.post('/tasks', data);
export const updateTask = (id, data) => API.put(`/tasks/${id}`, data);
export const deleteTask = (id) => API.delete(`/tasks/${id}`);
export const fetchAllTasksAdmin = () => API.get('/tasks/admin/all');

export const prepareTaskPayload = (form) => {
    const payload = {
        title: form.title.trim(),
        description: form.description?.trim() || '',
        status: form.status,
        priority: form.priority,
    };
    if (form.dueDate) {
        payload.dueDate = new Date(form.dueDate).toISOString();
    }
    return payload;
};
