'use client'
import React, { useEffect, useState } from 'react';
import { Box, colors, Card, CardContent, IconButton, Button, Autocomplete, TextField, Chip, ToggleButton, ToggleButtonGroup, Tooltip, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Typography } from '@mui/material';
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
import { Drawer } from '@mui/material';
import { Divider } from '@mui/material'; // Import Divider
import { Category, Subcategorys } from '@/app/constants/categories';
import ApproveDialogForProject from '../component/approveforproject/approveforproject';
import RejectDialogForProject from '../component/rejectforproject/rejectforproject';
import { styled } from '@mui/material/styles';




interface Job {
    _id?: string;
    title: string;
    description: string;
    Budget: number;
    Expertiselevel: string;
    TimeFrame: string | null;
    Category: string[];
    Subcategorys: string[];
    Sector: string;
    AreaOfProduct: string;
    ProductDescription: string;
    username: string;
    DetailsOfInnovationChallenge: string;
    SelectService: string;
    Objective: string;
    Expectedoutcomes: string;
    IPRownership: string;
    status: string;
    rejectComment?: string;
}



const Expertiselevel = [
    "Beginner",
    "Intermidiate",
    "Expert",
    "Phd"
];

const getSubcategorys = (Subcategorys: any[]) => Subcategorys.flatMap((Subcategory: { items: any; }) => Subcategory.items);

const Jobs = () => {
    const [jobs, setJobs] = useState<Job[]>([]);
    const [editingJob, setEditingJob] = useState<Job | null>(null);
    const [applyOpen, setApplyOpen] = useState(false);
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

    const userDetails: UserSchema = useAppSelector(selectUserSession);
    const { userType, _id: userId } = userDetails;

    const [viewingJob, setViewingJob] = useState<Job | null>(null);

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



    const fetchJobs = useCallback(async (page: number, CategoryesFilter: string[], SubcategorysFilter: string[], ExpertiselevelFilter: string[]) => {
        try {
            const response = await axios.get(APIS.JOBS, {
                params: {
                    page, limit: 10, Category: CategoryesFilter.join(','), Subcategorys: SubcategorysFilter.join(','), Expertiselevel: ExpertiselevelFilter.join(','),
                    userId: filterType === "mine" ? userId : undefined
                }
            });
            if (response.data.length === 0) {
                setHasMore(false);
            } else {
                setJobs((prev) => {
                    const newJobs = response.data.filter((newJobs: Job) => {
                        return !prev.some((existingJobs) => existingJobs._id === newJobs._id);
                    });
                    return [...prev, ...newJobs];
                });
                if (response.data.length < 10) {
                    setHasMore(false);
                }
            }
        } catch (error) {
            console.error('Error fetching jobs:', error);
        }
    }, [userId, filterType]);

    const refetch = useCallback(async () => {
        try {
            setPage(1);
            setJobs([]);
            setHasMore(true);
            await fetchJobs(1, selectedCategory, selectedSubcategory, selectedExpertis);
        } catch (error) {
            console.error('Error refetching jobs:', error);
        }
    }, [fetchJobs, selectedCategory, selectedExpertis, selectedSubcategory]);

    useEffect(() => {
        refetch();
    }, [selectedCategory, selectedSubcategory, selectedExpertis, filterType]);

    useEffect(() => {
        if (page > 1) {
            fetchJobs(page, selectedCategory, selectedSubcategory, selectedExpertis);
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

    const handleApplyClick = useCallback((title: string) => {
        setApplyOpen(true);
        setJobTitle(title);
    }, []);
    const handleFilterChange = useCallback(() => {
        refetch();
    }, [refetch]);

    const handleFilterTypeChange = (event: any, newFilterType: string) => {
        if (newFilterType !== null) {
            setFilterType(newFilterType);
        }
    }

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
            refetch();
        } catch (error) {
            console.error('Error approving job:', error);
        }
    }, [refetch, viewingJob]);
    
    const handleReject = useCallback(async (jobId: string,comment: string, job: Job | null) => {
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
          handleRejectDialogClose();
          refetch();
        } catch (error) {
          console.error('Error rejecting job:', error);
        }
      }, [refetch, viewingJob]);
      
      

    const CustomChip = styled(Chip)(({ theme }) => ({
        borderRadius: '16px', 
        border: `1px solid ${theme.palette.success.main}`, 
        backgroundColor: 'transparent', 
        color: theme.palette.success.main, 
        '&.MuiChip-colorError': {
          border: `1px solid ${theme.palette.error.main}`,
          color: theme.palette.error.main,
        },
        '&.MuiChip-colorDefault': {
          border: `1px solid ${theme.palette.grey[400]}`,
          color: theme.palette.text.primary,
        },
      }));
      
    

    return (
        <Box sx={{ background: colors.grey[100], p: 2, borderRadius: "30px !important", overflowX: "hidden !important" }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Typography component="h2" sx={{ marginY: 0 }}>Post Jobs</Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <ToggleButtonGroup
                        value={filterType}
                        exclusive
                        onChange={handleFilterTypeChange}
                        aria-label="filter exhibitions"
                        sx={{ height: "30px" }}
                    >
                        <ToggleButton value="all" aria-label="all exhibitions">
                            All Projects
                        </ToggleButton>
                        <ToggleButton value="mine" aria-label="my exhibitions">
                            My Projects
                        </ToggleButton>
                    </ToggleButtonGroup>
                    <Tooltip title="Filter" arrow>
                        <IconButton onClick={() => setFilterOpen(prev => !prev)}>
                            <FilterAltIcon />
                        </IconButton>
                    </Tooltip>
                </Box>

                {/*                 
                <AddProjects editingJobs={editingJob} onCancelEdit={handleCancelEdit} />
            </Box> */}
                {userDetails.userType === 'Project Owner' && (
                    <AddProjects editingJobs={editingJob} onCancelEdit={handleCancelEdit} />
                )}
            </Box>
            {filterOpen && (
                <Box sx={{ mt: 2, display: "flex", gap: 3, alignItems: 'center' }}>
                    <Autocomplete
                        sx={{ flex: 1 }}
                        multiple
                        size='small'
                        options={Expertiselevel}
                        value={selectedExpertis}
                        onChange={(event, value) => setSelectedExpertis(value)}
                        renderInput={(params) => <TextField {...params} variant="outlined" label="Filter by Expertise-Level" color='secondary' />}
                    />

                    <Autocomplete
                        sx={{ flex: 1 }}
                        multiple
                        size='small'
                        options={Category()}
                        value={selectedCategory}
                        onChange={(event, value) => setSelectedCategory(value)}
                        renderInput={(params) => <TextField {...params} variant="outlined" label="Filter by Categorys" color='secondary' />}
                    />

                    <Autocomplete
                        sx={{ flex: 1 }}
                        multiple
                        size='small'
                        options={getSubcategorys(Subcategorys())}
                        value={selectedSubcategory}
                        onChange={(event, value) => setSelectedSubcategory(value)}
                        renderInput={(params) => <TextField {...params} variant="outlined" label="Filter by Subcategorys" color='secondary' />}
                    />
                    <Button onClick={handleFilterChange} variant="contained" color="primary">Apply Filters</Button>
                </Box>
            )}



            <InfiniteScroll
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
                                <Typography variant="h5">

                                    <a onClick={() => handleViewJob(job)} style={{ cursor: 'pointer', textDecoration: 'underline' }}>
                                        {job.title}
                                    </a>
                                    <span style={{ fontSize: 'small', color: "#616161" }}>
                                        ({dayjs(job.TimeFrame).format('MMMM D, YYYY h:mm A')})
                                        <CustomChip
                                            sx={{position:'relative',left:'10px'}}
                                            label={job.status === 'Approved' ? 'Approved' : job.status === 'Rejected' ? 'Rejected' : 'Pending'}
                                            color={job.status === 'Approved' ? 'success' : job.status === 'Rejected' ? 'error' : 'default'}
                                            />
                                    </span>
                                    <span style={{ fontSize: 'small', fontWeight: "bolder", float: "right" }}>
                                        {job.Expertiselevel}
                                    </span>
                                    <span style={{ fontSize: 'small', fontWeight: "bolder", float: "right", position: "relative", right: "20px", bottom: "8px" }}>
                                        <Chip
                                            label={job.SelectService}
                                            variant="outlined"
                                            color='secondary'
                                        />
                                    </span>


                                </Typography>
                                <Typography variant="body2" sx={{ mb: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', width: '100%' }}>
                                    {job.description}
                                </Typography>

                                <Typography variant="body2">{job.Budget}</Typography>
                                <Typography variant="caption">{job.Category.join(', ')}, {job.Subcategorys.join(', ')}</Typography>
                                {/* <Box sx={{ float: "right" }}>
                                    <Button variant="contained" color="primary" onClick={() => handleApplyClick(job.title)}>
                                        Apply
                                    </Button>
                                    <Tooltip title="Edit" arrow>
                                        <IconButton onClick={() => handleEditJob(job)}>
                                            <EditIcon />
                                        </IconButton>
                                    </Tooltip>
                                    <Tooltip title="Delete" arrow>
                                        <IconButton onClick={() => handleConfirmDelete(job)}>
                                            <DeleteRoundedIcon />
                                        </IconButton>
                                    </Tooltip>
                                </Box> */}

                                <Box sx={{ float: "right" }}>
                                    <Button variant="contained" color="primary" onClick={() => handleApplyClick(job.title)}>
                                        Apply
                                    </Button>
                                    {userDetails.userType === 'Project Owner' && (
                                        <>
                                            <Tooltip title="Edit" arrow>
                                                <IconButton onClick={() => handleEditJob(job)}>
                                                    <EditIcon />
                                                </IconButton>
                                            </Tooltip>
                                            <Tooltip title="Delete" arrow>
                                                <IconButton onClick={() => handleConfirmDelete(job)}>
                                                    <DeleteRoundedIcon />
                                                </IconButton>
                                            </Tooltip>
                                        </>
                                    )}
                                </Box>

                            </CardContent>
                        </Card>
                    ))}
                </Box>
            </InfiniteScroll>
            <AddApply open={applyOpen} setOpen={setApplyOpen} jobTitle={jobTitle} />
            <DeleteConfirmationDialog
                open={confirmDelete.open}
                onCancel={handleCancelDelete}
                onConfirm={handleDeleteJob}
                title={confirmDelete.jobs?.title || ''}
            />


            <Drawer
                anchor="right"
                open={!!viewingJob}
                onClose={() => setViewingJob(null)}
                PaperProps={{
                    sx: {
                        borderRadius: '20px 0px 0px 20px',
                        width: '600px',
                        p: 2,
                        backgroundColor: '#f9f9f9'
                    }
                }}
                BackdropProps={{
                    sx: {
                        backgroundColor: 'rgba(0, 0, 0, 0.5)',
                    }
                }}
            >
                {viewingJob && (
                    <Box p={2}>
                        <Typography variant="h6" sx={{ mb: 2, fontWeight: 'bold' }}>Project Details Information</Typography>
                        
                        {isApproved && <Chip label="Approved" variant="outlined" sx={{ borderColor: 'green', color: 'green', borderRadius: '16px',float:'right' }} />}
                        {isRejected && <Chip label="Rejected" variant="outlined" sx={{ borderColor: 'red', color: 'red', borderRadius: '16px', float:'right' }} />}
                        <Typography variant="h5" sx={{ mb: 1 }}>{viewingJob.title}</Typography>
                        <Typography variant="body2" sx={{ mb: 1 }}><b>Description:</b></Typography>
                        <Typography variant="body2" sx={{ mb: 1 }}>{viewingJob.description}</Typography>
                        <Typography variant="body2" sx={{ mb: 1 }}><b>Select Service:</b></Typography>
                        <Typography variant="body2" sx={{ mb: 1 }}>{viewingJob.SelectService}</Typography>
                        <Typography variant="body2" sx={{ mb: 1 }}><b>Expertise Level:</b></Typography>
                        <Typography variant="body2" sx={{ mb: 1 }}>{viewingJob.Expertiselevel}</Typography>
                        <Typography variant="body2" sx={{ mb: 1 }}><b>Budget:</b></Typography>
                        <Typography variant="body2" sx={{ mb: 1 }}>${viewingJob.Budget}</Typography>
                        <Typography variant="body2" sx={{ mb: 1 }}><b>Category:</b></Typography>
                        <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', mb: 1 }}>
                            {viewingJob.Category.map((category, index) => (
                                <Chip
                                    key={index}
                                    label={category}
                                    variant="outlined"
                                    size="small"
                                    sx={{ fontSize: '0.75rem', height: 'auto', py: 0.5 }}
                                />
                            ))}
                        </Box>

                        <Typography variant="body2" sx={{ mb: 1 }}><b>Subcategories:</b></Typography>
                        <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', mb: 1 }}>
                            {viewingJob.Subcategorys.map((subcategory, index) => (
                                <Chip
                                    key={index}
                                    label={subcategory}
                                    variant="outlined"
                                    size="small"
                                    sx={{ fontSize: '0.75rem', height: 'auto', py: 0.5 }}
                                />
                            ))}
                        </Box>

                        <Typography variant="body2" sx={{ mb: 1 }}><b>Objective:</b></Typography>
                        <Typography variant="body2" sx={{ mb: 1 }}>{viewingJob.Objective}</Typography>
                        <Typography variant="body2" sx={{ mb: 1 }}><b>Expected Outcomes:</b></Typography>
                        <Typography variant="body2" sx={{ mb: 1 }}>{viewingJob.Expectedoutcomes}</Typography>
                        <Typography variant="body2" sx={{ mb: 1 }}><b>IPR Ownership:</b></Typography>
                        <Typography variant="body2" sx={{ mb: 1 }}>{viewingJob.IPRownership}</Typography>

                        
                            {viewingJob.rejectComment && (
                             <Box sx={{borderRadius:'5px',position:'relative',top:'20px'}}> 
                            <Typography variant="body2" sx={{ fontStyle: 'italic', color: 'error.main' }}>
                                <b>Rejection Comment:</b> {viewingJob.rejectComment}
                            </Typography>
                            </Box>  
                            )}

                        <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 2 }}>
                            {userType === 'Admin' && viewingJob.status !== 'Approved' && viewingJob.status !== 'Rejected' && (
                                <>
                                    <Button onClick={() => handleApproveDialogOpen(viewingJob)}>
                                    Approve
                                </Button>

                                <Button onClick={() => handleRejectDialogOpen(viewingJob)}>
                                    Reject
                                </Button>
                                  
                                </>
                            )}
                        </Box>
                    </Box>
                )}
            </Drawer>

            <ApproveDialogForProject
                        open={approveDialogOpen.open}
                        onClose={handleApproveDialogClose}
                        onApprove={() => handleApprove(approveDialogOpen.job)}
                        job={approveDialogOpen.job}
              />

            <RejectDialogForProject
                open={rejectDialogOpen.open}
                onClose={handleRejectDialogClose}
                onReject={(jonId, comment) => handleReject(jonId,comment, rejectDialogOpen.job)}
                job={rejectDialogOpen.job}
            />

        </Box>
    );
};

export default Jobs;