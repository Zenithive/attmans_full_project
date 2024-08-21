import React, { useCallback, useEffect, useState } from 'react';
import { Dialog, DialogTitle, DialogContent, Grid, TextField, Chip, Button, IconButton, Card, CardContent, Typography, Box, Divider, CircularProgress } from '@mui/material';
import { Close } from '@mui/icons-material';
import axios from 'axios';
import { APIS } from '@/app/constants/api.constant';
import ProjectDrawer from '../projectDrwer/projectDrwer';
import { useAppSelector } from '@/app/reducers/hooks.redux';
import { UserSchema, selectUserSession } from '@/app/reducers/userReducer';
import JobDetail from '../projectCommentCard/projectCommentCard';
import AddComment from '../projectComment/projectComment';

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
    milestones: {
        name: string;
        isCommentSubmitted: boolean;
    }[];
    isCommentSubmitted?: boolean;
    status?: string;
    milstonSubmitcomments: string[];
}

interface Apply {
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
    const [milestones, setMilestones] = useState<Record<string, Milestone[]>>({});
    const [viewingJobs, setViewingJobs] = useState<Job | null>(null);
    const [milestoneComments, setMilestoneComments] = useState<Record<string, string>>({});
    const [updateState, setUpdateState] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [commentErrors, setCommentErrors] = useState<Record<string, boolean>>({});
    const [jobDetailKey, setJobDetailKey] = useState<number>(0);



    const userDetails: UserSchema = useAppSelector(selectUserSession);
    const currentUser = userDetails.username;

    useEffect(() => {
        if (viewingJob?._id) {
            console.log('Fetching applications for job ID:', viewingJob._id);
            const fetchApplications = async () => {
                try {
                    const response = await axios.get(`${APIS.APPLY}/jobId/${viewingJob._id}`);
                    console.log('Applications fetched:', response.data);
                    setApplications(response.data);
                } catch (error) {
                    console.error('Error fetching applications:', error);
                }
            };

            fetchApplications();
        }
    }, [viewingJob?._id]);

    useEffect(() => {
        if (applications.length > 0) {
            applications.forEach(app => {
                if (app._id) {
                    const fetchMilestonesForApply = async (applyId: string) => {
                        try {
                            const response = await axios.get(`${APIS.MILESTONES}/apply/${applyId}`);

                            if (Array.isArray(response.data)) {
                                const milestoneData = response.data.map((milestone: Milestone) => {
                                    return {
                                        ...milestone,
                                        milstonSubmitcomments: milestone.milstonSubmitcomments || [],
                                    };
                                });

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

                    fetchMilestonesForApply(app._id);
                }
            });
        }
    }, [applications]);



    const filteredApplications = applications.filter(app => {
        if (filter === 'All') return true;
        return app.status === filter;
    }).filter(app => {
        if (userType === 'Project Owner') {
            return (app.status === 'Awarded') && currentUser === viewingJob?.username;
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
            await axios.post(`${APIS.MILESTONES}/submit-comment`, { applyId, milestoneIndex, comment });

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

            setMilestoneComments(prev => ({
                ...prev,
                [`${applyId}-${milestoneIndex}`]: '',
            }));

            window.location.reload();
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
            const response = await axios.get(`${APIS.GET_COMMENT}/jobId/${jobId}`);
            console.log('Comments fetched:', response.data);
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
                                        milestones[app._id!].map((milestoneGroup, groupIndex) => (
                                            <Grid container spacing={2} key={groupIndex}>
                                                {milestoneGroup.milestones.length > 0 ? (
                                                    milestoneGroup.milestones.map((milestone, milestoneIndex) => (
                                                        <Grid item xs={12} key={milestoneIndex}>
                                                            <Card variant="outlined" sx={{ mb: 1 }}>
                                                                <CardContent>
                                                                    <Typography variant="h6" sx={{ mb: 4 }}>
                                                                        Milestone {milestoneIndex + 1}

                                                                        {milestone.isCommentSubmitted && (
                                                                            <Chip
                                                                                label="Milestone submitted"
                                                                                variant="outlined"
                                                                                sx={{
                                                                                    borderColor: 'green',
                                                                                    color: 'green',
                                                                                    borderRadius: '16px',
                                                                                    position: 'relative',
                                                                                    float: 'right'
                                                                                }}
                                                                            />
                                                                        )}
                                                                    </Typography>

                                                                    <TextField
                                                                        label={`Milestone ${milestoneIndex + 1}`}
                                                                        value={milestone.name}
                                                                        multiline
                                                                        fullWidth
                                                                        disabled
                                                                        sx={{ mb: 2 }}
                                                                    />

                                                                    {milestone.isCommentSubmitted ? (
                                                                        <>
                                                                            {(userType === 'Project Owner' || userType === 'Innovators' || userType === 'Freelancer') && (
                                                                                <TextField
                                                                                    label="Submitted Milestone"
                                                                                    value={milestoneGroup.milstonSubmitcomments && milestoneGroup.milstonSubmitcomments[milestoneIndex] ? milestoneGroup.milstonSubmitcomments[milestoneIndex] : 'No comment'}
                                                                                    multiline
                                                                                    rows={4}
                                                                                    fullWidth
                                                                                    disabled
                                                                                    sx={{ mb: 2, color: 'blue' }}
                                                                                />
                                                                            )}
                                                                        </>
                                                                    ) : (
                                                                        (userType === 'Innovators' || userType === 'Freelancer') && (
                                                                            <>
                                                                                <TextField
                                                                                    label="Submit Milestone"
                                                                                    color="secondary"
                                                                                    multiline
                                                                                    rows={4}
                                                                                    value={milestoneComments[`${app._id}-${milestoneIndex}`] || ''}
                                                                                    onChange={(e) => handleCommentChange(app._id!, milestoneIndex, e.target.value)}
                                                                                    error={commentErrors[`${app._id}-${milestoneIndex}`]}
                                                                                    helperText={commentErrors[`${app._id}-${milestoneIndex}`] ? "Comment is required" : ""}
                                                                                    fullWidth
                                                                                    sx={{ mb: 2 }}
                                                                                />
                                                                                <Button
                                                                                    onClick={() => handleMilestoneSubmit(app._id!, milestoneIndex)}
                                                                                    disabled={milestone.isCommentSubmitted || isSubmitting}
                                                                                    sx={{ marginBottom: '40px' }}
                                                                                >
                                                                                    {isSubmitting ? <CircularProgress size={24} color="inherit" /> : 'Submit Milestone'}
                                                                                </Button>
                                                                            </>
                                                                        )
                                                                    )}

                                                                </CardContent>
                                                            </Card>
                                                        </Grid>
                                                    ))
                                                ) : (
                                                    <Typography>No milestones available</Typography>
                                                )}
                                            </Grid>
                                        ))
                                    ) : (
                                        <Typography>No milestones available</Typography>
                                    )}
                                </Grid>
                            </Grid>

                            <JobDetail key={jobDetailKey} jobId={viewingJob._id || ''} applyId={app._id} onCommentSubmitted={onCommentSubmitted} />
                            {viewingJob && (
                                <AddComment
                                    jobId={viewingJob._id || ''}
                                    applyId={app._id}
                                    onCommentSubmitted={() => {
                                        onCommentSubmitted();
                                        setJobDetailKey((prev) => prev + 1);
                                      }}
                                />
                            )}
                        </Box>
                    </Box>
                </Grid>
            ))}
        </Grid>
    ) : (
        <Typography>No applications available</Typography>
    )}
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
