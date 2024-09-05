'use client'
import React, { useEffect, useState } from 'react';
import { Box, colors, Card, CardContent, IconButton, Button, Autocomplete, TextField, Chip, ToggleButton, ToggleButtonGroup, Tooltip, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Typography, Menu, MenuItem, ListItemIcon, ListItemText, Grid } from '@mui/material';
import { AddApply } from '../component/apply/apply';
import { AddProjects } from '../component/projects/projects';
import { APIS } from '@/app/constants/api.constant';
import dayjs from 'dayjs';
import EditIcon from '@mui/icons-material/Edit';
import DeleteRoundedIcon from '@mui/icons-material/DeleteRounded';
import { PubSub, pubsub } from '../services/pubsub.service';
import FilterAltIcon from '@mui/icons-material/FilterAlt';
import InfiniteScroll from 'react-infinite-scroll-component';
import { useCallback, useMemo } from 'react';
import { useAppSelector } from '../reducers/hooks.redux';
import { UserSchema, selectUserSession } from '../reducers/userReducer';
import DeleteConfirmationDialog from '../component/deletdilog/deletdilog';
import ApproveDialogForProject from '../component/approveforproject/approveforproject';
import RejectDialogForProject from '../component/rejectforproject/rejectforproject';

import MoreVertIcon from '@mui/icons-material/MoreVert';
import ProjectDrawer from '../component/projectDrwer/projectDrwer';
import { Job, Apply } from './projectinterface';
import { CustomChip } from './projectinterface';
import { AddApplyForInnovatores } from '../component/innovatoreApply/innovatoreApply';
import Filters, { FilterColumn } from '../component/filter/filter.component';
import { DATE_FORMAT } from '../constants/common.constants';
import { PROJECT_STATUSES } from '../constants/status.constant';
import axiosInstance from '../services/axios.service';


const Jobs = () => {

    const userDetails: UserSchema = useAppSelector(selectUserSession);
    const { userType, _id: userId } = userDetails;

    const column: Array<FilterColumn> = [
        {
            name: "Project Name",
            value: '',
            type: "Texbox",
            key: 'title',
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
            name: "Created Date",
            value: '',
            type: "Date",
            key: 'createdAt',
            isVisible: true,
        },
        {
            name: "Deadline",
            value: '',
            type: "Date",
            key: 'TimeFrame',
            isVisible: true,
        },
        {
            name: "Status",
            value: '',
            type: "Texbox",
            key: 'status',
            isVisible: (userType === "Admin" || userType === "Project Owner"),
        },
        {
            name: "Service",
            value: '',
            type: "Service",
            key: 'SelectService',
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

    const [jobs, setJobs] = useState<Job[]>([]);
    const [editingJob, setEditingJob] = useState<Job | null>(null);
    const [applyOpen, setApplyOpen] = useState(false);
    const [applyOpenForInnovators, setApplyOpenForInnovators] = useState(false);
    const [selectedJobId, setSelectedJobId] = useState<string>('');
    const [jobTitle, setJobTitle] = useState<string>('');
    const [selectedCategory, setSelectedCategory] = useState<string[]>([]);
    const [selectedSubcategory, setSelectedSubcategory] = useState<string[]>([]);
    const [selectedExpertis, setSelectedExpertis] = useState<string[]>([]);
    const [filterOpen, setFilterOpen] = useState(false);
    const [hasMore, setHasMore] = useState(true);
    const [page, setPage] = useState(1);

    const [confirmDelete, setConfirmDelete] = useState<{ open: boolean; jobs: Job | null }>({ open: false, jobs: null });
    const [approveDialogOpen, setApproveDialogOpen] = useState<{
        open: boolean;
        job: Job | null;
    }>({ open: false, job: null });
    const [rejectDialogOpen, setRejectDialogOpen] = useState<{ open: boolean; job: Job | null }>({ open: false, job: null });
    const [isApproved, setIsApproved] = useState(false);
    const [isRejected, setIsRejected] = useState(false);
    const [anchorEl, setAnchorEl] = React.useState<HTMLElement | null>(null);
    const [appliedJobs, setAppliedJobs] = useState<string[]>([]);
    const [selectedStatus, setSelectedStatus] = useState<string | null>(null);
    const [viewingJob, setViewingJob] = useState<Job | null>(null);

    const [isShowingApplies, setIsShowingApplies] = useState(false);
    const [showingMyApplies, setShowingMyApplies] = useState(false);
    const [applies, setApplies] = useState<Apply[]>([]);
    const [selectedServices, setSelectedServices] = useState<string[]>([]);
    const [selectedFilter, setSelectedFilter] = useState<'all' | 'my'>();
    const [isDrawerOpen, setIsDrawerOpen] = useState(false);
    const [filter, setFilter] = useState('');

    const [filterType, setFilterType] = useState(() => {
        return userDetails.userType === 'Freelancer' ? 'Innovative Products' : 'all';
    });

    const handleApproveDialogOpen = (job: Job) => {
        setApproveDialogOpen({ open: true, job });
    };

    const handleApproveDialogClose = () => {
        setApproveDialogOpen({ open: false, job: null });
    };

    const handleRejectDialogOpen = (job: Job) => {
        setRejectDialogOpen({ open: true, job });
    };

    const handleRejectDialogClose = () => {
        setRejectDialogOpen({ open: false, job: null });
    };

    const handleClick = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const getParamForJobs = (page: number) => {
        if (userType === 'Project Owner') {
            return `?page=${page}&userId=${userDetails._id}&${filter}`;
        }else if(userType === 'Freelancer'){
            return `?page=${page}&status=${PROJECT_STATUSES.approved}&SelectService=Outsource Research and Development&${filter}`;
        }else if(userType === 'Innovators'){
            return `?page=${page}&status=${PROJECT_STATUSES.approved}&SelectService=Innovative product&${filter}`;
        }else {
            return `?page=${page}&${filter}`;
        }
    }


    const fetchJobs = useCallback(async (page: number) => {
        try {
            console.log('Fetch Jobs Params:', filter);
            const paramString = getParamForJobs(page);
            const response = await axiosInstance.get(`${APIS.JOBS}${paramString}`)

            if (response.data.length === 0) {
                setHasMore(false);
            } else {
                setJobs(prev => {
                    const newJobs = response.data.filter((newJobs: Job) => !prev.some((existingJobs) => existingJobs._id === newJobs._id));
                    return [...prev, ...newJobs];
                });
                if (response.data.length < 10) {
                    setHasMore(false);
                }
            }
        } catch (error) {
            console.error('Error fetching jobs:', error);
        }
    }, [userId, filterType, userType, filter]);

    const fetchApplies = useCallback(async () => {
        try {
            console.log('Fetching applies...');
            const response = await axiosInstance.get(`${APIS.APPLIED_APPLICATION}`);
            console.log('Applies fetched:', response.data);
            setApplies(response.data);
            setIsShowingApplies(true);
            setShowingMyApplies(false);
        } catch (error) {
            console.error('Error fetching applies:', error);
        }
    }, []);

    const fetchMyApplies = useCallback(async () => {
        try {
            const response = await axiosInstance.get(`${APIS.USER_APPLICATIONS(userDetails._id)}`);
            setApplies(response.data);
            setIsShowingApplies(true);
            setShowingMyApplies(true);
        } catch (error) {
            console.error('Error fetching my applies:', error);
        }
    }, [userDetails._id]);


    const resetApplies = async () => {
        setApplies([]);
        setIsShowingApplies(false);
        setShowingMyApplies(false);
        await refetch();
    };

    const handleFilterChanges = async (event: React.MouseEvent<HTMLElement>, newFilter: 'all' | 'my' | undefined) => {
        if (newFilter === null) {
            await resetApplies();
            setSelectedFilter(undefined);
        } else {
            setSelectedFilter(newFilter);

            if (newFilter === 'all') {
                await fetchApplies();
            } else if (newFilter === 'my') {
                await fetchMyApplies();
            }
        }
    };


    const refetch = useCallback(async () => {
        try {
            setPage(1);
            setJobs([]);
            setHasMore(true);
            await fetchJobs(1);
        } catch (error) {
            console.error('Error refetching jobs:', error);
        }
    }, [fetchJobs, filter]);

    useEffect(() => {
        refetch();
    }, [filter, userId]);

    useEffect(() => {
        if (page > 1) {
            fetchJobs(page);
        }
    }, [page, filter]);

    useEffect(() => {
        pubsub.subscribe('JobUpdated', refetch);
        return () => {
            pubsub.unsubscribe('JobUpdated', refetch);

        };
    }, [refetch]);

    useEffect(() => {
        pubsub.subscribe('JobCreated', refetch);
        return () => {
            pubsub.unsubscribe('JobCreated', refetch);

        };
    }, [refetch]);

    const handleEditJob = useCallback((job: Job) => {
        setEditingJob(job);
    }, []);

    const handleCancelEdit = useCallback(() => {
        setEditingJob(null);
    }, []);

    const handleDeleteJob = useCallback(async () => {
        if (confirmDelete.jobs) {
            try {
                await axiosInstance.delete(`${APIS.JOBS}/${confirmDelete.jobs._id}`);
                setJobs(jobs.filter(job => job._id !== confirmDelete.jobs!._id));
                pubsub.publish('JobDeleted', {});
            } catch (error) {
                console.error('Error deleting job:', error);
            } finally {
                setConfirmDelete({ open: false, jobs: null });
            }
        }
    }, [confirmDelete, jobs]);


    const handleConfirmDelete = (jobs: Job) => {
        setConfirmDelete({ open: true, jobs });
    };

    const handleCancelDelete = () => {
        setConfirmDelete({ open: false, jobs: null });
    };

    useEffect(() => {
        const fetchAppliedJobs = async () => {
            try {
                const response = await axiosInstance.get(`${APIS.APPLIED_JOBS}/${userId}`);
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

    const handleApplyClick = useCallback(async (title: string, job: Job) => {
        try {
            setApplyOpen(true);
            setJobTitle(title);
            setSelectedJobId(job._id || '');

            setAppliedJobs(prev => [...prev, job._id || '']);

            await axiosInstance.post(`${APIS.APPLY}`, { userId: userId, jobId: job._id, title: title });

            setApplyOpen(false);
        } catch (error) {
            console.error('Error applying for job:', error);
        }
    }, [userId]);

    const handleApplyClickForInnovators = useCallback(async (title: string, job: Job) => {
        try {
            setApplyOpenForInnovators(true);
            setJobTitle(title);
            setSelectedJobId(job._id || '');

            setAppliedJobs(prev => [...prev, job._id || '']);

            await axiosInstance.post(`${APIS.APPLY}`, { userId, jobId: job._id, title });

            setApplyOpenForInnovators(false);
        } catch (error) {
            console.error('Error applying for job:', error);
        }
    }, [userId]);


    // Function to handle viewing job details
    const handleViewJob = (job: Job) => {
        setViewingJob(job);
        setIsApproved(job.status === PROJECT_STATUSES.approved);
        setIsRejected(job.status === PROJECT_STATUSES.rejected);
        setApplyOpen(false);
        setApplyOpenForInnovators(false);
        // setApplyOpen(true); // Optionally reuse this state for opening the drawer
    };

    const handleApprove = useCallback(async (job: Job | null) => {
        if (!job) {
            return;
        }
        try {
            await axiosInstance.post(`${APIS.APPROVE_PROJECT}/${job._id}`);
            setJobs(prevJobs =>
                prevJobs.map(prevJob =>
                    prevJob._id === job._id ? { ...prevJob, status: PROJECT_STATUSES.approved } : prevJob
                )
            );
            if (viewingJob && viewingJob._id === job._id) {
                setViewingJob(prevViewingJob => ({
                    ...prevViewingJob!,
                    status: PROJECT_STATUSES.approved
                }));
            }
            setViewingJob(null);
            handleApproveDialogClose();
            setSelectedStatus(PROJECT_STATUSES.approved);
            refetch();
        } catch (error) {
            console.error('Error approving job:', error);
        }
    }, [refetch, viewingJob]);

    const handleReject = useCallback(async (jobId: string, comment: string, job: Job | null) => {
        if (!job) {
            return;
        }
        try {
            console.log('Rejecting job with comment:', comment);
            await axiosInstance.post(`${APIS.REJECT_PROJECT}/${job._id}`, { comment });
            setJobs(prevJobs =>
                prevJobs.map(prevJob =>
                    prevJob._id === job._id ? { ...prevJob, status: PROJECT_STATUSES.rejected, rejectComment: comment } : prevJob
                )
            );
            if (viewingJob && viewingJob._id === job._id) {
                setViewingJob(prevViewingJob => ({
                    ...prevViewingJob!,
                    status: PROJECT_STATUSES.rejected,
                    rejectComment: comment
                }));
            }
            setViewingJob(null);
            setSelectedStatus(PROJECT_STATUSES.rejected);
            handleRejectDialogClose();
            refetch();
        } catch (error) {
            console.error('Error rejecting job:', error);
        }
    }, [refetch, viewingJob]);


    const handleCancelApply = useCallback((jobId: string) => {
        setAppliedJobs(prev => prev.filter(id => id !== jobId));
    }, []);

    const changeFilterOrPage = (paramStr: string) => {
        if (paramStr && paramStr.length) {
            setFilter(paramStr);
        } else {
            setFilter('');
        }
        setPage(1);
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
                <Typography component="h2" sx={{ marginY: 0 }}>Post Projects</Typography>

                <Box sx={{
                    mr: 2, display: "flex"
                }}>
                    <Filters column={column} onFilter={changeFilterOrPage}></Filters>
                    <AddProjects editingJobs={editingJob} onCancelEdit={handleCancelEdit} />
                </Box>
            </Box>

            <Box sx={{ mt: 2 }}>
                {isShowingApplies ? (
                    <Box>
                        {applies.map((apply) => (
                            <Card key={apply._id} sx={{ mb: 2 }}>
                                <CardContent>
                                    <Typography variant="h5" sx={{ display: 'flex', justifyContent: 'space-between' }}>
                                        <Box>
                                            {apply.title}
                                        </Box>
                                        <Box sx={{ fontSize: 'small', color: 'text.secondary' }}>
                                            {dayjs(apply.TimeFrame).format('MMMM D, YYYY h:mm A')}
                                        </Box>
                                    </Typography>
                                    <Typography variant="body1" sx={{ mt: 1 }}>
                                        {apply.currency} {apply.Budget}
                                    </Typography>

                                    <Typography variant="body1">
                                        User Name: {apply.firstName} {apply.lastName}
                                    </Typography>

                                </CardContent>
                            </Card>
                        ))}
                    </Box>
                ) : (
                    <InfiniteScroll
                        key={appliedJobs.join(',')}
                        dataLength={jobs.length}
                        next={() => setPage(prev => prev + 1)}
                        hasMore={hasMore}
                        loader={<Typography>Loading...</Typography>}
                        endMessage={<Typography>No more Projects</Typography>}
                    >
                        <Box sx={{ mt: 2 }}>
                            {jobs.map((job) => (
                                <Card key={job._id} sx={{ mb: 2 }}>
                                    <CardContent>
                                        <Typography variant="h5" sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap' }}>
                                            <Box sx={{ width: '50%', '@media (max-width: 767px)': { width: '100%' } }}>
                                                <a onClick={() => handleViewJob(job)} style={{ cursor: 'pointer', textDecoration: 'none' }}>
                                                    {job.title}
                                                </a>
                                                <span style={{ fontSize: 'small', color: "#616161", marginLeft: 10 }}>
                                                    ({dayjs(job.TimeFrame).format(DATE_FORMAT)})
                                                </span>
                                            </Box>
                                            <Box sx={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap' }}>
                                                <Box sx={{ flexShrink: 0, display: 'flex', alignItems: 'center', mr: 2 }}>
                                                    <CustomChip
                                                        label={job.status === PROJECT_STATUSES.approved ? PROJECT_STATUSES.approved : job.status === PROJECT_STATUSES.rejected ? PROJECT_STATUSES.rejected : PROJECT_STATUSES.pending}
                                                        color={job.status === PROJECT_STATUSES.approved ? 'success' : job.status === PROJECT_STATUSES.rejected ? 'error' : 'default'}
                                                    />
                                                </Box>
                                                <Box sx={{ flexShrink: 0, mr: 2 }}>
                                                    <Chip
                                                        label={job.SelectService}
                                                        variant="outlined"
                                                        color='secondary'
                                                    />
                                                </Box>
                                                <Box sx={{ flexShrink: 0, fontSize: 'small', fontWeight: 'bolder' }}>
                                                    {job.Expertiselevel}
                                                </Box>
                                            </Box>
                                        </Typography>

                                        <Box sx={{ mt: 2 }}>
                                            <Typography variant="body2">{job.currency === 'USD' ? '$' : '₹'}{job.Budget}</Typography>
                                            <Typography variant="caption">{job.Category.join(', ')}, {job.Subcategorys.join(', ')}</Typography>

                                            

                                            {(userDetails.userType === 'Admin' || userDetails.userType === 'Project Owner') && (
                                                <Typography variant="body2" sx={{ mt: 1, fontWeight: 'bold' }}>
                                                    Applications: {job.appliesCount}
                                                </Typography>
                                            )}

                                            <Box sx={{ position: 'sticky', float: 'right', left: '92%', '@media (max-width: 767px)': { position: 'relative', left: '10px' } }}>
                                                {userDetails.userType === 'Project Owner' && job.username === userDetails.username && (
                                                    <>
                                                        <Tooltip title="Edit" arrow>
                                                            <IconButton onClick={() => handleEditJob(job)} sx={{ '@media (max-width: 767px)': { display: 'none' } }}>
                                                                <EditIcon />
                                                            </IconButton>
                                                        </Tooltip>
                                                        <Tooltip title="Delete" arrow>
                                                            <IconButton onClick={() => handleConfirmDelete(job)} sx={{ '@media (max-width: 767px)': { display: 'none' } }}>
                                                                <DeleteRoundedIcon />
                                                            </IconButton>
                                                        </Tooltip>
                                                    </>
                                                )}

                                                <IconButton
                                                    aria-controls="simple-menu"
                                                    aria-haspopup="true"
                                                    onClick={handleClick}
                                                    sx={{ display: { xs: 'block', md: 'none' } }}
                                                >
                                                    <MoreVertIcon />
                                                </IconButton>

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
                                                    <MenuItem sx={{ background: '#cc4800', color: 'white', borderRadius: '10px', position: 'relative', bottom: '8px', height: '55px' }} onClick={() => { handleApplyClick(job.title, job); handleClose(); }}>Apply</MenuItem>
                                                    {userDetails.userType === 'Project Owner' && job.username === userDetails.username && (
                                                        <>
                                                            <MenuItem onClick={() => { handleEditJob(job); handleClose(); }}>
                                                                <ListItemIcon>
                                                                    <EditIcon />
                                                                </ListItemIcon>
                                                                <ListItemText primary="Edit" />
                                                            </MenuItem>
                                                            <MenuItem onClick={() => { handleConfirmDelete(job); handleClose(); }}>
                                                                <ListItemIcon>
                                                                    <DeleteRoundedIcon />
                                                                </ListItemIcon>
                                                                <ListItemText primary="Delete" />
                                                            </MenuItem>
                                                        </>
                                                    )}
                                                </Menu>
                                            </Box>

                                            <Box sx={{ position: 'relative', bottom: '10px' }}>
                                                {(userType === 'Freelancer') && !appliedJobs.includes(job._id || '') && (
                                                    <Button
                                                        variant="contained"
                                                        color="primary"
                                                        onClick={() => handleApplyClick(job.title, job)}
                                                        sx={{ float: 'right' }}
                                                    >
                                                        Apply
                                                    </Button>
                                                )}
                                                {(userType === 'Innovators') && !appliedJobs.includes(job._id || '') && (
                                                    <Button
                                                        variant="contained"
                                                        color="secondary"
                                                        onClick={() => handleApplyClickForInnovators(job.title, job)}
                                                        sx={{ float: 'right', marginRight: '10px' }}
                                                    >
                                                        Apply
                                                    </Button>
                                                )}
                                            </Box>
                                        </Box>
                                    </CardContent>
                                </Card>
                            ))}
                        </Box>
                    </InfiniteScroll>
                )}
            </Box>



            <AddApply
                open={applyOpen}
                setOpen={setApplyOpen}
                jobTitle={jobTitle}
                jobId={selectedJobId}
                onCancel={() => handleCancelApply(selectedJobId)}
            />

            <AddApplyForInnovatores
                open={applyOpenForInnovators}
                setOpen={setApplyOpenForInnovators}
                jobTitle={jobTitle}
                jobId={selectedJobId}
                onCancel={() => handleCancelApply(selectedJobId)} />

            <DeleteConfirmationDialog
                open={confirmDelete.open}
                onCancel={handleCancelDelete}
                onConfirm={handleDeleteJob}
                title={confirmDelete.jobs?.title || ''}
            />

            <ProjectDrawer
                viewingJob={viewingJob}
                setViewingJob={setViewingJob}
                userType={userType}
                handleApproveDialogOpen={handleApproveDialogOpen}
                handleRejectDialogOpen={handleRejectDialogOpen}
            />

            <ApproveDialogForProject
                open={approveDialogOpen.open}
                onClose={handleApproveDialogClose}
                onApprove={() => handleApprove(approveDialogOpen.job)}
                job={approveDialogOpen.job}
            />

            <RejectDialogForProject
                open={rejectDialogOpen.open}
                onClose={handleRejectDialogClose}
                onReject={(jonId, comment) => handleReject(jonId, comment, rejectDialogOpen.job)}
                job={rejectDialogOpen.job}
            />
        </Box>
    );
};

export default Jobs;