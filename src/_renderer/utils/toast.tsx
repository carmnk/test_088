import React from 'react'
import { Box, Paper, Typography } from '@mui/material'
import toast from 'react-hot-toast'

export const userToast = (title: string, message: string) => {
  toast.custom(
    <Paper elevation={21}>
      <Box
        p={2}
        border="1px solid #999"
        borderColor={'secondary.light'}
        borderRadius={2}
      >
        <Box>
          <Typography variant="h5">{title}</Typography>
        </Box>
        <Box>
          <Typography>{message}</Typography>
        </Box>
      </Box>
    </Paper>,
    {
      position: 'bottom-center',
    }
  )
}
