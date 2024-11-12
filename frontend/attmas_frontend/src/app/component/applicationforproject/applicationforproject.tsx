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
import { useAppSelector } from '@/app/reducers/hooks.redux';
import { UserSchema, selectUserSession } from '@/app/reducers/userReducer';
import MyMilestones from './mymilestones.component';
import { translationsforApplicationsForProject } from '../../../../public/trancation';

export interface MilestoneCommentType {
    comment: string;
    userId: string;
    userType: string;
    commentType: string;
}

export interface childMilestone {
    isCommentSubmitted: boolean;
    name: {
        text: string;
        timeFrame: string | null;
    };
    status: string;
    submittedAt: string;
    adminStatus:
    | 'Pending'
    | 'Admin Approved'
    | 'Admin Rejected'
    | 'Project Owner Approved'
    | 'Project Owner Rejected';
    comments: MilestoneCommentType[];
    // approvalComments: string[];
    // rejectionComments: string[];
    // resubmissionComments: string[];

}
export interface Milestone {
    scopeOfWork: string;
    milestones: childMilestone[];
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
    applyType:string;
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
    applyType: string;
}

interface ApplicationsForProjectProps {
    filteredApplications: Apply[];
    milestones: Record<string, Milestone[]>;
    userType: string;
    milestoneComments: Record<string, string>;
    setMilestoneComments: React.Dispatch<React.SetStateAction<Record<string, string>>>;
    commentErrors: Record<string, boolean>;
    handleMilestoneSubmit: (applyId: string, milestoneIndex: number, submitType: 'submit' | 'Resubmit') => void;
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
    const [submittedMilestones, setSubmittedMilestones] = useState<Milestone[]>([]);
    const userDetails: UserSchema = useAppSelector(selectUserSession);

    const language = userDetails.language || 'english';
const t = translationsforApplicationsForProject[language as keyof typeof translationsforApplicationsForProject] || translationsforApplicationsForProject.english;

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
                    return response.data;
                })
            );

            const allSubmittedMilestones = submittedMilestonesData.flat();
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

            pubsub.publish('PaymentAdded', { Message: 'Payment Done' });
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
                    comment,
                    userId: userDetails._id,
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
                    comment,
                    userId: userDetails._id,
                });

                await fetchSubmittedMilestones();
                pubsub.publish('MilestoneRefetch', { applyId: selectedApplyId });
                handleCloseRejectDialog();
            } catch (error) {
                console.error('Error rejecting milestone:', error);
            }
        }
    };

    // const getChip = (milestone: childMilestone) => {
    //     return (
    //         <Chip
    //             label={
    //                 milestone.adminStatus === 'Admin Approved' || milestone.adminStatus === 'Project Owner Approved'
    //                     ? 'Approved'
    //                     : milestone.adminStatus === 'Admin Rejected' || milestone.adminStatus === 'Project Owner Rejected'
    //                         ? 'Rejected'
    //                         : 'Default'
    //             }
    //             variant="outlined"
    //             color={
    //                 milestone.adminStatus === 'Approved' || milestone.adminStatus === 'Approved'
    //                     ? 'success'
    //                     : milestone.adminStatus === 'Rejected' || milestone.adminStatus === 'Rejected'
    //                         ? 'error'
    //                         : 'default'
    //             }
    //             sx={{ ml: 2 }}
    //         />
    //     )
    // }



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
                <Typography variant="h5" sx={{ marginBottom: '15px' }}>{t.applicationsForProject}</Typography>
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
                                                        label={t.title}
                                                        value={app.title}
                                                        fullWidth
                                                        multiline
                                                        disabled
                                                        sx={{ mb: 1 }}
                                                    />
                                                </Box>
                                                {userType == 'Admin' && <Box sx={{ flex: 1 }}>
                                                    <TextField
                                                        label={t.appliedUser}
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
                                                    <MyMilestones
                                                        milestones={milestones}
                                                        apply={app}
                                                        milestoneComments={milestoneComments}
                                                        commentErrors={commentErrors}
                                                        handleMilestoneSubmit={handleMilestoneSubmit}
                                                        handleCommentChange={handleCommentChange}
                                                        isSubmitting={isSubmitting}
                                                        handleOpenApproveDialog={handleOpenApproveDialog}
                                                        handleOpenRejectDialog={handleOpenRejectDialog} />
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
                applyType={filteredApplications.find(app => app._id === paymentDetails.applyId)?.applyType || ''} 
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
