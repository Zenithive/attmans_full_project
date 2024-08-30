export interface Job {
    _id?: string;
    title: string;
    description: string;
    Budget: number;
    Expertiselevel: string;
    TimeFrame: string | null;
    Category: string[];
    Subcategorys: string[];
    DetailsOfInnovationChallenge: string;
    Sector: string;
    Quantity: number;
    ProductDescription: string;
    username: string;
    SelectService: string;
    Objective: string;
    Expectedoutcomes: string;
    IPRownership: string;
    currency: string;
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
    rejectComment: string;
    status: string;
    firstName: string;
    lastName: string;
    username: string;
    jobId: string;
  }


  export interface ProjectDrawerProps {
    viewingJob: Job | null;
    setViewingJob: React.Dispatch<React.SetStateAction<Job | null>>;
    userType: string;
    handleApproveDialogOpen: (job: Job) => void;
    handleRejectDialogOpen: (job: Job) => void;
  }