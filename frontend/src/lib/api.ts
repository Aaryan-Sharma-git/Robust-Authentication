import api from "@/config/axiosClient"
import type { sessionArrayType, userType } from "@/schemas/authSchemas"

export interface data {
    email: string,
    password: string
}

interface passwordResetData {
    verificationCode: string
    password: string,
}

export interface registerData extends data {
    confirmPassword: string
}

export const login = async (data: data) => {
    return await api.post('/auth/login', data);
}

export const createAccount = async (data: registerData) => {
    return await api.post('/auth/registration', data);
}

export const emailVerification = async (verificationCode: string) => {
    return await api.get(`/auth/email/verify/${verificationCode}`);
}

export const resetPassword = async (email: string) => {
    return await api.post('/auth/password/forgot', {email});
}

export const sendPasswordResetDetails = async (data: passwordResetData) => {
    return await api.post('/auth/password/reset', data);
}

export const getUser = async (): Promise<userType> => {
    return await api.get('/user');
}

export const logout = async () => {
    return await api.get('/auth/logout');
}

export const getSessions = async (): Promise<sessionArrayType> => {
    return await api.get('/session');
}

export const deleteSession = async (sessionId: string) => {
    return await api.delete(`/session/${sessionId}`);
}
