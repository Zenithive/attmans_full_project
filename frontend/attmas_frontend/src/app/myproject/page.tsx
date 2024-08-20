'use client'
import React, { useEffect, useState } from 'react';
import { Box, colors, Card, CardContent, IconButton, Autocomplete, TextField, Chip, ToggleButton, ToggleButtonGroup, Tooltip, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Typography, Menu, MenuItem, ListItemIcon, ListItemText, Grid } from '@mui/material';
import { AddApply } from '../component/apply/apply';
import axios from 'axios';
import { APIS } from '@/app/constants/api.constant';
import dayjs from 'dayjs';
import FilterAltIcon from '@mui/icons-material/FilterAlt';
import InfiniteScroll from 'react-infinite-scroll-component';
import { useCallback, useMemo } from 'react';
import { useAppSelector } from '../reducers/hooks.redux';
import { UserSchema, selectUserSession } from '../reducers/userReducer';
import { Category, Subcategorys } from '@/app/constants/categories';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import ProjectDrawer from '../component/projectDrwer/projectDrwer';
import { Job, Apply } from '../projects/projectinterface';
import { Expertiselevel } from '../projects/projectinterface';
import { getSubcategorys } from '../projects/projectinterface';
import { CustomChip } from '../projects/projectinterface';
import MyProjectDrawer from '../component/myProjectComponet/myprojectcomponet';



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
    const [selectedStatus, setSelectedStatus] = useState<string | null>(null);
    const [viewingJob, setViewingJob] = useState<Job | null>(null);
    const [isShowingApplies, setIsShowingApplies] = useState(false);
    const [showingMyApplies, setShowingMyApplies] = useState(false);
    const [applies, setApplies] = useState<Apply[]>([]);
    const [selectedServices, setSelectedServices] = useState<string[]>([]);
    const [selectedFilter, setSelectedFilter] = useState<'all' | 'my'>();

    const userDetails: UserSchema = useAppSelector(selectUserSession);
    const { userType, _id: userId } = userDetails;

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


    ///////////   All Applies fetch   ////////////


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


                    </ToggleButtonGroup>
                </Box>
            )}

            {(userType === 'Project Owner') && (
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

                                                </Menu>
                                            </Box>
                                            <Box sx={{ position: 'relative', bottom: '10px' }}>

                                            </Box>
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
        handleApproveDialogOpen={function (job: Job): void {
            throw new Error('Function not implemented.');
        } }
        handleRejectDialogOpen={function (job: Job): void {
            throw new Error('Function not implemented.');
        } }            />
            </Box>

        </Box>
    );
};

export default myproject;