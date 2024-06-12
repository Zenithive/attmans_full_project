"use client"
import React, { useEffect, useState } from 'react';
import { Box, colors, Typography, Card, CardContent, IconButton } from '@mui/material';
import { AddJobs } from '../component/jobs/jobs';
import axios from 'axios';
import { APIS } from '@/app/constants/api.constant';
import dayjs from 'dayjs';
import EditIcon from '@mui/icons-material/Edit';
import DeleteRoundedIcon from '@mui/icons-material/DeleteRounded';
import pubsub from '../services/pubsub.service';

interface Job {
    _id?: string;
    title: string;
    description: string;
    Budget: number;
    Expertiselevel: string;
    TimeFrame: string | null;
    Category: string[];
    Subcategorys: string[];
}

const Jobs = () => {
    const [jobs, setJobs] = useState<Job[]>([]);
    const [editingJob, setEditingJob] = useState<Job | null>(null);

    const fetchJobs = async () => {
        try {
            const response = await axios.get(APIS.JOBS);
            setJobs(response.data);
        } catch (error) {
            console.error('Error fetching jobs:', error);
        }
    };

    const refetch = async () => {
        try {
            await fetchJobs();
        } catch (error) {
            console.error('Error refetching jobs:', error);
        }
    };

    useEffect(() => {
        fetchJobs();
    }, []);

    useEffect(() => {
        const jobCreatedHandler = () => refetch();

        pubsub.subscribe('JobCreated', jobCreatedHandler);

        return () => {
            pubsub.unsubscribe('JobCreated', jobCreatedHandler);
        };
    }, []);

    const handleEditJob = (job: Job) => {
        setEditingJob(job);
    };

    const handleCancelEdit = () => {
        setEditingJob(null);
    };

    const handleDeleteJob = async (jobToDelete: Job) => {
        try {
            await axios.delete(`${APIS.JOBS}/${jobToDelete._id}`);
            setJobs(jobs.filter(job => job._id !== jobToDelete._id));
            pubsub.publish('JobDeleted', {}); 
        } catch (error) {
            console.error('Error deleting job:', error);
        }
    };

    return (
        <Box sx={{ background: colors.grey[100], p: 2, borderRadius: "30px !important" }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Typography component="h2" sx={{ marginY: 0 }}>Post Jobs</Typography>
                <AddJobs editingJobs={editingJob} onCancelEdit={handleCancelEdit} />
            </Box>
            <Box sx={{ mt: 2 }}>
                {jobs.map((job) => (
                    <Card key={job._id} sx={{ mb: 2 }}>
                        <CardContent>
                            <Typography variant="h5">
                                {job.title}
                                <span style={{ fontSize: 'small', color: "#616161" }}>
                                    ({dayjs(job.TimeFrame).format('MMMM D, YYYY h:mm A')})
                                </span>
                                <span style={{ fontSize: 'small', fontWeight: "bolder", float: "right" }}>
                                    {job.Expertiselevel}
                                </span>
                            </Typography>
                            <Typography variant="body2">{job.description}</Typography>
                            <Typography variant="body2">{job.Budget}</Typography>
                            <Typography variant="caption">{job.Category.join(', ')}, {job.Subcategorys.join(', ')}</Typography>
                            <Typography sx={{ display: "flex", float: "right" }}>
                                <IconButton onClick={() => handleEditJob(job)}>
                                    <EditIcon />
                                </IconButton>
                                <IconButton onClick={() => handleDeleteJob(job)}>
                                    <DeleteRoundedIcon />
                                </IconButton>
                            </Typography>
                        </CardContent>
                    </Card>
                ))}
            </Box>
        </Box>
    );
};

export default Jobs;
