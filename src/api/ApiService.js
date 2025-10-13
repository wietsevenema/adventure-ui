import axios from 'axios';

const api = axios.create({
  baseURL: '/game',
  headers: {
    'Content-Type': 'application/json',
  },
});



export const look = () => api.get('/look');
export const inventory = () => api.get('/inventory');
export const examine = (target) => api.post('/examine', { target });
export const move = (exit) => api.post('/move', { exit });
export const take = (itemName) => api.post('/take', { itemName });
export const use = (directObject, indirectObject) => api.post('/use', { direct_object: directObject, indirect_object: indirectObject });
export const drop = (itemName) => api.post('/drop', { itemName });