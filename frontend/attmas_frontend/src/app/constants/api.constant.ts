export const SERVER_URL = process.env.SERVER_URL;


export const APIS = {
    LOGIN: `/auth/login`,
    SIGNUP: `/users`,
    LOGOUT: `/auth/logout`,
    JOBS: `/jobs`,
    APPLY: `/apply`,
    // APPLYFORREWARD: `/Apply/applyforreward`,
    APPLYFORREWARD: `/Apply`,
    NOTAWARED: `/Apply`,



    //****** Profile API url ******//
    FORM1: `/profile/form1`,
    FORM2: `/profile/form2`,
    FORMTOPRODUCT: `/profile/formtoproduct`,
    FORM3: `/profile/form3`,
    CHECK_PROFILE: `/profile/check`,

    ADDBOTHPRODUCTTOWORKEXPRINCE: `/profile/addProductToWorkExperience`,



    PRODUCTNAME: `/profile/products`,

    CHECKINTRESTEDUSER: `/interested-users`,

    ALL_PROFILES: `/profile/all`,

    ADD_COMMENT: `/comments`,

    GET_COMMENT:`/comments`,




    PROPOSAL: `/proposals`,

    GET_ALL_PROPOSALS : `/proposals`,

    UPDATE_PROPOSAL_STATUS: `/status`,




    






    //****** Exhibitions API url ******//
    EXHIBITION: `/exhibitions`,
    SEND_INNOVATORS: `/exhibitions/sendinovators`,
    GET_SUBMITTED_INNOVATORS:`/exhibitions/submitted-innovators`,
    CREATE_BOOTH: `/booths`,
    GET_BOOTH: `/booths`,
    GET_BOOTHPRODUCTS: `/booths`,
    APPROVE_BOOTH: `/booths/approve`,
    REJECT_BOOTH: `/booths/reject`,
    UPDATE_BOOTH: `/booths/update-buttons-hidden`,
    APPROVE_PROJECT: `/jobs/approve`,
    REJECT_PROJECT: `/jobs/reject`,
    APPROVE_Apply_PROJECT: `/apply/approve`,
    REJECT_Apply_PROJECT: `/apply/reject`,
    APPLY_JOBID: `/apply/jobId`,
    APPLY_USERID: `/apply/userId`,

    



    //****** FreeLancers and Innovator API url ******//
    FREELANCERS: `/users/filters?userType=Freelancer`,
    INNOVATORS: `/users/filters?userType=Innovator`,
    INNOVATORSFOREXIBITION: `/users/by-type1?userType=Innovator`,
    PROJECTOWNERS: `/users/filters?userType=Project Owner`,

    CATEGORIES: `/profile/categories`,




    GET_INNOVATORS: `/users/filters?userType=Innovator`,
    GET_VISITORS:  `/interested-users`,
    GET_VISITORS2: '/interested-users/filter-visitors',
    ADD_VISITOR: `/interested-users`,


    NOTIFICATIONS: `/emails`,
    NOTIFICATIONSPROJECT: `/jobs`,


    MARK_AS_READ: `/emails/markasread`,

    GET_CURRENT_DATE: `/exhibitions/current-date`,

    APPLIED_JOBS: `/apply/appliedJobs`,



    APPLIED_JOBSFORADMIN: `/Apply/appliedJobsForAdmin`,




    APPLIED_APPLICATION: `/Apply`,
    JOB_DETAILS: `/apply/jobDetails`,

    GET_INTERESTED_EXHIBITIONS: `/interested-users/user-interests`, 
    SHOW_INTEREST: `/interested-users`, 

    USER_APPLICATIONS: (userId: any) => `/Apply/user/${userId}`,

    MILESTONES: `/milestones`,

    GET_MILESTONES: `/milestones`,





    GET_APPLIES_FOR_MYPROJECT : `/Apply/applyformyProject`,

    CLOSED_PROJECT: `/jobs/update-status-closecomment`, 

    CLOSED_BY_ADMIN: `/jobs/update-status-closecommentByAdmin`,

    GET_BOOTH_VISITORS_BY_EXHIBITION: `/booth-visitors-by-exhibition`,

    GET_VISITORS_BY_INTEREST_TYPE:`/interested-users/visitors-by-interest-type`,


    BILLING: `/billing`,
    GET_BILLING: (id: string) => `/billing/${id}`,

    CHECK_PROPOSAL_SUBMISSION: `/proposals/check-submission`,
}