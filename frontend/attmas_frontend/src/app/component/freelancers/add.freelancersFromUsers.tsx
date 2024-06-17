'use client';
import * as React from 'react';
import { AgGridReact } from 'ag-grid-react';
import { ColDef } from 'ag-grid-community';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-alpine.css';
import axios from 'axios';
import { APIS } from '../../constants/api.constant';

interface User {
  _id: string;
  firstName: string;
  lastName: string;
  userType: string;
  mobileNumber: string;
  username: string;  // Added username field
}

const Freelancers: React.FC = () => {
  const [rowData, setRowData] = React.useState<User[]>([]);

  React.useEffect(() => {
    const fetchFreelancers = async () => {
      try {
        const response = await axios.get(APIS.FREELANCERS);
        console.log('response', response);

        setRowData(response.data.map((user: User, index: number) => ({ ...user, id: index + 1 })));
      } catch (error) {
        console.error('Error fetching freelancers:', error);
      }
    };

    fetchFreelancers();
  }, []);

  const columnDefs: ColDef[] = [
    { headerName: 'ID', field: 'id', width: 90 },
    { headerName: 'First name', field: 'firstName', width: 150 },
    { headerName: 'Last name', field: 'lastName', width: 150 },
    { headerName: 'User Type', field: 'userType', width: 150 },
    { headerName: 'Mobile Number', field: 'mobileNumber', width: 150 },
    { headerName: 'Email', field: 'username', width: 290 }
  ];

  return (
    <div className="ag-theme-alpine" style={{ height: 500, width: '982px' }}> 
      <AgGridReact
        rowData={rowData}
        columnDefs={columnDefs}
        pagination={true}
        paginationPageSize={5}
        domLayout='autoHeight'
      />
    </div>
  );
};

export default Freelancers;
