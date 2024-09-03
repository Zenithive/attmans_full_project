'use client'
import React, { useEffect, useState } from 'react';
import { Box, colors, Card, CardContent, IconButton, Autocomplete, TextField, Chip, ToggleButton, ToggleButtonGroup, Tooltip, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Typography, Menu, MenuItem, ListItemIcon, ListItemText, Grid, Button } from '@mui/material';
import axios from 'axios';
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
import { APPLY_STATUSES, PROJECT_STATUSES } from '@/app/constants/status.constant';

interface Proposal {
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
}

interface JobDetails {

    firstName: string;
    lastName: string;
    username: string;

}



const proposal = () => {
    const [jobs, setJobs] = useState<Job[]>([]);
    const [applyOpen, setApplyOpen] = useState(false);
    const [selectedCategory, setSelectedCategory] = useState<string[]>([]);
    const [selectedSubcategory, setSelectedSubcategory] = useState<string[]>([]);
    const [selectedExpertis, setSelectedExpertis] = useState<string[]>([]);
    const [filterOpen, setFilterOpen] = useState(false);
    const [hasMore, setHasMore] = useState(true);
    const [page, setPage] = useState(1);
    const [filterType, setFilterType] = useState("all");
    const [anchorEl, setAnchorEl] = React.useState<HTMLElement | null>(null);
    const [appliedJobs, setAppliedJobs] = useState<string[]>([]);
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


    const userDetails: UserSchema = useAppSelector(selectUserSession);
    const { _id: userId } = userDetails;

    const [open, setOpen] = useState(false);
    const [step, setStep] = useState(1);
    const [formValues, setFormValues] = useState({});

    const handleClick = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };


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
            const response = await axios.get(APIS.GET_APPLIES_FOR_MYPROJECT, {
                params: {
                    userId: userDetails._id, // Include userId in the request

                },
            });
            console.log('Fetched Projects:', response.data); // Log the response data
            setProjects(response.data);
        } catch (error) {
            console.error('Error fetching projects:', error);
        }
    }, [userDetails._id]);

    const fetchAllProposals = useCallback(async () => {
        if (userDetails.userType === 'Admin' || userDetails.userType === 'Project Owner') {
            try {
                const response = await axios.get(APIS.GET_ALL_PROPOSALS);
                console.log('Fetched Proposals:', response.data);
                setProposals(response.data);
            } catch (error) {
                console.error('Error fetching proposals:', error);
            }
        }
    }, [userDetails.userType]);


    useEffect(() => {
        fetchAllProjects();
        // Fetch all projects on component mount
    }, [fetchAllProjects]);

    useEffect(() => {
        fetchAllProposals();
        // Fetch proposals if user is Admin
    }, [fetchAllProposals]);


    const refetch = useCallback(async () => {
        try {
            setPage(1);
            setJobs([]);
            setHasMore(true);
        } catch (error) {
            console.error('Error refetching jobs:', error);
        }
    }, [selectedCategory, selectedExpertis, selectedSubcategory, selectedStatus, filterType, selectedServices]);

    useEffect(() => {
        refetch();
    }, [selectedCategory, selectedSubcategory, selectedExpertis, filterType, selectedServices]);



    useEffect(() => {
        const fetchAppliedJobs = async () => {
            try {
                const response = await axios.get(`${APIS.APPLIED_JOBS}/${userId}`);
                console.log('respons page', response.data);
                const fetchedAppliedJobs = response.data.map((application: Apply) => application.jobId);
                console.log('fetchedAppliedJobs', fetchedAppliedJobs);
                setAppliedJobs(fetchedAppliedJobs);
                setApplications(response.data);
            } catch (error) {
                console.error('Error fetching applied jobs:', error);
            }
        };
        fetchAppliedJobs();
    }, [userId]);

    // Function to handle viewing job details
    const handleViewJob = (job: Job) => {
        console.log("Viewing Job:", job);
        setViewingJob(job);
        setSelectedProject(job);
        setApplyOpen(false);
        // setApplyOpen(true); // Optionally reuse this state for opening the drawer
    };

    useEffect(() => {
        const fetchProposalStatus = async () => {
            try {
                const response = await axios.get(`${SERVER_URL}/proposals/user${selectedApply?._id}`);
                console.log('response for fetchProposalStatus', response.data);
                setHasSubmittedProposal(!!response.data);
                // Update state based on whether proposal exists
            } catch (error) {
                console.error('Error fetching proposal status', error);
            }
        };

        fetchProposalStatus();
    }, [selectedApply?._id]);

    const handleNextStep = (values: any) => {
        setFormValues((prevValues) => ({ ...prevValues, ...values }));
        setStep((prevStep) => prevStep + 1);
    };

    const handlePreviousStep = () => {
        setStep((prevStep) => prevStep - 1);
    };

    const handleSubmit = async (values: any) => {
        console.log('values', values);
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
        console.log('finalValues', finalValues);
        console.log("finalValues.projectId", finalValues.projectId);
        console.log("finalValues.projectTitle", finalValues.projectTitle);

        // Submit finalValues to the backend
        try {
            await axios.post(APIS.PROPOSAL, finalValues); // Updated to use APIS.PROPOSAL
            setOpen(false);
            setHasSubmittedProposal(true);
            setStep(1);
            setFormValues({});
        } catch (error) {
            console.error('Error submitting proposal:', error);
        }
    };




    const handleApprove = (proposalId: string) => {
        setCurrentAction('Approve');
        setSelectedProposalId(proposalId);
        setConfirmationOpen(true);
    };

    const handleReject = (proposalId: string) => {
        setCurrentAction('Reject');
        setSelectedProposalId(proposalId);
        setConfirmationOpen(true);
    };

    const handleConfirmation = async (status: 'Approved' | 'Rejected', comment: string) => {
        try {
            await axios.put(`${SERVER_URL}/proposals/${selectedProposalId}/status`, {
                status,
                comment
            });
            // Refresh the proposals list after update
            fetchAllProposals();
        } catch (error) {
            console.error('Error updating proposal status:', error);
        }
    };

    const handleReward = async (applicationId: string, Comment: string) => {
        try {
            if (!applicationId) return;
            console.log("applicationId", applicationId);


            // First, award the selected application
            // await axios.post(`${APIS.APPLYFORREWARD}/reward/${applicationId}`);
            // await axios.post(`${APIS.APPLYFORREWARD}/reward/${applicationId}`, {
            //   jobId, // Include jobId in the payload
            // });

            await axios.post(`${APIS.APPLYFORREWARD}/reward/${applicationId}`, {
                jobId: viewingJob?._id, // Include jobId in the payload
                Comment
            });

            // Update all other applications to "Not Awarded"
            const updatedApplications = applications.map((app) =>
                app._id === applicationId
                    ? { ...app, status: 'Awarded' }
                    : { ...app, status: 'Not Awarded' }
            );

            // Make an API call to update all applications' statuses on the server
            // await axios.post(`${APIS.NOTAWARED}/updateStatuses`, { applications: updatedApplications });

            // Update the local state with the new statuses
            setApplications(updatedApplications);
            // Hide the Award button
            setIsAwardButtonVisible(false);

            // Hide all the buttons
            // setButtonsHidden((prev) => {
            //   const updated = { ...prev };
            //   Object.keys(updated).forEach((key) => {
            //     updated[key] = true;
            //   });
            //   return updated;
            // });

        } catch (error) {
            console.error('Error rewarding application:', error);
        }
    };


    const handleOpenConfirmationDialog = (applicationId: string) => {
        console.log("applicationId", applicationId);

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
            console.log(`Awarding application with ID: ${currentApplicationId}`);
            handleReward(currentApplicationId, comment)
            // Close the dialog after confirming
            handleCloseConfirmationDialog();
        }
    };

    const [showCommentSection, setShowCommentSection] = useState(false);

    const showProposalModal = (application: Apply) => {
        console.log('application.jobDetails', application.jobDetails._id);
        handleViewJob(application.jobDetails); // Call handleViewJob with the relevant job details
        setSelectedApply(application);
        setOpen(true); // Open the proposal dialog
    }

    const fetchProjectDetails = async (application: Apply) => {
        const response = await axios.get(`${APIS.JOBS}?projId=${application.jobId}`);
        console.log("fetchProjectDetails", response.data)
        if(response.data && response.data.length){
            showProposalModal({...application, jobDetails: {...response.data[0]}});
        }
    }

    useEffect(() => {
        if (userDetails.userType === 'Admin') {
            setShowCommentSection(true);
        }
    }, [userDetails.userType]);



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
                    <Typography component="h2" sx={{ marginY: 0 }}>
                        My Projects Proposals
                    </Typography>
                )}
                {userDetails.userType === 'Admin' && (
                    <Typography variant="h4">All Proposals</Typography>
                )}

            </Box>


            <Box sx={{
                position: 'relative', left: '87%', width: '3%', bottom: '26px', '@media (max-width: 767px)': {
                    position: 'relative',
                    top: '8px',
                    left: '-5px',
                    marginBottom: '15px'
                }
            }}>
                <Tooltip title="Filter" arrow>
                    <IconButton onClick={() => setFilterOpen(prev => !prev)}>
                        <FilterAltIcon />
                    </IconButton>
                </Tooltip>
            </Box>

            {filterOpen && (
                <Box
                    sx={{
                        display: 'flex',
                        marginBottom: '20px',
                        gap: 3,
                        alignItems: 'center',
                        '@media (max-width: 767px)': {
                            flexDirection: 'column',
                            alignItems: 'stretch',
                            gap: 2,
                            width: '100%'
                        },
                    }}
                >
                    <Autocomplete
                        sx={{ flex: 1, width: { xs: '100%', md: 'auto' } }}
                        multiple
                        size="small"
                        options={Expertiselevel}
                        value={selectedExpertis}
                        onChange={(event, value) => setSelectedExpertis(value)}
                        renderInput={(params) => (
                            <TextField {...params} variant="outlined" label="Filter by Expertise-Level" color="secondary" />
                        )}
                    />

                    <Autocomplete
                        sx={{ flex: 1, width: { xs: '100%', md: 'auto' } }}
                        multiple
                        size="small"
                        options={Category()}
                        value={selectedCategory}
                        onChange={(event, value) => setSelectedCategory(value)}
                        renderInput={(params) => (
                            <TextField {...params} variant="outlined" label="Filter by Category" color="secondary" />
                        )}
                    />

                    <Autocomplete
                        sx={{ flex: 1, width: { xs: '100%', md: 'auto' } }}
                        multiple
                        size="small"
                        options={getSubcategorys(Subcategorys())}
                        value={selectedSubcategory}
                        onChange={(event, value) => setSelectedSubcategory(value)}
                        renderInput={(params) => (
                            <TextField {...params} variant="outlined" label="Filter by Subcategory" color="secondary" />
                        )}
                    />

                </Box>
            )}

            <Box sx={{ mt: 2, position: 'relative' }}>
                {(userDetails.userType === 'Admin' || userDetails.userType === 'Project Owner') && (
                    <Box>
                        {proposals.length > 0 ? (
                            proposals.map((proposal) => (
                                <Card key={proposal._id} sx={{ mb: 2, position: 'relative' }}>
                                    <CardContent>
                                        <Typography variant="h6">{proposal.projectTitle}</Typography>
                                        <Typography variant="body1">
                                            <span style={{ fontWeight: 'bold' }} onClick={() => {
                                                console.log('proposal?.jobDetails?.username', proposal?.jobDetails?.username);
                                                handleUserClick(proposal?.jobDetails?.username);
                                            }}>
                                                Project Owner Name:
                                            </span>
                                            {` ${proposal.jobDetails.firstName} ${proposal.jobDetails.lastName}`}
                                        </Typography>
                                        {userDetails.userType === 'Admin' && (
                                            <Typography variant="body1">
                                                <span style={{ fontWeight: 'bold' }}
                                                    onClick={() => {
                                                        console.log(`Freelancer Name: ${proposal.firstname} ${proposal.lastname}`);
                                                        handleUserClick(proposal?.userName);
                                                    }}
                                                >
                                                    Freelancer Name:</span>
                                                {` ${proposal.firstname} ${proposal.lastname}`}
                                            </Typography>
                                        )}
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
                                                color={proposal.Status === 'Approved' ? 'success' : 'error'}
                                            />
                                        </Box>
                                        {userDetails.userType === 'Admin' && (
                                            <Box sx={{ display: 'flex', gap: 1, mt: 2 }}>
                                                <Button
                                                    variant="contained"
                                                    color="success"
                                                    onClick={() => handleApprove(proposal._id)}
                                                >
                                                    Approve
                                                </Button>
                                                <Button
                                                    variant="contained"
                                                    color="error"
                                                    onClick={() => handleReject(proposal._id)}
                                                >
                                                    Reject
                                                </Button>
                                            </Box>
                                        )}
                                        {userDetails.userType === 'Project Owner' && proposal.applyId && isAwardButtonVisible && (
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
                                    <Card key={application._id} sx={{ mb: 2 }}>
                                        <CardContent>
                                            <Typography variant="h5" sx={{ display: 'flex', justifyContent: 'space-between' }}>
                                                <a
                                                    href="#"
                                                    onClick={(e) => {
                                                        e.preventDefault();
                                                        setSelectedApply(application);
                                                        setDialogOpen(true);
                                                    }}
                                                    style={{
                                                        textDecoration: 'underline',
                                                        color: '#1976d2',
                                                        fontFamily: '"Segoe UI", "Segoe UI Emoji", "Segoe UI Symbol"',
                                                    }}
                                                >
                                                    {application.title}
                                                </a>
                                                <Box sx={{ fontSize: 'small', color: 'text.secondary' }}>
                                                    {dayjs(application.TimeFrame).format(DATE_FORMAT)}
                                                </Box>
                                            </Typography>

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


                                            <Typography variant="body1" sx={{ mt: 1 }}>
                                                {application.currency} {application.Budget}
                                            </Typography>
                                            {!hasSubmittedProposal && (
                                                <Box sx={{ mt: 1, display: 'flex', justifyContent: 'space-between', width: '100%' }}>

                                                    <Box sx={{
                                                        fontSize: 'small', fontWeight: "bolder", display: 'flex', alignItems: 'center'
                                                    }}>
                                                        <Button
                                                            variant="contained"
                                                            size='small'
                                                            onClick={() => {
                                                                fetchProjectDetails(application);
                                                            }}
                                                        >
                                                            Submit Proposal
                                                        </Button>

                                                        <Dialog open={open} onClose={() => setOpen(false)} maxWidth="lg" fullWidth>
                                                            <DialogTitle>Submit Proposal</DialogTitle>
                                                            <DialogContent>
                                                                {step === 1 && <ProposalStep1 onNext={handleNextStep} />}
                                                                {step === 2 && <ProposalStep2 onNext={handleNextStep} onPrevious={handlePreviousStep} />}
                                                                {step === 3 && <ProposalStep3 onSubmit={handleSubmit} onPrevious={handlePreviousStep} />}
                                                            </DialogContent>
                                                            <DialogActions>
                                                                <Button onClick={() => setOpen(false)}>Cancel</Button>
                                                            </DialogActions>
                                                        </Dialog>

                                                    </Box>
                                                </Box>
                                            )}
                                            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                                <Button
                                                    aria-controls="simple-menu"
                                                    aria-haspopup="true"
                                                    onClick={handleClick}
                                                    sx={{ display: { xs: 'block', md: 'none' } }}
                                                    endIcon={<MoreVertIcon />}
                                                >
                                                    More
                                                </Button>
                                                <Menu
                                                    id="simple-menu"
                                                    anchorEl={anchorEl}
                                                    keepMounted
                                                    open={Boolean(anchorEl)}
                                                    onClose={handleClose}
                                                    PaperProps={{
                                                        sx: {
                                                            border: '1px solid',
                                                            boxShadow: 'none',
                                                        },
                                                    }}
                                                >
                                                </Menu>
                                            </Box>
                                        </CardContent>
                                    </Card>
                                ))}
                            </Box>
                        ) : (
                            <Typography>No projects available</Typography>
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
        </Box>
    );
};

export default proposal;