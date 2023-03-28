// ** React Imports
import { MouseEvent, ReactNode, useState } from 'react'

// ** Next Imports
import Link from 'next/link'
import Image from 'next/image'

// ** MUI Components
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import TextField from '@mui/material/TextField'
import InputLabel from '@mui/material/InputLabel'
import Typography from '@mui/material/Typography'
import IconButton from '@mui/material/IconButton'
import CardContent from '@mui/material/CardContent'
import FormControl from '@mui/material/FormControl'
import OutlinedInput from '@mui/material/OutlinedInput'
import { styled, useTheme } from '@mui/material/styles'
import MuiCard, { CardProps } from '@mui/material/Card'
import InputAdornment from '@mui/material/InputAdornment'
import FormHelperText from '@mui/material/FormHelperText'

import EyeOutline from 'mdi-material-ui/EyeOutline'
import EyeOffOutline from 'mdi-material-ui/EyeOffOutline'

// ** Layout Import
import BlankLayout from 'src/@core/layouts/BlankLayout'

// ** Demo Imports
import FooterIllustrationsV1 from 'src/views/pages/auth/FooterIllustration'
import { Controller, useForm } from 'react-hook-form'
import { toast } from 'react-hot-toast'
import { userApi } from '../../api/user-api'
import { useRouter } from 'next/router'

// ** Styled Components
const Card = styled(MuiCard)<CardProps>(({ theme }) => ({
  [theme.breakpoints.up('sm')]: { width: '28rem' }
}))

const LinkStyled = styled('a')(({ theme }) => ({
  fontSize: '0.875rem',
  textDecoration: 'none',
  color: theme.palette.primary.main
}))

interface FormValue {
  email: string
  password: string
}

const LoginPage = () => {
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)

  const { control, handleSubmit } = useForm<FormValue>({
    defaultValues: {
      email: '',
      password: ''
    }
  })
  const theme = useTheme()
  const router = useRouter()

  const handleClickShowPassword = () => {
    setShowPassword(value => !value)
  }

  const handleMouseDownPassword = (event: MouseEvent<HTMLButtonElement>) => {
    event.preventDefault()
  }

  const onSubmit = async (values: FormValue) => {
    try {
      setLoading(true)
      await userApi.signIn({
        email: values.email,
        password: values.password
      })
      setLoading(false)
      router.push('/')
    } catch (error) {
      setLoading(false)
      toast.error((error as IResponseError).error)
    }
  }

  return (
    <Box className='content-center'>
      <Card sx={{ zIndex: 1 }}>
        <CardContent sx={{ padding: theme => `${theme.spacing(12, 9, 7)} !important` }}>
          <Box sx={{ mb: 8, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Image src='/images/logos/logo-primary-colorfulBg-lowOpacity.svg' alt='logo' width={100} height={100} />
            <Typography
              variant='h6'
              sx={{
                ml: 3,
                lineHeight: 1,
                fontWeight: 600,
                textTransform: 'uppercase',
                fontSize: '1.5rem !important'
              }}
            >
              Hygge
            </Typography>
          </Box>
          <Box sx={{ mb: 6 }}>
            <Typography variant='h5' sx={{ fontWeight: 600, marginBottom: 1.5 }}>
              Chào mừng đến với Hygge!
            </Typography>
            <Typography variant='body2'>Hãy điền thông tin tài khoản của bạn</Typography>
          </Box>
          <form noValidate autoComplete='off' onSubmit={handleSubmit(onSubmit)}>
            <Controller
              name='email'
              control={control}
              rules={{
                required: { value: true, message: 'Yêu cầu nhập email' },
                pattern: {
                  value: /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
                  message: 'Email không Đúng định dạng'
                }
              }}
              defaultValue={''}
              render={({ field: { onChange, value }, fieldState: { error, invalid } }) => (
                <TextField
                  value={value}
                  onChange={onChange}
                  error={invalid}
                  helperText={error?.message}
                  autoFocus
                  fullWidth
                  id='email'
                  label='Email'
                  sx={{ marginBottom: 4 }}
                />
              )}
            />
            <FormControl fullWidth>
              <InputLabel htmlFor='auth-login-password'>Mật khẩu</InputLabel>
              <Controller
                name='password'
                defaultValue={''}
                control={control}
                rules={{ required: { value: true, message: 'Yêu cầu nhập mật khẩu' } }}
                render={({ field: { onChange, value }, fieldState: { error, invalid } }) => (
                  <>
                    <OutlinedInput
                      label='Mật khẩu'
                      value={value}
                      id='auth-login-password'
                      onChange={onChange}
                      error={invalid}
                      type={showPassword ? 'text' : 'password'}
                      endAdornment={
                        <InputAdornment position='end'>
                          <IconButton
                            edge='end'
                            onClick={handleClickShowPassword}
                            onMouseDown={handleMouseDownPassword}
                            aria-label='toggle password visibility'
                          >
                            {showPassword ? <EyeOutline /> : <EyeOffOutline />}
                          </IconButton>
                        </InputAdornment>
                      }
                    />
                    {invalid && <FormHelperText error={invalid}>{error?.message}</FormHelperText>}
                  </>
                )}
              />
            </FormControl>
            <Box
              sx={{ mb: 4, mt: 4, display: 'flex', alignItems: 'center', flexWrap: 'wrap', justifyContent: 'flex-end' }}
            >
              <Link passHref href='/'>
                <LinkStyled onClick={e => e.preventDefault()}>Quên mật khẩu?</LinkStyled>
              </Link>
            </Box>
            <Button
              disabled={loading}
              fullWidth
              size='large'
              type='submit'
              variant='contained'
              sx={{ marginBottom: 7 }}
            >
              {loading ? 'Đang đăng nhâp...' : 'Đăng nhập'}
            </Button>
          </form>
        </CardContent>
      </Card>
      <FooterIllustrationsV1 />
    </Box>
  )
}

LoginPage.getLayout = (page: ReactNode) => <BlankLayout>{page}</BlankLayout>

export default LoginPage
