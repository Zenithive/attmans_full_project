import React, { useEffect, useState } from 'react';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Typography } from '@mui/material';
import { SERVER_URL } from '@/app/constants/api.constant';
import { useAppSelector } from '@/app/reducers/hooks.redux';
import { UserSchema, selectUserSession } from '@/app/reducers/userReducer';
import axiosInstance from '@/app/services/axios.service';
import { pubsub } from '@/app/services/pubsub.service';
import dayjs from 'dayjs';
import { DATE_FORMAT } from '@/app/constants/common.constants';
import { translationsforProjectCommentCard } from '../../../../public/trancation';

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
    applyType:string;
}

interface BillingDataProps {
    apply: Apply;
}

const BillingData: React.FC<BillingDataProps> = ({ apply }) => {
    const [billingData, setBillingData] = useState<Billing[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const userDetails: UserSchema = useAppSelector(selectUserSession);



  const language = userDetails.language || 'english';
  const t = translationsforProjectCommentCard[language as keyof typeof translationsforProjectCommentCard] || translationsforProjectCommentCard.english;


    useEffect(() => {
        const fetchBillingData = async () => {
            try {
                if (!apply._id) {
                    setError('No apply ID available');
                    return;
                }
                const response = await axiosInstance.get<Billing[]>(`/billing/by-apply/${apply._id}`);
                setBillingData(response.data);
            } catch (error) {
                setError('Error fetching billing data');
                console.error('Error fetching billing data:', error);
            } finally {
                setLoading(false);
            }
        };

        pubsub.subscribe('PaymentAdded', fetchBillingData);

        fetchBillingData();

      
        return () => {
            pubsub.unsubscribe('PaymentAdded', fetchBillingData);
        };
    }, [apply]);

    if (loading) return <Typography align="center">Loading...</Typography>;

    const filteredBillingData = billingData.filter((payment) => {
        if (
            (payment.category === 'received from Project Owner' && (userDetails.userType === 'Project Owner' || userDetails.userType === 'Admin')) ||
            (payment.category === 'Paid to Innovator/Freelancer' && (userDetails.userType === 'Freelancer' || userDetails.userType === 'Admin')) ||
            (payment.category === 'Paid to Innovator/Freelancer' && (userDetails.userType === 'Innovator' || userDetails.userType === 'Admin'))

        ) {
            return true;
        }
        return false;
    });

    return (
        <div>
            {error && <Typography color="error" align="center">{error}</Typography>}
            <TableContainer component={Paper}>
                <Table>
                    <TableHead>
                        <TableRow>
                        {apply.applyType === 'FreelancerApply' && <TableCell>Milestone</TableCell>}
                            <TableCell>Amount</TableCell>
                            <TableCell>Currency</TableCell>
                            <TableCell>Payment Date</TableCell>
                            <TableCell>Category</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {filteredBillingData.length > 0 ? (
                            filteredBillingData.map((payment, index) => (
                                <TableRow key={index}>
                                  {apply.applyType === 'FreelancerApply' && (
                                        <TableCell>{payment.milestoneText}</TableCell>
                                    )}
                                    <TableCell>{payment.amount}</TableCell>
                                    <TableCell>{payment.currency}</TableCell>
                                    <TableCell>  {dayjs(payment.paymentDate).format(DATE_FORMAT)}</TableCell>
                                    <TableCell>{payment.category}</TableCell>
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell colSpan={5}>
                                    {/* <Typography align="center">No payments available</Typography> */}
                                    <Typography align="center">{t.nopaymentavailable}</Typography>
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </TableContainer>
        </div>
    );
};

export default BillingData;
