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
  },
};




export const translationsforProjectPage = {
  english: {

    projects: 'Projects',
    nomoreproject: 'No more Projects'
  },
  gujarati: {

    projects: 'પ્રોજેક્ટ્સ',
    nomoreproject: 'કોઈ વધુ પ્રોજેક્ટ્સ નથી'
  },
};





export const translationsforMyProjectPage = {
  english: {

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

  },
  gujarati: {

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
    producttomarket1:'પ્રોડક્ટ ટૂ માર્કેટ',
    doyouhavepatent:'શું તમારી પાસે પેટન્ટ છે?'
  },
};






export const translationsforProjectDrawer = {
  english: {

    ProjectDetailsInformation: 'Project Details Information',
    projectOwner:'Project Owner',
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







export const translationsforApplicationsForProject = {
  english: {
    applicationsForProject: 'Applications for Project',
    title: 'Title',
    appliedUser: 'Applied User'
  },
  gujarati: {
    applicationsForProject: 'પ્રોજેક્ટ માટેની અરજી',
    title: 'શીર્ષક',
    appliedUser: 'અરજી કરનાર વપરાશકર્તા'
  },
};




export const translationsforViewExhibition = {
  english: {
    exhibition: 'Exhibition',
    boothDetails: 'Booth Details'
  },
  gujarati: {
    exhibition: 'પ્રદર્શન',
    boothDetails: 'બૂથ વિગતો'
  },
};
