// ** Icon imports
import Login from 'mdi-material-ui/Login'
import Table from 'mdi-material-ui/Table'
import CubeOutline from 'mdi-material-ui/CubeOutline'
import HomeOutline from 'mdi-material-ui/HomeOutline'
import FormatLetterCase from 'mdi-material-ui/FormatLetterCase'
import AccountCogOutline from 'mdi-material-ui/AccountCogOutline'
import CreditCardOutline from 'mdi-material-ui/CreditCardOutline'
import AccountPlusOutline from 'mdi-material-ui/AccountPlusOutline'
import AlertCircleOutline from 'mdi-material-ui/AlertCircleOutline'
import GoogleCirclesExtended from 'mdi-material-ui/GoogleCirclesExtended'
import Inventory2OutlinedIcon from '@mui/icons-material/Inventory2Outlined'
import GrainOutlinedIcon from '@mui/icons-material/GrainOutlined'
import BusinessOutlinedIcon from '@mui/icons-material/BusinessOutlined'

// ** Type import
import { VerticalNavItemsType } from 'src/@core/layouts/types'
import LocalOfferOutlinedIcon from '@mui/icons-material/LocalOfferOutlined'
import ReceiptLongOutlinedIcon from '@mui/icons-material/ReceiptLongOutlined'

const navigation = (): VerticalNavItemsType => {
  return [
    {
      title: 'Dashboard',
      icon: HomeOutline,
      path: '/'
    },
    {
      title: 'Sản phẩm',
      icon: Inventory2OutlinedIcon,
      path: '/product'
    },
    {
      title: 'Biến thể',
      icon: GrainOutlinedIcon,
      path: '/variation'
    },
    {
      title: 'Thương hiệu',
      icon: BusinessOutlinedIcon,
      path: '/brand'
    },
    {
      title: 'Thẻ sản phẩm',
      icon: LocalOfferOutlinedIcon,
      path: '/product-tag'
    },
    {
      title: 'Đơn hàng',
      icon: ReceiptLongOutlinedIcon,
      path: '/orders'
    },
    {
      title: 'Tài khoản',
      icon: AccountCogOutline,
      path: '/account-settings'
    }
  ]
}

export default navigation
