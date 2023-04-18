// ** Icon imports
import HomeOutline from 'mdi-material-ui/HomeOutline'
import AccountCogOutline from 'mdi-material-ui/AccountCogOutline'
import Inventory2OutlinedIcon from '@mui/icons-material/Inventory2Outlined'
import GrainOutlinedIcon from '@mui/icons-material/GrainOutlined'
import BusinessOutlinedIcon from '@mui/icons-material/BusinessOutlined'
import SettingsOutlinedIcon from '@mui/icons-material/SettingsOutlined'
import LocalOfferOutlinedIcon from '@mui/icons-material/LocalOfferOutlined'
import ReceiptLongOutlinedIcon from '@mui/icons-material/ReceiptLongOutlined'

// ** Type import
import { VerticalNavItemsType } from 'src/@core/layouts/types'

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
    },
    {
      title: 'Cài đặt',
      icon: SettingsOutlinedIcon,
      path: '/setting'
    }
  ]
}

export default navigation
