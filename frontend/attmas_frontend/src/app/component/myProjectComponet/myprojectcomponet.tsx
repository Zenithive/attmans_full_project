import React, { useCallback, useEffect, useState } from 'react';
import { Dialog, DialogTitle, DialogContent, Grid, TextField, Chip, Button, IconButton, Card, CardContent, Typography, Box, Divider, Tooltip, DialogContentText, DialogActions } from '@mui/material';
import { Close } from '@mui/icons-material';
import axios from 'axios';
import dayjs from 'dayjs';
import { APIS } from '@/app/constants/api.constant';
import ApproveDialogForApply from '../applyapprove/applyapprove';
import RejectDialogForApply from '../applyreject/applyreject';
import StatusFilter from '../filter/filter';
import { useAppSelector } from '@/app/reducers/hooks.redux';
import { UserSchema, selectUserSession } from '@/app/reducers/userReducer';
import ApplyDetailsDialog from '../projectsDetails/projectDetails';
import booth from '../booth/booth';
import AddComment from '../projectComment/projectComment';
import JobDetail from '../projectCommentCard/projectCommentCard';
import ConfirmationDialog from '../projectDrwer/ConfirmationDialog';
import ProjectDrawer from '../projectDrwer/projectDrwer';



export interface Job {
    _id?: string;
    title: string;
    description: string;
    Budget: number;
    Expertiselevel: string;
    TimeFrame: string | null;
    Category: string[];
    Subcategorys: string[];
    DetailsOfInnovationChallenge: string;
    firstName: string,
    lastName: string,
    Sector: string;
    AreaOfProduct: string;
    ProductDescription: string;
    username: string;
    SelectService: string;
    Objective: string;
    Expectedoutcomes: string;
    IPRownership: string;
    currency: string;
    status: string;
    rejectComment?: string;
}

interface Milestone {
    scopeOfWork: string;
    milestones: string[];
}

interface Apply {
    _id?: string;
    title: string;
    description: string;
    Budget: number;
    currency: string;
    TimeFrame: string | null;
    rejectComment: string;
    status: string;
    firstName: string;
    lastName: string;
    username: string;
    jobId: string;
    availableSolution: string;
    SolutionUSP: string;
}


export interface ProjectDrawerProps {
    viewingJob: Job | null;
    setViewingJob: React.Dispatch<React.SetStateAction<Job | null>>;
    userType: string;
    handleApproveDialogOpen: (job: Job) => void;
    handleRejectDialogOpen: (job: Job) => void;
}

const MyProjectDrawer: React.FC<ProjectDrawerProps> = ({
    viewingJob,
    setViewingJob,
    userType,
    handleApproveDialogOpen,
    handleRejectDialogOpen,
}) => {
    const isApproved = viewingJob?.status === 'Approved';
    const isRejected = viewingJob?.status === 'Rejected';
    const [filter, setFilter] = useState<string>('All');
    const [applications, setApplications] = useState<Apply[]>([]);
    const [milestones, setMilestones] = useState<Record<string, Milestone[]>>({});
    const [viewingJobs, setViewingJobs] = useState<Job | null>(null);

    const userDetails: UserSchema = useAppSelector(selectUserSession);
    const currentUser = userDetails.username;

    const fetchApplications = useCallback(async () => {
        if (viewingJob?._id) {
            try {
                const response = await axios.get(`${APIS.APPLY}/jobId/${viewingJob._id}`);
                setApplications(response.data);
            } catch (error) {
                console.error('Error fetching applications:', error);
            }
        }
    }, [viewingJob]);

    useEffect(() => {
        fetchApplications();
    }, [fetchApplications]);


    const fetchMilestonesForApply = useCallback(async (applyId: string) => {
        if (applyId) {
            try {
                const response = await axios.get(`${APIS.MILESTONES}/apply/${applyId}`);
                setMilestones(prevState => ({
                    ...prevState,
                    [applyId]: response.data,
                }));
            } catch (error) {
                console.error('Error fetching milestones:', error);
            }
        }
    }, []);

    const filteredApplications = applications.filter(app => {
        if (filter === 'All') return true;
        return app.status === filter;
    }).filter(app => {
        if (userType === 'Project Owner') {
            return (app.status === 'Approved' || app.status === 'Awarded') && currentUser === viewingJob?.username;
        }
        if (userType === 'Innovators' || userType === 'Freelancer') {
            return app.username === currentUser;
        }
        return true;
    });


    useEffect(() => {
        filteredApplications.forEach(app => {
            fetchMilestonesForApply(app._id!);
        });
    }, [filteredApplications, fetchMilestonesForApply]);



    const handleViewJob = (job: Job) => {
        setViewingJobs(job);
        // setApplyOpen(true); // Optionally reuse this state for opening the drawer
    };


    return (
        <>
            <Dialog
                open={!!viewingJob}
                onClose={() => setViewingJob(null)}
                fullWidth
                maxWidth="lg"
                PaperProps={{
                    sx: {
                        borderRadius: '20px',
                        height: '100%',
                        overflow: 'hidden',
                        p: 2,
                        backgroundColor: '#f9f9f9',
                    }
                }}
            >
                <DialogTitle>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '25px' }}>
                        Project Details Information
                        <IconButton
                            edge="start"
                            color="inherit"
                            onClick={() => setViewingJob(null)}
                            sx={{
                                position: 'absolute',
                                top: 16,
                                right: 16,
                                zIndex: 1,
                            }}
                        >
                            <Close />
                        </IconButton>
                    </Box>
                </DialogTitle>
                <DialogContent>
                    {viewingJob && (
                        <Box>
                            {isApproved && <Chip label="Approved" variant="outlined" sx={{ borderColor: 'green', color: 'green', borderRadius: '16px', float: 'right', mb: 2 }} />}
                            {isRejected && <Chip label="Rejected" variant="outlined" sx={{ borderColor: 'red', color: 'red', borderRadius: '16px', float: 'right', mb: 2 }} />}

                            <Grid container spacing={2}>
                                <Grid item xs={12} sm={6}>
                                    <TextField
                                        label="Title"
                                        value={viewingJob.title}
                                        fullWidth
                                        disabled
                                        sx={{ mb: 2 }}
                                    />
                                </Grid>
                                <Grid item xs={12} sm={6}>
                                    <TextField
                                        label="Budget"
                                        value={`${viewingJob.currency === 'USD' ? '$' : '₹'} ${viewingJob.Budget}`}
                                        fullWidth
                                        disabled
                                        sx={{ mb: 2 }}
                                    />
                                </Grid>
                                <Grid item xs={12} sm={6}>
                                    <TextField
                                        label="Owner Name"
                                        value={`${viewingJob.firstName} ${viewingJob.lastName}`}
                                        fullWidth
                                        disabled
                                        sx={{ mb: 2 }}
                                    />
                                </Grid>
                                {userDetails && (
                                    userType === 'Project Owner' ||
                                    (userType === 'Innovators' || userType === 'Freelancer')
                                ) && (
                                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 2, position: 'relative', left: '20%' }}>
                                            <a
                                                href="#"
                                                onClick={(e) => {
                                                    e.preventDefault();
                                                    if (viewingJob) {
                                                        handleViewJob(viewingJob);
                                                    }
                                                }}
                                                style={{ cursor: 'pointer' }}
                                            >
                                                View Details of Project
                                            </a>

                                        </Box>
                                    )}

                            </Grid>



                            <Divider orientation="horizontal" flexItem />

                            <Box sx={{ position: 'relative', top: '30px', marginBottom: '20px' }}>
                                <DialogTitle sx={{ fontSize: '25px' }}>
                                    Applications for Project
                                </DialogTitle>
                            </Box>


                            <Box p={2}>
                                {filteredApplications.length > 0 ? (
                                    <Grid container spacing={2}>
                                        {filteredApplications.map((app) => (
                                            <Grid item xs={12} key={app._id}>
                                                <Box sx={{ border: '1px solid #ddd', borderRadius: '4px', p: 2 }}>
                                                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                                                        <Box sx={{ display: 'flex', flexDirection: 'row', gap: 2 }}>
                                                            <Box sx={{ flex: 1 }}>
                                                                <TextField
                                                                    label="Title"
                                                                    value={app.title}
                                                                    fullWidth
                                                                    disabled
                                                                    sx={{ mb: 1 }}
                                                                />
                                                            </Box>
                                                            <Box sx={{ flex: 1 }}>
                                                                <TextField
                                                                    label="Applied User"
                                                                    value={`${app.firstName} ${app.lastName}`}
                                                                    fullWidth
                                                                    disabled
                                                                    sx={{ mb: 1 }}
                                                                />
                                                            </Box>
                                                        </Box>
                                                        <Grid container spacing={2}>
                                                            <Grid item xs={12}>
                                                                {milestones[app._id!]?.length > 0 ? (
                                                                    milestones[app._id!].map((milestone, index) => (
                                                                        <Card key={index} variant="outlined" sx={{ mb: 4 }}>
                                                                            <CardContent>
                                                                                <Typography variant="h6" sx={{ mb: 2 }}>
                                                                                    Milestone
                                                                                </Typography>
                                                                                <Grid container spacing={2}>
                                                                                    <Grid item xs={12}>
                                                                                        {milestone.milestones.length > 0 ? (
                                                                                            milestone.milestones.map((m, milestoneIndex) => (
                                                                                                <TextField
                                                                                                    key={milestoneIndex}
                                                                                                    label={`Milestone ${milestoneIndex + 1}`}
                                                                                                    value={m}
                                                                                                    multiline
                                                                                                    fullWidth
                                                                                                    disabled
                                                                                                    sx={{ mb: 2 }}
                                                                                                />
                                                                                            ))
                                                                                        ) : (
                                                                                            <Typography>No milestones available</Typography>
                                                                                        )}
                                                                                    </Grid>
                                                                                </Grid>
                                                                            </CardContent>
                                                                        </Card>
                                                                    ))
                                                                ) : (
                                                                    <Typography>No milestones available</Typography>
                                                                )}
                                                            </Grid>
                                                        </Grid>
                                                    </Box>                     </Box>
                                            </Grid>
                                        ))}
                                    </Grid>
                                ) : (
                                    <Typography>No applications available</Typography>
                                )}
                            </Box>

                        </Box>
                    )}
                    <>
                    </>
                </DialogContent>
            </Dialog>


            <ProjectDrawer
                viewingJob={viewingJobs}
                setViewingJob={setViewingJobs}
                userType={userType}
                handleApproveDialogOpen={handleApproveDialogOpen}
                handleRejectDialogOpen={handleRejectDialogOpen}
            />
        </>
    );
};

export default MyProjectDrawer;