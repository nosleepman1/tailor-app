import api from '@/api/axios';

export const getPlans = () => api.get('/subscriptions/plans');
export const createCheckout = (plan) => api.post('/subscriptions/checkout', { plan });
export const verifyPayment = (ref) => api.get(`/subscriptions/verify?ref=${ref}`);
export const getCurrentSubscription = () => api.get('/subscriptions/current');
