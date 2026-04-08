import axios from 'axios';

const API = axios.create({
  baseURL: 'http://localhost:5000/api'
});

// Automatically attach token to every request
API.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const authAPI = {
  register: (data) => API.post('/auth/register', data),
  login: (data) => API.post('/auth/login', data),
  upgrade: () => API.post('/auth/upgrade')
};

export const resumeAPI = {
  upload: (formData) => API.post('/resume/upload', formData)
};

export const interviewAPI = {
  start: (data) => API.post('/interview/start', data),
  submitAnswer: (data) => API.post('/interview/answer', data),
  getResults: (id) => API.get(`/interview/results/${id}`)
};

export const dashboardAPI = {
  get: () => API.get('/dashboard')
};