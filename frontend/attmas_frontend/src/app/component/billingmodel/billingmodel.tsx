// BillingModal.tsx
import React from 'react';
import { Box, Button, CircularProgress, FormControl, IconButton, InputLabel, MenuItem, Select, TextField, Typography } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { Modal } from '@mui/material';
import dayjs from 'dayjs';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { SelectChangeEvent } from '@mui/material/Select';
import { DATE_FORMAT } from '@/app/constants/common.constants';
import { MilestoneCommentType } from '../applicationforproject/applicationforproject';


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
        adminStatus:
        | 'Pending'
        | 'Admin Approved'
        | 'Admin Rejected'
        | 'Project Owner Approved'
        | 'Project Owner Rejected';
        // approvalComments: string[];
        // rejectionComments: string[];
        // resubmissionComments: string[];
        comments: MilestoneCommentType[];
    }[];
    isCommentSubmitted?: boolean;
    status?: string;
    milstonSubmitcomments: string[];
}

interface BillingModalProps {
    open: boolean;
    onClose: () => void;
    paymentDetails: {
        milestoneText: string;
        applyId: string;
        amount: string;
        paymentDate: dayjs.Dayjs | null;
        category: string;
        currency: string;
    };
    submittedMilestones: Milestone[];
    onPaymentDetailsChange: (e: React.ChangeEvent<HTMLInputElement> | SelectChangeEvent<string>) => void;
    onTextFieldChange: (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
    onDateChange: (newValue: dayjs.Dayjs | null) => void;
    onAddPayment: () => void;
    isSubmitting: boolean;
}

const BillingModal: React.FC<BillingModalProps> = ({
    open,
    onClose,
    paymentDetails,
    submittedMilestones,
    onPaymentDetailsChange,
    onTextFieldChange,
    onDateChange,
    onAddPayment,
    isSubmitting
}) => {
    const milestoneLabel = "Approved Milestone";

    const isFormValid = () => {
        return paymentDetails.milestoneText && paymentDetails.amount && paymentDetails.currency && paymentDetails.paymentDate && paymentDetails.category;
    };

    return (
        <Modal
            open={open}
            onClose={onClose}
            aria-labelledby="payment-modal-title"
            aria-describedby="payment-modal-description"
        >
            <Box sx={{ width: 400, margin: 'auto', padding: 4, backgroundColor: 'white', marginTop: '10%', borderRadius: 2 }}>
                <Typography id="payment-modal-title" variant="h6" component="h2" sx={{ mb: 2 }}>
                    Add Payment
                    <IconButton
                        onClick={onClose}
                        sx={{ position: 'relative', float: 'right' }}
                    >
                        <CloseIcon />
                    </IconButton>
                </Typography>
                <FormControl fullWidth sx={{ mb: 2 }}>
                    <InputLabel color="secondary">
                        {milestoneLabel}
                    </InputLabel>
                    <Select
                        label={milestoneLabel}
                        name="milestoneText"
                        color="secondary"
                        value={paymentDetails.milestoneText}
                        onChange={onPaymentDetailsChange}
                        required
                    >
                        {submittedMilestones.map((milestone, index) => (
                            <MenuItem key={index} value={(milestone as any).name.text}>
                                {(milestone as any).name.text}
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>

                <TextField
                    label="Amount"
                    name="amount"
                    color="secondary"
                    value={paymentDetails.amount}
                    onChange={onTextFieldChange}
                    fullWidth
                    required
                    sx={{ mb: 2 }}
                    inputProps={{ type: 'number' }}
                />
                <FormControl fullWidth sx={{ mb: 2 }}>
                    <InputLabel color="secondary">Currency</InputLabel>
                    <Select
                        name="currency"
                        value={paymentDetails.currency}
                        onChange={onPaymentDetailsChange}
                        color="secondary"
                        label="Currency"
                    >
                        <MenuItem value="USD">USD</MenuItem>
                        <MenuItem value="INR">INR</MenuItem>
                    </Select>
                </FormControl>
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <DateTimePicker
                        label="Payment Date"
                        format={DATE_FORMAT}
                        sx={{ marginBottom: '15px' }}
                        value={paymentDetails.paymentDate}
                        onChange={onDateChange}
                        slotProps={{
                            textField: {
                                color: 'secondary',
                            },
                        }}
                    />
                </LocalizationProvider>
                <FormControl fullWidth sx={{ mb: 2 }}>
                    <InputLabel color="secondary">Category</InputLabel>
                    <Select
                        name="category"
                        value={paymentDetails.category}
                        onChange={onPaymentDetailsChange}
                        color="secondary"
                        label="Category"
                        required
                    >
                        <MenuItem value="received from Project Owner">Received from Project Owner</MenuItem>
                        <MenuItem value="Paid to Innovator/Freelancer">Paid to Innovator/Freelancer</MenuItem>
                    </Select>
                </FormControl>
                <Button
                    onClick={onAddPayment}
                    variant="contained"
                    disabled={isSubmitting || !isFormValid()}
                >
                    {isSubmitting ? <CircularProgress size={24} color="inherit" /> : 'Submit'}
                </Button>
            </Box>
        </Modal>
    );
};

export default BillingModal;
