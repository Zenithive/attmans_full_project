'use client'
import React, { useEffect, useState } from 'react';
import { Box, colors, Card, CardContent, IconButton, Autocomplete, TextField, Chip, ToggleButton, ToggleButtonGroup, Tooltip, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Typography, Menu, MenuItem, ListItemIcon, ListItemText, Grid, Button, Link } from '@mui/material';
import { APIS, SERVER_URL } from '@/app/constants/api.constant';
import dayjs from 'dayjs';
import FilterAltIcon from '@mui/icons-material/FilterAlt';
import { useCallback, useMemo } from 'react';
import { useAppSelector } from '../reducers/hooks.redux';
import { UserSchema, selectUserSession } from '../reducers/userReducer';
import { Category, Subcategorys } from '@/app/constants/categories';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import { Job, Apply } from '../projects/projectinterface';
import { Expertiselevel } from '../projects/projectinterface';
import { getSubcategorys } from '../projects/projectinterface';
import ProposalStep1 from '../component/proposal/ProposalStep1'
import ProposalStep2 from '../component/proposal/ProposalStep2'
import ProposalStep3 from '../component/proposal/ProposalStep3'
import ProposalConfirmationDialog from '../component/All_ConfirmationBox/ProposalConfirmationDialog';
import UserDrawer from '../component/UserNameSeperate/UserDrawer';
import { DATE_FORMAT } from '../constants/common.constants';
import ApplyDetailsDialog from '../component/projectsDetails/projectDetails';
import ConfirmationDialog from '../component/All_ConfirmationBox/ConfirmationDialog';
import { APPLY_STATUSES, PROJECT_STATUSES, PROPOSAL_STATUSES } from '@/app/constants/status.constant';
import axiosInstance from '../services/axios.service';
import { pubsub } from '../services/pubsub.service';
import ProjectDrawer from '../component/projectDrwer/projectDrwer';
import Filters, { FilterColumn } from '../component/filter/filter.component';
import { translationsforMyProjectPage } from '../../../public/trancation';

export interface Proposal {
    _id: string;
    projectTitle: string;
    Status: string;
    // Add other fields as needed
    firstname: string;
    lastname: string;
    jobDetails: JobDetails;
    userId?: UserSchema;
    userName: string;
    applyId: string;
    industryProblem: string;
    impactProductOutput: string;
    natureOfProject: string;
    haveTechnology: string;
    patentPreference: string;
    projectObjective: string;
    projectOutline: string;
    marketNiche: string;

    otherCommitments: string;
    progressReportTemplate: string;
    milestones: string;
    totalDaysCompletion: string;
    labStrengths: string;
    externalEquipment: string;
    pilotProductionTesting: string;
    mentoringRequired: string;
    isPeerReviewed: string;
    expectedOutcome: string;
    detailedMethodology: string;
    physicalAchievements: string;
    budgetOutlay: BudgetOutlay[];
    manpowerDetails: ManpowerDetail[];
    pastCredentials: string;
    briefProfile: string;
    proposalOwnerCredentials: string;

}

export interface ProposalStep2Values {
    isPeerReviewed: string;
    expectedOutcome: string;
    detailedMethodology: string;
    physicalAchievements: string;
    budgetOutlay: BudgetOutlay[];
    manpowerDetails: ManpowerDetail[];
    pastCredentials: string;
    briefProfile: string;
    proposalOwnerCredentials: string;
}

export interface BudgetOutlay {
    head: string;
    firstYear: string;
    secondYear: string;
    thirdYear: string;
    total: string;
}

export interface ManpowerDetail {
    designation: string;
    monthlySalary: string;
    firstYear: string;
    secondYear: string;
    totalExpenditure: string;
}



interface JobDetails {

    _id?: string;
    title: string;
    description: string;
    Budget: number;
    Expertiselevel: string;
    TimeFrame: string | null;
    Category: string[];
    Subcategorys: string[];
    appliesCount?: number;

    // ******** op ******** //
    DetailsOfInnovationChallenge: string;
    Sector: string;
    Quantity: number;
    ProductDescription: string;
    firstName: string,
    lastName: string,
    username: string;
    SelectService: string;
    Objective: string;
    Expectedoutcomes: string;
    IPRownership: string;
    currency: string;
    // Status: string;
    status: string;
    rejectComment?: string;
}

const proposal = () => {

    const { userType } = useAppSelector(selectUserSession);


    const column: Array<FilterColumn> = [
        {
            name: "Project Name",
            value: '',
            type: "Texbox",
            key: 'projTitle',
            isVisible: true,
        },
        {
            name: "Project Owner",
            value: '',
            type: "Texbox",
            key: 'ProjectOwner',
            isVisible: userType === "Admin",
        },
        {
            name: "Status",
            value: '',
            type: "Texbox",
            key: 'Status',
            isVisible: (userType === "Admin" || userType === "Project Owner"),
        },
        {
            name: "Category",
            value: '',
            type: "Category",
            key: 'Category',
            isVisible: true,
        },
        {
            name: "Subject Matter Expertise",
            value: '',
            type: "SubCategory",
            key: 'Subcategorys',
            isVisible: true,
        }
    ];

    const [filter, setFilter] = useState('');
    const [applyOpen, setApplyOpen] = useState(false);
    const [selectedCategory, setSelectedCategory] = useState<string[]>([]);
    const [selectedSubcategory, setSelectedSubcategory] = useState<string[]>([]);
    const [selectedExpertis, setSelectedExpertis] = useState<string[]>([]);
    const [hasMore, setHasMore] = useState(true);
    const [page, setPage] = useState(1);
    const [filterType, setFilterType] = useState("all");
    const [selectedStatus, setSelectedStatus] = useState<string | null>(null);
    const [viewingJob, setViewingJob] = useState<Job | null>(null);
    const [selectedServices, setSelectedServices] = useState<string[]>([]);
    const [projects, setProjects] = useState<Apply[]>([]);
    const [selectedUser, setSelectedUser] = React.useState<string>('');
    const [drawerOpen, setDrawerOpen] = React.useState<boolean>(false);
    const [selectedApply, setSelectedApply] = useState<Apply | null>(null);
    const [applications, setApplications] = useState<Apply[]>([]);
    const [currentApplicationId, setCurrentApplicationId] = useState<string | null>(null);
    const [confirmationDialogOpen, setConfirmationDialogOpen] = useState(false);
    const [isAwardButtonVisible, setIsAwardButtonVisible] = useState(true);

    const [selectedProject, setSelectedProject] = useState<Job | null>(null);
    const [dialogOpen, setDialogOpen] = useState(false);

    const [proposals, setProposals] = useState<Proposal[]>([]);

    const [confirmationOpen, setConfirmationOpen] = useState(false);
    const [currentAction, setCurrentAction] = useState<'Approve' | 'Reject'>('Approve');
    const [selectedProposalId, setSelectedProposalId] = useState<string>('');
    const [hasSubmittedProposal, setHasSubmittedProposal] = useState(false);


    const [selectedProposal, setSelectedProposal] = useState<Proposal | null>(null);
    const [currentStep, setCurrentStep] = useState<number>(1); // Track the current step
    const [openDialog, setOpenDialog] = useState(false);


    const userDetails: UserSchema = useAppSelector(selectUserSession);
    const { _id: userId } = userDetails;

    const language = userDetails.language || 'english';
    const t = translationsforMyProjectPage[language as keyof typeof translationsforMyProjectPage] || translationsforMyProjectPage.english;

    const [open, setOpen] = useState(false);
    const [step, setStep] = useState(1);

    const [formValues, setFormValues] = useState({});

    const handleUserClick = (username: string) => {
        setSelectedUser(username);
        setDrawerOpen(true);
    };

    const handleDrawerClose = () => {
        setDrawerOpen(false);
        setSelectedUser('');
    };

    const fetchAllProjects = useCallback(async () => {
        try {
            const response = await axiosInstance.get(APIS.GET_APPLIES_FOR_MYPROJECT, {
                params: {
                    userId: userDetails._id, // Include userId in the request
                },
            });
            setProjects(response.data);
        } catch (error) {
            console.error('Error fetching projects:', error);
        }
    }, [userDetails._id]);

    const fetchAllProposals = useCallback(async () => {
        if (userDetails.userType === 'Admin' || userDetails.userType === 'Project Owner') {
            try {
                const response = await axiosInstance.get(`${APIS.GET_ALL_PROPOSALS}?${filter}`);
                setProposals(response.data);
            } catch (error) {
                console.error('Error fetching proposals:', error);
            }
        }
    }, [userDetails.userType, filter]);


    useEffect(() => {
        fetchAllProjects();
        // Fetch all projects on component mount
    }, [fetchAllProjects]);

    useEffect(() => {
        fetchAllProposals();
        // Fetch proposals if user is Admin
    }, [fetchAllProposals, filter]);


    const refetch = useCallback(async () => {
        try {
            setPage(1);
            setHasMore(true);
        } catch (error) {
            console.error('Error refetching jobs:', error);
        }
    }, [selectedCategory, selectedExpertis, selectedSubcategory, selectedStatus, filterType, selectedServices]);

    useEffect(() => {
        refetch();
    }, [selectedCategory, selectedSubcategory, selectedExpertis, filterType, selectedServices]);


    const fetchAppliedJobs = async () => {
        try {
            const response = await axiosInstance.get(`${APIS.APPLIED_JOBS}/${userId}?${filter}`);
            //const fetchedAppliedJobs = response.data.map((application: Apply) => application.jobId);
            setApplications(response.data);
        } catch (error) {
            console.error('Error fetching applied jobs:', error);
        }
    };

    useEffect(() => {
        fetchAppliedJobs();
    }, [userId, filter]);

    useEffect(() => {
        pubsub.subscribe('ProposalRefetch', fetchAppliedJobs);
        pubsub.subscribe('ProposalRefetchAfterAward', fetchAllProposals);

        return () => {
            pubsub.unsubscribe('ProposalRefetch', fetchAppliedJobs);
            pubsub.unsubscribe('ProposalRefetchAfterAward', fetchAllProposals);
        };
    }, [fetchAppliedJobs]);
    // Function to handle viewing job details
    const handleViewJob = (job: Job, isOpenProjectModal?: boolean) => {
        isOpenProjectModal && setViewingJob({ ...job, userId: { ...job.userId, username: job.username } });
        // setViewingJob(job);
        setSelectedProject(job);
        setApplyOpen(false);
        // setApplyOpen(true); // Optionally reuse this state for opening the drawer
    };

    const handleNextStep = (values: any) => {

        setFormValues((prevValues) => {
            return { ...prevValues, ...values };
        });

        setStep((prevStep) => prevStep + 1);
    };


    const handlePreviousStep = (values: any) => {
        setFormValues((prevValues) => {
            return { ...prevValues, ...values };
        });

        setStep((prevStep) => {
            return prevStep - 1;
        });
    };

    const handleSubmit = async (values: any) => {
        const finalValues = {
            ...formValues, ...values,
            userID: userDetails._id,
            userName: userDetails.username,
            projectId: selectedProject?._id || viewingJob?._id,
            applyId: selectedApply?._id,   // Correct
            projectTitle: selectedProject?.title,          // Correct
            // projectCurrency: selectedProject?.jobDetails?.currency,
            Status: 'Pending',
            comment: '',
            firstname: userDetails.firstName,
            lastname: userDetails.lastName,

        };


        // Submit finalValues to the backend
        try {
            await axiosInstance.post(APIS.PROPOSAL, finalValues); // Updated to use APIS.PROPOSAL
            setOpen(false);
            setHasSubmittedProposal(true);
            setStep(1);
            setFormValues({});
            pubsub.publish('ProposalRefetch', { Message: 'Proposal Refetched' });
        } catch (error) {
            console.error('Error submitting proposal:', error);
        }
    };


    const handleApprove = (proposalId: string) => {
        setConfirmationOpen(true);
        setCurrentAction('Approve');
        setSelectedProposalId(proposalId);
        pubsub.publish('ProposalRefetchAfterAward');

    };

    const handleReject = (proposalId: string) => {
        setConfirmationOpen(true);
        setCurrentAction('Reject');
        setSelectedProposalId(proposalId);
        pubsub.publish('ProposalRefetchAfterAward');

    };

    const handleConfirmation = async (status: 'Approved' | 'Rejected', comment: string) => {
        try {
            await axiosInstance.put(`/proposals/${selectedProposalId}/status`, {
                status,
                comment,
                userId
            });

            setProposals(prevProposals =>
                prevProposals.map(proposal =>
                    proposal._id === selectedProposalId ? { ...proposal, Status: status } : proposal
                )
            );

            setConfirmationOpen(false);
            pubsub.publish('ProposalRefetchAfterAward');
        } catch (error) {
            console.error('Error updating proposal status:', error);
        }
    };

    const handleReward = async (applicationId: string, Comment: string) => {
        try {
            if (!applicationId) return;

            await axiosInstance.post(`${APIS.APPLYFORREWARD}/reward/${applicationId}`, {
                jobId: viewingJob?._id, // Include jobId in the payload
                Comment
            });

            // Update all other applications to "Not Awarded"
            const updatedApplications = applications.map((app) =>
                app._id === applicationId
                    ? { ...app, status: 'Awarded' }
                    : { ...app, status: 'Not Awarded' }
            );

            // Update the local state with the new statuses
            setApplications(updatedApplications);
            // Hide the Award button
            setIsAwardButtonVisible(false);

            pubsub.publish('ProposalRefetchAfterAward', { Message: 'Proposal Refetched' });

        } catch (error) {
            console.error('Error rewarding application:', error);
        }
    };


    const handleOpenConfirmationDialog = (applicationId: string) => {
        setCurrentApplicationId(applicationId);
        setConfirmationDialogOpen(true);
    };

    const handleCloseConfirmationDialog = () => {
        setConfirmationDialogOpen(false);
        setCurrentApplicationId(null);
    };

    const handleConfirm = (comment: string) => {
        if (currentApplicationId) {
            // Perform the action with currentApplicationId
            handleReward(currentApplicationId, comment)
            // Close the dialog after confirming
            handleCloseConfirmationDialog();
        }
    };

    const [showCommentSection, setShowCommentSection] = useState(false);

    const showProposalModal = (application: Apply) => {

        handleViewJob(application.jobDetails); // Call handleViewJob with the relevant job details
        setSelectedApply(application);
        setOpen(true); // Open the proposal dialog
    }

    const fetchProjectDetails = async (application: Apply) => {
        const response = await axiosInstance.get(`${APIS.JOBS}?projId=${application.jobId}`);

        if (response.data && response.data.length) {
            showProposalModal({ ...application, jobDetails: { ...response.data[0] } });
        }
    }

    useEffect(() => {
        if (userDetails.userType === 'Admin') {
            setShowCommentSection(true);
        }
    }, [userDetails.userType]);

    const handleViewProposal = (proposal: Proposal) => {
        setSelectedProposal(proposal); // Set the selected proposal in state
        setCurrentStep(1); // Set to the first step
        setStep(1);
        setOpen(true); // Open the dialog
    };

    const handleCloseDialog = () => {
        setOpenDialog(false);
    };

    const changeFilterOrPage = (paramStr: string) => {
        if (paramStr && paramStr.length) {
            setFilter(paramStr);
        } else {
            setFilter('');
        }
        setPage(1);
    }

    const OnCloseProposalDialog = () => {
        setOpen(false);
        setFormValues({});
        setSelectedProposal(null);
        setStep(1);
    }

    return (
        <Box
            sx={{
                background: colors.grey[100],
                p: 2,
                borderRadius: "30px !important",
                overflowX: "hidden !important",
                '@media (max-width: 767px)': {
                    position: 'relative',
                    left: '25px',
                },
            }}
        >
            <Box
                sx={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    '@media (max-width: 767px)': {
                        flexDirection: 'column',
                        alignItems: 'flex-start',
                    },
                }}
            >
                {userDetails.userType === 'Freelancer' && (
                    <Typography component="h4" sx={{ marginY: 0 }}>
                        {/* My Projects Proposals ///////// */}
                        {t.MyProjectsProposals}
                    </Typography>
                )}
                {userDetails.userType === 'Admin' && (
                    <Typography variant="h4">{t.allproposal}</Typography>
                )}

                {userDetails.userType === 'Project Owner' && (
                    <Typography component="h4" sx={{ marginY: 0 }}>
                        My Projects Proposals
                    </Typography>
                )}

                <Box sx={{ flex: '0 1 auto', mr: 3 }}>
                    <Filters column={column} onFilter={changeFilterOrPage}></Filters>
                </Box>
            </Box>

            <Box sx={{ mt: 2, position: 'relative' }}>
                {(userDetails.userType === 'Admin' || userDetails.userType === 'Project Owner') && (
                    <Box>
                        {proposals.length > 0 ? (
                            proposals
                                .filter(proposal => userDetails.userType === 'Admin' || (userDetails.userType === 'Project Owner' && (proposal.Status === PROPOSAL_STATUSES.proposalUnderReview || proposal.Status === PROPOSAL_STATUSES.approvedAndAwarded || proposal.Status === PROPOSAL_STATUSES.notAwarded)))
                                .map((proposal) => (
                                    <Card key={proposal._id} sx={{ mb: 2, position: 'relative' }}>
                                        <CardContent>
                                            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                                <Typography variant="h6">{proposal.projectTitle}</Typography>

                                            </Box>


                                            <Typography variant="body1">
                                                <span style={{ fontWeight: 'bold' }} onClick={() => {

                                                    handleUserClick(proposal?.jobDetails?.username);
                                                }}>
                                                    {/* Project Owner Name: */}
                                                    {t.projectOwnersName}
                                                </span>
                                                {` ${proposal?.jobDetails?.firstName} ${proposal?.jobDetails?.lastName}`}
                                            </Typography>
                                            {userDetails.userType === 'Admin' && (
                                                <Typography variant="body1">
                                                    <span style={{ fontWeight: 'bold' }}
                                                        onClick={() => {

                                                            handleUserClick(proposal?.userName);
                                                        }}
                                                    >
                                                        {/* Freelancer Name: */}
                                                        {t.freelancerName}
                                                    </span>
                                                    {` ${proposal.firstname} ${proposal.lastname}`}
                                                </Typography>
                                            )}

                                            {(proposal.Status === PROPOSAL_STATUSES.notAwarded || proposal.Status === PROPOSAL_STATUSES.approvedAndAwarded || proposal.Status === PROPOSAL_STATUSES.pending || proposal.Status === PROPOSAL_STATUSES.proposalUnderReview) && <Link
                                                component="button"
                                                // variant="contained"
                                                color="primary"
                                                onClick={() => handleViewProposal(proposal)}
                                                sx={{
                                                    color: 'blue',
                                                    textDecoration: 'underline',
                                                    cursor: 'pointer',
                                                    mr: 2
                                                }} // Style to ensure link is blue with underline
                                            >
                                                {/* View Proposal */}
                                                {t.viewproposal}
                                            </Link>}

                                            <Link
                                                component="button"
                                                // variant="contained"
                                                color="primary"
                                                onClick={() => handleViewJob(proposal.jobDetails, true)}
                                                sx={{
                                                    color: 'blue',
                                                    textDecoration: 'underline',
                                                    cursor: 'pointer',
                                                    mr: 2
                                                }} // Style to ensure link is blue with underline
                                            >
                                                {/* View Project */}
                                                {t.viewproject}
                                            </Link>

                                            <Box
                                                sx={{
                                                    position: 'absolute',
                                                    top: 8,
                                                    right: 8,
                                                    display: 'flex',
                                                    alignItems: 'center'
                                                }}
                                            >
                                                <Chip
                                                    label={proposal.Status}
                                                    variant="outlined"
                                                    color={proposal.Status === PROPOSAL_STATUSES.proposalUnderReview ? 'success' : 'error'}
                                                />
                                            </Box>
                                            {userDetails.userType === 'Admin' && (
                                                <Box sx={{ display: 'flex', gap: 1, mt: 2 }}>
                                                    {proposal.Status !== PROPOSAL_STATUSES.pending || proposal.Status !== 'Rejected' && (
                                                        <>
                                                            <Button
                                                                variant="contained"
                                                                color="success"
                                                                onClick={() => handleApprove(proposal._id)}
                                                            >
                                                                {/* Approve */}
                                                                {t.approve}
                                                            </Button>
                                                            <Button
                                                                variant="contained"
                                                                color="error"
                                                                onClick={() => handleReject(proposal._id)}
                                                            >
                                                                {t.reject}
                                                            </Button>
                                                        </>
                                                    )}
                                                </Box>
                                            )}
                                            {userDetails.userType === 'Project Owner' && proposal.applyId && isAwardButtonVisible && proposal.Status === PROPOSAL_STATUSES.proposalUnderReview && (
                                                <Button
                                                    variant="contained"
                                                    color="primary"
                                                    onClick={() => handleOpenConfirmationDialog(proposal.applyId as string)}
                                                >
                                                    Award
                                                </Button>
                                            )}
                                        </CardContent>
                                    </Card>
                                ))
                        ) : (
                            <Typography>No proposals available</Typography>
                        )}
                    </Box>

                )}
            </Box>


            {/* Confirmation Dialog */}
            <ProposalConfirmationDialog
                open={confirmationOpen}
                onClose={() => setConfirmationOpen(false)}
                onConfirm={handleConfirmation}
                action={currentAction}
            />



            <Box sx={{ mt: 2, position: 'relative' }}>
                {(userDetails.userType === 'Freelancer') && (
                    <>
                        {applications.length > 0 ? (
                            <Box>
                                {applications.map((application) => (
                                    (application.status === APPLY_STATUSES.approvedPendingForProposal ||
                                        application.status === APPLY_STATUSES.rejected ||
                                        application.status === APPLY_STATUSES.proposalApprovalPending ||
                                        application.status === APPLY_STATUSES.proposalUnderReview ||
                                        application.status === APPLY_STATUSES.awarded ||
                                        application.status === APPLY_STATUSES.notAwarded) && (
                                        <Card key={application._id} sx={{ mb: 2 }}>
                                            <CardContent>
                                                <Typography variant="h5" sx={{ display: 'flex', justifyContent: 'space-between' }}>

                                                    <Box

                                                    >
                                                        {application.title} &nbsp;
                                                        <span style={{ fontSize: 'small', color: "#616161" }}>
                                                            {/* ({dayjs(job.TimeFrame).format('MMMM D, YYYY h:mm A')}) */}
                                                            {dayjs(application.TimeFrame).format(DATE_FORMAT)}
                                                        </span>

                                                    </Box>
                                                    <Chip
                                                        label={application.status}
                                                        size='small'
                                                        variant="outlined"
                                                        sx={{
                                                            borderColor: application.status === APPLY_STATUSES.approvedPendingForProposal
                                                                ? 'green'
                                                                : application.status === APPLY_STATUSES.rejected
                                                                    ? 'red'
                                                                    : application.status === APPLY_STATUSES.approvedPendingForProposalINNOVATORS
                                                                        ? 'green'
                                                                        : application.status === APPLY_STATUSES.awarded
                                                                            ? 'blue'
                                                                            : application.status === APPLY_STATUSES.notAwarded
                                                                                ? 'grey'
                                                                                : 'default',
                                                            color: application.status === APPLY_STATUSES.approvedPendingForProposalINNOVATORS
                                                                ? 'green'
                                                                : application.status === APPLY_STATUSES.rejected
                                                                    ? 'red'
                                                                    : application.status === APPLY_STATUSES.rejected
                                                                        ? 'green'
                                                                        : application.status === APPLY_STATUSES.awarded
                                                                            ? 'blue'
                                                                            : application.status === APPLY_STATUSES.notAwarded
                                                                                ? 'grey'
                                                                                : 'default',
                                                            borderRadius: '16px',
                                                            px: 1,
                                                            mb: 2,
                                                        }}
                                                    />
                                                </Typography>

                                                <Typography variant="body2">{application.currency === 'USD' ? '$' : '₹'}{application.Budget}</Typography>

                                                <Link
                                                    component="button"
                                                    // variant="contained"
                                                    color="primary"
                                                    onClick={(e) => {
                                                        e.preventDefault();
                                                        setSelectedApply(application)
                                                        setDialogOpen(true);
                                                    }}
                                                    sx={{
                                                        color: 'blue',
                                                        textDecoration: 'underline',
                                                        cursor: 'pointer',
                                                        mr: 2
                                                    }}
                                                >
                                                    Apply Details
                                                </Link>


                                                {(application.status === APPLY_STATUSES.notAwarded || application.status === APPLY_STATUSES.awarded || application.status === APPLY_STATUSES.proposalApprovalPending || application.status === APPLY_STATUSES.proposalUnderReview) && <Link
                                                    component="button"
                                                    color="primary"
                                                    onClick={() => handleViewProposal(application.proposalsDetails)}
                                                    sx={{
                                                        color: 'blue',
                                                        textDecoration: 'underline',
                                                        cursor: 'pointer',
                                                        mr: 2
                                                    }}
                                                >
                                                    View Proposal
                                                </Link>}


                                                <Link
                                                    component="button"
                                                    color="primary"
                                                    onClick={() => handleViewJob(application.jobDetails, true)}
                                                    sx={{
                                                        color: 'blue',
                                                        textDecoration: 'underline',
                                                        cursor: 'pointer',
                                                        mr: 2
                                                    }}
                                                >
                                                    View Project
                                                </Link>

                                                {(!application.proposalsDetails || application.proposalsDetails.length === 0) && (
                                                    <Button
                                                        variant="contained"
                                                        size="small"
                                                        onClick={() => fetchProjectDetails(application)}
                                                    >
                                                        Submit Proposal
                                                    </Button>
                                                )}



                                            </CardContent>
                                        </Card>
                                    )
                                ))}
                            </Box>
                        ) : (
                            <Typography>{t.Noprojectsavailable}</Typography>
                        )}
                    </>
                )}


            </Box>




            {selectedUser ? (
                <UserDrawer
                    open={drawerOpen}
                    onClose={handleDrawerClose}
                    username={selectedUser}
                />
            ) : ""}

            {selectedApply && (
                <ApplyDetailsDialog
                    open={dialogOpen}
                    onClose={() => setDialogOpen(false)}
                    apply={selectedApply}
                    jobId={viewingJob?._id || ''}
                    canAddComment={showCommentSection}
                    onCommentSubmitted={() => { console.log('Comment has been submitted') }}
                />
            )}
            <ConfirmationDialog
                open={confirmationDialogOpen}
                onClose={handleCloseConfirmationDialog}
                onConfirm={handleConfirm}
                message="Are you sure you want to award this application?"
            />


            <Dialog open={open} onClose={() => OnCloseProposalDialog()} maxWidth="lg" fullWidth>
                <DialogTitle>Submit Proposal</DialogTitle>
                <DialogContent>


                    {step === 1 && <ProposalStep1 onNext={handleNextStep}
                        initialValues={selectedProposal || formValues || null}
                        readOnly={selectedProposal ? true : false}
                    />}



                    {step === 2 && <ProposalStep2
                        // initialValues={selectedProposal || null}
                        initialValues={selectedProposal || formValues || null}

                        readOnly={selectedProposal ? true : false}
                        onNext={handleNextStep}
                        onPrevious={handlePreviousStep}
                    />}



                    {step === 3 && <ProposalStep3
                        initialValues={selectedProposal || formValues || null}
                        readOnly={selectedProposal ? true : false}
                        onSubmit={handleSubmit}
                        onPrevious={handlePreviousStep}
                    />}


                </DialogContent>
                <DialogActions>
                    <Button onClick={() => OnCloseProposalDialog()}>Close</Button>
                </DialogActions>
            </Dialog>

            <ProjectDrawer
                viewingJob={viewingJob}
                setViewingJob={setViewingJob}
                userType={userDetails.userType} handleApproveDialogOpen={function (job: Job): void {
                    throw new Error('Function not implemented.');
                }} handleRejectDialogOpen={function (job: Job): void {
                    throw new Error('Function not implemented.');
                }} />
        </Box>


    );
};

export default proposal;