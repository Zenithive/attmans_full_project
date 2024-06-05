export const SERVER_URL = process.env.SERVER_URL;

export const APIS = {
    LOGIN : `${SERVER_URL}/auth/login`,
    SIGNUP: `${SERVER_URL}/users`,
    LOGOUT:`${SERVER_URL}/auth/logout`,
    FORM1:`${SERVER_URL}/profile/form1`,
    FORM2:`${SERVER_URL}/profile/form2`,
    FORM3:`${SERVER_URL}/profile/form3`,
}