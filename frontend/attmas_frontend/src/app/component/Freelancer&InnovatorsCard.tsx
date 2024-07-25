"use client"
import * as React from 'react';
import {
  Box, Card, CardContent, Typography, TextField, IconButton, Grid, Chip, Autocomplete, Drawer
} from '@mui/material';
import axios from 'axios';
import FilterAltIcon from '@mui/icons-material/FilterAlt';
import InfiniteScroll from 'react-infinite-scroll-component';
import { APIS } from '../constants/api.constant';
import { categories, subcategories1 } from '../constants/categories';
import CloseIcon from '@mui/icons-material/Close';
interface User {
  _id: string;
  firstName: string;
  lastName: string;
  mobileNumber: string;
  username: string;
  userType: string;
}

interface CategoryData {
  categories: string[];
  subcategories: string[];
  username: string;
  objectKey: string;
}

interface UserListProps {
  apiUrl: string;
  title: string;
  endMessage: string;
}

const UserList: React.FC<UserListProps> = ({ apiUrl, title, endMessage }) => {
  const [rowData, setRowData] = React.useState<User[]>([]);
  const [categoryData, setCategoryData] = React.useState<CategoryData[]>([]);
  const [filterText, setFilterText] = React.useState<string>('');
  const [filterVisible, setFilterVisible] = React.useState<boolean>(false);
  const [page, setPage] = React.useState<number>(1);
  const [hasMore, setHasMore] = React.useState<boolean>(true);
  const [selectedCategory, setSelectedCategory] = React.useState<string | null>(null);
  const [selectedSubCategory, setSelectedSubCategory] = React.useState<string | null>(null);
  const [drawerOpen, setDrawerOpen] = React.useState<boolean>(false);
  const [selectedUser, setSelectedUser] = React.useState<User | null>(null);

  React.useEffect(() => {
    const fetchCategories = async () => {
      try {
        const categoriesResponse = await axios.get<CategoryData[]>(APIS.CATEGORIES);
        setCategoryData(categoriesResponse.data);
      } catch (error) {
        console.error('Error fetching categories:', error);
      }
    };

    fetchCategories();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await axios.get<User[]>(
        `${apiUrl}&page=${page}&limit=6&filter=${filterText}&category=${selectedCategory ?? ''}&subCategory=${selectedSubCategory ?? ''}`
      );
      if (response.data.length < 6) {
        setHasMore(false);
      }
      setRowData(prev => (page === 1 ? response.data : [...prev, ...response.data]));
      setPage(prev => prev + 1);
    } catch (error) {
      console.error('Error fetching users:', error);
      setHasMore(false);
    }
  };

  React.useEffect(() => {
    fetchUsers();
  }, [filterText, selectedCategory, selectedSubCategory]);

  const handleFilterChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setFilterText(event.target.value);
    setPage(1);
    setRowData([]);
    setHasMore(true);
  };

  const handleCategoryChange = (event: React.SyntheticEvent, value: string | null) => {
    setSelectedCategory(value);
    setSelectedSubCategory(null);
    setPage(1);
    setRowData([]);
    setHasMore(true);
  };

  const handleSubCategoryChange = (event: React.SyntheticEvent, value: string | null) => {
    setSelectedSubCategory(value);
    setPage(1);
    setRowData([]);
    setHasMore(true);
  };

  const toggleFilterVisibility = () => {
    setFilterVisible(!filterVisible);
  };

  const getUserCategoryData = (username: string) => {
    const userCategoryData = categoryData.find(data => data.username === username);
    return userCategoryData ? userCategoryData : { categories: [], subcategories: [] };
  };



  const handleUserClick = (user: User) => {
    setSelectedUser(user);
    setDrawerOpen(true);
  };

  const handleDrawerClose = () => {
    setDrawerOpen(false);
    setSelectedUser(null);
  };

  return (
    <Box
      sx={{
        background: '#f0f0f0',
        p: 2,
        borderRadius: 1,
        boxShadow: '0px 0px 10px rgba(0, 0, 0, 0.8)',
        '@media (max-width: 767px)': {
          position: 'relative',
          left: '25px',
        },
      }}
    >
      <Box sx={{ mb: 2, position: 'relative' }}>
        <Grid container alignItems="center" spacing={2}>
          <Grid item xs={12} sm="auto">
            <Typography variant="h4">{title}</Typography>
          </Grid>
          <Grid item xs={12} sm="auto"
            sx={{
              position: { xs: 'absolute', sm: 'static' },
              top: { xs: 0 },
              right: { xs: 0 },
              display: 'flex',
              justifyContent: 'flex-end'
            }}>
            <IconButton onClick={toggleFilterVisibility}>
              <FilterAltIcon />
            </IconButton>
          </Grid>
        </Grid>
        {filterVisible && (
          <Grid container spacing={2} sx={{ mt: 2 }}>
            <Grid item xs={12} sm={6} md={3}>
              <TextField
                label="Filter by name"
                color="secondary"
                variant="outlined"
                value={filterText}
                onChange={handleFilterChange}
                fullWidth
              />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Autocomplete
                value={selectedCategory}
                onChange={handleCategoryChange}
                options={categories}
                getOptionLabel={(option) => option}
                renderInput={(params) => (
                  <TextField {...params} label="Category" color="secondary" variant="outlined" fullWidth />
                )}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Autocomplete
                value={selectedSubCategory}
                onChange={handleSubCategoryChange}
                options={selectedCategory ? subcategories1[selectedCategory] : []}
                getOptionLabel={(option) => option}
                renderInput={(params) => (
                  <TextField {...params} label="Sub-category" color="secondary" variant="outlined" fullWidth />
                )}
                disabled={!selectedCategory}
              />
            </Grid>
          </Grid>
        )}
      </Box>
      <InfiniteScroll
        dataLength={rowData.length}
        next={fetchUsers}
        hasMore={hasMore}
        loader={<h4>Loading...</h4>}
        endMessage={<p style={{ textAlign: 'center' }}>{endMessage}</p>}
      >
        <Box sx={{ mt: 2 }}>
          {rowData.map((user) => {
            const { categories, subcategories } = getUserCategoryData(user.username);
            return (
              <Card key={user._id} sx={{ mb: 2, borderRadius: '16px', boxShadow: '0px 3px 6px rgba(0, 0, 0, 0.1)' }}>
                <CardContent>
                  <Grid container spacing={1}>
                    <Grid item xs={12} sx={{ display: 'flex', justifyContent: 'space-between' }}>
                      <Typography variant="h6" onClick={() => handleUserClick(user)} sx={{ cursor: 'pointer' }}>
                        {user.firstName} {user.lastName}
                      </Typography>
                      <Chip variant="outlined" label={user.userType} color="secondary" />
                    </Grid>
                    <Grid item xs={12}>
                      <Typography variant="body2" sx={{ mt: 0.5 }}>
                        {user.username} | {user.mobileNumber}
                      </Typography>
                    </Grid>
                    <Grid item xs={12}>
                      <Typography variant="body2" sx={{ mt: 0.5 }}>
                        {categories.join(', ')} | {subcategories.join(', ')}
                      </Typography>
                    </Grid>
                  </Grid>
                </CardContent>
              </Card>
            );
          })}
        </Box>
      </InfiniteScroll>

      <Drawer anchor="right" open={drawerOpen} onClose={handleDrawerClose}
        PaperProps={{
          sx: {
            borderRadius: '20px 0px 0px 20px',
            width: '600px',
            p: 2,
            backgroundColor: '#f9f9f9',
            '@media (max-width: 767px)': {
              width: '100%',
            }
          }
        }}
        BackdropProps={{
          sx: {
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
          }
        }}>

        <div style={{ position: 'relative' }}>
          <IconButton
            onClick={handleDrawerClose}
            sx={{ position: 'absolute', top: '-6px', right: 16 }}
          >
            <CloseIcon />
          </IconButton>
          {selectedUser && (
            <>
              <Typography variant="h6" sx={{ mb: 3, fontWeight: 'bold' }}>
                Detailed Information
              </Typography>
              <TextField
                label="User Name"
                value={`${selectedUser.firstName} ${selectedUser.lastName}`}
                InputProps={{ readOnly: true }}
                variant="outlined"
                color='secondary'
                fullWidth
                disabled
                sx={{ mb: 2 }}
              />

              <TextField
                label="Email"
                value={selectedUser.username}
                InputProps={{ readOnly: true }}
                variant="outlined"
                color='secondary'
                fullWidth
                disabled
                sx={{ mb: 2 }}
              />

              <TextField
                label="Mobile Number"
                value={selectedUser.mobileNumber}
                InputProps={{ readOnly: true }}
                variant="outlined"
                color='secondary'
                disabled
                fullWidth
                sx={{ mb: 2 }}
              />

              <TextField
                label="User Type"
                value={selectedUser.userType}
                InputProps={{ readOnly: true }}
                variant="outlined"
                color='secondary'
                fullWidth
                disabled
                sx={{ mb: 2 }}
              />

              {getUserCategoryData(selectedUser.username) && (
                <>
                  <TextField
                    label="Categories"
                    value={getUserCategoryData(selectedUser.username).categories.join(', ')}
                    InputProps={{ readOnly: true }}
                    variant="outlined"
                    color='secondary'
                    fullWidth
                    disabled
                    sx={{ mb: 2 }}
                  />

                  <TextField
                    label="Subcategories"
                    value={getUserCategoryData(selectedUser.username).subcategories.join(', ')}
                    InputProps={{ readOnly: true }}
                    variant="outlined"
                    color='secondary'
                    fullWidth
                    disabled
                    sx={{ mb: 2 }}
                  />
                </>
              )}
            </>
          )}
        </div>
      </Drawer>
    </Box>
  );
};

export default UserList;
