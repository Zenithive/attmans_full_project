'use client'
import React, { useEffect, useState } from 'react';
import { Box, colors, Card, CardContent, IconButton, Button, Autocomplete, TextField, Chip, ToggleButton, ToggleButtonGroup, Tooltip, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Typography, Menu, MenuItem, ListItemIcon, ListItemText, Grid } from '@mui/material';
import { AddApply } from '../component/apply/apply';
import { AddProjects } from '../component/projects/projects';
import axios from 'axios';
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
import { Category, Subcategorys } from '@/app/constants/categories';
import ApproveDialogForProject from '../component/approveforproject/approveforproject';
import RejectDialogForProject from '../component/rejectforproject/rejectforproject';
import { styled } from '@mui/material/styles';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import ProjectDrawer from '../component/projectDrwer/projectDrwer';
import { Job, Apply } from './projectinterface';
import { Expertiselevel } from './projectinterface';
import { getSubcategorys } from './projectinterface';
import { CustomChip } from './projectinterface';



const Jobs = () => {
    const [jobs, setJobs] = useState<Job[]>([]);
    const [editingJob, setEditingJob] = useState<Job | null>(null);
    const [applyOpen, setApplyOpen] = useState(false);
    const [selectedJobId, setSelectedJobId] = useState<string>('');
    const [jobTitle, setJobTitle] = useState<string>('');
    const [selectedCategory, setSelectedCategory] = useState<string[]>([]);
    const [selectedSubcategory, setSelectedSubcategory] = useState<string[]>([]);
    const [selectedExpertis, setSelectedExpertis] = useState<string[]>([]);
    const [filterOpen, setFilterOpen] = useState(false);
    const [hasMore, setHasMore] = useState(true);
    const [page, setPage] = useState(1);
    const [filterType, setFilterType] = useState("all");
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
    const userDetails: UserSchema = useAppSelector(selectUserSession);
    const { userType, _id: userId } = userDetails;
    const [isShowingApplies, setIsShowingApplies] = useState(false);
    const [showingMyApplies, setShowingMyApplies] = useState(false);
    const [applies, setApplies] = useState<Apply[]>([]);
    const [selectedServices, setSelectedServices] = useState<string[]>([]);
    const [selectedFilter, setSelectedFilter] = useState<'all' | 'my'>();

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


    const fetchJobs = useCallback(async (page: number, CategoryesFilter: string[], SubcategorysFilter: string[], ExpertiselevelFilter: string[], statusFilter: string | null, selectedServices: string[]) => {
        try {
            console.log('Fetch Jobs Params:', { page, CategoryesFilter, SubcategorysFilter, ExpertiselevelFilter, statusFilter, filterType, selectedServices });

            const response = await axios.get(APIS.JOBS, {
                params: {
                    page, limit: 10, Category: CategoryesFilter.join(','), Subcategorys: SubcategorysFilter.join(','), Expertiselevel: ExpertiselevelFilter.join(','),
                    status: statusFilter ? statusFilter : userType === 'Admin' ? undefined : 'Approved',
                    userId: filterType === 'mine' ? userId : undefined,
                    SelectService: selectedServices.join(','),

                }
            })

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
    }, [userId, filterType, userType, selectedServices]);


    ///////////   All Applies fetch   ////////////

    const fetchApplies = useCallback(async () => {
        try {
            console.log('Fetching applies...');
            const response = await axios.get(`${APIS.APPLIED_APPLICATION}`);
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
            const response = await axios.get(`${APIS.USER_APPLICATIONS(userDetails._id)}`);
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
            await fetchJobs(1, selectedCategory, selectedSubcategory, selectedExpertis, selectedStatus, selectedServices);
        } catch (error) {
            console.error('Error refetching jobs:', error);
        }
    }, [fetchJobs, selectedCategory, selectedExpertis, selectedSubcategory, selectedStatus, filterType, selectedServices]);

    useEffect(() => {
        refetch();
    }, [selectedCategory, selectedSubcategory, selectedExpertis, filterType, selectedServices]);

    useEffect(() => {
        if (page > 1) {
            fetchJobs(page, selectedCategory, selectedSubcategory, selectedExpertis, selectedStatus, selectedServices);
        }
    }, [page]);

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
                await axios.delete(`${APIS.JOBS}/${confirmDelete.jobs._id}`);
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

    const handleApplyClick = useCallback(async (title: string, job: Job) => {
        try {
            setApplyOpen(true);
            setJobTitle(title);
            setSelectedJobId(job._id || '');

            setAppliedJobs(prev => [...prev, job._id || '']);

            await axios.post(`${APIS.APPLY}`, { userId: userId, jobId: job._id, title: title });

            setApplyOpen(false);
        } catch (error) {
            console.error('Error applying for job:', error);
        }
    }, [userId]);



    const handleFilterTypeChange = (event: any, newFilterType: string) => {
        if (newFilterType !== null) {
            setFilterType(newFilterType);
            refetch();
        }
    }

    const handleServiceChange = (
        event: React.MouseEvent<HTMLElement>,
        newServices: string[],
    ) => {
        setSelectedServices(newServices);
    };


    // Function to handle viewing job details
    const handleViewJob = (job: Job) => {
        setViewingJob(job);
        setIsApproved(job.status === 'Approved');
        setIsRejected(job.status === 'Rejected');
        setApplyOpen(false);
        // setApplyOpen(true); // Optionally reuse this state for opening the drawer
    };

    const handleApprove = useCallback(async (job: Job | null) => {
        if (!job) {
            return;
        }
        try {
            await axios.post(`${APIS.APPROVE_PROJECT}/${job._id}`);
            setJobs(prevJobs =>
                prevJobs.map(prevJob =>
                    prevJob._id === job._id ? { ...prevJob, status: 'Approved' } : prevJob
                )
            );
            if (viewingJob && viewingJob._id === job._id) {
                setViewingJob(prevViewingJob => ({
                    ...prevViewingJob!,
                    status: 'Approved'
                }));
            }
            setViewingJob(null);
            handleApproveDialogClose();
            setSelectedStatus('Approved');
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
            await axios.post(`${APIS.REJECT_PROJECT}/${job._id}`, { comment });
            setJobs(prevJobs =>
                prevJobs.map(prevJob =>
                    prevJob._id === job._id ? { ...prevJob, status: 'Rejected', rejectComment: comment } : prevJob
                )
            );
            if (viewingJob && viewingJob._id === job._id) {
                setViewingJob(prevViewingJob => ({
                    ...prevViewingJob!,
                    status: 'Rejected',
                    rejectComment: comment
                }));
            }
            setViewingJob(null);
            setSelectedStatus('Rejected');
            handleRejectDialogClose();
            refetch();
        } catch (error) {
            console.error('Error rejecting job:', error);
        }
    }, [refetch, viewingJob]);

    const filteredJobs = useMemo(() => {
        return jobs.filter(job => {
            if (userType === 'Admin' && selectedStatus) {
                return job.status === selectedStatus;
            }
            return userType === 'Admin' || job.status === 'Approved';
        });

    }, [jobs, userType, selectedStatus]);


    const handleCancelApply = useCallback((jobId: string) => {
        setAppliedJobs(prev => prev.filter(id => id !== jobId));
    }, []);


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




            </Box>

            {userDetails.userType === 'Project Owner' && (
                <Box sx={{
                    mt: {
                        xs: 2, md: 0, float: 'right', position: 'relative', bottom: '20px', '@media (max-width: 767px)': {
                            position: 'relative',
                            float: 'right',
                            top: '0px'
                        }
                    }
                }}>
                    <AddProjects editingJobs={editingJob} onCancelEdit={handleCancelEdit} />
                </Box>
            )}
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
            {userType === 'Admin' && (
                <Box
                    sx={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 2,
                    }}
                >
                    <ToggleButtonGroup
                        value={selectedStatus}
                        exclusive
                        onChange={(event, newStatus) => setSelectedStatus(newStatus)}
                        aria-label="filter jobs by status"
                        sx={{ height: '40px' }}
                    >
                        <ToggleButton value="" aria-label="all jobs">
                            All Projects
                        </ToggleButton>
                        <ToggleButton value="Pending" aria-label="pending jobs">
                            Pending
                        </ToggleButton>
                        <ToggleButton value="Approved" aria-label="approved jobs">
                            Approved
                        </ToggleButton>
                        <ToggleButton value="Rejected" aria-label="rejected jobs">
                            Rejected
                        </ToggleButton>
                    </ToggleButtonGroup>
                </Box>

            )}

            {(userType === 'Project Owner') && (
                <Box
                    sx={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 2,
                        marginTop: '-15px',
                        '@media (max-width: 767px)': {
                            width: '100%',
                            justifyContent: 'space-between',
                            mt: 4,
                            position: 'relative',
                            left: '28px'
                        },
                    }}
                >
                    <ToggleButtonGroup
                        value={filterType}
                        exclusive
                        onChange={handleFilterTypeChange}
                        aria-label="filter exhibitions"
                        sx={{ height: "30px" }}
                    >
                        {/* <ToggleButton value="all" aria-label="all exhibitions">
                            All ProjectS
                        </ToggleButton>
                        {userType === 'Project Owner' && (
                            <ToggleButton value="mine" aria-label="my exhibitions">
                                My Projects
                            </ToggleButton>
                        )} */}


                        <ToggleButton value="all" aria-label="all exhibitions">
                            All Projects
                        </ToggleButton>



                        {userType === 'Project Owner' && (
                            <ToggleButton value="mine" aria-label="my exhibitions">
                                My Projects
                            </ToggleButton>
                        )}

                    </ToggleButtonGroup>
                </Box>
            )}

            {(userType === 'Project Owner') &&(
                <Box
                    sx={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 2,
                        position: 'relative',
                        left: '20%',
                        bottom: '30px',

                        '@media (max-width: 767px)': {
                            width: '100%',
                            justifyContent: 'space-between',
                            mt: 4,
                            position: 'relative',
                            left: '28px'
                        },
                    }}
                >

                    <ToggleButtonGroup
                        value={selectedServices}
                        onChange={handleServiceChange}
                        aria-label="Select Service"
                        sx={{ height: "30px" }}
                    >
                        <ToggleButton value="Outsource Research and Development ">
                            Outsource Research and Development
                        </ToggleButton>
                        <ToggleButton value="Innovative product">
                            Innovative Product
                        </ToggleButton>
                    </ToggleButtonGroup>
                </Box>
            )}


            {(userType === 'Innovators' || userType === 'Freelancer') && (

                <Box sx={{ display: 'flex', gap: 2 }}>
                    <ToggleButtonGroup
                        value={selectedFilter}
                        exclusive
                        onChange={handleFilterChanges}
                        aria-label="Apply Filter"
                        sx={{ height: "30px",ml:2 }}
                    >
                        <ToggleButton value="all">
                            All 
                        </ToggleButton>
                        <ToggleButton value="my">
                           My Projects
                        </ToggleButton>
                    </ToggleButtonGroup>
                </Box>
            )}

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
                    // Render job listings
                    <InfiniteScroll
                        key={appliedJobs.join(',')}
                        dataLength={jobs.length}
                        next={() => setPage(prev => prev + 1)}
                        hasMore={hasMore}
                        loader={<Typography>Loading...</Typography>}
                        endMessage={<Typography>No more Projects</Typography>}
                    >

                        <Box sx={{ mt: 2 }}>
                            {filteredJobs.map((job) => (
                                <Card key={job._id} sx={{ mb: 2 }}>
                                    <CardContent>
                                        <Typography variant="h5">

                                            <a onClick={() => handleViewJob(job)} style={{ cursor: 'pointer' }}>
                                                {job.title}    ,
                                            </a>
                                            <span style={{ fontSize: 'small', color: "#616161" }}>
                                                ({dayjs(job.TimeFrame).format('MMMM D, YYYY h:mm A')})
                                                <Grid item xs={12} sx={{
                                                    position: 'relative', bottom: "24px", width: 'fit-content', left: '62%', '@media (max-width: 767px)': {
                                                        position: 'relative',
                                                        top: '65px',
                                                        left: '69%'
                                                    }
                                                }}>
                                                    <CustomChip
                                                        label={job.status === 'Approved' ? 'Approved' : job.status === 'Rejected' ? 'Rejected' : 'Pending'}
                                                        color={job.status === 'Approved' ? 'success' : job.status === 'Rejected' ? 'error' : 'default'}
                                                    />
                                                </Grid>
                                            </span>
                                            <Box sx={{
                                                fontSize: 'small', fontWeight: "bolder", float: "right", position: 'relative', bottom: '47px', '@media (max-width: 767px)': {
                                                    position: 'relative', top: '40px', right: '100px'
                                                }
                                            }}>
                                                {job.Expertiselevel}
                                            </Box>


                                            <Box sx={{ fontSize: 'small', fontWeight: "bolder", float: "right", bottom: '56px', right: '20px', position: 'relative', '@media (max-width: 767px)': { position: 'relative', bottom: '30px' } }}>
                                                <Chip
                                                    label={job.SelectService}
                                                    variant="outlined"
                                                    color='secondary'
                                                    sx={{ '@media (max-width: 767px)': { position: 'relative', bottom: '10px' } }}
                                                />
                                            </Box>
                                        </Typography>

                                        <Box sx={{ marginTop: '10px' }}>

                                            <Typography variant="body2">{job.currency === 'USD' ? '$' : '₹'}{job.Budget}</Typography>
                                            <Typography variant="caption">{job.Category.join(', ')}, {job.Subcategorys.join(', ')}</Typography>

                                            <Box sx={{ position: 'sticky', float: 'right', left: '92%', '@media (max-width: 767px)': { position: 'relative', left: '10px' } }}>
                                                {userDetails.userType === 'Project Owner' && (
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
                                                    {userDetails.userType === 'Project Owner' && (
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
                                                {(userType === 'Freelancer' || userType === 'Innovators') && !appliedJobs.includes(job._id || '') && (
                                                    <Button
                                                        variant="contained"
                                                        color="primary"
                                                        onClick={() => handleApplyClick(job.title, job)}
                                                        sx={{ float: 'right' }}
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