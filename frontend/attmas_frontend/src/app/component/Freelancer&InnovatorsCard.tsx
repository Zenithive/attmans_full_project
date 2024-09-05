"use client"

import * as React from 'react';
import {
  Box, Card, CardContent, Typography, TextField, IconButton, Grid, Chip, Autocomplete
} from '@mui/material';
import InfiniteScroll from 'react-infinite-scroll-component';
import { APIS } from '../constants/api.constant';
import { categories, subcategories1 } from '../constants/categories';
import { CommonAvatar } from './common-ui/avatar.component';
import { useAppSelector } from "@/app/reducers/hooks.redux";
import { UserSchema, selectUserSession } from "@/app/reducers/userReducer";
import { useState } from 'react';
import UserDrawer from './UserNameSeperate/UserDrawer';
import { ProductForBooth } from './ProductTableForBooth';
import UserFullName from './UserNameSeperate/UserFullName';
import Filters, { FilterColumn } from './filter/filter.component';
import axiosInstance from '../services/axios.service';

interface User {
  _id: string;
  firstName: string;
  lastName: string;
  mobileNumber: string;
  username: string;
  userType: string;
  personalProfilePhoto?: string;
  categories: string[]; // New field for categories
  subcategories: string[]; // New field for subcategories
  sector: string;
  organization: string;
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
  const column:Array<FilterColumn> = [
    {
      name: "First Name",
      value: '',
      type: "Texbox",
      key: 'firstName',
      isVisible: true
    },
    {
      name: "Last Name",
      value: '',
      type: "Texbox",
      key: 'lastName',
      isVisible: true
    },
    {
      name: "Username",
      value: '',
      type: "Texbox",
      key: 'username',
      isVisible: true
    },
    {
      name: "Mobile Number",
      value: '',
      type: "Texbox",
      key: 'mobileNumber',
      isVisible: true
    },
    {
      name: "Category",
      value: '',
      type: "Category",
      key: 'categories',
      isVisible: true
    },
    {
      name: "Subject Matter Expertise",
      value: '',
      type: "SubCategory",
      key: 'subCategory',
      isVisible: true
    }
  ];
  const [rowData, setRowData] = React.useState<User[]>([]);
  const [filter, setFilter] = useState('');
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
        const categoriesResponse = await axiosInstance.get<CategoryData[]>(APIS.CATEGORIES);
        setCategoryData(categoriesResponse.data);
      } catch (error) {
        console.error('Error fetching categories:', error);
      }
    };

    fetchCategories();
  }, []);

  const changeFilterOrPage = (paramStr: string) => {
    if(paramStr && paramStr.length){
      setFilter(paramStr);
    }else{
      setFilter('');
    }
    setPage(1);
  }

  const fetchUsers = async () => {
    try {
      const response = await axiosInstance.get<User[]>(
        `${apiUrl}&page=${page}&limit=20&${filter}`
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
  }, [filterText, selectedCategory, selectedSubCategory, filter]);

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
        boxShadow: '0px 0px 10px rgba(0, 0, 0, 0.8)', // Adding shadow here
      }}
    >
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography variant="h4" sx={{width: 250, fontSize: 28, fontWeight: 'bold'}}>{title}</Typography>
        {/* <IconButton onClick={toggleFilterVisibility}>
          <FilterAltIcon />
        </IconButton> */}
        <Filters column={column} onFilter={changeFilterOrPage}></Filters>
        {filterVisible && (
          <Box sx={{ display: 'flex', gap: 2, marginBottom: 2 }}>
            <TextField
              label="Search"
              value={filterText}
              onChange={handleFilterChange}
              variant="outlined"
              fullWidth
              sx={{ flex: 1 }} // Ensures the text field takes up available space
            />

            <Autocomplete
              options={categories}
              value={selectedCategory}
              onChange={handleCategoryChange}
              renderInput={(params) => <TextField {...params} label="Category" />}
              sx={{ flex: 1 }} // Ensures the autocomplete takes up available space
            />
          </Box>
        )}


      </Box>
        <InfiniteScroll
          dataLength={rowData.length}
          next={fetchUsers}
          hasMore={hasMore}
          loader={<Typography>Loading...</Typography>}
          endMessage={<Typography>{endMessage}</Typography>}
        >
          <Grid container spacing={2}>
            {rowData.map(user => (
              <Grid item xs={12} sm={6} md={4} key={user._id}>


                <Card
                  sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    p: 2,
                    cursor: 'pointer',
                    position: 'relative' // Create positioning context
                  }}
                  onClick={() => handleUserClick(user)}
                >
                  <CommonAvatar
                    url={user.personalProfilePhoto} // Pass the profile photo URL
                    style={{ width: 80, height: 80, marginRight: 15 }}
                  />
                  <CardContent>
                    {/* <Typography
                      variant="h6"
                      sx={{
                        textAlign: 'center', // Align text to the right
                        width: '100%' // Optional: Ensure it spans the full width to align correctly
                      }}
                    >
                      {`${user.firstName} ${user.lastName}`}
                    </Typography> */}

                     {/* Use the UserFullName component here */}
                     <UserFullName firstName={user.firstName} lastName={user.lastName} />


                    <Typography variant="body2" color="text.secondary">
                      {user.username} | {user.mobileNumber}
                    </Typography>
                  </CardContent>

                  <Chip
                    variant="outlined"
                    label={user.userType}
                    color="secondary"
                    sx={{
                      position: 'absolute',
                      top: 8,
                      right: 8,
                      zIndex: 1, // Ensure chip is above other content
                    }}
                  />
                </Card>


              </Grid>
            ))}
          </Grid>
        </InfiniteScroll>

      {selectedUser && (
        <UserDrawer
          open={drawerOpen}
          onClose={handleDrawerClose}
          username={selectedUser.username}
        />
      )}
    </Box>
  );
};

export default UserList;

