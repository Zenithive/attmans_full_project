export interface Subcategory {
  name: string;
  subcategories?: Subcategory[];
}

export const subcategories: Subcategory[] = [
  {
    name: 'Chemistry',
    subcategories: [
      { name: 'Chemical Reagent Development' },
      { name: 'Dewatering & Drying Technology' },
      { name: 'Catalysis' },
      { name: 'Trace Elements' },
      { name: 'Mathematical Chemistry' },
      { name: 'Dispersion Chemistry' },
      { name: 'Surface Science' },
      {
        name: 'Materials Science & Engineering',
        subcategories: [
          {
            name: 'Nanotechnology & Nanomaterials',
            subcategories: [
              { name: 'Biomaterials ' },
            ],
          },
          { name: 'Surface Chemistry' },
          { name: 'Metallurgy' },
          { name: 'Glass Science' },
          { name: 'Ceramic Engineering' },
          { name: 'Corrosion' },
          { name: 'Structural Chemistry' },
          { name: 'Microencapsulation' },
          { name: 'Supramolecular Chemistry' },
          { name: 'Fiber & Textile Engineering' },
          { name: 'Carbon Materials' },
        ],
      },
      {
        name: 'Biomaterials',
        subcategories: [
          { name: 'Collagen' },
          { name: 'Bioplastics' },
          { name: 'Powder Metallurgy' },
          { name: 'Powders & Bulk Materials' },
          { name: 'Refractory Materials' },
          { name: 'Composite Materials' },
          { name: 'Electronic, Optical & Magnetic Materials' },
          { name: 'Dental Materials' },
          { name: 'Biocatalysis' },
          { name: 'Marine Chemistry' },
          { name: 'Coordination Compounds' },
          { name: 'Inorganic Chemistry' },
          { name: 'Natural Product Chemistry' },
          { name: 'Molecular Engineering' },
          { name: 'Physical Chemistry' },
        ],
      },
      {
        name: 'Molecular Modeling',
        subcategories: [
          { name: 'Molecular Docking' },
          { name: 'Chemoinformatics' },
          { name: 'Biopolymers' },
          { name: 'Polymer Chemistry' },
        ],
      },
      {
        name: 'Analytical Chemistry',
        subcategories: [
          { name: 'Deformulation' },
          { name: 'Separation & Purification' },
          { name: 'Crystallography' },
          { name: 'X-Ray Crystallography' },
          {
            name: 'Spectroscopy',
            subcategories: [
              { name: 'Atomic Absorption Spectroscopy' },
              { name: 'Atomic Emission Spectroscopy' },
              { name: 'UV Spectroscopy' },
              { name: 'Fluorescence Spectroscopy' },
              { name: 'IR Spectroscopy' },
              { name: 'Raman Spectroscopy' },
              { name: 'NMR Spectroscopy' },
              { name: 'Circular Dichroism Spectroscopy' },
              { name: 'Spectrophotometry' },
              { name: 'Mass Spectrometry' },
              { name: 'Molecular Imaging' },
            ],
          },
          { name: 'Liquid Chromatography/HPLC' },
          { name: 'Thermal Analysis' },
          { name: 'Microcalorimetry' },
          { name: 'Gas Chromatography' },
          { name: 'Particle Size Distribution' },
          { name: 'Optical Rotation' },
          { name: 'Stable Isotope Analysis' },
          { name: 'Particle-Induced X-Ray Emission' },
          { name: 'Electrochemistry' },
          { name: 'Agricultural Chemistry' },
          { name: 'Cosmochemistry' },
          { name: 'Radiochemistry' },
          { name: 'Astrochemistry' },
          { name: 'Petrochemistry' },
        ],
      },
      {
        name: 'Solid State Sciences',
        subcategories: [
          { name: 'Condensed Matter Physics' },
          { name: 'Solid-State Chemistry' },
          { name: 'Flow Chemistry' },
          { name: 'Green Chemistry' },
          { name: 'Organometallic Chemistry' },
          { name: 'Photochemistry' },
          { name: 'Quantum Chemistry' },
          { name: 'Theoretical Chemistry' },
        ],
      },
      {
        name: 'Organic Chemistry',
        subcategories: [
          { name: 'Retrosynthesis' },
          { name: 'Thermochemistry' },
          { name: 'Computational Chemistry' },
          { name: 'Mechanochemistry' },
          { name: 'Sonochemistry' },
          { name: 'Peptide Synthesis' },
          { name: 'Physical Organic Chemistry' },
          { name: 'Adhesion Technology' },
          { name: 'Applied Chemistry' },
        ],
      },
    ],
  },
  {
    name: 'Agriculture',
    subcategories: [
      {
        name: 'Plant Science',
        subcategories: [
          { name: 'Agronomy' },
          { name: 'Plant Breeding' },
          { name: 'Horticulture' },
          { name: 'Entomology' },
          { name: 'Plant Pathology' },
          { name: 'Soil Science' },
          { name: 'Weed Science' },
        ],
      },
      {
        name: 'Agricultural Engineering and Technology',
        subcategories: [
          { name: 'Precision Agriculture' },
          { name: 'Irrigation and Drainage Engineering' },
          { name: 'Farm Machinery and Equipment' },
          { name: 'Renewable Energy in Agriculture' },
          { name: 'Post-harvest Technology' },
        ],
      },
      {
        name: 'Organic agriculture',
        subcategories: [
          { name: 'Soil Health & Fertility Management' },
          { name: 'Pest & Disease' },
          { name: 'Integrated Pest Management (IPM)' },
          { name: 'Crop Rotations & Intercropping' },
          { name: 'Pollinator & Natural Enemy Habitat Creation' },
          { name: 'Biodiversity Conservation' },
          { name: 'Composting & Biofertilizer Production' },
          { name: 'Weed Management' },
          { name: 'Irrigation & Water Management' },
          { name: 'Seed Saving & Variety Selection' },
          { name: 'On-farm Research & Experimentation' },
          { name: 'Organic Seed Saving' },
          { name: 'Nutrient Cycling' },
          { name: 'Composting and Vermicomposting' },
        ],
      },
    ],
  },
  {
    name: 'Engineering',
    subcategories: [
      {
        name: 'Aviation',
        subcategories: [
          { name: 'Aviation Transport' },
          { name: 'Aviation Management' },
          { name: 'Aviation Safety' },
          { name: 'Aircraft Maintenance' },
          { name: 'Air Traffic Control' },
          { name: 'Airline Management & Operations' },
          { name: 'Airport Management & Operations' },
          { name: 'Unmanned Aerial Systems' },
        ],
      },
      {
        name: 'Electrical Engineering',
        subcategories: [
          { name: 'Semiconductors' },
          { name: 'Batteries & Fuel Cells' },
          { name: 'Power Engineering' },
          { name: 'Electronics Engineering' },
          { name: 'Electronic Circuits' },
          { name: 'Integrated Circuits/Microchips' },
          { name: 'Signal Processing' },
          { name: 'Microelectronics' },
          { name: 'Computer Engineering' },
          { name: 'Telecommunications Engineering' },
          { name: 'Instrumentation Engineering' },
          { name: 'Electro-Optics' },
          { name: 'Distribution Engineering' },
          { name: 'Wireless Sensor Networks' },
          { name: 'Microwave Engineering' },
          { name: 'Cold Regions Engineering' },
          { name: 'Biological Engineering' },
          { name: 'Engineering Education' },
          { name: 'Engineering Physics' },
        ],
      },
      {
        name: 'Civil engineering',
        subcategories: [
          { name: 'Urban Planning & Development' },
          { name: 'Offshore Structures' },
          { name: 'Hydraulic Engineering' },
          { name: 'Geotechnical Engineering' },
          { name: 'Structural Engineering' },
          { name: 'Construction Engineering' },
          { name: 'Civil Site Design' },
          { name: 'Site Survey' },
          { name: 'Earthquake Engineering' },
          { name: 'Coastal Engineering' },
          { name: 'Regional Planning & Development' },
          { name: 'Ocean Engineering' },
          { name: 'Petroleum Engineering' },
          { name: 'Sound Design' },
          { name: 'Remote Sensing' },
          { name: 'Surveillance Systems' },
        ],
      },
      {
        name: 'Automotive engineering',
        subcategories: [
          {
            name: 'Powertrain & Drivetrain',
            subcategories: [
              { name: 'Engine Development' },
              { name: 'Transmission Development' },
              { name: 'Vehicle Control Systems' },
            ],
          },
          {
            name: 'Chassis & Suspension',
            subcategories: [
              { name: 'Vehicle Dynamics' },
              { name: 'Suspension Design' },
              { name: 'Brake Systems' },
            ],
          },
          {
            name: 'Vehicle Safety & Crashworthiness',
            subcategories: [
              { name: 'Occupant Protection' },
              { name: 'Crash Testing' },
              { name: 'Collision Repair' },
            ],
          },
          { name: 'Noise, Vibration, & Harshness (NVH)' },
          { name: 'Vehicle Electronics' },
          { name: 'Advanced Driver Assistance Systems (ADAS)' },
          { name: 'Vehicle Ergonomics' },
          { name: 'Vehicle Aerodynamics' },
        ],
      },
    ],
  },
  {
    name: 'Earth and Atmospheric Science',
    subcategories: [
      { name: 'Climatology' },
      { name: 'Oceanography' },
      { name: 'Geophysics' },
      { name: 'Geology' },
      { name: 'Meteorology' },
      { name: 'Hydrology' },
      { name: 'Geomorphology' },
      { name: 'Seismology' },
      { name: 'Vulcanology' },
    ],
  },
  {
    name: 'Environmental Science',
    subcategories: [
      { name: 'Air Pollution Control' },
      { name: 'Water Treatment & Purification' },
      { name: 'Solid Waste Management' },
      { name: 'Environmental Toxicology' },
      { name: 'Environmental Impact Assessment' },
      { name: 'Sustainable Development' },
      { name: 'Environmental Policy' },
      { name: 'Ecosystem Management' },
      { name: 'Biodiversity Conservation' },
    ],
  },
  {
    name: 'Food Science',
    subcategories: [
      { name: 'Food Chemistry' },
      { name: 'Food Microbiology' },
      { name: 'Food Engineering' },
      { name: 'Food Safety' },
      { name: 'Sensory Science' },
      { name: 'Food Processing & Preservation' },
      { name: 'Functional Foods' },
      { name: 'Nutraceuticals' },
    ],
  },
  {
    name: 'Renewable Energy',
    subcategories: [
      { name: 'Solar Energy' },
      { name: 'Wind Energy' },
      { name: 'Hydropower' },
      { name: 'Bioenergy' },
      { name: 'Geothermal Energy' },
      { name: 'Ocean Energy' },
    ],
  },
  {
    name: 'Medical Device',
    subcategories: [
      { name: 'Medical Imaging' },
      { name: 'Diagnostic Equipment' },
      { name: 'Surgical Instruments' },
      { name: 'Prosthetics' },
      { name: 'Orthopedics' },
      { name: 'Dental Devices' },
    ],
  },
  {
    name: 'Healthcare',
    subcategories: [
      { name: 'Public Health' },
      { name: 'Epidemiology' },
      { name: 'Health Policy' },
      { name: 'Health Economics' },
      { name: 'Health Services Research' },
      { name: 'Health Informatics' },
    ],
  },
  {
    name: 'Sustainability Science',
    subcategories: [
      { name: 'Sustainable Agriculture' },
      { name: 'Sustainable Energy' },
      { name: 'Sustainable Development' },
      { name: 'Sustainable Cities' },
      { name: 'Sustainable Water Management' },
      { name: 'Sustainable Tourism' },
      { name: 'Sustainable Transportation' },
    ],
  },
];

export interface Subcategory {
  name: string;
  subcategories?: Subcategory[];
}

// export const subcategories: Subcategory[] = [
//   {
//     name: 'Chemistry',
//     subcategories: [
//       {
//         name: 'Analytical Chemistry',
//       },
//       {
//         name: 'Biochemistry',
//         subcategories: [
//           {
//             name: 'Biomaterials',
//           },
//         ],
//       },
//     ],
//   },
//   {
//     name: 'Engineering',
//     subcategories: [
//       {
//         name: 'Mechanical Engineering',
//       },
//       {
//         name: 'Electrical Engineering',
//       },
//     ],
//   },
// ];


// export const categories: string[] = [
//   "Agriculture",
//   "Chemicals",
//   "Electronics",
//   "Energy",
//   "Environmental and waste management",
//   "Food and beverage",
//   "Healthcare",
//   "Medical devices and equipment",
//   "Mining and metals",
//   "Real estate and construction",
//   "Textiles",
// ];


// constants/categories.ts

export const categories: string[] = [
  "Agriculture",
  "Chemicals",
  "Electronics",
  "Energy",
  "Environmental and waste management",
  "Food and beverage",
  "Healthcare",
  "Medical devices and equipment",
  "Mining and metals",
  "Real estate and construction",
  "Textiles",
  // ... other categories
];

export const subcategories1: { [key: string]: string[] } = {
  'Agriculture': ['Subcategory 1', 'Subcategory 2'],
  'Chemicals': ['Subcategory 3', 'Subcategory 4'],
  'Electronics': ['Subcategory 5', 'Subcategory 6'],
  'Energy': ['Subcategory 5', 'Subcategory 6'],
  'Environmental and waste management': ['Subcategory 5', 'Subcategory 6'],
  'Food and beverage': ['Subcategory 5', 'Subcategory 6'],
  'Healthcare': ['Subcategory 5', 'Subcategory 6'],
  'Medical devices and equipment': ['Subcategory 5', 'Subcategory 6'],
  'Mining and metals': ['Subcategory 5', 'Subcategory 6'],
  'Real estate and construction': ['Subcategory 5', 'Subcategory 6'],
  'Textiles': ['Subcategory 5', 'Subcategory 6'],
  // ... other subcategories
};





// Usage Example
export const options = [
  ////////////////////////chemical/////////////////////////////////////

  {
    label: 'Chemistry ',
    value: 'Chemistry ',
    children: [
      {
        label: 'Chemical Reagent Development',
        value: 'Chemical Reagent Development',
      },
      {
        label: 'Dewatering & Drying Technology',
        value: 'Dewatering & Drying Technology',
      },
      {
        label: 'Catalysis',
        value: 'Catalysis',
      },
      {
        label: 'Trace Elements',
        value: 'Trace Elements',
      },
      {
        label: 'Mathematical Chemistry',
        value: 'Mathematical Chemistry',
      },
      {
        label: 'Dispersion Chemistry',
        value: 'Dispersion Chemistry',
      },
      {
        label: 'Surface Science',
        value: 'Surface Science',
      },
      // {
      //   label: 'Option 1.2',
      //   value: 'option1.2',
      //   children: [
      //     {
      //       label: 'Option 1.2.1',
      //       value: 'option1.2.1',
      //       children: [
      //           {
      //               label: 'Option 1.2.1.1',
      //               value: 'option1.2.1.1',
      //               },
      //       ]
      //     },
      //   ],
      // },
      {
        label: 'Materials Science & Engineering',
        value: 'Materials Science & Engineering ',
        children: [
          {
            label: 'Nanotechnology & Nanomaterials',
            value: 'Nanotechnology & Nanomaterials',
          },
          {
            label: 'Surface Chemistry',
            value: 'Surface Chemistry',
          },
          {
            label: 'Metallurgy',
            value: 'Metallurgy',
          },
          {
            label: 'Glass Science',
            value: 'Glass Science',
          },
          {
            label: 'Ceramic Engineering',
            value: 'Ceramic Engineering',
          },
          {
            label: 'Corrosion',
            value: 'Corrosion',
          },
          {
            label: 'Structural Chemistry',
            value: 'Structural Chemistry',
          },
          {
            label: 'Microencapsulation',
            value: 'Microencapsulation',
          },
          {
            label: 'Supramolecular Chemistry',
            value: 'Supramolecular Chemistry',
          },
          {
            label: 'Fiber & Textile Engineering',
            value: 'Fiber & Textile Engineering',
          },
          {
            label: 'Carbon Materials',
            value: 'Carbon Materials',
          },
          {
            label: 'Nanotechnology',
            value: 'Nanotechnology',
          },
        ],
      },
      {
        label: 'Biomaterials',
        value: 'Biomaterials',
        children: [
          {
            label: 'Collagen',
            value: 'Collagen',

          },
          {
            label: 'Bioplastics',
            value: 'Bioplastics',

          },
          {
            label: 'Powder Metallurgy',
            value: 'Powder Metallurgy',

          },
          {
            label: 'Powders & Bulk Materials',
            value: 'Powders & Bulk Materials',

          },
          {
            label: 'Refractory Materials',
            value: 'Refractory Materials',

          },
          {
            label: 'Composite Materials',
            value: 'Composite Materials',

          },
          {
            label: 'Electronic, Optical & Magnetic Materials',
            value: 'Electronic, Optical & Magnetic Materials',

          },
          {
            label: 'Dental Materials',
            value: 'Dental Materials',

          },
          {
            label: 'Biocatalysis',
            value: 'Biocatalysis',

          },
          {
            label: 'Marine Chemistry',
            value: 'Marine Chemistry',

          },
          {
            label: 'Coordination Compounds',
            value: 'Coordination Compounds',

          },
          {
            label: 'Inorganic Chemistry',
            value: 'Inorganic Chemistry',

          },
          {
            label: 'Natural Product Chemistry',
            value: 'Natural Product Chemistry',

          },
          {
            label: 'Molecular Engineering',
            value: 'Molecular Engineering',

          },
          {
            label: 'Physical Chemistry',
            value: 'Physical Chemistry',

          },

        ]
      },
      {
        label: 'Molecular Modeling ',
        value: 'Molecular Modeling  ',
        children: [
          {
            label: 'Molecular Docking',
            value: 'Molecular Docking',
          },
          {
            label: 'Chemoinformatics',
            value: 'Chemoinformatics',
          },
          {
            label: 'Biopolymers',
            value: 'Biopolymers',
          },
          {
            label: 'Polymer Chemistry',
            value: 'Polymer Chemistry',
          },
        ],
      },
      {
        label: 'Analytical Chemistry  ',
        value: 'Analytical Chemistry   ',
        children: [
          {
            label: 'Deformulation',
            value: 'Deformulation',
          },
          {
            label: 'Separation & Purification Crystallography ',
            value: 'Separation & Purification Crystallography ',
          },
          {
            label: 'X-Ray Crystallography Spectroscopy ',
            value: 'X-Ray Crystallography Spectroscopy ',
          },
          {
            label: 'Atomic Absorption Spectroscopy',
            value: 'Atomic Absorption Spectroscopy',
          },
          {
            label: 'Atomic Emission Spectroscopy',
            value: 'Atomic Emission Spectroscopy',
          },
          {
            label: 'UV Spectroscopy',
            value: 'UV Spectroscopy',
          },
          {
            label: 'Fluorescence Spectroscopy',
            value: 'Fluorescence Spectroscopy',
          },
          {
            label: 'IR Spectroscopy',
            value: 'IR Spectroscopy',
          },
          {
            label: 'Raman Spectroscopy',
            value: 'Raman Spectroscopy',
          },
          {
            label: 'NMR Spectroscopy',
            value: 'NMR Spectroscopy',
          },
          {
            label: 'Circular Dichroism Spectroscopy',
            value: 'Circular Dichroism Spectroscopy',
          },
          {
            label: 'Spectrophotometry',
            value: 'Spectrophotometry',
          },
          {
            label: 'Mass Spectrometry',
            value: 'Mass Spectrometry',
          },
          {
            label: 'Molecular Imaging',
            value: 'Molecular Imaging',
          },
          {
            label: 'Liquid Chromatography/HPLC',
            value: 'Liquid Chromatography/HPLC',
          },
          {
            label: 'Thermal Analysis',
            value: 'Thermal Analysis',
          },
          {
            label: 'Microcalorimetry',
            value: 'Microcalorimetry',
          },
          {
            label: 'Gas Chromatography',
            value: 'Gas Chromatography',
          },
          {
            label: 'Particle Size Distribution',
            value: 'Particle Size Distribution',
          },
          {
            label: 'Optical Rotation',
            value: 'Optical Rotation',
          },
          {
            label: 'Stable Isotope Analysis',
            value: 'Stable Isotope Analysis',
          },
          {
            label: 'Particle-Induced X-Ray Emission',
            value: 'Particle-Induced X-Ray Emission',
          },
          {
            label: 'Electrochemistry',
            value: 'Electrochemistry',
          },
          {
            label: 'Agricultural Chemistry',
            value: 'Agricultural Chemistry',
          },
          {
            label: 'Cosmochemistry',
            value: 'Cosmochemistry',
          },
          {
            label: 'Radiochemistry',
            value: 'Radiochemistry',
          },
          {
            label: 'Astrochemistry',
            value: 'Astrochemistry',
          },
          {
            label: 'Petrochemistry',
            value: 'Petrochemistry',
          },
        ],
      },
      {
        label: 'Solid State Sciences ',
        value: 'Solid State Sciences ',
        children: [
          {
            label: 'Condensed Matter Physics',
            value: 'Condensed Matter Physics',
          },
          {
            label: 'Solid-State Chemistry',
            value: 'Solid-State Chemistry',
          },
          {
            label: 'Flow Chemistry',
            value: 'Flow Chemistry',
          },
          {
            label: 'Green Chemistry',
            value: 'Green Chemistry',
          },
          {
            label: 'Organometallic Chemistry',
            value: 'Organometallic Chemistry',
          },
          {
            label: 'Photochemistry',
            value: 'Photochemistry',
          },
          {
            label: 'Quantum Chemistry',
            value: 'Quantum Chemistry',
          },
          {
            label: 'Theoretical Chemistry',
            value: 'Theoretical Chemistry',
          },

        ],
      },
      {
        label: 'Organic Chemistry  ',
        value: 'Organic Chemistry  ',
        children: [
          {
            label: 'Retrosynthesis',
            value: 'Retrosynthesis',
          },
          {
            label: 'Thermochemistry',
            value: 'Thermochemistry',
          },
          {
            label: 'Computational Chemistry',
            value: 'Computational Chemistry',
          },
          {
            label: ' Mechanochemistry',
            value: ' Mechanochemistry',
          },
          {
            label: 'Sonochemistry',
            value: 'Sonochemistry',
          },
          {
            label: 'Peptide Synthesis',
            value: 'Peptide Synthesis',
          },
          {
            label: 'Physical Organic Chemistry',
            value: 'Physical Organic Chemistry',
          },
          {
            label: 'Adhesion Technology',
            value: 'Adhesion Technology',
          },
          {
            label: 'Applied Chemistry',
            value: 'Applied Chemistry',
          },

        ],
      },
    ],
  },


  ////////////////////////Agriculture/////////////////////////////////////


  {
    label: 'Agriculture',
    value: 'Agriculture',
    children: [
      {
        label: 'Plant Science',
        value: 'Plant Science',
        children: [
          {
            label: 'Agronomy',
            value: 'Agronomy',
          },
          {
            label: 'Plant Breeding',
            value: 'Plant Breeding',
          },
          {
            label: 'Horticulture',
            value: 'Horticulture',
          },
          {
            label: 'Entomology',
            value: 'Entomology',
          },
          {
            label: 'Plant Pathology',
            value: 'Plant Pathology',
          },
          {
            label: 'Soil Science: ',
            value: 'Soil Science: ',
          },
          {
            label: 'Weed Science: ',
            value: 'Weed Science: ',
          },
        ]
      },
      {
        label: 'Agricultural Engineering and Technology',
        value: 'Agricultural Engineering and Technology',
        children: [
          {
            label: 'Precision Agriculture',
            value: 'Precision Agriculture',
          },
          {
            label: 'Irrigation and Drainage Engineering',
            value: 'Irrigation and Drainage Engineering',
          },
          {
            label: 'Farm Machinery and Equipment',
            value: 'Farm Machinery and Equipment',
          },
          {
            label: 'Renewable Energy in Agriculture',
            value: 'Renewable Energy in Agriculture',
          },
          {
            label: 'Post-harvest Technology',
            value: 'Post-harvest Technology',
          },
        ]
      },
      {
        label: 'Organic agriculture',
        value: 'Organic agriculture',
        children: [

          {
            label: 'Soil Health & Fertility Management',
            value: 'Soil Health & Fertility Management',
          },
          {
            label: 'Pest & Disease',
            value: 'Pest & Disease',
          },
          {
            label: 'Integrated Pest Management (IPM)',
            value: 'Integrated Pest Management (IPM)',
          },
          {
            label: 'Crop Rotations & Intercropping',
            value: 'Crop Rotations & Intercropping',
          },
          {
            label: 'Pollinator & Natural Enemy Habitat Creation',
            value: 'Pollinator & Natural Enemy Habitat Creation',
          },
          {
            label: 'Biodiversity Conservation',
            value: 'Biodiversity Conservation',
          },
          {
            label: 'Composting & Biofertilizer Production',
            value: 'Composting & Biofertilizer Production',
          },
          {
            label: 'Weed Management',
            value: 'Weed Management',
          },
          {
            label: 'Irrigation & Water Management',
            value: 'Irrigation & Water Management',
          },
          {
            label: 'Seed Saving & Variety Selection',
            value: 'Seed Saving & Variety Selection',
          },
          {
            label: 'On-farm Research & Experimentation',
            value: 'On-farm Research & Experimentation',
          },
          {
            label: 'Organic Seed Saving',
            value: 'Organic Seed Saving',
          },
          {
            label: 'Nutrient Cycling',
            value: 'Nutrient Cycling',
          },
          {
            label: 'Composting and Vermicomposting',
            value: 'Composting and Vermicomposting',
          },

        ]
      },
    ]
  },


  ///////////////////////////Engineering/////////////////////////////////////


  {
    label: 'Engineering',
    value: 'Engineering',
    children: [
      {
        label: 'Aviation',
        value: 'Aviation',
        children: [
          {
            label: 'Aviation Transport',
            value: 'Aviation Transport',
          },
          {
            label: 'Aviation Management',
            value: 'Aviation Management',
          },
          {
            label: 'Aviation Safety',
            value: 'Aviation Safety',
          },
          {
            label: 'Aircraft Maintenance',
            value: 'Aircraft Maintenance',
          },
          {
            label: 'Air Traffic Control',
            value: 'Air Traffic Control',
          },
          {
            label: 'Airline Management & Operations',
            value: 'Airline Management & Operations',
          },
          {
            label: 'Airport Management & Operations',
            value: 'Airport Management & Operations',
          },
          {
            label: 'Unmanned Aerial Systems',
            value: 'Unmanned Aerial Systems',
          }

        ]
      },
      {
        label: 'Electrical Engineering ',
        value: 'Electrical Engineering ',
        children: [
          {
            label: 'Semiconductors',
            value: 'Semiconductors',
          },
          {
            label: 'Batteries & Fuel Cells',
            value: 'Batteries & Fuel Cells',
          },
          {
            label: 'Power Engineering',
            value: 'Power Engineering',
          },
          {
            label: 'Electronics Engineering',
            value: 'Electronics Engineering',
          },
          {
            label: 'Electronic Circuits',
            value: 'Electronic Circuits',
          },
          {
            label: 'Integrated Circuits/Microchips',
            value: 'Integrated Circuits/Microchips',
          },
          {
            label: 'Signal Processing',
            value: 'Signal Processing',
          },
          {
            label: 'Microelectronics',
            value: 'Microelectronics',
          },
          {
            label: 'Computer Engineering',
            value: 'Computer Engineering',
          },
          {
            label: 'Telecommunications Engineering',
            value: 'Telecommunications Engineering',
          },
          {
            label: 'Instrumentation Engineering',
            value: 'Instrumentation Engineering',
          },
          {
            label: 'Electro-Optics',
            value: 'Electro-Optics',
          },
          {
            label: 'Distribution Engineering',
            value: 'Distribution Engineering',
          },
          {
            label: 'Wireless Sensor Networks',
            value: 'Wireless Sensor Networks',
          },
          {
            label: 'Microwave Engineering',
            value: 'Microwave Engineering',
          },
          {
            label: 'Cold Regions Engineering',
            value: 'Cold Regions Engineering',
          },
          {
            label: 'Biological Engineering',
            value: 'Biological Engineering',
          },
          {
            label: 'Engineering Education',
            value: 'Engineering Education',
          },
          {
            label: 'Engineering Physics',
            value: 'Engineering Physics',
          }
        ]
      },
      {
        label: 'Civil Engineering',
        value: 'Civil Engineering',
        children: [
          {
            label: 'Urban Planning & Development',
            value: 'Urban Planning & Development',
          },
          {
            label: 'Offshore Structures',
            value: 'Offshore Structures',
          },
          {
            label: 'Hydraulic Engineering',
            value: 'Hydraulic Engineering',
          },
          {
            label: 'Geotechnical Engineering',
            value: 'Geotechnical Engineering',
          },
          {
            label: 'Structural Engineering',
            value: 'Structural Engineering',
          },
          {
            label: 'Construction Engineering',
            value: 'Construction Engineering',
          },
          {
            label: 'Civil Site Design',
            value: 'Civil Site Design',
          },
          {
            label: 'Site Survey',
            value: 'Site Survey',
          },
          {
            label: 'Earthquake Engineering',
            value: 'Earthquake Engineering',
          },
          {
            label: 'Coastal Engineering',
            value: 'Coastal Engineering',
          },
          {
            label: 'Regional Planning & Development',
            value: 'Regional Planning & Development',
          },
          {
            label: 'Ocean Engineering',
            value: 'Ocean Engineering',
          },
          {
            label: 'Petroleum Engineering',
            value: 'Petroleum Engineering',
          },
          {
            label: 'Sound Design',
            value: 'Sound Design',
          },
          {
            label: 'Remote Sensing',
            value: 'Remote Sensing',
          },
          {
            label: 'Surveillance Systems',
            value: 'Surveillance Systems',
          }

        ]
      },
      {
        label: 'Automotive Engineering',
        value: 'Automotive Engineering',
        children: [
          {
            label: 'Powertrain & Drivetrain',
            value: 'Powertrain & Drivetrain',
            children: [
              {
                label: 'Internal Combustion Engines (ICE)',
                value: 'Internal Combustion Engines (ICE)',
              },
              {
                label: 'Electric Vehicles (EVs)',
                value: 'Electric Vehicles (EVs)',
              },
              {
                label: 'Hybrid and Plug-in Hybrid Electric Vehicles (HEVs and PHEVs)',
                value: 'Hybrid and Plug-in Hybrid Electric Vehicles (HEVs and PHEVs)',
              },
              {
                label: 'Transmission & Drivetrain Systems',
                value: 'Transmission & Drivetrain Systems',
              }

            ]
          },
          {
            label: 'Vehicle Design & Engineering',
            value: 'Vehicle Design & Engineering',
            children: [
              {
                label: 'Chassis & Body Engineering',
                value: 'Chassis & Body Engineering',
              },
              {
                label: 'Aerodynamics & Computational Fluid Dynamics (CFD)',
                value: 'Aerodynamics & Computational Fluid Dynamics (CFD)',
              },
              {
                label: 'Vehicle Dynamics & Control Systems',
                value: 'Vehicle Dynamics & Control Systems',
              },
              {
                label: 'Autonomous Driving & Advanced Driver-Assistance Systems (ADAS)',
                value: 'Autonomous Driving & Advanced Driver-Assistance Systems (ADAS)',
              }

            ]
          },
          {
            label: 'Manufacturing & Production',
            value: 'Manufacturing & Production',
            children: [
              {
                label: 'Automotive Manufacturing Processes',
                value: 'Automotive Manufacturing Processes',
              },
              {
                label: 'Supply Chain & Logistics',
                value: 'Supply Chain & Logistics',
              },
              {
                label: 'Manufacturing Automation & Robotics',
                value: 'Manufacturing Automation & Robotics',
              },
              {
                label: 'Sustainable Manufacturing Practices',
                value: 'Sustainable Manufacturing Practices',
              }

            ]
          },

        ]
      },
      {
        label: 'Electronics ',
        value: 'Electronics ',
        children: [
          {
            label: 'Circuit Design and Analysis',
            value: 'Circuit Design and Analysis',
            children: [
              {
                label: 'Analog circuit design',
                value: 'Analog circuit design',
              },
              {
                label: 'Digital circuit design',
                value: 'Digital circuit design',
              },
              {
                label: 'Mixed-signal design',
                value: 'Mixed-signal design',
              },
              {
                label: 'Power electronics design',
                value: 'Power electronics design',
              },
              {
                label: 'RF and microwave circuit design',
                value: 'RF and microwave circuit design',
              },
              {
                label: 'High-speed circuit design',
                value: 'High-speed circuit design',
              },
              {
                label: 'FPGA and embedded systems design',
                value: 'FPGA and embedded systems design',
              },
              {
                label: 'Circuit simulation and modeling',
                value: 'Circuit simulation and modeling',
              }

            ]
          },
          {
            label: 'Electronics Manufacturing and Packaging',
            value: 'Electronics Manufacturing and Packaging',
            children: [
              {
                label: 'PCB design and layout',
                value: 'PCB design and layout',
              },
              {
                label: 'Printed circuit board fabrication',
                value: 'Printed circuit board fabrication',
              },
              {
                label: 'Semiconductor fabrication',
                value: 'Semiconductor fabrication',
              },
              {
                label: 'Component selection and sourcing',
                value: 'Component selection and sourcing',
              },
              {
                label: 'Assembly and soldering techniques',
                value: 'Assembly and soldering techniques',
              },
              {
                label: 'Test and measurement',
                value: 'Test and measurement',
              },
              {
                label: 'Quality control and reliability',
                value: 'Quality control and reliability',
              }

            ]
          },
          {
            label: 'Communication and Wireless Systems',
            value: 'Communication and Wireless Systems',
            children: [
              {
                label: 'Mobile network infrastructure (2G/3G/4G/5G)',
                value: 'Mobile network infrastructure (2G/3G/4G/5G)',
              },
              {
                label: 'Wi-Fi and Bluetooth technology',
                value: 'Wi-Fi and Bluetooth technology',
              },
              {
                label: 'Satellite communication systems',
                value: 'Satellite communication systems',
              },
              {
                label: 'Radar and sensor technology',
                value: 'Radar and sensor technology',
              },
              {
                label: 'Optical communication systems',
                value: 'Optical communication systems',
              },
              {
                label: 'Signal processing and Modulation',
                value: 'Signal processing and Modulation',
              }

            ]
          },
          {
            label: 'Embedded Systems and Robotics',
            value: 'Embedded Systems and Robotics',
            children: [
              {
                label: 'Microcontroller programming',
                value: 'Microcontroller programming',
              },
              {
                label: 'Real-time operating systems',
                value: 'Real-time operating systems',
              },
              {
                label: 'Sensor interfacing and data acquisition',
                value: 'Sensor interfacing and data acquisition',
              },
              {
                label: 'Motor control and actuators',
                value: 'Motor control and actuators',
              },
              {
                label: 'Control systems and feedback loops',
                value: 'Control systems and feedback loops',
              },
              {
                label: 'Machine learning and AI for embedded systems',
                value: 'Machine learning and AI for embedded systems',
              }

            ]
          },
          {
            label: 'Power Electronics and Energy Systems',
            value: 'Power Electronics and Energy Systems',
            children: [
              {
                label: 'Power conversion (AC/DC, DC/DC)',
                value: 'Power conversion (AC/DC, DC/DC)',
              },
              {
                label: 'Renewable energy systems (solar, wind)',
                value: 'Renewable energy systems (solar, wind)',
              },
              {
                label: 'Battery management systems',
                value: 'Battery management systems',
              },
              {
                label: 'Power grid infrastructure',
                value: 'Power grid infrastructure',
              },
              {
                label: 'Smart grids and microgrids',
                value: 'Smart grids and microgrids',
              },
              {
                label: 'Electric vehicle technology',
                value: 'Electric vehicle technology',
              }

            ]
          }

        ]
      },

    ]
  },


  ////////////////Earth and Atmospheric science////////////////////////////////////////////


  {
    label: 'Earth and Atmospheric science',
    value: 'Earth and Atmospheric science',
    children: [

      {
        label: 'Geology',
        value: 'Geology',
        children: [
          {
            label: 'Petrology',
            value: 'Petrology',
          },
          {
            label: 'Mineralogy',
            value: 'Mineralogy',
          },
          {
            label: 'Sedimentology',
            value: 'Sedimentology',
          },
          {
            label: 'Structural geology',
            value: 'Structural geology',
          },
          {
            label: 'Paleontology',
            value: 'Paleontology',
          }

        ]
      },
      {
        label: 'Geophysics',
        value: 'Geophysics',
        children: [
          {
            label: 'Seismology',
            value: 'Seismology',
          },
          {
            label: 'Geodesy',
            value: 'Geodesy',
          },
          {
            label: 'Geomagnetism',
            value: 'Geomagnetism',
          },
          {
            label: 'Exploration geophysics',
            value: 'Exploration geophysics',
          }

        ]
      },
      {
        label: 'Geochemistry',
        value: 'Geochemistry',
        children: [{
          label: 'Isotope geochemistry',
          value: 'Isotope geochemistry',
        },
        {
          label: 'Hydrogeochemistry',
          value: 'Hydrogeochemistry',
        },
        {
          label: 'Organic geochemistry',
          value: 'Organic geochemistry',
        },
        {
          label: 'Environmental geochemistry',
          value: 'Environmental geochemistry',
        },
        {
          label: 'Atmospheric Science',
          value: 'Atmospheric Science',
        }
        ]
      },
      {
        label: 'Meteorology',
        value: 'Meteorology',
        children: [
          {
            label: 'Synoptic meteorology',
            value: 'Synoptic meteorology',
          },
          {
            label: 'Mesoscale meteorology',
            value: 'Mesoscale meteorology',
          },
          {
            label: 'Micrometeorology',
            value: 'Micrometeorology',
          },
          {
            label: 'Climate science',
            value: 'Climate science',
          }

        ]
      },
      {
        label: 'Atmospheric Chemistry',
        value: 'Atmospheric Chemistry',
        children: [
          {
            label: 'Gas-phase chemistry',
            value: 'Gas-phase chemistry',
          },
          {
            label: 'Aerosol chemistry',
            value: 'Aerosol chemistry',
          },
          {
            label: 'Air pollution chemistry',
            value: 'Air pollution chemistry',
          }

        ]
      },
      {
        label: 'Remote Sensing',
        value: 'Remote Sensing',
        children: [
          {
            label: 'Satellite remote sensing',
            value: 'Satellite remote sensing',
          },
          {
            label: 'Airborne remote sensing',
            value: 'Airborne remote sensing',
          },
          {
            label: 'Ground-based remote sensing',
            value: 'Ground-based remote sensing',
          }

        ]

      }


    ]
  },

  ///////////////////////////Environmental science/////////////////////////////////////

  {
    label: 'Environmental science',
    value: 'Environmental science',
    children: [
      {
        "label": "Air Pollution",
        "value": "Air Pollution",
        "children": [
          {
            "label": "Air Quality Modeling",
            "value": "Air Quality Modeling"
          },
          {
            "label": "Emission Control Technologies",
            "value": "Emission Control Technologies"
          },
          {
            "label": "Policy and Regulation",
            "value": "Policy and Regulation"
          },
          {
            "label": "Atmospheric Chemistry",
            "value": "Atmospheric Chemistry"
          }
        ]

      },
      {
        "label": "Water Resources",
        "value": "Water Resources",
        children: [
          {
            "label": "Hydrology",
            "value": "Hydrology"
          },
          {
            "label": "Water Treatment and Pollution Control",
            "value": "Water Treatment and Pollution Control"
          },
          {
            "label": "Water Management and Conservation",
            "value": "Water Management and Conservation"
          },
          {
            "label": "Water Policy and Governance",
            "value": "Water Policy and Governance"
          }
        ]

      },
      {
        "label": "Biodiversity and Conservation",
        "value": "Biodiversity and Conservation",
        children: [
          {
            "label": "Ecology",
            "value": "Ecology",
            children: [
              {
                "label": "Ecosystem Management",
                "value": "Ecosystem Management"
              },
              {
                "label": "Applied Ecology",
                "value": "Applied Ecology"
              },
              {
                "label": "Ecological Restoration",
                "value": "Ecological Restoration"
              },
              {
                "label": "Conservation Biology",
                "value": "Conservation Biology"
              },
              {
                "label": "Marine Conservation",
                "value": "Marine Conservation"
              },
              {
                "label": "Marine Ecology",
                "value": "Marine Ecology"
              },
              {
                "label": "Aquatic Ecology",
                "value": "Aquatic Ecology"
              },
              {
                "label": "Conservation Genetics",
                "value": "Conservation Genetics"
              },
              {
                "label": "Grasslands",
                "value": "Grasslands"
              },
              {
                "label": "Systems Ecology",
                "value": "Systems Ecology"
              },
              {
                "label": "Biodiversity",
                "value": "Biodiversity"
              },
              {
                "label": "Microbial Ecology",
                "value": "Microbial Ecology"
              },
              {
                "label": "Human Ecology",
                "value": "Human Ecology"
              },
              {
                "label": "Landscape Ecology",
                "value": "Landscape Ecology"
              }
            ]

          },
          {
            "label": "Conservation Biology",
            "value": "Conservation Biology"
          },
          {
            "label": "Conservation Policy and Planning",
            "value": "Conservation Policy and Planning"
          }
        ]




      },
      {
        "label": "Climate Change",
        "value": "Climate Change",
        children: [
          {
            "label": "Climate Science",
            "value": "Climate Science"
          },
          {
            "label": "Climate Modeling",
            "value": "Climate Modeling"
          },
          {
            "label": "Climate Impacts and Adaptation",
            "value": "Climate Impacts and Adaptation"
          },
          {
            "label": "Climate Change Policy and Mitigation",
            "value": "Climate Change Policy and Mitigation"
          }
        ]

      },
      {
        "label": "Environmental Toxicology",
        "value": "Environmental Toxicology",
        children: [
          {
            "label": "Toxicology",
            "value": "Toxicology"
          },
          {
            "label": "Environmental Contaminants",
            "value": "Environmental Contaminants"
          },
          {
            "label": "Environmental Risk Assessment",
            "value": "Environmental Risk Assessment"
          },
          {
            "label": "Environmental Health",
            "value": "Environmental Health"
          }
        ]

      }
    ]

  },


  ///////////////////////////Food Science/////////////////////////////////////


  {
    label: 'Food Science',
    value: 'Food Science ',
    children: [
      {
        "label": "Food Microbiology",
        "value": "Food Microbiology",
        children: [
          {
            "label": "Food Spoilage and Fermentation",
            "value": "Food Spoilage and Fermentation"
          },
          {
            "label": "Probiotics and Prebiotics",
            "value": "Probiotics and Prebiotics"
          },
          {
            "label": "Foodborne Pathogen Control",
            "value": "Foodborne Pathogen Control"
          }
        ]

      },
      {
        "label": "Food Processing and Engineering",
        "value": "Food Processing and Engineering",
        children: [
          {
            "label": "Unit Operations in Food Processing",
            "value": "Unit Operations in Food Processing"
          },
          {
            "label": "Food Packaging and Technology",
            "value": "Food Packaging and Technology"
          },
          {
            "label": "Food Rheology and Texture",
            "value": "Food Rheology and Texture"
          }
        ]

      },
      {
        "label": "Food Product Development",
        "value": "Food Product Development",
        ////////////////// baki
      }
    ]

  },

  ///////////////////////////Renewable Energy/////////////////////////////////////

  {
    label: 'Renewable Energy',
    value: 'Renewable Energy',
    children: [
      {
        "label": "Solar Energy",
        "value": "Solar Energy",
        children: [
          {
            "label": "Photovoltaic (PV) Systems",
            "value": "Photovoltaic (PV) Systems"
          },
          {
            "label": "Concentrated Solar Power (CSP)",
            "value": "Concentrated Solar Power (CSP)"
          },
          {
            "label": "Solar Thermal Technologies",
            "value": "Solar Thermal Technologies"
          }
        ]

      },
      {
        "label": "Wind Energy",
        "value": "Wind Energy",
        children: [
          {
            "label": "Wind Turbine Technology",
            "value": "Wind Turbine Technology"
          },
          {
            "label": "Wind Resource Assessment",
            "value": "Wind Resource Assessment"
          },
          {
            "label": "Grid Integration and Power Management",
            "value": "Grid Integration and Power Management"
          }
        ]

      },
      {
        "label": "Hydropower",
        "value": "Hydropower",
        children: [
          {
            "label": "Hydropower Plant Design and Construction",
            "value": "Hydropower Plant Design and Construction"
          },
          {
            "label": "Small Hydropower and Microhydro",
            "value": "Small Hydropower and Microhydro"
          },
          {
            "label": "Hydropower Policy and Regulation",
            "value": "Hydropower Policy and Regulation"
          }
        ]

      },
      {
        "label": "Geothermal Energy",
        "value": "Geothermal Energy",
        children: [
          {
            "label": "Geothermal Resource Assessment",
            "value": "Geothermal Resource Assessment"
          },
          {
            "label": "Geothermal Power Plant Design and Operation",
            "value": "Geothermal Power Plant Design and Operation"
          },
          {
            "label": "Direct Use of Geothermal Energy",
            "value": "Direct Use of Geothermal Energy"
          }
        ]

      },
      {
        "label": "Biomass and Bioenergy",
        "value": "Biomass and Bioenergy",
        children: [
          {
            "label": "Biomass Production and Processing",
            "value": "Biomass Production and Processing"
          },
          {
            "label": "Biofuels",
            "value": "Biofuels"
          },
          {
            "label": "Biogas and Anaerobic Digestion",
            "value": "Biogas and Anaerobic Digestion"
          }
        ]

      },
      {
        "label": "Other Renewable Energy Technologies",
        "value": "Other Renewable Energy Technologies",
        children: [
          {
            "label": "Ocean Energy",
            "value": "Ocean Energy"
          },
          {
            "label": "Hydrogen Energy",
            "value": "Hydrogen Energy"
          },
          {
            "label": "Energy Storage and Grid Integration",
            "value": "Energy Storage and Grid Integration"
          }
        ]

      }
    ]

  },
  ///////////////////////////Medical Device/////////////////////////////////////

  {
    label: 'Medical Device',
    value: 'Medical Device',
    children: [
      {
        "label": "Device Types",
        "value": "Device Types",
        children: [
          {
            "label": "Implantable Devices",
            "value": "Implantable Devices"
          },
          {
            "label": "Diagnostic Devices",
            "value": "Diagnostic Devices"
          },
          {
            "label": "Therapeutic Devices",
            "value": "Therapeutic Devices"
          },
          {
            "label": "Assistive Technologies",
            "value": "Assistive Technologies"
          }
        ]

      },
      {
        "label": "Technology & Engineering",
        "value": "Technology & Engineering",
        children: [
          {
            "label": "Biomaterials",
            "value": "Biomaterials"
          },
          {
            "label": "Microfluidics & Nanotechnology",
            "value": "Microfluidics & Nanotechnology"
          },
          {
            "label": "Medical Imaging & Sensors",
            "value": "Medical Imaging & Sensors"
          },
          {
            "label": "Robotics & Artificial Intelligence",
            "value": "Robotics & Artificial Intelligence"
          }
        ]

      },
      {
        "label": "Clinical Applications and Integration",
        "value": "Clinical Applications and Integration",
        children: [
          {
            "label": "Cardiovascular Devices",
            "value": "Cardiovascular Devices"
          },
          {
            "label": "Neurological Devices",
            "value": "Neurological Devices"
          },
          {
            "label": "Orthopedic Devices",
            "value": "Orthopedic Devices"
          },
          {
            "label": "Rehabilitation Devices",
            "value": "Rehabilitation Devices"
          },
          {
            "label": "Point-of-Care Diagnostics",
            "value": "Point-of-Care Diagnostics"
          }
        ]

      },
      {
        "label": "Diagnostics & Monitoring",
        "value": "Diagnostics & Monitoring",
        children: [
          {
            "label": "Imaging Devices",
            "value": "Imaging Devices"
          },
          {
            "label": "Laboratory Instruments",
            "value": "Laboratory Instruments"
          },
          {
            "label": "Biosensors",
            "value": "Biosensors"
          },
          {
            "label": "Vital Signs Monitors",
            "value": "Vital Signs Monitors"
          }
        ]

      },
      {
        "label": "Therapeutic & Interventional",
        "value": "Therapeutic & Interventional",
        children: [
          {
            "label": "Implants",
            "value": "Implants"
          },
          {
            "label": "Prosthetics & Orthotics",
            "value": "Prosthetics & Orthotics"
          },
          {
            "label": "Surgical Instruments",
            "value": "Surgical Instruments"
          },
          {
            "label": "Respiratory Support Devices",
            "value": "Respiratory Support Devices"
          },
          {
            "label": "Dialysis Machines",
            "value": "Dialysis Machines"
          },
          {
            "label": "Drug Delivery Systems",
            "value": "Drug Delivery Systems"
          }
        ]


      },
      {
        "label": "Assistive & Rehabilitation",
        "value": "Assistive & Rehabilitation",
        children: [
          {
            "label": "Wheelchairs & Mobility Aids",
            "value": "Wheelchairs & Mobility Aids"
          },
          {
            "label": "Hearing Aids",
            "value": "Hearing Aids"
          },
          {
            "label": "Vision Aids",
            "value": "Vision Aids"
          },
          {
            "label": "Speech-generating Devices",
            "value": "Speech-generating Devices"
          },
          {
            "label": "Physical Therapy Equipment",
            "value": "Physical Therapy Equipment"
          }
        ]

      },
      {
        "label": "Personal & Home-based",
        "value": "Personal & Home-based",
        children: [
          {
            "label": "Blood Glucose Monitors",
            "value": "Blood Glucose Monitors"
          },
          {
            "label": "Thermometers",
            "value": "Thermometers"
          },
          {
            "label": "Blood Pressure Monitors",
            "value": "Blood Pressure Monitors"
          },
          {
            "label": "Pregnancy Tests",
            "value": "Pregnancy Tests"
          },
          {
            "label": "Nebulizers",
            "value": "Nebulizers"
          }
        ]

      }
    ]

  },


  ///////////////////////////Healthcare/////////////////////////////////////


  {
    label: 'Healthcare',
    value: 'Healthcare',
    children: [
      {
        "label": "Public Health",
        "value": "Public Health",
        children: [
          {
            "label": "Epidemiology",
            "value": "Epidemiology"
          },
          {
            "label": "Environmental Epidemiology",
            "value": "Environmental Epidemiology"
          },
          {
            "label": "Pandemic Preparedness",
            "value": "Pandemic Preparedness"
          },
          {
            "label": "Emergency Preparedness",
            "value": "Emergency Preparedness"
          },
          {
            "label": "Food Security",
            "value": "Food Security"
          },
          {
            "label": "Poverty Alleviation",
            "value": "Poverty Alleviation"
          },
          {
            "label": "Disaster Relief",
            "value": "Disaster Relief"
          },
          {
            "label": "Rural Development",
            "value": "Rural Development"
          },
          {
            "label": "Contact Tracing",
            "value": "Contact Tracing"
          },
          {
            "label": "Global Health",
            "value": "Global Health"
          },
          {
            "label": "Disease Control and Prevention",
            "value": "Disease Control and Prevention"
          },
          {
            "label": "Public Health and Sanitation",
            "value": "Public Health and Sanitation"
          },
          {
            "label": "Community Health Services",
            "value": "Community Health Services"
          },
          {
            "label": "Quality of Life Assessment",
            "value": "Quality of Life Assessment"
          },
          {
            "label": "Tobacco Use Prevention & Control",
            "value": "Tobacco Use Prevention & Control"
          },
          {
            "label": "Foodborne Disease",
            "value": "Foodborne Disease"
          }
        ]

      },
      {
        "label": "Public Safety",
        "value": "Public Safety",
        children: [
          {
            "label": "Firefighting Equipment & Supplies",
            "value": "Firefighting Equipment & Supplies"
          },
          {
            "label": "Firefighting",
            "value": "Firefighting"
          },
          {
            "label": "Law Enforcement",
            "value": "Law Enforcement"
          },
          {
            "label": "Health Technology Assessment",
            "value": "Health Technology Assessment"
          },
          {
            "label": "E-Health & Telemedicine",
            "value": "E-Health & Telemedicine"
          }
        ]

      },
      {
        "label": "Occupational Health & Safety",
        "value": "Occupational Health & Safety",
        children: [
          {
            "label": "Industrial Hygiene",
            "value": "Industrial Hygiene"
          },
          {
            "label": "Occupational Toxicology",
            "value": "Occupational Toxicology"
          },
          {
            "label": "Construction Site Safety",
            "value": "Construction Site Safety"
          },
          {
            "label": "Biohazard Waste Management",
            "value": "Biohazard Waste Management"
          },
          {
            "label": "Workplace Safety Assessment",
            "value": "Workplace Safety Assessment"
          },
          {
            "label": "Ergonomics",
            "value": "Ergonomics"
          },
          {
            "label": "Rural Health",
            "value": "Rural Health"
          },
          {
            "label": "Healthcare Reimbursement",
            "value": "Healthcare Reimbursement"
          }
        ]

      },
      {
        "label": "Psychiatry",
        "value": "Psychiatry",
        children: [
          {
            "label": "Psychotraumatology",
            "value": "Psychotraumatology"
          },
          {
            "label": "Child & Adolescent Psychiatry",
            "value": "Child & Adolescent Psychiatry"
          },
          {
            "label": "Neuropsychiatry",
            "value": "Neuropsychiatry"
          },
          {
            "label": "Forensic Psychiatry",
            "value": "Forensic Psychiatry"
          },
          {
            "label": "Addiction Psychiatry",
            "value": "Addiction Psychiatry"
          },
          {
            "label": "Psychopharmacology",
            "value": "Psychopharmacology"
          },
          {
            "label": "Cognitive Behavioral Therapy",
            "value": "Cognitive Behavioral Therapy"
          },
          {
            "label": "Geriatric Psychiatry",
            "value": "Geriatric Psychiatry"
          }
        ]

      }
    ]

  },


  ///////////////////////////Sustainability science/////////////////////////////////////


  {
    label: 'Sustainability science',
    value: 'Sustainability science',
    children: [
      {
        "label": "Sustainability Solutions & Implementation",
        "value": "Sustainability Solutions & Implementation",
        children: [
          {
            "label": "Sustainable Urban Systems",
            "value": "Sustainable Urban Systems"
          },
          {
            "label": "Sustainable Agriculture and Food Systems",
            "value": "Sustainable Agriculture and Food Systems"
          },
          {
            "label": "Renewable Energy and Energy Efficiency",
            "value": "Renewable Energy and Energy Efficiency"
          },
          {
            "label": "Water Resource Management",
            "value": "Water Resource Management"
          }
        ]

      },
      {
        "label": "Other Areas of Expertise",
        "value": "Other Areas of Expertise",
        children: [
          {
            "label": "Life Cycle Assessment and Industrial Ecology",
            "value": "Life Cycle Assessment and Industrial Ecology"
          },
          {
            "label": "Circular Economy and Waste Management",
            "value": "Circular Economy and Waste Management"
          },
          {
            "label": "Climate Change Mitigation and Adaptation",
            "value": "Climate Change Mitigation and Adaptation"
          },
          {
            "label": "Biodiversity Conservation and Ecosystem Services",
            "value": "Biodiversity Conservation and Ecosystem Services"
          }
        ]

      }
    ]

  },

];