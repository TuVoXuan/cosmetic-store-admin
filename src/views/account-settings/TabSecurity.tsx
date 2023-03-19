// ** React Imports
import { MouseEvent, useState } from 'react'

// ** MUI Imports
import Box from '@mui/material/Box'
import Grid from '@mui/material/Grid'
import Button from '@mui/material/Button'
import Divider from '@mui/material/Divider'
import InputLabel from '@mui/material/InputLabel'
import IconButton from '@mui/material/IconButton'
import CardContent from '@mui/material/CardContent'
import FormControl from '@mui/material/FormControl'
import OutlinedInput from '@mui/material/OutlinedInput'
import InputAdornment from '@mui/material/InputAdornment'

// ** Icons Imports
import EyeOutline from 'mdi-material-ui/EyeOutline'
import EyeOffOutline from 'mdi-material-ui/EyeOffOutline'
import { Controller, useForm } from 'react-hook-form'
import FormHelperText from '@mui/material/FormHelperText'
import { toast } from 'react-hot-toast'
import { userApi } from '../../api/user-api'

interface State {
  showNewPassword: boolean
  showCurrentPassword: boolean
  showConfirmNewPassword: boolean
}

interface FormValue {
  currentPass: string
  newPass: string
  confirmNewPass: string
}

const TabSecurity = () => {
  // ** States
  const [values, setValues] = useState<State>({
    showNewPassword: false,
    showCurrentPassword: false,
    showConfirmNewPassword: false
  })
  const [loading, setLoading] = useState(false)

  const { control, handleSubmit, reset } = useForm<FormValue>({
    defaultValues: {
      currentPass: '',
      newPass: '',
      confirmNewPass: ''
    }
  })

  // Handle Current Password

  const handleClickShowCurrentPassword = () => {
    setValues({ ...values, showCurrentPassword: !values.showCurrentPassword })
  }
  const handleMouseDownCurrentPassword = (event: MouseEvent<HTMLButtonElement>) => {
    event.preventDefault()
  }

  // Handle New Password

  const handleClickShowNewPassword = () => {
    setValues({ ...values, showNewPassword: !values.showNewPassword })
  }
  const handleMouseDownNewPassword = (event: MouseEvent<HTMLButtonElement>) => {
    event.preventDefault()
  }

  // Handle Confirm New Password

  const handleClickShowConfirmNewPassword = () => {
    setValues({ ...values, showConfirmNewPassword: !values.showConfirmNewPassword })
  }
  const handleMouseDownConfirmNewPassword = (event: MouseEvent<HTMLButtonElement>) => {
    event.preventDefault()
  }

  const onSubmit = async (values: FormValue) => {
    try {
      setLoading(true)

      await userApi.changePass({
        oldPass: values.currentPass,
        newPass: values.newPass
      })

      setLoading(false)
      reset()
      toast.success('Thay đổi mật khẩu thành công')
    } catch (error) {
      toast.error((error as IResponseError).error)
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <CardContent sx={{ paddingBottom: 0 }}>
        <Grid container spacing={5}>
          <Grid item xs={12} sm={6}>
            <Grid container spacing={5}>
              <Grid item xs={12} sx={{ marginTop: 4.75 }}>
                <FormControl fullWidth>
                  <InputLabel htmlFor='account-settings-current-password'>Mật khẩu hiện tại</InputLabel>
                  <Controller
                    name='currentPass'
                    control={control}
                    rules={{ required: { value: true, message: 'Vui lòng nhập mật khẩu hiện tại.' } }}
                    render={({ field: { onChange, value }, fieldState: { error, invalid } }) => (
                      <>
                        <OutlinedInput
                          label='Mật khẩu hiện tại'
                          value={value}
                          id='account-settings-current-password'
                          type={values.showCurrentPassword ? 'text' : 'password'}
                          onChange={onChange}
                          error={invalid}
                          endAdornment={
                            <InputAdornment position='end'>
                              <IconButton
                                edge='end'
                                aria-label='toggle password visibility'
                                onClick={handleClickShowCurrentPassword}
                                onMouseDown={handleMouseDownCurrentPassword}
                              >
                                {values.showCurrentPassword ? <EyeOutline /> : <EyeOffOutline />}
                              </IconButton>
                            </InputAdornment>
                          }
                        />
                        {invalid && <FormHelperText error>{error?.message}</FormHelperText>}
                      </>
                    )}
                  />
                </FormControl>
              </Grid>

              <Grid item xs={12} sx={{ marginTop: 6 }}>
                <FormControl fullWidth>
                  <InputLabel htmlFor='account-settings-new-password'>Mật khẩu mới</InputLabel>
                  <Controller
                    name='newPass'
                    control={control}
                    rules={{
                      required: { value: true, message: 'Vui lòng nhập mật khẩu mới' },
                      pattern: {
                        value: /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/,
                        message: 'Mật khẩu chứa ít nhất 8 kí tự gồm chữ, số, kí tự đặc biệt.'
                      }
                    }}
                    render={({ field: { onChange, value }, fieldState: { error, invalid } }) => (
                      <>
                        <OutlinedInput
                          label='Mật khẩu mới'
                          value={value}
                          id='account-settings-new-password'
                          onChange={onChange}
                          error={invalid}
                          type={values.showNewPassword ? 'text' : 'password'}
                          endAdornment={
                            <InputAdornment position='end'>
                              <IconButton
                                edge='end'
                                onClick={handleClickShowNewPassword}
                                aria-label='toggle password visibility'
                                onMouseDown={handleMouseDownNewPassword}
                              >
                                {values.showNewPassword ? <EyeOutline /> : <EyeOffOutline />}
                              </IconButton>
                            </InputAdornment>
                          }
                        />
                        {invalid && <FormHelperText error>{error?.message}</FormHelperText>}
                      </>
                    )}
                  />
                </FormControl>
              </Grid>

              <Grid item xs={12}>
                <FormControl fullWidth>
                  <InputLabel htmlFor='account-settings-confirm-new-password'>Nhập lại</InputLabel>
                  <Controller
                    name='confirmNewPass'
                    control={control}
                    rules={{
                      required: { value: true, message: 'Vui lòng xác nhận mật khẩu' },
                      validate: (value, formValue) => value === formValue.newPass
                    }}
                    render={({ field: { onChange, value }, fieldState: { error, invalid } }) => (
                      <>
                        <OutlinedInput
                          label='Nhập lại'
                          value={value}
                          error={invalid}
                          id='account-settings-confirm-new-password'
                          type={values.showConfirmNewPassword ? 'text' : 'password'}
                          onChange={onChange}
                          endAdornment={
                            <InputAdornment position='end'>
                              <IconButton
                                edge='end'
                                aria-label='toggle password visibility'
                                onClick={handleClickShowConfirmNewPassword}
                                onMouseDown={handleMouseDownConfirmNewPassword}
                              >
                                {values.showConfirmNewPassword ? <EyeOutline /> : <EyeOffOutline />}
                              </IconButton>
                            </InputAdornment>
                          }
                        />
                        {invalid && (
                          <FormHelperText error>
                            {error?.type === 'validate' ? 'Xác nhận mật khẩu không đúng' : error?.message}
                          </FormHelperText>
                        )}
                      </>
                    )}
                  />
                </FormControl>
              </Grid>
            </Grid>
          </Grid>

          <Grid
            item
            sm={6}
            xs={12}
            sx={{ display: 'flex', marginTop: [7.5, 2.5], alignItems: 'center', justifyContent: 'center' }}
          >
            <img width={183} alt='avatar' height={256} src='/images/pages/pose-m-1.png' />
          </Grid>
        </Grid>
      </CardContent>

      <Divider sx={{ margin: 0 }} />

      <CardContent>
        <Box sx={{ mt: 11 }}>
          <Button disabled={loading} variant='contained' type='submit' sx={{ marginRight: 3.5 }}>
            {loading ? 'Đang Lưu...' : 'Lưu thay đổi'}
          </Button>
          <Button type='reset' variant='outlined' color='secondary' onClick={() => setValues({ ...values })}>
            Reset
          </Button>
        </Box>
      </CardContent>
    </form>
  )
}
export default TabSecurity
