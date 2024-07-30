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



    PRODUCTNAME: `${SERVER_URL}/profile/products`,

    CHECKINTRESTEDUSER: `${SERVER_URL}/interested-users`,




    






    //****** Exhibitions API url ******//
    EXHIBITION: `${SERVER_URL}/exhibitions`,
    SEND_INNOVATORS: `${SERVER_URL}/exhibitions/sendinovators`,
    GET_SUBMITTED_INNOVATORS:`${SERVER_URL}/exhibitions/submitted-innovators`,
    CREATE_BOOTH: `${SERVER_URL}/booths`,
    GET_BOOTH: `${SERVER_URL}/booths`,
    APPROVE_BOOTH: `${SERVER_URL}/booths/approve`,
    REJECT_BOOTH: `${SERVER_URL}/booths/reject`,
    UPDATE_BOOTH: `${SERVER_URL}/booths/update-buttons-hidden`,
    APPROVE_PROJECT: `${SERVER_URL}/jobs/approve`,
    REJECT_PROJECT: `${SERVER_URL}/jobs/reject`,
    APPROVE_Apply_PROJECT: `${SERVER_URL}/apply/approve`,
    REJECT_Apply_PROJECT: `${SERVER_URL}/apply/reject`,
    APPLY_JOBID: `${SERVER_URL}/apply/jobId`,

    



    //****** FreeLancers and Innovators API url ******//
    FREELANCERS: `${SERVER_URL}/users/by-type?userType=Freelancer`,
    INNOVATORS: `${SERVER_URL}/users/by-type?userType=Innovators`,
    INNOVATORSFOREXIBITION: `${SERVER_URL}/users/by-type1?userType=Innovators`,
    PROJECTOWNERS: `${SERVER_URL}/users/by-type?userType=Project Owner`,

    CATEGORIES: `${SERVER_URL}/profile/categories`,




    GET_INNOVATORS: `${SERVER_URL}/users/by-type?userType=Innovators`,
    GET_VISITORS:  `${SERVER_URL}/interested-users`,
    ADD_VISITOR: `${SERVER_URL}/interested-users`,


    NOTIFICATIONS: `${SERVER_URL}/emails`,
    NOTIFICATIONSPROJECT: `${SERVER_URL}/jobs`,


    MARK_AS_READ: `${SERVER_URL}/emails/markasread`,

    GET_CURRENT_DATE: `${SERVER_URL}/exhibitions/current-date`,

}