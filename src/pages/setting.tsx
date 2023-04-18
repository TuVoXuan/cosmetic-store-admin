import { Card, CardContent, CardHeader, Grid } from '@mui/material'
import React from 'react'
import SettingItem from '../views/setting/settingItem'

export default function Setting() {
  return (
    <Card>
      <CardHeader
        title='Cài đặt'
        titleTypographyProps={{
          sx: {
            mb: 2.5,
            lineHeight: '2rem !important',
            letterSpacing: '0.15px !important'
          }
        }}
      />
      <CardContent sx={{ pt: theme => `${theme.spacing(3)} !important` }}>
        <Grid container spacing={[5, 0]}>
          <Grid item xs={12} sm={6}>
            <SettingItem />
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  )
}
