import { Chip, styled } from "@mui/material";
import { UserSchema } from "../reducers/userReducer";

interface ProjApplies {
    status: string;
    userId: string;
    _id: string;
}

export interface Job {
    _id?: string;
    title: string;
    description: string;
    Budget: number;
    Expertiselevel: string;
    TimeFrame: string | null;
    Category: string[];
    Subcategorys: string[];
    appliesCount?: number;
    jobDetails?: Job;

    // ******** op ******** //
    DetailsOfInnovationChallenge: string;
    Sector: string;
    Quantity: number;
    ProductDescription: string;
    firstName: string,
    lastName: string,
    username: string;
    SelectService: string;
    Objective: string;
    Expectedoutcomes: string;
    IPRownership: string;
    currency: string;
    // Status: string;
    status: string;
    rejectComment?: string;
    applies?: ProjApplies[];
    userId?: any;
}



export interface Apply {
    jobDetails: any;
    _id?: string;
    title: string;
    description: string;
    Budget: number;
    currency: string;
    TimeFrame: string | null;
    rejectComment: string;
    proposalsDetails: any;
    status: string;
    firstName: string;
    lastName: string;
    username: string;
    jobId: string;
    userId?: UserSchema;
    availableSolution: string;
    SolutionUSP: string;
    userDetails: any;
}

export const Expertiselevel = [
    "Beginner",
    "Intermediate",
    "Expert",
    "PhD"
];


export const getSubcategorys = (Subcategorys: any[]) => Subcategorys.flatMap((Subcategory: { items: any; }) => Subcategory.items);


export const CustomChip = styled(Chip)(({ theme }) => ({
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