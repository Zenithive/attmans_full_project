export const SERVER_URL = process.env.SERVER_URL;


export const APIS = {
    LOGIN: `${SERVER_URL}/auth/login`,
    SIGNUP: `${SERVER_URL}/users`,
    LOGOUT: `${SERVER_URL}/auth/logout`,
    JOBS: `${SERVER_URL}/jobs`,
    APPLY: `${SERVER_URL}/apply`,
    // APPLYFORREWARD: `${SERVER_URL}/Apply/applyforreward`,
    APPLYFORREWARD: `${SERVER_URL}/Apply`,
    NOTAWARED: `${SERVER_URL}/Apply`,



    //****** Profile API url ******//
    FORM1: `${SERVER_URL}/profile/form1`,
    FORM2: `${SERVER_URL}/profile/form2`,
    FORMTOPRODUCT: `${SERVER_URL}/profile/formtoproduct`,
    FORM3: `${SERVER_URL}/profile/form3`,
    CHECK_PROFILE: `${SERVER_URL}/profile/check`,

    ADDBOTHPRODUCTTOWORKEXPRINCE: `${SERVER_URL}/profile/addProductToWorkExperience`,



    PRODUCTNAME: `${SERVER_URL}/profile/products`,

    CHECKINTRESTEDUSER: `${SERVER_URL}/interested-users`,

    ALL_PROFILES: `${SERVER_URL}/profile/all`,

    ADD_COMMENT: `${SERVER_URL}/comments`,

    GET_COMMENT:`${SERVER_URL}/comments`,




    PROPOSAL: `${SERVER_URL}/proposals`,




    






    //****** Exhibitions API url ******//
    EXHIBITION: `${SERVER_URL}/exhibitions`,
    SEND_INNOVATORS: `${SERVER_URL}/exhibitions/sendinovators`,
    GET_SUBMITTED_INNOVATORS:`${SERVER_URL}/exhibitions/submitted-innovators`,
    CREATE_BOOTH: `${SERVER_URL}/booths`,
    GET_BOOTH: `${SERVER_URL}/booths`,
    GET_BOOTHPRODUCTS: `${SERVER_URL}/booths`,
    APPROVE_BOOTH: `${SERVER_URL}/booths/approve`,
    REJECT_BOOTH: `${SERVER_URL}/booths/reject`,
    UPDATE_BOOTH: `${SERVER_URL}/booths/update-buttons-hidden`,
    APPROVE_PROJECT: `${SERVER_URL}/jobs/approve`,
    REJECT_PROJECT: `${SERVER_URL}/jobs/reject`,
    APPROVE_Apply_PROJECT: `${SERVER_URL}/apply/approve`,
    REJECT_Apply_PROJECT: `${SERVER_URL}/apply/reject`,
    APPLY_JOBID: `${SERVER_URL}/apply/jobId`,
    APPLY_USERID: `${SERVER_URL}/apply/userId`,

    



    //****** FreeLancers and Innovators API url ******//
    FREELANCERS: `${SERVER_URL}/users/filters?userType=Freelancer`,
    INNOVATORS: `${SERVER_URL}/users/filters?userType=Innovators`,
    INNOVATORSFOREXIBITION: `${SERVER_URL}/users/by-type1?userType=Innovators`,
    PROJECTOWNERS: `${SERVER_URL}/users/filters?userType=Project Owner`,

    CATEGORIES: `${SERVER_URL}/profile/categories`,




    GET_INNOVATORS: `${SERVER_URL}/users/filters?userType=Innovators`,
    GET_VISITORS:  `${SERVER_URL}/interested-users`,
    GET_VISITORS2: '/interested-users/filter-visitors',
    ADD_VISITOR: `${SERVER_URL}/interested-users`,


    NOTIFICATIONS: `${SERVER_URL}/emails`,
    NOTIFICATIONSPROJECT: `${SERVER_URL}/jobs`,


    MARK_AS_READ: `${SERVER_URL}/emails/markasread`,

    GET_CURRENT_DATE: `${SERVER_URL}/exhibitions/current-date`,

    APPLIED_JOBS: `${SERVER_URL}/apply/appliedJobs`,
    APPLIED_APPLICATION: `${SERVER_URL}/Apply`,
    JOB_DETAILS: `${SERVER_URL}/apply/jobDetails`,

    GET_INTERESTED_EXHIBITIONS: `${SERVER_URL}/interested-users/user-interests`, 
    SHOW_INTEREST: `${SERVER_URL}/interested-users`, 

    USER_APPLICATIONS: (userId: any) => `${SERVER_URL}/Apply/user/${userId}`,

    MILESTONES: `${SERVER_URL}/milestones`,

    GET_MILESTONES: `${SERVER_URL}/milestones`,





    GET_APPLIES_FOR_MYPROJECT : `${SERVER_URL}/Apply/applyformyProject`,

    CLOSED_PROJECT: `${SERVER_URL}/jobs/update-status-closecomment`, 

    CLOSED_BY_ADMIN: `${SERVER_URL}/jobs/update-status-closecommentByAdmin`,

    GET_BOOTH_VISITORS_BY_EXHIBITION: `${SERVER_URL}/booth-visitors-by-exhibition`,

    GET_VISITORS_BY_INTEREST_TYPE:`${SERVER_URL}/interested-users/visitors-by-interest-type`
}