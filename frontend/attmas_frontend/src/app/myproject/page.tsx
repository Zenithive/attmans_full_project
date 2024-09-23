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
import { APPLY_STATUSES, PROJECT_STATUSES } from '../constants/status.constant';
import Filters, { FilterColumn } from '../component/filter/filter.component';


const myproject = () => {
    const [jobs, setJobs] = useState<Job[]>([]);
    const [applyOpen, setApplyOpen] = useState(false);
    const [selectedJobId, setSelectedJobId] = useState<string>('');
    const [jobTitle, setJobTitle] = useState<string>('');
    const [jobDescription ,setJobDescription] = useState<string>('');
    const [selectedCategory, setSelectedCategory] = useState<string[]>([]);
    const [selectedSubcategory, setSelectedSubcategory] = useState<string[]>([]);
    const [selectedExpertis, setSelectedExpertis] = useState<string[]>([]);
    const [hasMore, setHasMore] = useState(true);
    const [page, setPage] = useState(1);
    const [filterType, setFilterType] = useState("all");
    const [anchorEl, setAnchorEl] = React.useState<HTMLElement | null>(null);
    const [appliedJobs, setAppliedJobs] = useState<string[]>([]);
    const [appliedJobsForAdmin, setAppliedJobsForAdmin] = useState<string[]>([]);
    const [viewingJob, setViewingJob] = useState<Job | null>(null);
    const [isShowingApplies, setIsShowingApplies] = useState(false);
    const [applies, setApplies] = useState<Apply[]>([]);
    const [applications, setApplications] = useState<Apply[]>([]);
    const [confirmationDialogOpen, setConfirmationDialogOpen] = useState(false);
    const [currentApplicationId, setCurrentApplicationId] = useState<string | null>(null);
    const [projects, setProjects] = useState<Apply[]>([]);
    const [projectsForAdmin, setProjectsForAdmin] = useState<Apply[]>([]);
    //   const [filter, setFilter] = useState('');
    const [filter, setFilter] = useState<string>('');


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

    const getParamsForJobs = (page: number, filter: Record<string, any>, userId: string, userType: string) => {
        const params: Record<string, any> = {
          page,
          limit: 10,
          appstatus: APPLY_STATUSES.awarded,
          ...filter, // Directly spread the filter object here
        };
      
        if (userType !== 'Admin') {
            params.appUserId = userId;
        }
      
        return params;
      };
      
      


      const fetchJobs = useCallback(async (page: number) => {
        try {
          // Construct params including filter
          const params = getParamsForJobs(page, {}, userId, userType);
      
          // Create URLSearchParams instance
          const searchParams = new URLSearchParams();
      
          // Append basic parameters
          Object.keys(params).forEach(key => {
            const value = params[key];
            if (Array.isArray(value)) {
              value.forEach(v => searchParams.append(key, v));
            } else {
              searchParams.append(key, value);
            }
          });
      
          // Convert URLSearchParams to string
          const queryString = searchParams.toString() + '&'+ filter;
          console.log('Query String:', queryString); // Debugging line to inspect the query string
      
          const response = await axiosInstance.get(`${APIS.JOBS}?${queryString}`);
      
          if (response.data.length === 0) {
            setHasMore(false);
          } else {
            setJobs(prev => {
              const newJobs = response.data.filter((newJob: Job) => !prev.some(existingJob => existingJob._id === newJob._id));
              return [...prev, ...newJobs];
            });
            if (response.data.length < 10) {
              setHasMore(false);
            }
          }
        } catch (error) {
          console.error('Error fetching jobs:', error);
        }
      }, [userId, userType, filter]);
      
      
      
      




    useEffect(() => {
        const fetchAppliedJobsForAdmin = async () => {
            try {
                const response = await axiosInstance.get(`${APIS.APPLIED_JOBSFORADMIN}/status/Awarded`);
                console.log("fetchAppliedJobsForAdmin", response.data);
                setApplicationsBasedOnUser(response.data);
                const fetchedAppliedJobsForAdmin = response.data.map((application: Apply) => application.jobId);
                console.log('fetchedAppliedJobsForAdmin', fetchedAppliedJobsForAdmin);
                setAppliedJobsForAdmin(fetchedAppliedJobsForAdmin);
            } catch (error) {
                console.error('Error fetching applied jobs:', error);
            }
        };

        // Check if the user type is 'Admin' before fetching
        if (userDetails.userType === 'Admin' || userDetails.userType === 'Freelancer' || userDetails.userType === 'Innovator') {
            fetchAppliedJobsForAdmin();
        }
    }, [userDetails]);

    const refetch = useCallback(async () => {
        try {
            setPage(1);
            setJobs([]);
            setHasMore(true);
            await fetchJobs(1);
        } catch (error) {
            console.error('Error refetching jobs:', error);
        }
    }, [fetchJobs]);

    useEffect(() => {
        refetch();
    }, [refetch]);

    useEffect(() => {
        if (page > 1) fetchJobs(page);
    }, [page, fetchJobs]);

    const currentUser = userDetails.username;
    const currentUserType = userDetails.userType;
    const currentUserId = userDetails._id;

    const setApplicationsBasedOnUser = (applies: Apply[]) => {
        const tmpApplies: Apply[] = applies.filter(element => {
            return (
                (userDetails.userType === "Freelancer" && element?.userDetails._id === userId && element?.status === APPLY_STATUSES.awarded) ||
                (userDetails.userType === "Project Owner" && element.status === APPLY_STATUSES.awarded) ||
                (userDetails.userType === "Admin" && element?.status === APPLY_STATUSES.awarded)
            );
        });
        setProjectsForAdmin(tmpApplies);
    };

    const handleViewJob = (job: Job) => {
        setViewingJob(job);
        setApplyOpen(false);
    };

    const filteredJobs = useMemo(() => {
        return jobs.filter(job => {
            return userType === 'Admin' || job.status === 'Approved';
        });
    }, [jobs, userType]);

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

            const status = 'Project Finished and close';
            const defaultComment = 'No comment provided When Project is closed';
            const finalComment = comment || defaultComment;

            await axiosInstance.post(`${APIS.CLOSED_PROJECT}/${projectId}`, {
                status,
                comment: finalComment,
            });
        } catch (error) {
            console.error('Error updating project:', error);
        }
    };

    const isProjectOwnerOrAdmin = userDetails.userType === 'Project Owner';

    const changeFilterOrPage = (newFilter: string) => {
        setFilter(newFilter); 
        setPage(1);
        setJobs([]); 
        setHasMore(true);
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
                <Typography component="h2" sx={{ marginY: 0 }}>My Projects</Typography>
                <Filters
                    column={column}
                    onFilter={changeFilterOrPage}                // onFilter={changeFilterOrPage}
                ></Filters>

            </Box>

            {/* {isProjectOwnerOrAdmin && ( */}
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
                                                    <a onClick={() => handleViewJob(job)} style={{ cursor: 'pointer', textDecoration: 'none' }}>
                                                        {job.title},
                                                    </a>
                                                    <span style={{ fontSize: 'small', color: "#616161" }}>
                                                        ({dayjs(job.TimeFrame).format('MMMM D, YYYY h:mm A')})
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

                                                    <Box sx={{ flexShrink: 0, fontSize: 'small', fontWeight: 'bolder' }}>
                                                        {job.Expertiselevel}
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
            {/* )} */}

            {/* ///// ********** different box for freelancer  */}
            {/* <Box sx={{ mt: 2, position: 'relative' }}>
                {userDetails && (userDetails.userType === 'Freelancer' || userDetails.userType === 'Innovators') && (
                    <>
                        {projectsForAdmin.length > 0 ? (
                            <Box>
                                {projectsForAdmin.map((project) => project.jobDetails && (
                                    <Card key={project._id} sx={{ mb: 2 }}>
                                        <CardContent>
                                            <Typography variant="h5" sx={{ display: 'flex', justifyContent: 'space-between' }}>
                                                <Box
                                                    onClick={() => handleViewJob(project.jobDetails)}
                                                    sx={{ cursor: 'pointer' }}
                                                >
                                                    {project.jobDetails.title}
                                                </Box>

                                                <Box sx={{ flexShrink: 0, display: 'flex', alignItems: 'center', mr: 2, position: 'relative', left: '25%' }}>
                                                    <CustomChip
                                                        label={project.jobDetails.status === 'Approved' ? 'Approved' : project.jobDetails.status === 'Rejected' ? 'Rejected' : 'Pending'}
                                                        color={project.jobDetails.status === 'Approved' ? 'success' : project.jobDetails.status === 'Rejected' ? 'error' : 'default'}
                                                    />
                                                </Box>

                                                <Box sx={{ flexShrink: 0, mr: 2, position: 'relative', left: '12%' }}>
                                                    <Chip
                                                        label={project.jobDetails.SelectService}
                                                        variant="outlined"
                                                        color='secondary'
                                                    />
                                                </Box>

                                                <Box sx={{ fontSize: 'small', color: 'text.secondary' }}>
                                                    {dayjs(project.jobDetails.TimeFrame).format('MMMM D, YYYY h:mm A')}
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
                                                        onClick={() => handleOpenConfirmationDialog(project.jobDetails._id)}
                                                        sx={{
                                                            position: 'absolute',
                                                            bottom: 0,
                                                            right: 0,
                                                            margin: 1,
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
                                                        }}
                                                    >
                                                        Close
                                                    </Button>
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

                <ConfirmationCancelDialog
                    open={confirmationDialogOpen}
                    onClose={handleCloseConfirmationDialog}
                    onConfirm={handleConfirm}
                    message="Are you sure you want to close this application?"
                />
            </Box> */}

            {/* <Box sx={{ mt: 2, position: 'relative' }}>
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
                                                    <Chip
                                                        label={project.jobDetails.status}
                                                        color={
                                                            project.jobDetails.status === 'Approved'
                                                                ? 'success'
                                                                : project.jobDetails.status === 'Rejected'
                                                                    ? 'error'
                                                                    : 'default'
                                                        }
                                                    />



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

                <ConfirmationCancelDialog
                    open={confirmationDialogOpen}
                    onClose={handleCloseConfirmationDialog}
                    onConfirm={handleConfirm}
                    message="Are you sure you want to close this application?"
                />
            </Box> */}

            <AddApply
                open={applyOpen}
                setOpen={setApplyOpen}
                jobTitle={jobTitle}
                jobId={selectedJobId}
                jobDescription={jobDescription}
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