import { Box, Button, colors } from '@mui/material'
import React from 'react'
import { AddExhibition } from '../component/exhibition/add-exhibition'

const Exhibition = () => {
  return (
    <Box sx={{borderRadius: 3, background: colors.grey}}>
      <Box sx={{display: 'flex' , justifyContent: 'space-between'}}>
        <Box component="h2" sx={{marginY: 0}}>Exhibitions</Box>
        <AddExhibition />
      </Box>
    </Box>
  )
}

export default Exhibition
