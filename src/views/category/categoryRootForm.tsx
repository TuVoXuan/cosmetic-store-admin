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
import { useCategory } from '../../context/category'
import { createRootCategory, updateRootCategory } from '../../redux/actions/category-action'

interface FormValue {
  nameVi: string;
  nameEn: string;
  icon: any;
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
  [theme.breakpoints.down('sm')]: {
    width: '100%',
    marginLeft: 0,
    textAlign: 'center',
    marginTop: theme.spacing(4)
  }
}))

export default function CreateAndUpdateRootCategory() {
  const { selectedCategory, setSelectedCategory, actionWithLeafCategory } = useCategory()

  const {
    control,
    handleSubmit,
    register,
    formState: { errors },
    setValue,
    clearErrors
  } = useForm<FormValue>({
    defaultValues: {
      nameVi: selectedCategory ? selectedCategory.name.find((name) => name.language === 'vi')?.value : undefined,
      nameEn: selectedCategory ? selectedCategory.name.find((name) => name.language === 'en')?.value : undefined
    }
  })

  const [logo, setLogo] = useState<string>('/images/cards/default-img.png')
  const [logoFile, setLogoFile] = useState<File>()
  const dispatch = useAppDispatch()

  const onSubmit = async (values: FormValue) => {
    if (selectedCategory) {
      // update category
      const body: FormData = new FormData();
      if (logoFile) {
        body.append('icon', logoFile);
      }

      body.append('nameVi', values.nameVi);
      body.append('nameEn', values.nameEn);

      const result = dispatch(updateRootCategory({ body, categoryId: selectedCategory._id }));

      if (result) {
        toast.promise(result, {
          loading: 'Đang cập nhập loại sản phẩm ...',
          success: 'Cập nhập loại sản phẩm thành công',
          error: err => (err as IResponseError).error
        })
      }
    }

    if (logoFile && !selectedCategory) {
      // create category
      const body: FormData = new FormData();
      body.append('icon', logoFile);
      body.append('nameVi', values.nameVi);
      body.append('nameEn', values.nameEn);

      const result = dispatch(createRootCategory(body));

      if (result) {
        toast.promise(result, {
          loading: 'Đang tạo loại sản phẩm mới ...',
          success: 'Tạo loại sản phẩm thành công',
          error: err => (err as IResponseError).error
        })
      }
    }

    setSelectedCategory(undefined);
  }

  const onChangeLogo = (file: ChangeEvent) => {
    const { files } = file.target as HTMLInputElement
    if (files && files.length !== 0) {
      setLogoFile(files[0])
      setLogo(URL.createObjectURL(files[0]))
    }
  }

  useEffect(() => {
    if (!actionWithLeafCategory) {
      clearErrors();
      if (selectedCategory) {
        setLogo(selectedCategory.icon || '');
        setValue('nameVi', selectedCategory.name.find((name) => name.language === 'vi')?.value || '');
        setValue('nameEn', selectedCategory.name.find((name) => name.language === 'en')?.value || '');

      } else {
        setLogo('/images/cards/default-img.png');
        setValue('nameVi', '');
        setValue('nameEn', '');
      }
    }
  }, [selectedCategory])

  return (
    <Card>
      <CardHeader
        title={selectedCategory && !actionWithLeafCategory ? 'Cập nhập loại sản phẩm gốc' : 'Thêm loại sản phẩm gốc'}
        titleTypographyProps={{ variant: 'h5' }}
      />
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)}>
          <Grid container spacing={7}>
            <Grid item xs={12} sx={{ marginTop: 4.8, marginBottom: 3 }}>
              <FormLabel style={{ fontWeight: 500 }} error={errors.icon?.message ? true : false}>
                Icon
              </FormLabel>
              <Box sx={{ display: 'flex', alignItems: 'center', mt: 4 }}>
                <ImgStyled src={logo} alt='logo' />

                <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', rowGap: '24px' }}>
                  <ButtonStyled component='label' variant='contained' htmlFor='logo-input'>
                    Tải hình ảnh
                    <input
                      {...register('icon', {
                        required: { value: selectedCategory ? false : true, message: 'Yêu cầu hình ảnh thương hiệu' }
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
                      setValue('icon', undefined)
                      setLogo('/images/cards/default-img.png')
                    }}
                  >
                    Reset
                  </ResetButtonStyled>
                </Box>
              </Box>
            </Grid>

            <Grid item xs={12}>
              <Controller
                name={'nameVi'}
                defaultValue={''}
                rules={{ required: { value: true, message: 'Yêu cầu tên loại sản phẩm tiếng việt' } }}
                control={control}
                render={({ field: { onChange, value }, fieldState: { error, invalid } }) => (
                  <TextField
                    error={invalid}
                    helperText={error?.message}
                    fullWidth
                    label='Tên loại sản phẩm (tiếng việt)'
                    placeholder='Tên loại sản phẩm'
                    onChange={onChange}
                    value={value}
                  />
                )}
              />
            </Grid>

            <Grid item xs={12}>
              <Controller
                name={'nameEn'}
                defaultValue={''}
                rules={{ required: { value: true, message: 'Yêu cầu tên loại sản phẩm tiếng anh' } }}
                control={control}
                render={({ field: { onChange, value }, fieldState: { error, invalid } }) => (
                  <TextField
                    error={invalid}
                    helperText={error?.message}
                    fullWidth
                    label='Tên loại sản phẩm (tiếng anh)'
                    placeholder='Category name'
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
    </Card >
  )
}
