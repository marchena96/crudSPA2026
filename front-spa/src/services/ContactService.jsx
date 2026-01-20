import axios from 'axios';

// Abstraction: Hide the implementation details of the HTTP client
const apiClient = axios.create({
    baseURL: 'https://localhost:7143/api/contacts', //
    headers: { 'Content-Type': 'application/json' }
});

export const ContactService = {
    async getAll() {
        const { data } = await apiClient.get('/');
        return data;
    },

    async create(contact) {
        return await apiClient.post('/', contact);
    },

    async update(id, contact) {
        return await apiClient.put(`/${id}`, contact);
    },

    async delete(id) {
        return await apiClient.delete(`/${id}`);
    }
};