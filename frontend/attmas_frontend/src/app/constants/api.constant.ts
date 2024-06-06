export const SERVER_URL = process.env.SERVER_URL;

export const APIS = {
    LOGIN : `${SERVER_URL}/auth/login`,
    SIGNUP: `${SERVER_URL}/users`,
    LOGOUT:`${SERVER_URL}/auth/logout`,
    EXHIBITION:`${SERVER_URL}/exhibitions`
}