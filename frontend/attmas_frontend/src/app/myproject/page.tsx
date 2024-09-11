'use client'
import React, { useEffect, useState } from 'react';
import { Box, colors, Card, CardContent, IconButton, Autocomplete, TextField, Chip, ToggleButton, ToggleButtonGroup, Tooltip, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Typography, Menu, MenuItem, ListItemIcon, ListItemText, Grid, Button, Link } from '@mui/material';
import { AddApply } from '../component/apply/apply';
import { APIS } from '@/app/constants/api.constant';
import dayjs from 'dayjs';
import FilterAltIcon from '@mui/icons-material/FilterAlt';
import InfiniteScroll from 'react-infinite-scroll-component';
import { useCallback, useMemo } from 'react';
import { useAppSelector } from '../reducers/hooks.redux';
import { UserSchema, selectUserSession } from '../reducers/userReducer';
import { Category, Subcategorys } from '@/app/constants/categories';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import { Job, Apply } from '../projects/projectinterface';
import { Expertiselevel } from '../projects/projectinterface';
import { getSubcategorys } from '../projects/projectinterface';
import { CustomChip } from '../projects/projectinterface';
import MyProjectDrawer from '../component/myProjectComponet/myprojectcomponet';
import ConfirmationCancelDialog from '../component/ConfirmationCancelDialog';
import axiosInstance from '../services/axios.service';
import { APPLY_STATUSES } from '../constants/status.constant';
import { DATE_FORMAT } from '../constants/common.constants';


const myproject = () => {
    const [jobs, setJobs] = useState<Job[]>([]);
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
    const [anchorEl, setAnchorEl] = React.useState<HTMLElement | null>(null);
    const [appliedJobs, setAppliedJobs] = useState<string[]>([]);
    const [appliedJobsForAdmin, setAppliedJobsForAdmin] = useState<string[]>([]);
    const [selectedStatus, setSelectedStatus] = useState<string | null>(null);
    const [viewingJob, setViewingJob] = useState<Job | null>(null);
    const [isShowingApplies, setIsShowingApplies] = useState(false);
    const [showingMyApplies, setShowingMyApplies] = useState(false);
    const [applies, setApplies] = useState<Apply[]>([]);
    const [selectedServices, setSelectedServices] = useState<string[]>([]);
    const [selectedFilter, setSelectedFilter] = useState<'all' | 'my'>();
    const [apply, setApply] = useState<Apply | null>(null);
    const [applications, setApplications] = useState<Apply[]>([]);

    const [confirmationDialogOpen, setConfirmationDialogOpen] = useState(false);

    const [currentApplicationId, setCurrentApplicationId] = useState<string | null>(null);




    const [projects, setProjects] = useState<Apply[]>([]);
    const [projectsForAdmin, setProjectsForAdmin] = useState<Apply[]>([]);


    const userDetails: UserSchema = useAppSelector(selectUserSession);
    const { userType, _id: userId } = userDetails;

    const handleClick = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };


    const fetchApplications = useCallback(async () => {
        if (viewingJob?._id) {
            try {
                const response = await axiosInstance.get(`${APIS.APPLY}/jobId/${viewingJob._id}`);
                setApplications(response.data);
            } catch (error) {
                console.error('Error fetching applications:', error);
            }
        }
    }, [viewingJob]);

    const handleCommentSubmitted = () => {
        fetchApplications();
    };

    const fetchJobs = useCallback(async (page: number, CategoryesFilter: string[], SubcategorysFilter: string[], ExpertiselevelFilter: string[], statusFilter: string | null, selectedServices: string[]) => {
        try {

            const response = await axiosInstance.get(APIS.JOBS, {
                params: {
                    page,
                    limit: 10,
                    Category: CategoryesFilter.join(','),
                    Subcategorys: SubcategorysFilter.join(','),
                    Expertiselevel: ExpertiselevelFilter.join(','),
                    status: statusFilter ? statusFilter : userType === 'Admin' ? undefined : 'Approved',
                    userId: userDetails._id,
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



    const currentUser = userDetails.username;
    const currentUserType = userDetails.userType;
    const currentUserId = userDetails._id;

    const setApplicationsBasedOnUser = (applies: Apply[]) => {
        const tmpApplies: Apply[] = [];
        for (let index = 0; index < applies.length; index++) {
            const element = applies[index];
            const isFreelancer = currentUserType === "Freelancer" && element?.userDetails._id === currentUserId && element?.status === APPLY_STATUSES.awarded;
            const isProjectOwner = currentUserType === "Project Owner" && element.status === APPLY_STATUSES.awarded;
            const isAdmin = currentUserType === "Admin" && element?.status === APPLY_STATUSES.awarded;
            if (isFreelancer || isProjectOwner || isAdmin) {
                tmpApplies.push(element);
            }
        }

        setProjectsForAdmin(tmpApplies);
    }



    useEffect(() => {
        // Function to fetch applied jobs for admin
        const fetchAppliedJobsForAdmin = async () => {
            try {
                const response = await axiosInstance.get(`${APIS.APPLIED_JOBSFORADMIN}/status/Awarded`);
                setApplicationsBasedOnUser(response.data);

                // const fetchedAppliedJobsForAdmin = response.data.map((application) => application.jobId);
                const fetchedAppliedJobsForAdmin = response.data.map((application: Apply) => application.jobId);

                setAppliedJobsForAdmin(fetchedAppliedJobsForAdmin);
            } catch (error) {
                console.error('Error fetching applied jobs:', error);
            }
        };

        // Check if the user type is 'Admin' before fetching
        if (userDetails.userType === 'Admin' || userDetails.userType === 'Freelancer' || userDetails.userType === 'Innovators') {
            fetchAppliedJobsForAdmin();
        }
    }, [userDetails]);



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
        setApplyOpen(false);
        // setApplyOpen(true); // Optionally reuse this state for opening the drawer
    };

    const filteredJobs = useMemo(() => {
        return jobs.filter(job => {
            if (userType === 'Admin' && selectedStatus) {
                return job.status === selectedStatus;
            }
            return userType === 'Admin' || job.status === 'Approved';
        });
    }, [jobs, userType, selectedStatus]);


    const handleOpenConfirmationDialog = (projectId: string) => {
        setCurrentApplicationId(projectId);
        setConfirmationDialogOpen(true);
    };


    const handleCloseConfirmationDialog = () => {
        setConfirmationDialogOpen(false);
        setCurrentApplicationId(null);
    };

    const handleConfirm = async (comment: string) => {
        if (currentApplicationId) {
            handleCancel(currentApplicationId, comment)
            // Close the dialog after confirming
            handleCloseConfirmationDialog();

        }
    };

    const handleCancel = async (projectId: string, comment?: string) => {
        try {
            if (!projectId) return;

            // Ensure status is always "Closed"
            const status = 'Project Finished and close ';

            // Use a default comment if none is provided
            const defaultComment = 'No comment provided When Project is closed ';
            const finalComment = comment || defaultComment;

            // Make a POST request to update the project with the provided status and comment
            await axiosInstance.post(`${APIS.CLOSED_PROJECT}/${projectId}`, {
                status,
                comment: finalComment,
            });

        } catch (error) {
            console.error('Error updating project:', error);
        }
    };

    const isProjectOwnerOrAdmin = userDetails.userType === 'Project Owner';


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
                <Typography component="h2" sx={{ marginY: 0 }}>My Projects</Typography>

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


            {(userType === 'Project Owner' || userType === 'Admin') && (
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


                    </ToggleButtonGroup>
                </Box>
            )}

            {(userType === 'Project Owner' || userType === 'Admin') && (
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
                            left: '28px',
                        },
                    }}
                >

                    <ToggleButtonGroup
                        value={selectedServices}
                        onChange={handleServiceChange}
                        aria-label="Select Service"
                        sx={{ height: "50px", right: '26px', position: 'relative' }}
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


            {isProjectOwnerOrAdmin && (
                <Box sx={{ mt: 2 }}>
                    <>
                        {isShowingApplies ? (
                            <Box>
                                {applies.map((apply) => (

                                    <Card key={apply._id} sx={{ mb: 2, position: 'relative' }}>
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
                                    {filteredJobs.map((job) => (
                                        <Card key={job._id} sx={{ mb: 2, position: 'relative' }}>
                                            <CardContent>
                                                <Typography variant="h5" sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap' }}>

                                                    <Box sx={{ width: '50%', '@media (max-width: 767px)': { width: '100%' } }}>

                                                        {job.title},



                                                        <span style={{ fontSize: 'small', color: "#616161" }}>
                                                            {/* ({dayjs(job.TimeFrame).format('MMMM D, YYYY h:mm A')}) */}
                                                            {dayjs(job.TimeFrame).format(DATE_FORMAT)}
                                                        </span>
                                                    </Box>


                                                    <Box sx={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap' }}>
                                                        <Box sx={{ flexShrink: 0, display: 'flex', alignItems: 'center', mr: 2 }}>
                                                            <CustomChip
                                                                label={job.status === 'Approved' ? 'Approved' : job.status === 'Rejected' ? 'Rejected' : 'Pending'}
                                                                color={job.status === 'Approved' ? 'success' : job.status === 'Rejected' ? 'error' : 'default'}
                                                            />
                                                        </Box>

                                                        <Box sx={{ flexShrink: 0, mr: 2 }}>
                                                            <Chip
                                                                label={job.SelectService}
                                                                variant="outlined"
                                                                color='secondary'
                                                            />
                                                        </Box>
                                                    </Box>

                                                </Typography>
                                                <Box sx={{ marginTop: '10px' }}>
                                                    <Typography variant="body2">{job.currency === 'USD' ? '$' : '₹'}{job.Budget}</Typography>
                                                    <Typography variant="caption">{job.Category.join(', ')}, {job.Subcategorys.join(', ')}</Typography>
                                                    <Button
                                                        onClick={() => handleOpenConfirmationDialog(job._id as string)}
                                                        sx={{
                                                            position: 'absolute',
                                                            bottom: 0,
                                                            right: 0,
                                                            margin: 1,
                                                            width: '8%',
                                                            minWidth: 'auto',
                                                            padding: 1,
                                                            display: 'flex',
                                                            alignItems: 'center',
                                                            borderRadius: '22px',
                                                            backgroundColor: 'grey',
                                                            color: 'white',
                                                            '&:hover': {
                                                                backgroundColor: '#cc4800',
                                                            },
                                                            '@media (max-width: 767px)': {
                                                                width: '20%',
                                                            }
                                                        }}
                                                    >
                                                        Close
                                                    </Button>
                                                </Box>
                                                <Link
                                                    component="button"
                                                    // variant="contained"
                                                    color="primary"
                                                    onClick={() => handleViewJob(job)}
                                                    sx={{
                                                        color: 'blue',
                                                        textDecoration: 'underline',
                                                        cursor: 'pointer',
                                                        mr: 2
                                                    }} // Style to ensure link is blue with underline
                                                >
                                                    View Project
                                                </Link>
                                            </CardContent>
                                        </Card>

                                    ))}
                                </Box>

                            </InfiniteScroll>
                        )}
                        <MyProjectDrawer
                            viewingJob={viewingJob}
                            setViewingJob={setViewingJob}
                            userType={userType}
                            handleApproveDialogOpen={() => {/* Handle approve dialog */ }}
                            handleRejectDialogOpen={() => {/* Handle reject dialog */ }}
                            onCommentSubmitted={handleCommentSubmitted}

                        />

                    </>
                </Box>
            )}


            <Box sx={{ mt: 2, position: 'relative' }}>
                {userDetails && (userDetails.userType === 'Freelancer' || userDetails.userType === 'Innovators') && (
                    <>
                        {projectsForAdmin.length > 0 ? (
                            <Box>
                                {projectsForAdmin.map((project) => project.jobDetails && (
                                    <Card key={project._id} sx={{ mb: 2 }}>
                                        <CardContent>
                                            <Typography variant="h5" sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap' }}>

                                                <Box sx={{ width: '50%', '@media (max-width: 767px)': { width: '100%' } }}>

                                                    {project.jobDetails.title},



                                                    <span style={{ fontSize: 'small', color: "#616161" }}>
                                                        {/* ({dayjs(job.TimeFrame).format('MMMM D, YYYY h:mm A')}) */}
                                                        {dayjs(project.jobDetails.TimeFrame).format(DATE_FORMAT)}
                                                    </span>
                                                </Box>


                                                <Box sx={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap' }}>
                                                    <Box sx={{ flexShrink: 0, display: 'flex', alignItems: 'center', mr: 2 }}>
                                                        <CustomChip
                                                            label={project.jobDetails.status === 'Approved' ? 'Approved' : project.jobDetails.status === 'Rejected' ? 'Rejected' : 'Pending'}
                                                            color={project.jobDetails.status === 'Approved' ? 'success' : project.jobDetails.status === 'Rejected' ? 'error' : 'default'}
                                                        />
                                                    </Box>

                                                    <Box sx={{ flexShrink: 0, mr: 2 }}>
                                                        <Chip
                                                            label={project.jobDetails.SelectService}
                                                            variant="outlined"
                                                            color='secondary'
                                                        />
                                                    </Box>
                                                </Box>

                                            </Typography>
                                            <Box sx={{ marginTop: '10px' }}>
                                                <Typography variant="body2">{project.jobDetails.currency === 'USD' ? '$' : '₹'}{project.jobDetails.Budget}</Typography>
                                                <Typography variant="caption">{project.jobDetails.Category.join(', ')}, {project.jobDetails.Subcategorys.join(', ')}</Typography>
                                            </Box>
                                            <Link
                                                component="button"
                                                // variant="contained"
                                                color="primary"
                                                onClick={() => handleViewJob(project.jobDetails)}
                                                sx={{
                                                    color: 'blue',
                                                    textDecoration: 'underline',
                                                    cursor: 'pointer',
                                                    mr: 2
                                                }} // Style to ensure link is blue with underline
                                            >
                                                View Project
                                            </Link>
                                        </CardContent>
                                    </Card>
                                ))}
                            </Box>
                        ) : (
                            <Typography>No projects available</Typography>
                        )}
                    </>
                )}
                {/* Close Button */}

                {/* Confirmation Dialog */}
                <ConfirmationCancelDialog
                    open={confirmationDialogOpen}
                    onClose={handleCloseConfirmationDialog}
                    onConfirm={handleConfirm}
                    message="Are you sure you want to close this application?"
                />
            </Box>

            <Box sx={{ mt: 2, position: 'relative' }}>
                {(userDetails.userType === 'Admin') && (
                    <>
                        {projectsForAdmin.length > 0 ? (
                            <Box>
                                {projectsForAdmin.map((project) => (
                                    <Card key={project._id} sx={{ mb: 2 }}>
                                        <CardContent>
                                            <Typography variant="h5" sx={{ display: 'flex', justifyContent: 'space-between' }}>
                                                <Box

                                                >
                                                    {project.jobDetails.title},
                                                    <span style={{ fontSize: 'small', color: "#616161" }}>
                                                        {/* ({dayjs(job.TimeFrame).format('MMMM D, YYYY h:mm A')}) */}
                                                        {dayjs(project.jobDetails.TimeFrame).format(DATE_FORMAT)}
                                                    </span>

                                                </Box>
                                                <Box sx={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap' }}>
                                                    <Box sx={{ flexShrink: 0, display: 'flex', alignItems: 'center', mr: 2 }}>
                                                        <CustomChip
                                                            label={project.jobDetails.status === 'Approved' ? 'Approved' : project.jobDetails.status === 'Rejected' ? 'Rejected' : 'Pending'}
                                                            color={project.jobDetails.status === 'Approved' ? 'success' : project.jobDetails.status === 'Rejected' ? 'error' : 'default'}
                                                        />
                                                    </Box>

                                                    <Box sx={{ flexShrink: 0, mr: 2 }}>
                                                        <Chip
                                                            label={project.jobDetails.SelectService}
                                                            variant="outlined"
                                                            color='secondary'
                                                        />
                                                    </Box>
                                                </Box>

                                            </Typography>

                                            <Box sx={{ marginTop: '10px' }}>
                                                <Typography variant="body2">{project.jobDetails.currency === 'USD' ? '$' : '₹'}{project.jobDetails.Budget}</Typography>
                                                <Typography variant="caption">{project.jobDetails.Category.join(', ')}, {project.jobDetails.Subcategorys.join(', ')}</Typography>
                                            </Box>


                                            <Link
                                                component="button"
                                                // variant="contained"
                                                color="primary"
                                                onClick={() => handleViewJob(project.jobDetails)}
                                                sx={{
                                                    color: 'blue',
                                                    textDecoration: 'underline',
                                                    cursor: 'pointer',
                                                    mr: 2
                                                }}
                                            >
                                                View Project
                                            </Link>
                                        </CardContent>
                                    </Card>
                                ))}
                            </Box>
                        ) : (
                            <Typography>No projects available</Typography>
                        )}
                    </>
                )}
                {/* Close Button */}

                {/* Confirmation Dialog */}
                <ConfirmationCancelDialog
                    open={confirmationDialogOpen}
                    onClose={handleCloseConfirmationDialog}
                    onConfirm={handleConfirm}
                    message="Are you sure you want to close this application?"
                />
            </Box>

            <AddApply
                open={applyOpen}
                setOpen={setApplyOpen}
                jobTitle={jobTitle}
                jobId={selectedJobId}
            />

            <MyProjectDrawer
                viewingJob={viewingJob}
                setViewingJob={setViewingJob}
                userType={userType}
                handleApproveDialogOpen={function (): void {
                    throw new Error('Function not implemented.');
                }}
                handleRejectDialogOpen={function (): void {
                    throw new Error('Function not implemented.');
                }}
                onCommentSubmitted={handleCommentSubmitted}
            />

        </Box>
    );
};

export default myproject;