// const customTheme = createTheme({
//     palette: {
//         primary: {
//             main: "rgb(0,23,98)",
//         },
//     },
//     shape: {
//         borderRadius: 20,
//     },
//     components: {
//         MuiTextField: {
//             styleOverrides: {
//                 root: {
//                     '& .MuiOutlinedInput-root': {
//                         '& fieldset': {
//                             borderRadius: 20,
//                         },
//                         '&:hover fieldset': {
//                             borderColor: "rgb(0,23,98)",
//                         },
//                         '&.Mui-focused fieldset': {
//                             borderColor: "rgb(0,23,98)",
//                         },
//                     },
//                 },
//             },
//         },
//         MuiButton: {
//             styleOverrides: {
//                 root: {
//                     borderRadius: 20,
//                     textTransform: 'none',
//                     backgroundColor: "rgb(0,23,98)",
//                     '&:hover': {
//                         backgroundColor: "rgb(0,23,98)",
//                     },
//                 },
//             },
//         },
//         MuiCheckbox: {
//             styleOverrides: {
//                 root: {
//                     color: "rgb(0,23,98)",
//                     '&.Mui-checked': {
//                         color: "rgb(0,23,98)",
//                     },
//                 },
//             },
//         },
//     },
// });

// const ITEM_HEIGHT = 48;
// const ITEM_PADDING_TOP = 8;
// const MenuProps = {
//     PaperProps: {
//         style: {
//             maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
//             width: 250,
//         },
//     },
// };




"use client";
import React, { useState } from 'react';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import {
    Box,
    Button,
    Container,
    CssBaseline,
    Grid,
    MenuItem,
    Typography,
    Select,
    FormControl,
    InputLabel,
    OutlinedInput,
    Checkbox,
    ListItemText,
    SelectChangeEvent,
} from '@mui/material';
import { useFormik } from 'formik';
import { categories } from '@/app/constents/categories';
import { subcategories } from '@/app/constents/subcategories';

const customTheme = createTheme({
    palette: {
        primary: {
            main: "rgb(0,23,98)",
        },
    },
    shape: {
        borderRadius: 20,
    },
});

function getStyles(name: string, selectedCategories: string[], theme: any) {
    return {
        fontWeight:
            selectedCategories.indexOf(name) === -1
                ? theme.typography.fontWeightRegular
                : theme.typography.fontWeightMedium,
    };
}

interface ProfileForm3Props {
    onPrevious: () => void;
}

const ProfileForm3: React.FC<ProfileForm3Props> = ({ onPrevious }) => {
    const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
    const [selectedSubcategories, setSelectedSubcategories] = useState<string[]>([]);

    const formik = useFormik({
        initialValues: {
            categories: [] as string[],
            subcategories: [] as string[],
        },
        onSubmit: async (values) => {
            console.log('Form values:', values);
        },
    });

    const handleCategoryChange = (event: SelectChangeEvent<typeof selectedCategories>) => {
        const {
            target: { value },
        } = event;
        setSelectedCategories(typeof value === 'string' ? value.split(',') : value);
        setSelectedSubcategories([]);
        formik.setFieldValue('categories', value);
        formik.setFieldValue('subcategories', []);
    };

    const handleSubcategoryChange = (event: SelectChangeEvent<typeof selectedSubcategories>) => {
        const {
            target: { value },
        } = event;
        setSelectedSubcategories(typeof value === 'string' ? value.split(',') : value);
        formik.setFieldValue('subcategories', value);
    };

    return (
        <ThemeProvider theme={customTheme}>
            <Container component="main" maxWidth="md">
                <CssBaseline />
                <Box
                    sx={{
                        marginTop: 8,
                        padding: 4,
                        border: '1px solid #ccc',
                        borderRadius: 2,
                        width: '142.5%',
                        position: 'relative',
                        right: '180px',
                        bottom: "60px",
                        boxShadow: 5,
                    }}
                >
                    <Typography component="h1" variant="h5" align="center">
                        Category
                    </Typography>
                    <Typography variant="body2" color="text.secondary" align="center" mb={4}>
                        View and Change your category here
                    </Typography>
                    <Box component="form" onSubmit={formik.handleSubmit} noValidate sx={{ mt: 1 }}>
                        <Grid container spacing={2}>
                            <Grid item xs={12} sm={6}>
                                <FormControl fullWidth>
                                    <InputLabel id="categories-label">Categories</InputLabel>
                                    <Select
                                        labelId="categories-label"
                                        id="categories"
                                        name="categories"
                                        multiple
                                        value={selectedCategories}
                                        onChange={handleCategoryChange}
                                        input={<OutlinedInput id="select-multiple-chip" label="Categories" />}
                                        renderValue={(selected) => (
                                            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                                                {(selected as string[]).map((value) => (
                                                    <Typography key={value} variant="body2">
                                                        {value}
                                                    </Typography>
                                                ))}
                                            </Box>
                                        )}
                                    >
                                        {categories.map((category) => (
                                            <MenuItem key={category} value={category} style={getStyles(category, selectedCategories, customTheme)}>
                                                <Checkbox checked={selectedCategories.indexOf(category) > -1} />
                                                <ListItemText primary={category} />
                                            </MenuItem>
                                        ))}
                                    </Select>
                                </FormControl>
                            </Grid>
                        </Grid>
                        {selectedCategories.length > 0 && (
                            <Grid container spacing={2}>
                                <Grid item xs={12} sm={6}>
                                    <FormControl fullWidth>
                                        <InputLabel id="subcategories-label">Subcategories</InputLabel>
                                        <Select
                                            labelId="subcategories-label"
                                            id="subcategories"
                                            name="subcategories"
                                            multiple
                                            value={selectedSubcategories}
                                            onChange={handleSubcategoryChange}
                                            input={<OutlinedInput id="select-multiple-chip" label="Subcategories" />}
                                            renderValue={(selected) => (
                                                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                                                    {(selected as string[]).map((value) => (
                                                        <Typography key={value} variant="body2">
                                                            {value}
                                                        </Typography>
                                                    ))}
                                                </Box>
                                            )}
                                        >
                                            {subcategories[selectedCategories[0]].map((subcategory) => (
                                                <MenuItem key={subcategory} value={subcategory}>
                                                    {subcategory}
                                                </MenuItem>
                                            ))}
                                        </Select>
                                    </FormControl>
                                </Grid>
                            </Grid>
                        )}
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', marginTop: 2 }}>
                            <Button
                                type="button"
                                variant="contained"
                                size="small"
                                onClick={onPrevious}
                            >
                                Back
                            </Button>
                            <Button
                                type="submit"
                                variant="contained"
                                size="small"
                            >
                                Save
                            </Button>
                        </Box>
                    </Box>
                </Box>
            </Container>
        </ThemeProvider>
    );
};

export default ProfileForm3;

