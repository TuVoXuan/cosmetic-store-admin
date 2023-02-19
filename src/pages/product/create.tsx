// ** React Imports
import { SyntheticEvent, useState } from 'react'

// ** MUI Imports
import Box from '@mui/material/Box'
import Card from '@mui/material/Card'
import TabList from '@mui/lab/TabList'
import TabPanel from '@mui/lab/TabPanel'
import TabContext from '@mui/lab/TabContext'
import { styled } from '@mui/material/styles'
import MuiTab, { TabProps } from '@mui/material/Tab'

// ** Icons Imports
import Inventory2OutlinedIcon from '@mui/icons-material/Inventory2Outlined'
import WidgetsOutlinedIcon from '@mui/icons-material/WidgetsOutlined'

// ** Tab import
import TabProduct from '../../views/prodcut/TabProduct'
import TabProductItem from '../../views/prodcut/TabProductItem'

// ** Third Party Styles Imports
import 'react-datepicker/dist/react-datepicker.css'

const Tab = styled(MuiTab)<TabProps>(({ theme }) => ({
  [theme.breakpoints.down('md')]: {
    minWidth: 100
  },
  [theme.breakpoints.down('sm')]: {
    minWidth: 67
  }
}))

const TabName = styled('span')(({ theme }) => ({
  lineHeight: 1.71,
  fontSize: '0.875rem',
  marginLeft: theme.spacing(2.4),
  [theme.breakpoints.down('md')]: {
    display: 'none'
  }
}))

const CreateProduct = () => {
  // ** State
  const [value, setValue] = useState<string>('product')

  const handleChange = (event: SyntheticEvent, newValue: string) => {
    setValue(newValue)
  }

  return (
    <Card>
      <TabContext value={value}>
        <TabList
          onChange={handleChange}
          aria-label='product tabs'
          sx={{ borderBottom: theme => `1px solid ${theme.palette.divider}` }}
        >
          <Tab
            value='product'
            label={
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <Inventory2OutlinedIcon />
                <TabName>Product</TabName>
              </Box>
            }
          />
          <Tab
            value='productItem'
            label={
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <WidgetsOutlinedIcon />
                <TabName>Product Item</TabName>
              </Box>
            }
          />
        </TabList>

        <TabPanel sx={{ p: 0 }} value='product'>
          <TabProduct />
        </TabPanel>
        <TabPanel sx={{ p: 0 }} value='productItem'>
          <TabProductItem />
        </TabPanel>
      </TabContext>
    </Card>
  )
}

export default CreateProduct
