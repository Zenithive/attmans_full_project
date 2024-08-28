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

interface Proposal {
    _id: string;
    projectTitle: string;
    Status: string;
    // Add other fields as needed
    firstname: string;
    lastname: string;
    jobDetails: JobDetails;

}

interface JobDetails {

    firstName: string;
    lastName: string;
    
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


    const [selectedProject, setSelectedProject] = useState<Job | null>(null);

    const [proposals, setProposals] = useState<Proposal[]>([]);

    const [confirmationOpen, setConfirmationOpen] = useState(false);
    const [currentAction, setCurrentAction] = useState<'Approve' | 'Reject'>('Approve');
    const [selectedProposalId, setSelectedProposalId] = useState<string>('');



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
        if (userDetails.userType === 'Admin') {
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








    ////////////// Proposal ///////////////

    const handleNextStep = (values: any) => {
        setFormValues((prevValues) => ({ ...prevValues, ...values }));
        setStep((prevStep) => prevStep + 1);
    };

    const handlePreviousStep = () => {
        setStep((prevStep) => prevStep - 1);
    };

    const handleSubmit = async (values: any) => {

        const finalValues = {
            ...formValues, ...values,
            userID: userDetails._id,
            userName: userDetails.username,
            projectId: selectedProject?._id,               // Correct
            projectTitle: selectedProject?.title,          // Correct
            // projectCurrency: selectedProject?.jobDetails?.currency,
            Status: 'Pending',
            comment: '',
            firstname: userDetails.firstName,
            lastname: userDetails.lastName,

        };
        console.log("finalValues.projectId", finalValues.projectId);
        console.log("finalValues.projectTitle", finalValues.projectTitle);

        // Submit finalValues to the backend
        try {
            await axios.post(APIS.PROPOSAL, finalValues); // Updated to use APIS.PROPOSAL
            setOpen(false);
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
                        My Projects
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
                {userDetails.userType === 'Admin' && (
                    <Box>
                        {proposals.length > 0 ? (
                            proposals.map((proposal) => (
                                <Card key={proposal._id} sx={{ mb: 2, position: 'relative' }}>
                                    <CardContent>
                                        <Typography variant="h6">{proposal.projectTitle}</Typography>
                                        <Typography variant="body1">
                                            <span style={{ fontWeight: 'bold' }}>Project Owner Name:</span>
                                            {` ${proposal.jobDetails.firstName} ${proposal.jobDetails.lastName}`}
                                        </Typography>
                                        <Typography variant="body1">
                                            <span style={{ fontWeight: 'bold' }}>Freelancer Name:</span>
                                            {` ${proposal.firstname} ${proposal.lastname}`}
                                        </Typography>
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
                {(userDetails.userType === 'Freelancer' || userDetails.userType === 'Innovators') && (
                    <>
                        {projects.length > 0 ? (
                            <Box>
                                {projects.map((project) => (
                                    <Card key={project._id} sx={{ mb: 2 }}>
                                        <CardContent>
                                            <Typography variant="h5" sx={{ display: 'flex', justifyContent: 'space-between' }}>
                                                <Box
                                                    onClick={() => handleViewJob(project.jobDetails)}
                                                    sx={{ cursor: 'pointer' }}
                                                >
                                                    {project.jobDetails.title}
                                                </Box>
                                                <Box sx={{ fontSize: 'small', color: 'text.secondary' }}>
                                                    {dayjs(project.jobDetails.TimeFrame).format('MMMM D, YYYY h:mm A')}
                                                </Box>
                                            </Typography>



                                            <Typography variant="body1" sx={{ mt: 1 }}>
                                                {project.jobDetails.currency} {project.jobDetails.Budget}
                                            </Typography>



                                            <Typography variant="body2" sx={{ mt: 1 }}>
                                                {project.jobDetails.Category.join(', ')}{project.jobDetails.Subcategorys.length > 0 ? `, ${project.jobDetails.Subcategorys.join(', ')}` : ''}
                                            </Typography>

                                            <Box sx={{ mt: 2, display: 'flex', justifyContent: 'space-between' }}>
                                                <Box sx={{
                                                    fontSize: 'small', fontWeight: "bolder", display: 'flex', alignItems: 'center'
                                                }}>


                                                    <Button
                                                        variant="contained"
                                                        onClick={() => {
                                                            handleViewJob(project.jobDetails); // Call handleViewJob with the relevant job details
                                                            setOpen(true); // Open the proposal dialog
                                                        }}
                                                    >
                                                        Proposal
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
        </Box>
    );
};

export default proposal;