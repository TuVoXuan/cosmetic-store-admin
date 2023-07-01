import React, { ChangeEvent, ElementType, useEffect, useState } from 'react'
import { Box, Card, CardContent, CardHeader, FormLabel, Grid, TextField } from '@mui/material'
import { Controller, useForm } from 'react-hook-form'
import { styled } from '@mui/material/styles'
import Button, { ButtonProps } from '@mui/material/Button'
import Typography from '@mui/material/Typography'
import { useAppDispatch } from '../../store/configureStore'
import { toast } from 'react-hot-toast'
import { createBrand, updateBrand } from '../../redux/actions/brand-action'
import { useBrand } from '../../context/brand'

interface FormValue {
  name: string
  logo: any
}

const ImgStyled = styled('img')(({ theme }) => ({
  maxWidth: 250,
  maxHeight: 120,
  marginRight: theme.spacing(6.25),
  borderRadius: theme.shape.borderRadius
}))

const ButtonStyled = styled(Button)<ButtonProps & { component?: ElementType; htmlFor?: string }>(({ theme }) => ({
  [theme.breakpoints.down('sm')]: {
    width: '100%',
    textAlign: 'center'
  }
}))

const ResetButtonStyled = styled(Button)<ButtonProps>(({ theme }) => ({
  marginLeft: theme.spacing(4.5),
  [theme.breakpoints.down('sm')]: {
    width: '100%',
    marginLeft: 0,
    textAlign: 'center',
    marginTop: theme.spacing(4)
  }
}))

export default function CreateAndBrandForm() {
  const { selectedBrand } = useBrand()

  const {
    control,
    handleSubmit,
    register,
    formState: { errors },
    setValue,
    reset
  } = useForm<FormValue>({
    defaultValues: {
      name: selectedBrand ? selectedBrand.name : undefined
    }
  })

  const [logo, setLogo] = useState<string>('/images/cards/default-img.png')
  const [logoFile, setLogoFile] = useState<File>()
  const dispatch = useAppDispatch()

  const onSubmit = async (values: FormValue) => {
    let result
    if (selectedBrand) {
      if (logo) {
        result = dispatch(
          updateBrand({
            _id: selectedBrand._id,
            name: values.name,
            logo: logoFile
          })
        ).unwrap()
      } else {
        result = dispatch(
          updateBrand({
            _id: selectedBrand._id,
            name: values.name
          })
        ).unwrap()
      }
    }

    if (logoFile && !selectedBrand) {
      result = dispatch(
        createBrand({
          name: values.name,
          logo: logoFile
        })
      ).unwrap()
    }

    if (result) {
      toast.promise(result, {
        loading: selectedBrand ? 'Đang cập nhập thương hiệu ...' : 'Đang tạo thương hiệu mới ...',
        success: selectedBrand ? 'Cập nhập thương hiệu thành công' : 'Tạo thương hiệu thành công',
        error: err => (err as IResponseError).error
      })
    }

    reset()
    setLogo('/images/cards/default-img.png')
    setLogoFile(undefined)
  }

  const onChangeLogo = (file: ChangeEvent) => {
    const { files } = file.target as HTMLInputElement
    if (files && files.length !== 0) {
      setLogoFile(files[0])
      setLogo(URL.createObjectURL(files[0]))
    }
  }

  useEffect(() => {
    if (selectedBrand) {
      setLogo(selectedBrand.logo)
      setValue('name', selectedBrand.name)
    } else {
      setLogo('/images/cards/default-img.png')
      setValue('name', '')
    }
  }, [selectedBrand])

  return (
    <Card>
      <CardHeader
        title={selectedBrand ? 'Cập nhập thương hiệu' : 'Thêm thương hiệu'}
        titleTypographyProps={{ variant: 'h5' }}
      />
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)}>
          <Grid container spacing={7}>
            <Grid item xs={12} sx={{ marginTop: 4.8, marginBottom: 3 }}>
              <FormLabel style={{ fontWeight: 500 }} error={errors.logo?.message ? true : false}>
                Logo
              </FormLabel>
              <Box sx={{ display: 'flex', alignItems: 'center', mt: 4 }}>
                <ImgStyled src={logo} alt='logo' />
                <Box>
                  <ButtonStyled component='label' variant='contained' htmlFor='logo-input'>
                    Tải hình ảnh
                    <input
                      {...register('logo', {
                        required: { value: selectedBrand ? false : true, message: 'Yêu cầu hình ảnh thương hiệu' }
                      })}
                      hidden
                      type='file'
                      onChange={e => {
                        onChangeLogo(e)
                      }}
                      accept='image/png, image/jpeg'
                      id='logo-input'
                    />
                  </ButtonStyled>
                  <ResetButtonStyled
                    color='error'
                    variant='outlined'
                    onClick={() => {
                      setValue('logo', undefined)
                      setLogo('/images/cards/default-img.png')
                    }}
                  >
                    Reset
                  </ResetButtonStyled>
                </Box>
              </Box>
            </Grid>
            <Grid item xs={12} sm={7}>
              <Controller
                name={'name'}
                defaultValue={''}
                rules={{ required: { value: true, message: 'Yêu cầu tên thương hiệu' } }}
                control={control}
                render={({ field: { onChange, value }, fieldState: { error, invalid } }) => (
                  <TextField
                    error={invalid}
                    helperText={error?.message}
                    fullWidth
                    label='Tên thương hiệu'
                    placeholder='Tên thương hiệu'
                    onChange={onChange}
                    value={value}
                  />
                )}
              />
            </Grid>
            <Grid item xs={12} sm={12}>
              <Button color='primary' variant='contained' type='submit'>
                Lưu
              </Button>
            </Grid>
          </Grid>
        </form>
      </CardContent>
    </Card>
  )
}
