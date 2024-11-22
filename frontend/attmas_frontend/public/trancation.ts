// const language = userDetails.language || 'english';
// const t = translationsforMyProjectPage[language as keyof typeof translationsforMyProjectPage] || translationsforMyProjectPage.english;






type Translations = {
  title: string;
  description: string;
  gender: string;
  address: string;
  city: string;
  state: string;
  pinCode: string;
  country: string;
  linkedIn: string;
  billingAddress: string;
  saveNext: string;
  profileUpdated: string;
  profileUpdateFailed: string;
  required: string;
  profilePhotoRequired: string;
  language: string;
  updatepersonal: string;
};

export const translations: { [key: string]: Translations } = {
  english: {
    title: 'Personal Details',
    description: 'View and change your personal details here',
    gender: 'Gender',
    address: 'Address',
    language: 'Language',
    city: 'City',
    state: 'State',
    pinCode: 'Pin Code',
    country: 'Country',
    linkedIn: 'LinkedIn Profile',
    billingAddress: 'Billing Address',
    saveNext: 'Save & Next',
    profileUpdated: 'Profile updated successfully!',
    profileUpdateFailed: 'Failed to update profile. Please try again.',
    required: 'Required',
    profilePhotoRequired: 'Profile photo is required',
    updatepersonal: 'Update Personal Details',
  },
  gujarati: {
    title: 'વ્યક્તિગત વિગતો',
    description: 'અહીં તમારી વ્યક્તિગત વિગતો જુઓ અને બદલો',
    gender: 'લિંગ',
    address: 'સરનામું',
    language: 'ભાષા',
    city: 'શહેર',
    state: 'રાજ્ય',
    pinCode: 'પિન કોડ',
    country: 'દેશ',
    linkedIn: 'LinkedIn પ્રોફાઇલ',
    billingAddress: 'બિલિંગ સરનામું',
    saveNext: 'સાચવો અને આગળ વધો',
    profileUpdated: 'પ્રોફાઇલ સફળતાપૂર્વક સુધારવામાં આવી!',
    profileUpdateFailed: 'પ્રોફાઇલ સુધારવામાં નિષ્ફળ. કૃપા કરીને ફરી પ્રયાસ કરો.',
    required: 'જરૂરી',
    profilePhotoRequired: 'પ્રોફાઇલ ફોટો જરૂરી છે',
    updatepersonal: 'વ્યક્તિગત વિગતો અપડેટ કરો',

  },
};




export const translationsforProjectPage = {
  english: {

    projects: 'Projects',
    nomoreproject: 'No more Projects',
    viewproject: 'View Project',
  },
  gujarati: {

    projects: 'પ્રોજેક્ટ્સ',
    nomoreproject: 'કોઈ વધુ પ્રોજેક્ટ્સ નથી',
    viewproject: 'પ્રોજેક્ટ જુઓ',
  },
};





export const translationsforMyProjectPage = {
  english: {


    projectOwnersName:'Project Owner Name:',
    freelancerName:'Freelancer Name:',
    viewproposal:'View Proposal',
    viewproject:'View Project',
    approve:'View Project',
    reject:'View Project',
    viewexhibition: 'View Exhibition',
    myproject: 'My Projects',
    nomoreproject: 'No more Projects',
    allproposal: 'All Proposals',
    exhibition: 'Exhibitions',
    nomoreexhibitions: 'No more Exhibitions',
    projectOwners: 'Project Owners',
    NomoreProjectOwners: 'No more Project Owners',
    Freelancers: 'Freelancers',
    Nomorefreelancers: 'No more freelancers',
    Innovators: 'Innovators',
    Nomoreinnovators: 'No more innovators',
    MyProjectsProposals: 'My Projects Proposals',
    Noprojectsavailable: 'No projects available'

  },
  gujarati: {


    projectOwnersName:'પ્રોજેક્ટ માલિકનું નામ:',
    freelancerName:'ફ્રીલાન્સર નામ:',
    viewproposal:'દરખાસ્ત જુઓ',
    viewproject:'પ્રોજેક્ટ જુઓ',
    approve:'પ્રોજેક્ટ જુઓ',
    reject:'પ્રોજેક્ટ જુઓ',

    viewexhibition: 'પ્રદર્શન જુઓ',
    myproject: 'મારા પ્રોજેક્ટ્સ',
    nomoreproject: 'કોઈ વધુ પ્રોજેક્ટ્સ નથી',
    allproposal: 'તમામ દરખાસ્તો',
    exhibition: 'પ્રદર્શનો',
    nomoreexhibitions: 'કોઈ વધુ પ્રદર્શનો નથી',
    projectOwners: 'પ્રોજેક્ટ માલિકો',
    NomoreProjectOwners: 'વધુ પ્રોજેક્ટ માલિકો નથી',
    Freelancers: 'ફ્રીલાન્સર્સ',
    Nomorefreelancers: 'કોઈ વધુ ફ્રીલાન્સર્સ નથી',
    Innovators: 'ઈનોવેટર્સ',
    Nomoreinnovators: 'કોઈ વધુ ઈનોવેટર્સ નથી',
    MyProjectsProposals: 'મારા પ્રોજેક્ટ્સ દરખાસ્તો',
    Noprojectsavailable: 'કોઈ પ્રોજેક્ટ ઉપલબ્ધ નથી'


  },
};




export const translationsforDetails = {
  english: {
    projects: 'Projects',
    nomoreproject: 'No more Projects',
    detailedInformation: 'Detailed Information',
    userName: 'User Name',
    email: 'Email',
    mobileNumber: 'Mobile Number',
    userType: 'User Type',
    sector: 'Sector',
    organization: 'Organization',
    preferredCategory: 'Preferred Category',
    subjectMatterExpertise: 'Subject Matter Expertise',
    headline: 'Headline',
    productToMarket: 'Product to Market',
    hasPatent: 'Do you have a patent?',
    patentDetails: 'Patent Details',

    researchProductDetails: 'Provide details about the research product or solution that you intend to commercialize',
    producttomarket1: 'Product to Market',
    doyouhavepatent: 'Do you have a patent?',
  },
  gujarati: {
    projects: 'પ્રોજેક્ટ્સ',
    nomoreproject: 'કોઈ વધુ પ્રોજેક્ટ્સ નથી',
    detailedInformation: 'વિગતવાર માહિતી',
    userName: 'વપરાશકર્તાનું નામ',
    email: 'ઇમેઇલ',
    mobileNumber: 'મોબાઇલ નંબર',
    userType: 'વપરાશકર્તા પ્રકાર',
    sector: 'સેક્ટર',
    organization: 'સંસ્થા',
    preferredCategory: 'પ્રાધાન્ય શ્રેણી',
    subjectMatterExpertise: 'વિષય નિષ્ણાત',
    headline: 'હેડલાઇન',
    productToMarket: 'માર્કેટ માટે ઉત્પાદન',
    hasPatent: 'શું તમારા પાસે પેટન્ટ છે?',
    patentDetails: 'પેટન્ટની વિગતો',
    researchProductDetails: 'તમે જે સંશોધન ઉત્પાદન અથવા ઉકેલને વ્યાપારીકરણ કરવા ઈચ્છો છો તેની વિગતો પૂરી પાડો',
    producttomarket1: 'પ્રોડક્ટ ટૂ માર્કેટ',
    doyouhavepatent: 'શું તમારી પાસે પેટન્ટ છે?'
  },
};






export const translationsforProjectDrawer = {
  english: {

    viewDetails: 'View Details',
    appliedUser: 'Applied User:',
    noapplicationsfound: 'No application found',
    ProjectDetailsInformation: 'Project Details Information',
    projectOwner: 'Project Owner',
    title: 'Title',
    selectService: 'Select Service',
    createdDate: 'Created Date',
    timeframe: 'Timeframe',
    description: 'Description',
    expertiseLevel: 'Expertise Level',
    detailsOfInnovationChallenge: 'Details Of Innovation Challenge',
    sector: 'Sector',
    quantity: 'Quantity',
    productDescription: 'Product Description',
    budget: 'Budget',
    preferredCategory: 'Preferred Category',
    subjectMatterExpertise: 'Subject Matter Expertise',
    objective: 'Objective',
    expectedOutcomes: 'Expected Outcomes',
    iprOwnership: 'IPR Ownership',
    applicationsForProject: 'Applications for Project'
  },
  gujarati: {

    viewDetails: 'વિગતો જુઓ',

    appliedUser: 'અરજી કરનાર વપરાશકર્તા:',

    noapplicationsfound: 'કોઈ એપ્લિકેશન મળી નથી.',
    ProjectDetailsInformation: 'પ્રોજેક્ટ વિગતો માહિતી ',
    projectOwner: 'પ્રોજેક્ટ માલિક',
    title: 'શીર્ષક',
    selectService: 'સેવા પસંદ કરો',
    createdDate: 'બનાવાની તારીખ',
    timeframe: 'સમયશ્રેણી',
    description: 'વર્ણન',
    expertiseLevel: 'નિપુણતા સ્તર',
    detailsOfInnovationChallenge: 'નાવિનલ્ય પડકારના વિગત',
    sector: 'સેક્ટર',
    quantity: 'જથ્થો',
    productDescription: 'ઉત્પાદન વર્ણન',
    budget: 'બજેટ',
    preferredCategory: 'પ્રિય શ્રેણી',
    subjectMatterExpertise: 'વિષય નિષ્ણાત',
    objective: 'ઉદ્દેશ',
    expectedOutcomes: 'આશાવાદી પરિણામો',
    iprOwnership: 'આઈપીઆર માલિકી',
    applicationsForProject: 'પ્રોજેક્ટ માટે અરજીઓ'
  },
};




export const translationsforProjectDetailsInformation = {
  english: {
    projectDetailsInformation: 'Project Details Information',
    title: 'Title',
    budget: 'Budget',
    ownerName: 'Owner Name',
    viewDetailsOfProject: 'View Details of Project'
  },
  gujarati: {
    projectDetailsInformation: 'પ્રોજેક્ટ વિગતો માહિતી',
    title: 'શીર્ષક',
    budget: 'બજેટ',
    ownerName: 'માલિકનું નામ',
    viewDetailsOfProject: 'પ્રોજેક્ટની વિગતો જુઓ'
  },
};
export const translationsforProjectCommentCard = {
  english: {
    projectDetailsInformation: 'Project Details Information',
    comments: 'Comments',
    nocommentsyet: 'No comments yet.',
    ownerName: 'Owner Name',
    viewDetailsOfProject: 'View Details of Project',
    addacomment:'Add a comment',
    commentneedtofill: 'Comment needs to be Filled',
    SubmitComment : 'Submit Comment',
    Submitting :'Submitting',
    nopaymentavailable:'No payments available',
    paymentDate:'Payment Date',
    addpayment:'Add Payment',
    approvedmilestone:'Approved Milestone',
    currency:'Currency',
    ammount: 'Amount',
    // paymentDate: '',
    category: 'Category',
    submit: 'Submit',
  



  },
  gujarati: {
    projectDetailsInformation: 'પ્રોજેક્ટ વિગતો માહિતી',
    comments: 'ટિપ્પણીઓ',
    nocommentsyet: 'હજુ સુધી કોઈ ટિપ્પણીઓ નથી.',
    ownerName: 'માલિકનું નામ',
    viewDetailsOfProject: 'પ્રોજેક્ટની વિગતો જુઓ',
    addacomment:'ટિપ્પણી ઉમેરો',
    commentneedtofill: 'ટિપ્પણી ભરવાની જરૂર છે',
    SubmitComment : 'ટિપ્પણી સબમિટ કરો',
    Submitting :'સબમિટટીન્ગ',
    nopaymentavailable:'નો પેમેન્ટ્સ અવાઇલાબલે',
    paymentDate:'ચુકવણીની તારીખ',
    addpayment:'ચુકવણી ઉમેરો',
    approvedmilestone:'મંજૂર માઇલસ્ટોન્સ',
    currency:'કરરએનસી',
    ammount: 'રકમ',
    category: 'શ્રેણી',
    submit: 'સબમિટ',






    

  },
};







export const translationsforApplicationsForProject = {
  english: {
    applicationsForProject: 'Applications for Project',
    title: 'Title',
    appliedUser: 'Applied User',
    addpayment:'Add Payment'
  },
  gujarati: {
    applicationsForProject: 'પ્રોજેક્ટ માટેની અરજી',
    title: 'શીર્ષક',
    appliedUser: 'અરજી કરનાર વપરાશકર્તા',
    addpayment:'ચુકવણી ઉમેરો'

  },
};




export const translationsforViewExhibition = {
  english: {
    exhibition: 'Exhibition',
    boothDetails: 'Booth Details',
    viewDetails:'View Details',
    noboothtodisplay:'No booths to display'
  },
  gujarati: {
    exhibition: 'પ્રદર્શન',
    boothDetails: 'બૂથ વિગતો',
    viewDetails:'વિગતો જુઓ',
    noboothtodisplay:'પ્રદર્શિત કરવા માટે કોઈ બૂથ નથી'

  },
};



export const translationsforSidebar = {
  english: {
    dashboard: 'Dashboard',
    innovators: 'Innovators',
    freelancers: 'Freelancers',
    projectOwner: 'Project Owner',
    projects: 'Projects',
    myProjects: 'My Project',
    proposal: 'Proposal',
    exhibition: 'Exhibition'
  },
  gujarati: {
    dashboard: 'ડેશબોર્ડ',
    innovators: 'ઈનોવેટર્સ',
    freelancers: 'ફ્રીલાન્સર્સ',
    projectOwner: 'પ્રોજેક્ટ માલિક',
    projects: 'પ્રોજેક્ટ્સ',
    myProjects: 'મારા પ્રોજેક્ટ્સ',
    proposal: 'દરખાસ્ત',
    exhibition: 'પ્રદર્શન'
  },
};




export const translationsforNotification = {
  english: {
    notifications: 'Notifications',
    unread: 'Unread',
    read: 'Read',
    profile: 'Profile',
    logout: 'Logout',
    Nonewnotifications: 'No new notifications.',
    commentneedtofill: 'Comment needs to be Filled'
  },
  gujarati: {
    notifications: 'સૂચનાઓ',
    unread: 'Unread',
    read: 'વાંચો',
    profile: 'પ્રોફાઇલ',
    logout: 'લોગઆઉટ',
    Nonewnotifications: 'કોઈ નવી સૂચનાઓ નથી.',
    commentneedtofill: 'ટિપ્પણી ભરવાની જરૂર છે'


  },
};


export const translationsforInnovatorApply = {
  english: {
    titleRequired: 'Title is required',
    descriptionRequired: 'Description is required',
    budgetRequired: 'Budget is required',
    currencyRequired: 'Currency is required',
    timeFrameRequired: 'Date & Time is required',
    productsRequired: 'Only one product is acceptable',

    apply: 'Apply',
    cancel: 'Cancel',
    title: 'Title',
    budget: 'Budget',
    currency: 'Currency',
    description: 'Description',
    timeFrame: 'Time Frame',
    qualification: 'Qualification',
    organization: 'Organization',
    sector: 'Sector',
    workAddress: 'Work Address',
    designation: 'Designation',
    doYouHavePatent: 'Do you have a patent?',
    patentDetails: 'Patent Details',
    noProducts: 'No products available',
    categories: 'Categories',
    subjectMatterExpertise: 'Subject Matter Expertise',
    workaddress: 'Work Address',
    noproductavailabe: 'No products available',
    doyouhaveapatient: 'Do you have a patent?',
    patientdetails: 'Patent Details',
    categoriess: 'Categories',
    subjectmatterexpertisess: 'Subject Matter Expertise'

  },
  gujarati: {
    titleRequired: 'શીર્ષક જરૂરી છે',
    descriptionRequired: 'વર્ણન જરૂરી છે',
    budgetRequired: 'બજેટ જરૂરી છે',
    currencyRequired: 'ચલણ જરૂરી છે',
    timeFrameRequired: 'તારીખ અને સમય જરૂરી છે',
    productsRequired: 'માત્ર એક જ ઉત્પાદન સ્વીકાર્ય છે',

    apply: 'અરજી કરો',
    cancel: 'રદ કરો',
    title: 'શીર્ષક',
    budget: 'બજેટ',
    currency: 'ચલણ',
    description: 'વર્ણન',
    timeFrame: 'સમયચક્ર',
    qualification: 'લાયકાત',
    organization: 'સંસ્થા',
    sector: 'સેક્ટર',
    workAddress: 'કામનું સરનામું',
    designation: 'હોદ્દો',
    doYouHavePatent: 'શું તમારું પેટન્ટ છે?',
    patentDetails: 'પેટન્ટ વિગતો',
    noProducts: 'કોઈ ઉત્પાદનો ઉપલબ્ધ નથી',
    categories: 'શ્રેણીઓ',
    subjectMatterExpertise: 'વિષય વિશેષજ્ઞતા',
    workaddress: 'કામનું સરનામું',
    noproductavailabe: 'કોઈ ઉત્પાદનો ઉપલબ્ધ નથી',
    doyouhaveapatient: 'શું તમારી પાસે પેટન્ટ છે?',
    patientdetails: 'પેટન્ટ વિગતો',
    categoriess: 'શ્રેણીઓ',
    subjectmatterexpertisess: 'વિષયની નિપુણતા'


  },
};



export const translationsforNewProductTable = {
  english: {
    productName: 'Product Name',
    price: 'Price',
    quantity: 'Quantity',
    stageOfDevelopment: 'Stage of Development',
    video: 'Video',
    actions: 'Actions'
  },
  gujarati: {
    productName: 'પ્રોડક્ટનું નામ',
    price: 'કીમત',
    quantity: 'જથ્થો',
    stageOfDevelopment: 'વિકાસનો ચરણ',
    video: 'વિડિયો',
    actions: 'ક્રિયાઓ'
  },
};


export const translationsforProject = {
  english: {
    titleRequired: "Title is required",
    descriptionRequired: "Description is required",
    objectiveRequired: "Objective is required",
    iprOwnershipRequired: "IPR ownership is required",
    expectedOutcomesRequired: "Expected outcomes are required",
    budgetRequired: "Budget is required",
    timeFrameRequired: "Date & Time are required",
    currencyRequired: "Currency is required",
    title: 'Title',
    description: 'Description',
    detailsOfInnovationChallenge: 'Details of Innovation Challenge',
    sector: 'Sector',
    quantity: 'Quantity',
    productDescription: 'Product Description',
    expertiseLevel: 'Expertise Level',
    budget: 'Budget',
    preferredCategory: 'Preferred Category',
    objective: 'Objective',
    expectedOutcomes: 'Expected outcomes',
    iprOwnership: 'IPR ownership',
    timeFrame: 'Time Frame',
    cancel: 'Cancel',
    edit: 'Edit',
    create: 'Create',
    selectservice:'Select Service',
    cancelButton: 'Cancel',

  },
  gujarati: {
    titleRequired: "શીર્ષક જરૂરી છે",
    descriptionRequired: "વર્ણન જરૂરી છે",
    objectiveRequired: "ઉદ્દેશ્ય જરૂરી છે",
    iprOwnershipRequired: "IPR માલિકી જરૂરી છે",
    expectedOutcomesRequired: "અંદાજિત પરિણામો જરૂરી છે",
    budgetRequired: "બજેટ જરૂરી છે",
    timeFrameRequired: "તારીખ અને સમય જરૂરી છે",
    currencyRequired: "કરન્સી જરૂરી છે",
    title: 'શીર્ષક',
    description: 'વર્ણન',
    detailsOfInnovationChallenge: 'નવીનીકરણ પડકારનો વિસતૃત વિસેીષ',
    sector: 'વિભાગ',
    quantity: 'જથ્થો',
    productDescription: 'ઉત્પાદન વર્ણન',
    expertiseLevel: 'વિશેષજ્ઞતા સ્તર',
    budget: 'બજેટ',
    preferredCategory: 'પસંદગીની શ્રેણી',
    objective: 'ઉદ્દેશ્ય',
    expectedOutcomes: 'પ્રતિક્ષિત પરિણામો',
    iprOwnership: 'IPR માલિકી',
    timeFrame: 'સમય સીમા',
    cancel: 'રદ કરો',
    edit: 'સંપાદિત કરો',
    create: 'બનાવો',
    selectservice:'સેવા પસંદ કરો',
    cancelButton: 'રદ કરો',


  },
};



export const translationsforAddProductModal2 = {
  english: {
    viewProductDetails: 'View Product Details',
    editProductDetails: 'Edit Product Details',
    addProductDetails: 'Add Product Details',
    productName: 'Product Name',
    productDescription: 'Product Description',
    howDoesSolutionWork: 'How Does the Solution Work?',
    productQuantity: 'Product Quantity',
    videoURL: 'Video URL',
    productPrice: 'Product Price',
    currency: 'Currency',
    stageOfDevelopment: 'Stage of Development',
    intellectualPropertyConsiderations: 'Intellectual Property Considerations',
    targetAudience: 'Target Audience',
    technologyUsed: 'Technology Used',
    problemAddressed: 'Problem Addressed',
    competitiveAdvantages: 'Competitive Advantages',
    feasibilityOfSolution: 'Feasibility of the Solution',
    potentialBenefits: 'Potential Benefits',
    challengesOrRisks: 'Challenges or Risks',
    save: 'Save',
    close: 'Close'
  },
  gujarati: {
    viewProductDetails: 'પ્રોડક્ટ વિગતો જુઓ',
    editProductDetails: 'પ્રોડક્ટ વિગતો સંપાદિત કરો',
    addProductDetails: 'પ્રોડક્ટ વિગતો ઉમેરો',
    productName: 'પ્રોડક્ટનું નામ',
    productDescription: 'પ્રોડક્ટનું વર્ણન',
    howDoesSolutionWork: 'સોલ્યુશન કેવી રીતે કાર્ય કરે છે?',
    productQuantity: 'પ્રોડક્ટની માત્રા',
    videoURL: 'વિડિયો URL',
    productPrice: 'પ્રોડક્ટ કિંમત',
    currency: 'કરન્સી',
    stageOfDevelopment: 'વિકાસનું સ્તર',
    intellectualPropertyConsiderations: 'બૌદ્ધિક મકાનના પરિપ્રેક્ષ્ય',
    targetAudience: 'લક્ષ્ય પ્રેક્ષક',
    technologyUsed: 'ટેક્નોલોજી વાપરી',
    problemAddressed: 'સમસ્યા ઉકેલાયેલી',
    competitiveAdvantages: 'પ્રતિસ્પર્ધી લાભો',
    feasibilityOfSolution: 'ઉકેલની સંભાવના',
    potentialBenefits: 'સમભાવિત લાભો',
    challengesOrRisks: 'ચૂણાઉતિઓ અથવા ખતરા',
    save: 'સેવ',
    close: 'બંધ કરો'
  },
};



export const translationsforCreateExhibition = {
  english: {

    titleRequired: 'Title is required',
    descriptionRequired: 'Description is required',
    videoUrlRequired: 'Video URL is required',
    meetingUrlRequired: 'Meeting URL is required',
    dateTimeRequired: 'Date is required',
    exhbTimeRequired: 'Time is required',
    createExhibition: 'Create Exhibition',
    editExhibition: 'Edit Exhibition',
    title: 'Title',
    description: 'Description',
    videoUrl: 'Video Url',
    meetingUrl: 'Meeting Url',
    preferredIndustries: 'Preferred Industries',
    status: 'Status',
  },
  gujarati: {
    titleRequired: 'શીર્ષક જરૂરી છે',
    descriptionRequired: 'વર્ણન જરૂરી છે',
    videoUrlRequired: 'વિડિયો URL જરૂરી છે',
    meetingUrlRequired: 'મીટિંગ URL જરૂરી છે',
    dateTimeRequired: 'તારીખ જરૂરી છે',
    exhbTimeRequired: 'સમય જરૂરી છે',
    createExhibition: 'પ્રદર્શન બનાવો',
    editExhibition: 'પ્રદર્શન સંપાદિત કરો',
    title: 'શીર્ષક',
    description: 'વર્ણન',
    videoUrl: 'વિડિયો URL',
    meetingUrl: 'મિટિંગ URL',
    preferredIndustries: 'આગંતુક ઉદ્યોગો',
    status: 'સ્થિતિ',
  },
};




export const translationsforProposal = {
  english: {

    ManpowerDetails:'Manpower Details Table',

    submitProposal: 'Submit Proposal',
    industryProblemAim: 'Industry problem, aim and brief project summary',
    impactProductOutput: 'Impact/Product output envisaged with potential benefits',
    natureOfProject: 'Nature of Project solving the Industry problem partially or fully:',
    rdEngineering: 'Research, Development & Engineering (R,D & E) leading to production capability',
    rdDDesignDevelopment: 'Application oriented Research, Design and Development (R,D&D) having production potential',
    basicRandD: 'Basic R&D addressing the Industry problem but needs efforts to take it to applied research or production capability',
    technologyMeetsRequirement: 'Do you already have a technology that meets the requirement of the industry problem statement shared? If yes, can you elaborate?',
    technologyDetails: 'If yes, please elaborate the details of the technology and how you would like to undertake the technology transfer or manufacture for the industry partner.',
    patentAgreement: 'Are you fine if the Patent is as follows:',
    patentIndustryMember: 'Patent is only with the Industry member',
    jointPatent: 'Joint patent with Industry member',
    publicPatent: 'Public patent which means anyone can use the technology for larger good',
    objectiveOfProject: 'Objective of the Project',
    projectOutline: 'Brief outline of the project with specific technology fall-outs',
    definedNiche: 'Is there a defined niche for this project? Is there a defined marketable advantage over what is currently on the market?',
    peerReviewed: 'Is this proposal peer reviewed?',
    expectedOutcomePhysical: 'Expected Outcome in Physical Terms',
    methodologyDuration: 'Detailed Methodology and Duration of Project',
    yearwiseBreakup: 'Year-wise Break-up of Physical Achievements',
    budgetOutlay: 'Budget Outlay',
    addRow: 'Add Row',
    pastCredentials: 'Past Credentials in Similar Projects',
    profileCVRoles: 'Brief Profile/CV with Roles of Project Team',
    proposalOwnerCredentials: 'Credentials of Proposal Owner (e.g., patents, tech transfers)',
    previous: 'Previous',
    next: 'Next',
    otherCommitments: 'Other Commitments of the Proposal Owner and Time Share on the Project',
    progressReport: 'Progress Report Template and Periodicity',
    milestones: 'Milestones',
    totalDaysR: 'Expected Total Number of Days for R&D Project Completion',
    strengthsLab: 'Strengths of the Lab, Equipment, and Infrastructure (Equipment Number/ID)',
    externalEquipment: 'External Equipment Needed from Other Institutes or National Facilities',
    pilotProductionTesting: 'Pilot Production and Testing - Facilities Available or Support Needed',
    mentoringRequired: 'Specific Mentoring by Industry Partner Required?',
    statementOfAgreement: 'STATEMENT OF AGREEMENT',
    declaration: 'By checking the checkbox, I declare that, to the best of my knowledge, the information provided in this form is correct. I understand that if any false information is provided, it may result in the disqualification of the proposal.',
  },
  gujarati: {

    ManpowerDetails:'માનવશક્તિ વિગતો કોષ્ટક',


    submitProposal: 'પ્રસ્તાવ સબમિટ કરો',
    industryProblemAim: 'ઉદ્યોગ સમસ્યા, હેતુ અને સંક્ષિપ્ત પ્રોજેક્ટ સંક્ષેપ',
    impactProductOutput: 'પ્રભાવ/ઉત્પાદન આઉટપુટ જેના સાથે સંભવિત ફાયદા',
    natureOfProject: 'ઉદ્યોગની સમસ્યાને આંશિક રીતે અથવા સંપૂર્ણ રીતે હલ કરવાના પ્રોજેક્ટની પ્રકૃતિ:',
    rdEngineering: 'અનુશંધાન, વિકાસ અને એન્જીનીયરીંગ (R,D & E) જે ઉત્પાદન ક્ષમતા તરફ જાય છે',
    rdDDesignDevelopment: 'અરજીની સંકેતાનુસાર સંશોધન, ડિઝાઇન અને વિકાસ (R,D&D) જે ઉત્પાદન ક્ષમતા ધરાવતી છે',
    basicRandD: 'ઉદ્યોગ સમસ્યાને સંલગ્ન કરવા માટેના મૌલિક સંશોધન પરંતુ તેને લાગુ સંશોધન અથવા ઉત્પાદન ક્ષમતા તરફ લઇ જવાની જરૂર છે',
    technologyMeetsRequirement: 'શું તમારી પાસે તે ટેકનોલોજી છે જે ઉદ્યોગ સમસ્યા નિવેદનની આવશ્યકતાઓને પૂર્ણ કરે છે? જો હા, તો કૃપા કરીને વિગતવાર આપો?',
    technologyDetails: 'જો હા, તો કૃપા કરીને ટેકનોલોજીની વિગતો આપો અને તમે ઉદ્યોગ પાર્ટનર માટે ટેકનોલોજી ટ્રાન્સફર કે ઉત્પાદન માટે કેવી રીતે આગળ વધશો તે સમજાવશો.',
    patentAgreement: 'શું તમને નીચે મુજબ પેટન્ટ પર સંમતિ છે?',
    patentIndustryMember: 'પેટન્ટ માત્ર ઉદ્યોગ સભ્ય સાથે છે',
    jointPatent: 'ઉદ્યોગ સભ્ય સાથે સંયુક્ત પેટન્ટ',
    publicPatent: 'જાહેર પેટન્ટ, જેનો અર્થ એ છે કે કોઈપણ વ્યક્તિ ટેકનોલોજીનો ઉપયોગ મોટા લાભ માટે કરી શકે છે',
    objectiveOfProject: 'પ્રોજેક્ટનો હેતુ',
    projectOutline: 'પ્રોજેક્ટનું સંક્ષિપ્ત દ્રષ્ટિ આપો અને ખાસ ટેકનોલોજી ફોલઆઉટ',
    definedNiche: 'શું આ પ્રોજેક્ટ માટે નિર્ધારિત નેચ છે? શું આજના બજારમાં શું છે તે ઉપર માર્કેટિંગ ફાયદો છે?',
    peerReviewed: 'શું આ પ્રસ્તાવ પીયર રિવ્યુ થયેલો છે?',
    expectedOutcomePhysical: 'ભૌતિક દ્રષ્ટિએ અપેક્ષિત પરિણામ',
    methodologyDuration: 'પ્રોજેક્ટની વિધિ અને અવધિ',
    yearwiseBreakup: 'પ્રતિ વર્ષે ભૌતિક સિદ્ધિઓનો વિભાજન',
    budgetOutlay: 'બજેટ ની રકમ',
    addRow: 'પંક્તિ ઉમેરો',
    pastCredentials: 'સમાન પ્રોજેક્ટ્સમાં ભૂતકાળની પ્રણાલીઓ',
    profileCVRoles: 'પ્રોજેક્ટ ટીમના ભૂમિકા સાથે સંક્ષિપ્ત પ્રોફાઈલ / CV',
    proposalOwnerCredentials: 'પ્રસ્તાવ માલિકના પ્રમાણપત્રો (જેમ કે પેટન્ટ, ટેક ટ્રાન્સફર)',
    previous: 'અગાઉ',
    next: 'આગળ',
    otherCommitments: 'પ્રસ્તાવ માલિક અને પ્રોજેક્ટ પર સમય શેરીના અન્ય બાંધકામ',
    progressReport: 'પ્રગતિ રિપોર્ટ અને સમયસુચિ',
    milestones: 'માઈલસ્ટોન',
    totalDaysR: 'R&D પ્રોજેક્ટ પૂર્ણ કરવા માટેની કુલ દિવસોની અપેક્ષા',
    strengthsLab: 'લેબ, સાધનો અને ઇન્ફ્રાસ્ટ્રક્ચરની મજબૂતી (સાધનો નંબર / આઈડી)',
    externalEquipment: 'બીજી સંસ્થાઓ અથવા રાષ્ટ્રીય સુવિધાઓમાંથી જરૂરી બાહ્ય સાધનો',
    pilotProductionTesting: 'પાઇલટ ઉત્પાદન અને પરીક્ષણ - સુવિધાઓ ઉપલબ્ધ છે કે મદદની જરૂર છે',
    mentoringRequired: 'ઉદ્યોગ પાર્ટનર દ્વારા વિશિષ્ટ માર્ગદર્શન જરૂરી છે?',
    statementOfAgreement: 'સहमતિનું નિવેદન',
    declaration: 'ચેકબોક્સ પર ચિહ્નિત કરીને, હું જાહેર કરું છું કે મારી જાણકારી પ્રમાણે, આ ફોર્મમાં આપવામાં આવેલી માહિતી સાચી છે. હું સમજી છું કે જો કોઈ ખોટી માહિતી આપવામાં આવે છે, તો તે પ્રસ્તાવની અક્ષમતા કારણ બની શકે છે.',
  },
};


export const translationsforApplyDetails = {
  english: {
    applyDetails: 'Apply Details',
    title: 'Title',
    description: 'Description',
    budget: 'Budget',
    scopeOfWork: 'Scope of Work',
    milestone: 'Milestone',
    milestoneDeadline: 'Milestone Deadline Date',
    otherSolutions: 'Other available solutions',
    solutionUSP: 'Solution USP',
    appliedUser:'Applied User:',
  },
  gujarati: {
    applyDetails: 'લાગુ વિગતો',
    title: 'શીર્ષક',
    description: 'વર્ણન',
    budget: 'બજેટ',
    scopeOfWork: 'કામનો વિસ્તાર',
    milestone: 'માઇલસ્ટોન',
    milestoneDeadline: 'માઇલસ્ટોનની સમય મર્યાદા તારીખ',
    otherSolutions: 'અન્ય ઉપલબ્ધ ઉકેલો',
    solutionUSP: 'ઉકેલની અનોખી વિશેષતા',
    appliedUser:'લાગુ વપરાશકર્તા:',

  },
};



export const translationsforPROFILE2 = {
  english: {

    // ********* yup

    enterheadlineff:'Enter a brief sentences that best summarizes your core expertise and skills, like you would on your resume of LinkedIn profile.',
    enterheadlinepp:'Provide details about the research product or solution that you intend to commercialize',
    headline: 'Headline is required',
    headlineOriginal: 'Headline',
    provideDetails:'Provide details about the research product or solution that you intend to commercialize',
    addProduct: 'Add Product',
    qualificationr: 'Qualification is required',
    required: 'Required',
    currencyRequired: 'Currency is required',
    workExperience: 'Work Experience',
    workExperienceDescription: 'View and change your work experience here',
    qualification: 'Qualification',
    organization: 'Organization',
    sector: 'Sector',
    workAddress: 'Work Address',
    designation: 'Designation',
    userType: 'User Type',
    productToMarket: 'Product to Market',
    hasPatent: 'Do you have a patent?',
    patentDetailsOrResearch: (userType: string) =>
      userType === 'Freelancer'
        ? 'Provide details about the research product or solution that you intend to commercialize'
        : 'Patent Details',
    saveAndNext: 'Save & Next',
    updateworkex: 'Update Work Experience',
    back: 'Back'
  },
  gujarati: {

    enterheadlineff:'સંક્ષિપ્ત વાક્યો દાખલ કરો જે તમારી મુખ્ય કુશળતા અને કૌશલ્યોનો શ્રેષ્ઠ સારાંશ આપે છે, જેમ કે તમે તમારા LinkedIn પ્રોફાઇલના રેઝ્યૂમે પર કરશો.',
    enterheadlinepp:'તમે જે રિસર્ચ પ્રોડક્ટ અથવા સોલ્યુશનનું વ્યાપારીકરણ કરવા માગો છો તેની વિગતો આપો.',
    headline: 'હેડલાઇન જરૂરી છે',
    headlineOriginal: 'હેડલાઇન',
    provideDetails:'તમે જે રિસર્ચ પ્રોડક્ટ અથવા સોલ્યુશનનું વ્યાપારીકરણ કરવા માગો છો તેની વિગતો આપો', //////////

    qualificationr: 'લાયકાત જરૂરી છે',
    addProduct: 'ઉત્પાદન ઉમેરો',

    required: 'જરૂરી',
    currencyRequired: 'ચલણ જરૂરી છે',
    workExperience: 'કામનો અનુભવ',
    workExperienceDescription: 'તમારો કામનો અનુભવ અહીં જુઓ અને બદલો',
    qualification: 'લાયકાત',
    organization: 'સંસ્થા',
    sector: 'વિભાગ',
    workAddress: 'કાર્યસ્થાનનો સરનામું',
    designation: 'હોદ્દો',
    userType: 'વપરાશકર્તા પ્રકાર',
    productToMarket: 'માર્કેટમાં પ્રોડક્ટ',
    hasPatent: 'શું તમારી પાસે પેટન્ટ છે?',
    patentDetailsOrResearch: (userType: string) =>
      userType === 'Freelancer'
        ? 'તમે જે પ્રોડક્ટ અથવા ઉકેલનું વ્યાપારીકરણ કરવાનું વિચારતા હો તે વિશે વિગતો આપો'
        : 'પેટન્ટ વિગતો',
    saveAndNext: 'સાચવો અને આગળ વધો',
    updateworkex: 'કામનો અનુભવ અપડેટ કરો',
    back: 'પાછળ'


  },
};



export const translationsforEditstartingProfile = {
  english: {
    editProfile: 'Edit Profile',
    firstName: 'First Name',
    lastName: 'Last Name',
    emailAddress: 'Email Address',
    mobileNumber: 'Mobile Number',
    password: 'Password',
    savechanges: 'Save Changes',
    ChangePassword: 'Change Password'
  },
  gujarati: {
    editProfile: 'પ્રોફાઇલ સંપાદિત કરો',
    firstName: 'પ્રથમ નામ',
    lastName: 'અંતિમ નામ',
    emailAddress: 'ઇમેઇલ સરનામું',
    mobileNumber: 'મોબાઇલ નંબર',
    password: 'પાસવર્ડ',
    savechanges: 'ફેરફારો સાચવો',
    ChangePassword: 'પાસવર્ડ બદલો',



  },
};



export const translationsforCreateApply = {
  english: {

    productsRequired: 'At least one product is required to select.',
    titleRequired: 'Title is required',
    descriptionRequired: 'Description is required',
    budgetRequired: 'Budget is required',
    currencyRequired: 'Currency is required',
    timeFrameRequired: 'Date & Time is required',
    availableSolutionRequired: 'You have to give a solution',
    solutionUSPRequired: 'Solution USP is required',
    scopeOfWorkRequired: 'Scope of work is required',
    milestoneTextRequired: 'Milestone text is required',
    milestoneTimeFrameRequired: 'Milestone time frame is required',
    atLeastOneMilestoneRequired: 'At least one milestone is required',
    atLeastOneMilestoneGroupRequired: 'At least one milestone group is required',


    apply: 'Apply',
    title: 'Title',
    description: 'Description',
    budget: 'Budget',
    // timefarme:'Time Frame',
    scopeOfWork: 'Scope of Work',
    scopeDetails:
      'Add Specific activities, deliverables, timelines, and/or quality guidelines to ensure successful execution of the project.',
    milestonesDescription:
      'Add milestones to help you break up the scope of work into smaller deliverables to track the project\'s progress. These can be viewed and modified by the client.',
    milestone: 'Milestone...',
    milestoneDeadlineDate: 'Milestone Deadline Date',
    flawsInSolution: 'What have been the flaws in current solution?',
    otherSolutions: 'Write about other available solutions',
    uniqueResults: 'Positive and unique results do we expect to see from your solution?',
    solutionUSP: 'Write your solution USP here',
    cancel: 'Cancel',
    applyButton: 'Apply',
  },
  gujarati: {


    productsRequired: 'ઓછામાં ઓછા એક ઉત્પાદન પસંદ કરવું જરૂરી છે.',
    titleRequired: 'શીર્ષક જરૂરી છે',
    descriptionRequired: 'વર્ણન જરૂરી છે',
    budgetRequired: 'બજેટ જરૂરી છે',
    currencyRequired: 'કરન્સી જરૂરી છે',
    timeFrameRequired: 'તારીખ અને સમય જરૂરી છે',
    availableSolutionRequired: 'તમારે ઉકેલ આપવો પડશે',
    solutionUSPRequired: 'ઉકેલનું યુએસપી જરૂરી છે',
    scopeOfWorkRequired: 'કાર્યક્ષેત્ર જરૂરી છે',
    milestoneTextRequired: 'માઇલસ્ટોન લખાણ જરૂરી છે',
    milestoneTimeFrameRequired: 'માઇલસ્ટોન સમયગાળો જરૂરી છે',
    atLeastOneMilestoneRequired: 'ઓછામાં ઓછા એક માઇલસ્ટોન જરૂરી છે',
    atLeastOneMilestoneGroupRequired: 'ઓછામાં ઓછા એક માઇલસ્ટોન જૂથ જરૂરી છે',
    apply: 'અરજી કરો',
    title: 'શીર્ષક',
    description: 'વર્ણન',
    budget: 'બજેટ',
    // timefarme:'Time Frame',
    scopeOfWork: 'કાર્યક્ષેત્ર',
    scopeDetails:
      'પ્રોજેક્ટના સફળ અમલ માટે ચોક્કસ પ્રવૃત્તિઓ, વિતરણો, સમયમર્યાદા, અને/અથવા ગુણવત્તા માર્ગદર્શિકા ઉમેરો.',
    milestonesDescription:
      'પ્રોજેક્ટની પ્રગતિને ટ્રૅક કરવા માટે કાર્યક્ષેત્રને નાના વિતરણોમાં વહેંચવા માટે માઇલસ્ટોન્સ ઉમેરો. આ ગ્રાહક દ્વારા જોવામાં અને ફેરફાર કરવામાં આવી શકે છે.',
    milestone: 'માઇલસ્ટોન...',
    milestoneDeadlineDate: 'માઇલસ્ટોનની સમયમર્યાદા તારીખ',
    flawsInSolution: 'વર્તમાન ઉકેલમાં શું ખામીઓ રહી છે?',
    otherSolutions: 'અન્ય ઉપલબ્ધ ઉકેલ વિશે લખો',
    uniqueResults: 'તમારા ઉકેલમાંથી ધારિત સકારાત્મક અને અનન્ય પરિણામો શું છે?',
    solutionUSP: 'અહીં તમારું ઉકેલ USP લખો',
    cancel: 'રદ્દ કરો',
    applyButton: 'અરજી કરો',
  },
};
