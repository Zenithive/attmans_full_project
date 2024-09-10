import React, { useCallback, useEffect, useState } from 'react';
import { Dialog, DialogTitle, DialogContent, Grid, TextField, Chip, Button, IconButton, Card, CardContent, Typography, Box, Divider, CircularProgress } from '@mui/material';
import { Close } from '@mui/icons-material';
import { APIS } from '@/app/constants/api.constant';
import ProjectDrawer from '../projectDrwer/projectDrwer';
import { useAppSelector } from '@/app/reducers/hooks.redux';
import { UserSchema, selectUserSession } from '@/app/reducers/userReducer';
import JobDetail from '../projectCommentCard/projectCommentCard';
import AddComment from '../projectComment/projectComment';
import dayjs from 'dayjs';
import ApplicationsForProject from '../applicationforproject/applicationforproject';
import { APPLY_STATUSES } from '@/app/constants/status.constant';
import axiosInstance from '@/app/services/axios.service';
import { pubsub } from '@/app/services/pubsub.service';

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
    firstName: string;
    lastName: string;
    Sector: string;
    Quantity: number;
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

export interface Milestone {
    scopeOfWork: string;
    milestones: {
        _id: string;
        isCommentSubmitted: boolean;
        name: {
            text: string;
            timeFrame: string | null;
        };
        status: string;
        submittedAt: string;
        adminStatus:
        | 'Pending'
        | 'Admin Approved'
        | 'Admin Rejected'
        | 'Project Owner Approved'
        | 'Project Owner Rejected';
        approvalComments: string[];
        rejectionComments: string[];
        resubmissionComments: string[];
    }[];
    isCommentSubmitted?: boolean;
    status?: string;
    milstonSubmitcomments: string[];
}

export interface Apply {
    _id?: string;
    title: string;
    jobDetails: any;
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
    userId?: UserSchema;
    userDetails: any;
}

export interface ProjectDrawerProps {
    viewingJob: Job | null;
    setViewingJob: React.Dispatch<React.SetStateAction<Job | null>>;
    userType: string;
    handleApproveDialogOpen: (job: Job) => void;
    handleRejectDialogOpen: (job: Job) => void;
    onCommentSubmitted: () => void;
}

const MyProjectDrawer: React.FC<ProjectDrawerProps> = ({
    viewingJob,
    setViewingJob,
    userType,
    handleApproveDialogOpen,
    handleRejectDialogOpen,
    onCommentSubmitted
}) => {
    const isApproved = viewingJob?.status === 'Approved';
    const isRejected = viewingJob?.status === 'Rejected';
    const [filter, setFilter] = useState<string>('All');
    const [applications, setApplications] = useState<Apply[]>([]);
    // const [filteredApplications, setFilteredApplications] = useState<Apply[]>([]);
    const [milestones, setMilestones] = useState<Record<string, Milestone[]>>({});
    const [viewingJobs, setViewingJobs] = useState<Job | null>(null);
    const [milestoneComments, setMilestoneComments] = useState<Record<string, string>>({});
    const [updateState, setUpdateState] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [commentErrors, setCommentErrors] = useState<Record<string, boolean>>({});
    const [jobDetailKey, setJobDetailKey] = useState<number>(0);





    const userDetails: UserSchema = useAppSelector(selectUserSession);
    const currentUser = userDetails.username;
    const currentUserType = userDetails.userType;
    const currentUserId = userDetails._id;

    const setApplicationsBasedOnUser = (applies: Apply[]) => {
        const tmpApplies: Apply[] = [];
        for (let index = 0; index < applies.length; index++) {
            const element = applies[index];
            const isFreelancer = currentUserType === "Freelancer" && element?.userId?._id === currentUserId;
            const isProjectOwner = currentUserType === "Project Owner" && element.status === APPLY_STATUSES.awarded;
            const isAdmin = currentUserType === "Admin" && element?.status === APPLY_STATUSES.awarded;
            if (isFreelancer || isProjectOwner || isAdmin) {
                tmpApplies.push(element);
            }
        }

        setApplications(tmpApplies);
    }

    useEffect(() => {
        if (viewingJob?._id) {
            const fetchApplications = async () => {
                try {
                    const response = await axiosInstance.get(`${APIS.APPLY}/jobId/${viewingJob._id}`);
                    setApplicationsBasedOnUser(response.data);
                } catch (error) {
                    console.error('Error fetching applications:', error);
                }
            };

            fetchApplications();
        }
    }, [viewingJob?._id]);


    useEffect(() => {
        if (applications.length > 0) {
            const fetchMilestonesForApply = async (applyId: string) => {
                try {
                    const response = await axiosInstance.get(`${APIS.MILESTONES}/apply/${applyId}`);
                    if (Array.isArray(response.data)) {
                        const milestoneData = response.data.map((milestone: Milestone) => ({
                            ...milestone,
                            milstonSubmitcomments: milestone.milstonSubmitcomments || [],
                        }));
                        setMilestones(prevState => ({
                            ...prevState,
                            [applyId]: milestoneData,
                        }));
                    } else {
                        console.error('Unexpected data format:', response.data);
                    }
                } catch (error) {
                    console.error('Error fetching milestones:', error);
                }
            };

            const refetchMilestones = (message: { applyId: string }) => {
                if (typeof message.applyId === 'string') {
                    fetchMilestonesForApply(message.applyId);
                } else {
                    console.error('Invalid applyId:', message.applyId);
                }
            };

            pubsub.subscribe('MilestoneRefetch', refetchMilestones);

            applications.forEach(app => {
                if (app._id && typeof app._id === 'string') {
                    fetchMilestonesForApply(app._id);
                } else {
                    console.error('Invalid application ID:', app._id);
                }
            });

            return () => {
                pubsub.unsubscribe('MilestoneRefetch', refetchMilestones);
            };
        }
    }, [applications]);



    const filteredApplications = applications.filter(app => {
        if (filter === 'All') return true;
        return app.status === filter;
    }).filter(app => {
        if (userType === 'Project Owner' || userType === 'Admin') {
            return (app.status === 'Awarded') && currentUser === viewingJob?.username;
        }
        if (userType === 'Admin') {
            return (app.status === 'Awarded');
        }
        if (userType === 'Innovators' || userType === 'Freelancer') {
            return app.username === currentUser;
        }
        return true;
    });

    const forceUpdate = () => setUpdateState(prev => !prev);

    const handleMilestoneSubmit = async (applyId: string, milestoneIndex: number) => {
        const comment = milestoneComments[`${applyId}-${milestoneIndex}`] || '';

        if (!comment.trim()) {
            setCommentErrors(prev => ({
                ...prev,
                [`${applyId}-${milestoneIndex}`]: true,
            }));
            return;
        }

        setIsSubmitting(true);
        setCommentErrors(prev => ({
            ...prev,
            [`${applyId}-${milestoneIndex}`]: false,
        }));

        try {
            await axiosInstance.post(`${APIS.MILESTONES}/submit-comment`, { applyId, milestoneIndex, comment });

            setMilestones(prevState => {
                const updatedMilestones = { ...prevState };
                const milestoneList = updatedMilestones[applyId] || [];

                if (milestoneList[milestoneIndex]) {
                    milestoneList[milestoneIndex] = {
                        ...milestoneList[milestoneIndex],
                        isCommentSubmitted: true,
                        status: 'Submitted',
                    };
                }

                return {
                    ...updatedMilestones,
                    [applyId]: milestoneList,
                };
            });
            pubsub.publish('MilestoneRefetch', { applyId });

            setMilestoneComments(prev => ({
                ...prev,
                [`${applyId}-${milestoneIndex}`]: '',
            }));
            forceUpdate();

        } catch (error) {
            console.error('Error submitting milestone:', error);
        } finally {
            setIsSubmitting(false);
        }
    };


    const handleCommentChange = (applyId: string, index: number, value: string) => {
        setMilestoneComments(prev => ({
            ...prev,
            [`${applyId}-${index}`]: value,
        }));
        setCommentErrors(prev => ({
            ...prev,
            [`${applyId}-${index}`]: !value.trim(),
        }));
    };

    useEffect(() => {
        if (!viewingJob) {
            setMilestoneComments({});
            setCommentErrors({});
        }
    }, [viewingJob]);

    const handleViewJob = (job: Job) => {
        setViewingJobs(job);
    };

    const fetchCommentsForJob = async (jobId: string) => {
        try {
            const response = await axiosInstance.get(`${APIS.GET_COMMENT}/jobId/${jobId}`);

        } catch (error) {
            console.error('Error fetching comments:', error);
        }
    };

    const handleCommentSubmitted = () => {
        if (viewingJob?._id) {
            fetchCommentsForJob(viewingJob._id);
        }
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
                        '@media (max-width: 767px)': {
                            maxWidth: '100%'
                        }
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
                                {!(userDetails.userType === 'Freelancer' || userDetails.userType === 'Innovators') && (
                                    <Grid item xs={12} sm={6}>
                                        <TextField
                                            label="Owner Name"
                                            value={`${viewingJob.firstName} ${viewingJob.lastName}`}
                                            fullWidth
                                            disabled
                                            sx={{ mb: 2 }}
                                        />
                                    </Grid>
                                )}
                                {userDetails && (
                                    userType === 'Project Owner' ||
                                    (userType === 'Innovators' || userType === 'Freelancer' || userType === 'Admin')
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

                            <ApplicationsForProject
                                filteredApplications={applications}
                                milestones={milestones}
                                userType={userType}
                                milestoneComments={milestoneComments}
                                setMilestoneComments={setMilestoneComments}
                                commentErrors={commentErrors}
                                handleMilestoneSubmit={handleMilestoneSubmit}
                                handleCommentChange={handleCommentChange}
                                isSubmitting={isSubmitting}

                            />

                            <Box sx={{ position: 'relative' }}>
                                {applications.map((app) => (
                                    <React.Fragment key={app._id}>
                                        <JobDetail
                                            key={jobDetailKey}
                                            jobId={viewingJob._id || ''}
                                            applyId={app._id || ''}
                                            onCommentSubmitted={onCommentSubmitted}
                                        />
                                        {viewingJob && (
                                            <AddComment
                                                jobId={viewingJob._id || ''}
                                                applyId={app._id || ''}
                                                onCommentSubmitted={() => {
                                                    onCommentSubmitted();
                                                    setJobDetailKey((prev) => prev + 1);
                                                }}
                                            />
                                        )}
                                    </React.Fragment>
                                ))}
                            </Box>

                        </Box>
                    )}
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


