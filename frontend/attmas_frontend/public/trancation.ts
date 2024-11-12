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
  