import React from 'react'
import EditProfile1 from '../component/EditProfileComponents/editProfile1'
import EditProfile2 from '../component/EditProfileComponents/editProfile2'
import EditProfile from '../component/EditProfileComponents/editUserProfile'
import EditProfile3 from '../component/EditProfileComponents/editProfile3'
import Box from '@mui/material/Box';

const page = () => {
  console.log('page', page)
  return (
    <Box>
      {/* <h1> Section 1 </h1> */}
      <EditProfile />
      {/* <h1> Section 2 </h1> */}
      <EditProfile1 />
      {/* <h1> Section 3 </h1> */}
      <EditProfile2 />
      {/* <h1> Section 4 </h1> */}
      <EditProfile3 />
    </Box>

  )
}

export default page
