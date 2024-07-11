export const SERVER_URL = process.env.SERVER_URL;


export const APIS = {
    LOGIN: `${SERVER_URL}/auth/login`,
    SIGNUP: `${SERVER_URL}/users`,
    LOGOUT: `${SERVER_URL}/auth/logout`,
    JOBS: `${SERVER_URL}/jobs`,
    APPLY: `${SERVER_URL}/apply`,


    //****** Profile API url ******//
    FORM1: `${SERVER_URL}/profile/form1`,
    FORM2: `${SERVER_URL}/profile/form2`,
    FORM3: `${SERVER_URL}/profile/form3`,
    CHECK_PROFILE: `${SERVER_URL}/profile/check`,






    //****** Exhibitions API url ******//
    EXHIBITION: `${SERVER_URL}/exhibitions`,
    SEND_INNOVATORS: `${SERVER_URL}/exhibitions/sendinovators`,
    GET_SUBMITTED_INNOVATORS:`${SERVER_URL}/exhibitions/submitted-innovators`,


    //****** FreeLancers and Innovators API url ******//
    FREELANCERS: `${SERVER_URL}/users/by-type?userType=Freelancer`,
    INNOVATORS: `${SERVER_URL}/users/by-type?userType=Innovators`,
    INNOVATORSFOREXIBITION: `${SERVER_URL}/users/by-type1?userType=Innovators`,
    PROJECTOWNERS: `${SERVER_URL}/users/by-type?userType=Project Owner`,

    CATEGORIES: `${SERVER_URL}/profile/categories`,




    GET_INNOVATORS: `${SERVER_URL}/users/by-type?userType=Innovators`,


    NOTIFICATIONS: `${SERVER_URL}/emails`,


    MARK_AS_READ: `${SERVER_URL}/emails/markasread`,

}