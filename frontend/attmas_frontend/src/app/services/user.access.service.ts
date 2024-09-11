export type userType = 'Admin' | 'Freelancer' | 'Project Owner' | 'Innovator' | 'Visitors' | "";

export const getRoleBasedAccess = (userType: userType) => {
    const isAdmin = userType === 'Admin';
    const isFreelancer = userType === 'Freelancer';
    const isProjectOwner = userType === 'Project Owner';
    const isInnovator = userType === 'Innovator';
    const isVisitor = userType === 'Visitors';

    return {
        isAdmin,
        isFreelancer,
        isProjectOwner,
        isInnovator,
        isVisitor
    }
}