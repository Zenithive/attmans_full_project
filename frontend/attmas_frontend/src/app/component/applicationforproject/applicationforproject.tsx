import React, { useEffect, useState } from 'react';
import { Grid, Box, TextField, Card, CardContent, Typography, Button, CircularProgress, Chip, Divider, InputLabel, MenuItem, ToggleButton, ToggleButtonGroup, FormControl, Modal, Select, SelectChangeEvent } from '@mui/material';
import { Apply, Milestone } from '../myProjectComponet/myprojectcomponet';
import dayjs from 'dayjs';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import axios from 'axios';
import { APIS, SERVER_URL } from '@/app/constants/api.constant';

interface ApplicationsForProjectProps {
    filteredApplications: Apply[];
    milestones: Record<string, Milestone[]>;
    userType: string;
    milestoneComments: Record<string, string>;
    setMilestoneComments: React.Dispatch<React.SetStateAction<Record<string, string>>>;
    commentErrors: Record<string, boolean>;
    handleMilestoneSubmit: (applyId: string, milestoneIndex: number) => void;
    handleCommentChange: (applyId: string, index: number, value: string) => void;
    isSubmitting: boolean;
}

const ApplicationsForProject: React.FC<ApplicationsForProjectProps> = ({
    filteredApplications,
    milestones,
    userType,
    milestoneComments,
    commentErrors,
    handleMilestoneSubmit,
    handleCommentChange,
    isSubmitting,
}) => {
    const [view, setView] = useState<'applications' | 'billing'>('applications');
    const [submittedMilestones, setSubmittedMilestones] = useState<
        {
            _id: string;
            isCommentSubmitted: boolean;
            name: {
                text: string;
                timeFrame: string | null;
            };
            status: string;
            submittedAt: string;
        }[]
    >([]);
    const [openModal, setOpenModal] = useState(false);
    const [paymentDetails, setPaymentDetails] = useState({
        milestoneId: '',
        applyId: '',
        amount: '',
        paymentDate: null as dayjs.Dayjs | null,
        category: ''
    });

    useEffect(() => {
        const fetchSubmittedMilestones = async () => {
            try {

                const submittedMilestonesData = await Promise.all(
                    filteredApplications.map(async (app) => {
                        const response = await axios.get(`${SERVER_URL}/milestones/submitted/${app._id}`);
                        console.log("Mistlon Fetch With ApplyId", response.data)
                        return response.data;
                    })
                );

                const allSubmittedMilestones = submittedMilestonesData.flat();
                console.log('All Submitted Milestones:', allSubmittedMilestones);
                setSubmittedMilestones(allSubmittedMilestones);
            } catch (error) {
                console.error('Error fetching submitted milestones:', error);
            }
        };

        fetchSubmittedMilestones();
    }, [filteredApplications]);

    const handleToggleChange = (event: React.MouseEvent<HTMLElement>, newView: 'applications' | 'billing') => {
        if (newView !== null) {
            setView(newView);
        }
    };

    const handleOpenModal = () => setOpenModal(true);
    const handleCloseModal = () => setOpenModal(false);

    const handlePaymentDetailsChange = (
        e: React.ChangeEvent<HTMLInputElement> | SelectChangeEvent<string>
    ) => {
        setPaymentDetails({
            ...paymentDetails,
            [e.target.name]: e.target.value
        });
    };

    const handleTextFieldChange = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setPaymentDetails({
            ...paymentDetails,
            [event.target.name]: event.target.value
        });
    };


    const handleDateChange = (newValue: dayjs.Dayjs | null) => {
        setPaymentDetails(prevDetails => ({
            ...prevDetails,
            paymentDate: newValue
        }));
    };

    const handleAddPayment = async () => {
        try {
            const response = await axios.post(APIS.BILLING, {
                milestoneId: paymentDetails.milestoneId,
                applyId: paymentDetails.applyId,
                amount: paymentDetails.amount,
                paymentDate: paymentDetails.paymentDate?.toISOString(),
                category: paymentDetails.category
            });

            console.log('Payment added successfully:', response.data);
            // Optionally, you can reset the form or perform other actions after successful submission
            handleCloseModal();
        } catch (error) {
            console.error('Error adding payment:', error);
        }
    };
    return (
        <Box>
            <Box sx={{ position: 'relative', top: '30px', marginBottom: '20px' }}>
                <Typography variant="h5">Applications for Project</Typography>
                <ToggleButtonGroup
                    value={view}
                    exclusive
                    onChange={handleToggleChange}
                    sx={{ marginTop: 2 }}
                >
                    <ToggleButton value="applications">Applications</ToggleButton>
                    <ToggleButton value="billing">Billing</ToggleButton>
                </ToggleButtonGroup>
            </Box>
            {view === 'applications' ? (
                <Box p={2}>
                    {filteredApplications.length > 0 ? (
                        <Grid container spacing={2}>
                            {filteredApplications.map((app) => (
                                <Grid item xs={12} key={app._id}>
                                    <Box sx={{
                                        border: '1px solid #ddd', borderRadius: '4px', p: 2, '@media (max-width: 767px)': {
                                            position: 'relative',
                                            width: '135%',
                                            right: '18%'
                                        }
                                    }}>
                                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                                            <Box sx={{ display: 'flex', flexDirection: 'row', gap: 2 }}>
                                                <Box sx={{ flex: 1 }}>
                                                    <TextField
                                                        label="Title"
                                                        value={app.title}
                                                        fullWidth
                                                        multiline
                                                        disabled
                                                        sx={{ mb: 1 }}
                                                    />
                                                </Box>
                                                <Box sx={{ flex: 1 }}>
                                                    <TextField
                                                        label="Applied User"
                                                        value={`${app.firstName} ${app.lastName}`}
                                                        fullWidth
                                                        multiline
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
                                                                                    <Typography variant="h6" sx={{ mb: 4, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                                                                        <span>
                                                                                            Milestone {milestoneIndex + 1}
                                                                                            {milestone.submittedAt && (
                                                                                                <Typography component="span" sx={{ ml: 2, color: 'green', }}>
                                                                                                    Submitted Date: ({dayjs(milestone.submittedAt).format('MMMM D, YYYY h:mm A')})
                                                                                                </Typography>
                                                                                            )}
                                                                                        </span>

                                                                                        {milestone.isCommentSubmitted && (
                                                                                            <Chip
                                                                                                label="Milestone submitted"
                                                                                                variant="outlined"
                                                                                                sx={{
                                                                                                    borderColor: 'green',
                                                                                                    color: 'green',
                                                                                                    borderRadius: '16px',
                                                                                                    ml: 2,
                                                                                                }}
                                                                                            />
                                                                                        )}
                                                                                    </Typography>

                                                                                    <TextField
                                                                                        label={`Milestone ${milestoneIndex + 1}`}
                                                                                        value={milestone.name ? milestone.name.text : 'No Name'}
                                                                                        multiline
                                                                                        fullWidth
                                                                                        disabled
                                                                                        sx={{ mb: 2 }}
                                                                                    />

                                                                                    {milestone.isCommentSubmitted ? (
                                                                                        <>
                                                                                            {(userType === 'Project Owner' || userType === 'Innovators' || userType === 'Freelancer' || userType === 'Admin') && (
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
                                                                                        (userType === 'Freelancer') && (
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
                                        </Box>
                                    </Box>
                                </Grid>
                            ))}
                        </Grid>
                    ) : (
                        <Typography>No applications available</Typography>
                    )}
                </Box>
            ) : (
                <Box p={2}>

                    <Button onClick={handleOpenModal} variant="contained">Add Payment</Button>
                </Box>
            )}
            <Modal
                open={openModal}
                onClose={handleCloseModal}
                aria-labelledby="payment-modal-title"
                aria-describedby="payment-modal-description"
            >
                <Box sx={{ width: 400, margin: 'auto', padding: 4, backgroundColor: 'white', marginTop: '20%', borderRadius: 2 }}>
                    <Typography id="payment-modal-title" variant="h6" component="h2" sx={{ mb: 2 }}>
                        Add Payment
                    </Typography>
                    <FormControl fullWidth sx={{ mb: 2 }}>
                        <InputLabel>Submitted Milestone</InputLabel>
                        <Select
                            name="milestoneId"
                            value={paymentDetails.milestoneId}
                            onChange={handlePaymentDetailsChange}
                            label="Submitted Milestone"
                        >
                            {submittedMilestones.map((milestone) => (
                                <MenuItem key={milestone._id} value={milestone._id}>
                                    {milestone.name?.text || 'No Title'} ({milestone.name?.timeFrame ? dayjs(milestone.name.timeFrame).format('MMMM D, YYYY') : 'No Timeframe'})
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>



                    <TextField
                        label="Amount"
                        name="amount"
                        value={paymentDetails.amount}
                        onChange={handleTextFieldChange}
                        fullWidth
                        sx={{ mb: 2 }}
                    />
                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                        <DateTimePicker
                            label="Payment Date"
                            value={paymentDetails.paymentDate}
                            onChange={handleDateChange}
                        />
                    </LocalizationProvider>
                    <FormControl fullWidth sx={{ mb: 2 }}>
                        <InputLabel>Category</InputLabel>
                        <Select
                            name="category"
                            value={paymentDetails.category}
                            onChange={handlePaymentDetailsChange}
                            label="Category"
                        >
                            <MenuItem value="receivedByOwner">Received by Project Owner</MenuItem>
                            <MenuItem value="receivedByInnovator">Received by Innovator/Freelancer</MenuItem>
                        </Select>
                    </FormControl>
                    <Button onClick={handleAddPayment} variant="contained">Submit</Button>
                </Box>
            </Modal>
        </Box>
    );
};

export default ApplicationsForProject;
