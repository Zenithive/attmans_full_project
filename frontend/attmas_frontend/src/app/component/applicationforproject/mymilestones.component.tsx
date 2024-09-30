import React from 'react';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    CircularProgress,
    TextField,
    Typography,
    CardContent,
    Card,
    Grid,
    Box,
    Chip,
    Paper,
} from '@mui/material';
import dayjs from 'dayjs';
import { Apply, Milestone } from './applicationforproject';
import { selectUserSession, UserSchema } from '@/app/reducers/userReducer';
import { useAppSelector } from '@/app/reducers/hooks.redux';
import { DATE_FORMAT } from '@/app/constants/common.constants';


interface MyMilestonesProps {
    milestones: Record<string, Milestone[]>;
    apply: Apply;
    milestoneComments: Record<string, string>;
    commentErrors: Record<string, boolean>;
    handleMilestoneSubmit: (applyId: string, milestoneIndex: number, submitType: 'submit' | 'Resubmit') => void;
    handleCommentChange: (applyId: string, index: number, value: string) => void;
    isSubmitting: boolean;
    handleOpenApproveDialog: CallableFunction;
    handleOpenRejectDialog: CallableFunction;
}

const MyMilestones: React.FC<MyMilestonesProps> = ({
    milestones,
    apply,
    milestoneComments,
    commentErrors,
    handleMilestoneSubmit,
    handleCommentChange,
    isSubmitting,
    handleOpenApproveDialog,
    handleOpenRejectDialog
}) => {

    const { userType }: UserSchema = useAppSelector(selectUserSession);


    return (
        <>
            {milestones[apply._id!]?.length > 0 ? (
                milestones[apply._id!].map((milestoneGroup, groupIndex) => (
                    <Grid container spacing={2} key={groupIndex}>
                        {milestoneGroup.milestones.length > 0 ? (
                            milestoneGroup.milestones.map((milestone, milestoneIndex) => (
                                (userType === 'Project Owner' ? milestone.adminStatus === 'Admin Approved' ||
                                    milestone.adminStatus === 'Project Owner Approved' ||
                                    milestone.adminStatus === 'Project Owner Rejected' : true) && (
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
                                                        color={
                                                            milestone.adminStatus === 'Admin Approved' || milestone.adminStatus === 'Project Owner Approved'
                                                                ? 'success'
                                                                : milestone.adminStatus === 'Admin Rejected' || milestone.adminStatus === 'Project Owner Rejected'
                                                                    ? 'error'
                                                                    : 'default'
                                                        }
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
                                                        {(userType === 'Project Owner' || userType === 'Innovator' || userType === 'Freelancer' || userType === 'Admin') && (
                                                            <>

                                                                <Box
                                                                    sx={{
                                                                        maxHeight: { xs: 200, sm: 300 },
                                                                        overflowY: 'auto',
                                                                        marginTop: 2,
                                                                        marginBottom: 1,
                                                                        paddingRight: 1,
                                                                        '@media (max-width: 767px)': {
                                                                            maxHeight: { xs: 250 }
                                                                        }
                                                                    }}
                                                                >
                                                                    <Paper
                                                                        sx={{
                                                                            padding: { xs: 1, sm: 2 },
                                                                            marginBottom: 1,
                                                                            position: 'relative',
                                                                        }}
                                                                    >
                                                                        <Typography
                                                                            variant="body2"
                                                                            sx={{
                                                                                whiteSpace: 'pre-wrap', fontSize: { xs: '0.875rem', sm: '1rem' }, width: '76%', '@media (max-width: 767px)': {
                                                                                    width: '100%'
                                                                                }
                                                                            }}
                                                                        >
                                                                            {milestoneGroup.milstonSubmitcomments[milestoneIndex]}
                                                                        </Typography>
                                                                        <Typography
                                                                            variant="caption"
                                                                            color="textSecondary"
                                                                            sx={{ fontSize: { xs: '0.75rem', sm: '0.875rem' } }}
                                                                        >
                                                                            {new Date(milestone.submittedAt).toLocaleString()}
                                                                        </Typography>
                                                                        <Box
                                                                            sx={{
                                                                                position: 'absolute',
                                                                                top: { xs: 4, sm: 8 },
                                                                                right: { xs: 4, sm: 8 },
                                                                                textAlign: 'right',
                                                                                '@media (max-width: 767px)': {
                                                                                    textAlign: 'right', width: 'fit-content', float: 'right', position: 'relative', top: '-14px'
                                                                                }
                                                                            }}
                                                                        >
                                                                            <Typography variant="body2">
                                                                                <strong>Freelancer</strong>
                                                                            </Typography>
                                                                            <Typography variant="body2" sx={{ color: 'grey' }}>
                                                                                Submitted Comment
                                                                            </Typography>
                                                                        </Box>
                                                                    </Paper>
                                                                    {milestone.comments.length > 0 ? (
                                                                        milestone.comments.map((comment: any, index: number) => (
                                                                            <Paper
                                                                                key={index}
                                                                                sx={{
                                                                                    padding: { xs: 1, sm: 2 },
                                                                                    marginBottom: 1,
                                                                                    position: 'relative',
                                                                                }}
                                                                            >
                                                                                <Typography
                                                                                    variant="body2"
                                                                                    sx={{
                                                                                        whiteSpace: 'pre-wrap', fontSize: { xs: '0.875rem', sm: '1rem' }, width: '76%', '@media (max-width: 767px)': {
                                                                                            width: '100%'
                                                                                        }
                                                                                    }}
                                                                                >
                                                                                    {comment.comment}
                                                                                </Typography>
                                                                                <Typography
                                                                                    variant="caption"
                                                                                    color="textSecondary"
                                                                                    sx={{ fontSize: { xs: '0.75rem', sm: '0.875rem' } }}
                                                                                >
                                                                                    {new Date(comment.date).toLocaleString()}
                                                                                </Typography>
                                                                                <Box
                                                                                    sx={{
                                                                                        position: 'absolute',
                                                                                        top: { xs: 4, sm: 8 },
                                                                                        right: { xs: 4, sm: 8 },
                                                                                        textAlign: 'right',
                                                                                        '@media (max-width: 767px)': {
                                                                                            textAlign: 'right', width: 'fit-content', float: 'right', position: 'relative', top: '-14px'
                                                                                        }
                                                                                    }}
                                                                                >
                                                                                    <Typography variant="body2">
                                                                                        <strong>{comment.userType}</strong>
                                                                                    </Typography>
                                                                                    <Typography variant="body2" sx={{ color: 'grey' }}>
                                                                                        {comment.commentType}
                                                                                    </Typography>
                                                                                </Box>
                                                                            </Paper>
                                                                        ))
                                                                    ) : (
                                                                        <Typography>No comments yet.</Typography>
                                                                    )}
                                                                </Box>
                                                                {/* {milestone.resubmissionComments.length > 0 && (
                                                                    <TextField
                                                                        label="Resubmission Comments"
                                                                        value={milestone.resubmissionComments.join('\n')}
                                                                        multiline
                                                                        rows={4}
                                                                        fullWidth
                                                                        disabled
                                                                        sx={{ mb: 2 }}
                                                                    />
                                                                )} */}


                                                            </>

                                                        )}
                                                        {/* <>
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
                                                        </> */}
                                                    </>
                                                ) : (
                                                    (userType === 'Freelancer') && (
                                                        <>
                                                            <TextField
                                                                label="Submit Milestone"
                                                                color="secondary"
                                                                multiline
                                                                rows={4}
                                                                value={milestoneComments[`${apply._id}-${milestoneIndex}`] || ''}
                                                                onChange={(e) => handleCommentChange(apply._id!, milestoneIndex, e.target.value)}
                                                                error={commentErrors[`${apply._id}-${milestoneIndex}`]}
                                                                helperText={commentErrors[`${apply._id}-${milestoneIndex}`] ? "Comment is required" : ""}
                                                                fullWidth
                                                                sx={{ mb: 2 }}
                                                            />
                                                            <Button
                                                                onClick={() => handleMilestoneSubmit(apply._id!, milestoneIndex, 'submit')}
                                                                disabled={milestone.isCommentSubmitted || isSubmitting}
                                                                sx={{ marginBottom: '40px' }}
                                                            >
                                                                {isSubmitting ? <CircularProgress size={24} color="inherit" /> : 'Submit Milestone'}
                                                            </Button>
                                                        </>
                                                    )
                                                )}


                                                {/* Admin: Approve Reject buttons for milestone  */}
                                                {userType === 'Admin' && milestone.adminStatus === 'Pending' && (
                                                    <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                                                        {milestone.status === 'Submitted' && (
                                                            <>
                                                                <Button
                                                                    variant="contained"
                                                                    color="success"
                                                                    onClick={() => handleOpenApproveDialog(milestoneGroup, apply._id!, milestoneIndex)}
                                                                    sx={{ marginRight: '10px' }}
                                                                >
                                                                    Approve
                                                                </Button>
                                                                <Button
                                                                    variant="contained"
                                                                    color="error"
                                                                    onClick={() => handleOpenRejectDialog(milestoneGroup, apply._id!, milestoneIndex)}
                                                                >
                                                                    Reject
                                                                </Button>
                                                            </>
                                                        )}

                                                    </Box>
                                                )}

                                                {/* Project Owner: Approve Reject buttons for milestone  */}
                                                {userType === 'Project Owner' && milestone.adminStatus === 'Admin Approved' && (
                                                    <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                                                        <Button
                                                            variant="contained"
                                                            color="success"
                                                            onClick={() => handleOpenApproveDialog(milestoneGroup, apply._id!, milestoneIndex)}
                                                            sx={{ marginRight: '10px' }}
                                                        >
                                                            Approve
                                                        </Button>
                                                        <Button
                                                            variant="contained"
                                                            color="error"
                                                            onClick={() => handleOpenRejectDialog(milestoneGroup, apply._id!, milestoneIndex)}
                                                        >
                                                            Reject
                                                        </Button>
                                                    </Box>
                                                )}


                                                {/* Resubmit milestone for Freelancer */}
                                                {(userType === 'Freelancer' && milestone.adminStatus.toLowerCase().includes('reject')) && (
                                                    <>
                                                        <TextField
                                                            label="Resubmit Milestone"
                                                            color="secondary"
                                                            multiline
                                                            rows={4}
                                                            value={milestoneComments[`${apply._id}-${milestoneIndex}`] || ''}
                                                            onChange={(e) => handleCommentChange(apply._id!, milestoneIndex, e.target.value)}
                                                            error={commentErrors[`${apply._id}-${milestoneIndex}`]}
                                                            helperText={commentErrors[`${apply._id}-${milestoneIndex}`] ? "Comment is required" : ""}
                                                            fullWidth
                                                            sx={{ mb: 2 }}
                                                        />
                                                        <Button
                                                            onClick={() => handleMilestoneSubmit(apply._id!, milestoneIndex, 'Resubmit')}
                                                            disabled={isSubmitting}
                                                            sx={{ marginBottom: '40px' }}
                                                        >
                                                            {isSubmitting ? <CircularProgress size={24} color="inherit" /> : 'Resubmit Milestone'}
                                                        </Button>
                                                    </>
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
        </>
    );
};

export default MyMilestones;
