"use client"
import * as React from 'react';
import {
  Box, Card, CardContent, Typography, TextField, IconButton, Grid, Chip, Select, MenuItem, FormControl, InputLabel, SelectChangeEvent
} from '@mui/material';
import axios from 'axios';
import FilterAltIcon from '@mui/icons-material/FilterAlt';
import InfiniteScroll from 'react-infinite-scroll-component';
import { APIS } from '../constants/api.constant';
import { categories, subcategories } from '../constants/categories';

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
  const [selectedCategory, setSelectedCategory] = React.useState<string>('');
  const [selectedSubCategory, setSelectedSubCategory] = React.useState<string>('');

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
        `${apiUrl}&page=${page}&limit=6&filter=${filterText}&category=${selectedCategory}&subCategory=${selectedSubCategory}`
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

  const handleCategoryChange = (event: SelectChangeEvent<string>, child: React.ReactNode) => {
    setSelectedCategory(event.target.value as string);
    setSelectedSubCategory('');
    setPage(1);
    setRowData([]);
    setHasMore(true);
  };

  const handleSubCategoryChange = (event: SelectChangeEvent<string>, child: React.ReactNode) => {
    setSelectedSubCategory(event.target.value as string);
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

  return (
    <Box
      sx={{
        background: '#f0f0f0',
        p: 2,
        borderRadius: 1,
        boxShadow: '0px 0px 10px rgba(0, 0, 0, 0.8)', // Adding shadow here
      }}
    >
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography variant="h4">{title}</Typography>
        <IconButton onClick={toggleFilterVisibility}>
          <FilterAltIcon />
        </IconButton>
        {filterVisible && (
          <>
            <TextField
              label="Filter by name"
              color="secondary"
              variant="outlined"
              value={filterText}
              onChange={handleFilterChange}
              sx={{ width: '25%' }}
            />
            <FormControl variant="outlined" sx={{ width: '25%', ml: 2 }}>
              <InputLabel color="secondary">Category</InputLabel>
              <Select
                value={selectedCategory}
                onChange={handleCategoryChange}
                label="Category"
                color="secondary"
              >
                <MenuItem value="">
                  <em>None</em>
                </MenuItem>
                {categories.map((category, index) => (
                  <MenuItem key={index} value={category}>
                    {category}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <FormControl variant="outlined" sx={{ width: '25%', ml: 2 }}>
              <InputLabel color="secondary">Sub-category</InputLabel>
              <Select
                value={selectedSubCategory}
                onChange={handleSubCategoryChange}
                label="Sub-category"
                color="secondary"
                disabled={!selectedCategory}
              >
                <MenuItem value="">
                  <em>None</em>
                </MenuItem>
                {subcategories[selectedCategory]?.map((subCategory, index) => (
                  <MenuItem key={index} value={subCategory}>
                    {subCategory}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </>
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
                      <Typography variant="h6">{user.firstName} {user.lastName}</Typography>
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
    </Box>
  );
};

export default UserList;
