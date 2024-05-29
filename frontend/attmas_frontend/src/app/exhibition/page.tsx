import { Box, Button, colors } from '@mui/material'
import React from 'react'

const Exhibition = () => {
  return (
    <Box sx={{borderRadius: 3, background: colors.grey}}>
      <Box sx={{display: 'flex' , justifyContent: 'space-between'}}>
        <Box component="h2" sx={{marginY: 0}}>Exhibitions</Box>
        <Button type='button' size='small' variant='contained' sx={{borderRadius: 3}}>Create Exhibition</Button>
      </Box>
    </Box>
  )
}

export default Exhibition
