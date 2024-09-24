import { CustomChip } from "@/app/projects/projectinterface";
import { Job } from "../projectDrwer/projectDrwer";

export const GetProjectStatusChip = (props: { job: Job }) => {
    let color = "default";
    if (props.job.status === 'Approved') {
        color = 'success';
    } else if (props.job.status === 'Rejected') {
        color = 'error';
    }

    return (
        <CustomChip
            label={props.job.status}
            color={props.job.status === 'Approved' ? 'success' : props.job.status === 'Rejected' ? 'error' : 'default'}
        />
    )
}