import { Chip, styled } from "@mui/material";

export interface Job {
    _id?: string;
    title: string;
    description: string;
    Budget: number;
    Expertiselevel: string;
    TimeFrame: string | null;
    Category: string[];
    Subcategorys: string[];

    // ******** op ******** //
    DetailsOfInnovationChallenge: string;
    Sector: string;
    AreaOfProduct: string;
    ProductDescription: string;


    username: string;
    SelectService: string;
    Objective: string;
    Expectedoutcomes: string;
    IPRownership: string;
    currency: string;
    // Status: string;
    status: string;
    rejectComment?: string;
}



export interface Apply {
    _id?: string;
    title: string;
    description: string;
    Budget: number;
    currency: string;
    TimeFrame: string | null;
    jobId: string;
    firstName: string;
    lastName: string;
}

export const Expertiselevel = [
    "Beginner",
    "Intermidiate",
    "Expert",
    "Phd"
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