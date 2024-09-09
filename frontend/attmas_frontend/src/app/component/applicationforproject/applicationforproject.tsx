import React, { useEffect, useState } from 'react';
import { Grid, Box, TextField, Card, CardContent, Typography, Button, CircularProgress, Chip, Divider, InputLabel, MenuItem, ToggleButton, ToggleButtonGroup, FormControl, Modal, Select, SelectChangeEvent, IconButton } from '@mui/material';
import dayjs from 'dayjs';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { APIS, SERVER_URL } from '@/app/constants/api.constant';
import ApproveMilestoneDialog from '../approveformilston/approveformilston';
import RejectMilestoneDialog from '../rejectformilston/rejectformilston';
import BillingData from '../addpaymentshow/addpaymentshow';
import CloseIcon from '@mui/icons-material/Close';
import BillingModal from '../billingmodel/billingmodel';
import { DATE_FORMAT } from '@/app/constants/common.constants';
import axiosInstance from '@/app/services/axios.service';
import { pubsub } from '@/app/services/pubsub.service';
import { Message } from '@mui/icons-material';

export interface Milestone {
    scopeOfWork: string;
    milestones: {
        isCommentSubmitted: boolean;
        name: {
            text: string;
            timeFrame: string | null;
        };
        status: string;
        submittedAt: string;
        adminStatus: 'Pending' | 'Approved' | 'Rejected';
        approvalComments: string[];
        rejectionComments: string[];
        resubmissionComments: string[];
    }[];
    isCommentSubmitted?: boolean;
    status?: string;
    milstonSubmitcomments: string[];
}

interface Billing {
    _id?: string;
    milestoneText: string;
    applyId: string;
    amount: number;
    paymentDate: string;
    category: string;
    currency: string;
    createdAt?: string;
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
}

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

    console.log("filteredApplications", filteredApplications)
    const [view, setView] = useState<'applications' | 'billing'>('applications');
    const [submittedMilestones, setSubmittedMilestones] = useState<Milestone[]>([]);
    const [openModal, setOpenModal] = useState(false);
    const [paymentDetails, setPaymentDetails] = useState({
        milestoneText: '',
        applyId: '',
        amount: '',
        paymentDate: null as dayjs.Dayjs | null,
        category: '',
        currency: 'USD'
    });
    const [approveDialogOpen, setApproveDialogOpen] = useState(false);
    const [rejectDialogOpen, setRejectDialogOpen] = useState(false);
    const [selectedMilestone, setSelectedMilestone] = useState<Milestone | null>(null);
    const [selectedApplyId, setSelectedApplyId] = useState<string | null>(null);
    const [selectedMilestoneIndex, setSelectedMilestoneIndex] = useState<number | null>(null);

    const initialPaymentDetails = {
        milestoneText: '',
        applyId: '',
        amount: '',
        paymentDate: null as dayjs.Dayjs | null,
        category: '',
        currency: 'USD'
    };


    const fetchSubmittedMilestones = async () => {
        try {

            const submittedMilestonesData = await Promise.all(
                filteredApplications.map(async (app) => {
                    const response = await axiosInstance.get(`/milestones/submitted/${app._id}`);
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

    useEffect(() => {
        fetchSubmittedMilestones();
    }, [filteredApplications]);
    

    const handleToggleChange = (event: React.MouseEvent<HTMLElement>, newView: 'applications' | 'billing') => {
        if (newView !== null) {
            setView(newView);
        }
    };
    const handleOpenModal = (applyId: string) => () => {
        setPaymentDetails(prevDetails => ({ ...prevDetails, applyId }));
        setOpenModal(true);
    };

    const handleCloseModal = () => {
        setPaymentDetails(initialPaymentDetails);
        setOpenModal(false);
    };

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
        if (!paymentDetails.applyId) {
            console.error('applyId is required');
            return;
        }


        try {
            const response = await axiosInstance.post(APIS.BILLING, {
                milestoneText: paymentDetails.milestoneText,
                applyId: paymentDetails.applyId,
                amount: paymentDetails.amount,
                currency: paymentDetails.currency,
                paymentDate: paymentDetails.paymentDate?.toISOString(),
                category: paymentDetails.category
            });

            console.log('Payment added successfully:', response.data);
            pubsub.publish('PaymentAdded',{Message:'Payment Done'});
            handleCloseModal();
        } catch (error) {
            console.error('Error adding payment:', error);
        }
    };


    const handleOpenApproveDialog = (milestoneGroup: Milestone, applyId: string, milestoneIndex: number) => {
        const milestone = milestoneGroup.milestones[milestoneIndex];
        setSelectedMilestone(milestoneGroup);
        setSelectedApplyId(applyId);
        setSelectedMilestoneIndex(milestoneIndex);
        setApproveDialogOpen(true);
    };

    const handleOpenRejectDialog = (milestoneGroup: Milestone, applyId: string, milestoneIndex: number) => {
        const milestone = milestoneGroup.milestones[milestoneIndex];
        setSelectedMilestone(milestoneGroup);
        setSelectedApplyId(applyId);
        setSelectedMilestoneIndex(milestoneIndex);
        setRejectDialogOpen(true);
    };


    
    const handleApproveMilestone = async (comment: string) => {
        if (selectedApplyId && selectedMilestoneIndex !== null) {
            try {
                await axiosInstance.post(`/milestones/approve`, {
                    applyId: selectedApplyId,
                    milestoneIndex: selectedMilestoneIndex,
                    comment
                });

                await fetchSubmittedMilestones();
                pubsub.publish('MilestoneRefetch', { applyId: selectedApplyId });
                handleCloseApproveDialog();
            } catch (error) {
                console.error('Error approving milestone:', error);
            }
        }
    };

    const handleRejectMilestone = async (comment: string) => {
        if (selectedApplyId && selectedMilestoneIndex !== null) {
            try {
                await axiosInstance.post(`/milestones/reject`, {
                    applyId: selectedApplyId,
                    milestoneIndex: selectedMilestoneIndex,
                    comment
                });
                await fetchSubmittedMilestones();
                pubsub.publish('MilestoneRefetch', { applyId: selectedApplyId });
                handleCloseRejectDialog();
            } catch (error) {
                console.error('Error rejecting milestone:', error);
            }
        }
    };

    const handleCloseApproveDialog = () => {
        setApproveDialogOpen(false);
        setSelectedMilestone(null);
        setSelectedApplyId(null);
        setSelectedMilestoneIndex(null);
    };

    const handleCloseRejectDialog = () => {
        setRejectDialogOpen(false);
        setSelectedMilestone(null);
        setSelectedApplyId(null);
        setSelectedMilestoneIndex(null);
    };

    const isFormValid = () => {
        return paymentDetails.milestoneText && paymentDetails.amount && paymentDetails.currency && paymentDetails.paymentDate && paymentDetails.category;
    };

    return (
        <Box>
            <Box sx={{ position: 'relative', top: '30px', marginBottom: '20px' }}>
                <Typography variant="h5" sx={{ marginBottom: '15px' }}>Applications for Project</Typography>
                <ToggleButtonGroup
                    value={view}
                    exclusive
                    onChange={handleToggleChange}
                    sx={{ marginTop: 2, marginBottom: '15px', position: 'relative', left: '10px' }}
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
                                                {userType == 'Admin' && <Box sx={{ flex: 1 }}>
                                                    <TextField
                                                        label="Applied User"
                                                        value={`${app.firstName} ${app.lastName}`}
                                                        fullWidth
                                                        multiline
                                                        disabled
                                                        sx={{ mb: 1 }}
                                                    />
                                                </Box>}
                                            </Box>
                                            <Grid container spacing={2}>
                                                <Grid item xs={12}>
                                                    {milestones[app._id!]?.length > 0 ? (
                                                        milestones[app._id!].map((milestoneGroup, groupIndex) => (
                                                            <Grid container spacing={2} key={groupIndex}>
                                                                {milestoneGroup.milestones.length > 0 ? (
                                                                    milestoneGroup.milestones.map((milestone, milestoneIndex) => (
                                                                        (userType === 'Project Owner' ? milestone.adminStatus === 'Approved' : true) && (
                                                                            <Grid item xs={12} key={milestoneIndex}>
                                                                                <Card variant="outlined" sx={{ mb: 1 }}>
                                                                                    <CardContent>
                                                                                        <Typography variant="h6" sx={{ mb: 4, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                                                                            <span>
                                                                                                Milestone {milestoneIndex + 1}
                                                                                                {milestone.submittedAt && (
                                                                                                    <Typography component="span" sx={{ ml: 2, color: 'green', }}>
                                                                                                        Submitted Date: ({dayjs(milestone.submittedAt).format(DATE_FORMAT)})
                                                                                                    </Typography>
                                                                                                )}
                                                                                                <Box sx={{ position: 'relative', top: '5px' }}>
                                                                                                    {milestone.name.timeFrame && (
                                                                                                        <Typography variant="body2" sx={{ color: 'green', }}>
                                                                                                            Deadline Date: ({dayjs(milestone.name.timeFrame).format(DATE_FORMAT)})
                                                                                                        </Typography>
                                                                                                    )}
                                                                                                </Box>
                                                                                            </span>

                                                                                            {milestone.isCommentSubmitted && (
                                                                                                <Chip
                                                                                                    label="Milestone submitted"
                                                                                                    variant="outlined"
                                                                                                    sx={{
                                                                                                        borderColor: 'green',
                                                                                                        color: 'green',
                                                                                                        borderRadius: '16px',
                                                                                                        ml: 40,
                                                                                                    }}
                                                                                                />
                                                                                            )}
                                                                                            <Chip
                                                                                                label={milestone.adminStatus}
                                                                                                variant="outlined"
                                                                                                color={milestone.adminStatus === 'Approved' ? 'success' : milestone.adminStatus === 'Rejected' ? 'error' : 'default'}
                                                                                                sx={{ ml: 2 }}
                                                                                            />

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
                                                                                                    <>
                                                                                                        <TextField
                                                                                                            label="Submitted Milestone"
                                                                                                            value={milestoneGroup.milstonSubmitcomments && milestoneGroup.milstonSubmitcomments[milestoneIndex] ? milestoneGroup.milstonSubmitcomments[milestoneIndex] : 'No comment'}
                                                                                                            multiline
                                                                                                            rows={4}
                                                                                                            fullWidth
                                                                                                            disabled
                                                                                                            sx={{ mb: 2, color: 'blue' }}
                                                                                                        />
                                                                                                        {milestone.resubmissionComments.length > 0 && (
                                                                                                            <TextField
                                                                                                                label="Resubmission Comments"
                                                                                                                value={milestone.resubmissionComments.join('\n')}
                                                                                                                multiline
                                                                                                                rows={4}
                                                                                                                fullWidth
                                                                                                                disabled
                                                                                                                sx={{ mb: 2 }}
                                                                                                            />
                                                                                                        )}


                                                                                                    </>

                                                                                                )}
                                                                                                <>
                                                                                                    {milestone.approvalComments.length > 0 && (
                                                                                                        <TextField
                                                                                                            label="Approval Comments"
                                                                                                            value={milestone.approvalComments.join('\n')}
                                                                                                            multiline
                                                                                                            rows={4}
                                                                                                            fullWidth
                                                                                                            disabled
                                                                                                            sx={{ mb: 2, color: 'success.main' }}
                                                                                                        />
                                                                                                    )}

                                                                                                    {milestone.rejectionComments.length > 0 && (
                                                                                                        <TextField
                                                                                                            label="Rejection Comments"
                                                                                                            value={milestone.rejectionComments.join('\n')}
                                                                                                            multiline
                                                                                                            rows={4}
                                                                                                            fullWidth
                                                                                                            disabled
                                                                                                            sx={{ mb: 2, color: 'error.main' }}
                                                                                                        />
                                                                                                    )}
                                                                                                </>
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
                                                                                        {userType === 'Admin' && milestone.adminStatus === 'Pending' && (
                                                                                            <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                                                                                                {milestone.status === 'Submitted' && (
                                                                                                    <>
                                                                                                        <Button
                                                                                                            variant="contained"
                                                                                                            color="success"
                                                                                                            onClick={() => handleOpenApproveDialog(milestoneGroup, app._id!, milestoneIndex)}
                                                                                                            sx={{ marginRight: '10px' }}
                                                                                                        >
                                                                                                            Approve
                                                                                                        </Button>
                                                                                                        <Button
                                                                                                            variant="contained"
                                                                                                            color="error"
                                                                                                            onClick={() => handleOpenRejectDialog(milestoneGroup, app._id!, milestoneIndex)}
                                                                                                        >
                                                                                                            Reject
                                                                                                        </Button>
                                                                                                    </>
                                                                                                )}
                                                                                            </Box>
                                                                                        )}

                                                                                    </CardContent>
                                                                                </Card>
                                                                            </Grid>
                                                                        ))
                                                                    )) : (
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
                    {filteredApplications.length > 0 ? (
                        <>
                            <Box sx={{ marginBottom: '40px' }}>
                                {filteredApplications.map((app) => (
                                    <BillingData key={app._id} apply={app} />
                                ))}
                            </Box>

                            <Box sx={{ mb: 2 }}>
                                {filteredApplications.map((app) => (
                                    userType === 'Admin' && (
                                        <Button key={app._id} onClick={handleOpenModal(app._id!)} variant="contained">Add Payment</Button>
                                    )
                                ))}
                            </Box>

                        </>
                    ) : (
                        <Typography>No applications available for billing</Typography>
                    )}
                </Box>
            )}

            <BillingModal
                open={openModal}
                onClose={handleCloseModal}
                paymentDetails={paymentDetails}
                submittedMilestones={submittedMilestones}
                onPaymentDetailsChange={handlePaymentDetailsChange}
                onTextFieldChange={handleTextFieldChange}
                onDateChange={handleDateChange}
                onAddPayment={handleAddPayment}
                isSubmitting={isSubmitting}
            />
            <ApproveMilestoneDialog
                open={approveDialogOpen}
                onClose={handleCloseApproveDialog}
                onApprove={handleApproveMilestone}
                milestone={selectedMilestone}
            />
            <RejectMilestoneDialog
                open={rejectDialogOpen}
                onClose={handleCloseRejectDialog}
                onReject={handleRejectMilestone}
                milestone={selectedMilestone}
            />
        </Box>
    );
};

export default ApplicationsForProject;
