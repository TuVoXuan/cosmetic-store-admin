// ** React Imports
import { useState, ElementType, ChangeEvent, useEffect } from 'react'

// ** MUI Imports
import Box from '@mui/material/Box'
import Grid from '@mui/material/Grid'
import { styled } from '@mui/material/styles'
import TextField from '@mui/material/TextField'
import CardContent from '@mui/material/CardContent'
import Button, { ButtonProps } from '@mui/material/Button'

// ** Icons Imports
import { Autocomplete, Card, CardHeader, FormLabel, InputAdornment } from '@mui/material'
import { Controller, useForm } from 'react-hook-form'
import toast from 'react-hot-toast'
import productApi from '../../../../api/product-api'
import variationApi from '../../../../api/variation-api'
import { useAppDispatch } from '../../../../store/configureStore'
import { updateProdItem } from '../../../../redux/actions/product-action'
import { tagApi } from '../../../../api/product-tag-api'
import ProtectRoute from '../../../../layouts/components/ProtectRoute'
import { getCookie } from 'cookies-next'
import { IProdtem } from '../../../../types/api/product-api'

const ImgStyled = styled('img')(({ theme }) => ({
  width: 120,
  height: 120,
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

interface FormValue {
  thumbnail: any
  images: any
  price: number
  quantity: number
  tags: any
  [index: string]: any
}

interface Props {
  productId: string
  prodItem: IProdtem
  optionsGroup: IVariationGroup[]
  tags: IOptionGroup[]
  auth: string
}

export const getServerSideProps = async (context: any) => {
  const productId = context.query.productId as string
  const itemId = context.query.itemId as string
  const auth = getCookie('Authorization', { req: context.req, res: context.res })

  // fetch product item and variation
  const resProdItem = await productApi.getProductItem(productId, itemId)
  const tags = await tagApi.getTags()
  const { variations, prodItem } = resProdItem.data.data

  const tagOptions: IOptionGroup[] = []

  for (const tag of tags.data.data) {
    for (const option of tag.children) {
      tagOptions.push({
        value: option._id,
        label: option.name,
        group: tag.name
      })
    }
  }

  // fetch variation options
  const optionsGroup: IVariationGroup[] = []
  for (let i = 0; i < variations.length; i++) {
    const variationId: string = variations[i]
    const res = await variationApi.getVariationOptions(variationId)
    // @typescript-eslint / no - inferrable - types
    let variationName: string = ''
    res.data.data.variation.name.forEach(item => {
      if (item.language === 'vi') {
        variationName = item.value
      }
    })

    optionsGroup.push({
      variationName: variationName,
      variationOptions: res.data.data.variationOptions.map(item => {
        let label = ''
        item.value.forEach(name => {
          if (name.language === 'vi') {
            label = name.value
          }
        })

        return {
          label,
          value: item._id
        }
      })
    })
  }

  return {
    props: {
      productId,
      prodItem,
      optionsGroup,
      tags: tagOptions,
      auth: auth
    }
  }
}

function UpdateProductItem({ optionsGroup, prodItem, productId, tags, auth }: Props) {
  // ** State
  const [thumbnailFile, setThumbnailFile] = useState<File>()
  const [thumbnail, setThumbnail] = useState<string>(prodItem.thumbnail)
  const [imgFiles, setImgFiles] = useState<File[]>([])
  const [imgSrc, setImgSrc] = useState<string[]>(prodItem.images)

  // ** Redux Toolkit
  const dispatch = useAppDispatch()

  // ** react-hook-form
  const {
    register,
    control,
    handleSubmit,
    formState: { errors },
    setValue
  } = useForm<FormValue>({
    defaultValues: {
      price: prodItem.price,
      quantity: prodItem.quantity,
      tags: tags.filter(item => prodItem.tags.includes(item.value))
    }
  })

  const onChangeThumbnail = (file: ChangeEvent) => {
    const { files } = file.target as HTMLInputElement
    if (files && files.length !== 0) {
      setThumbnailFile(files[0])
      setThumbnail(URL.createObjectURL(files[0]))
    }
  }

  const onChangeImgs = (file: ChangeEvent) => {
    const { files } = file.target as HTMLInputElement
    const rawFiles: File[] = []
    const urlFiles: string[] = []

    if (files && files.length !== 0) {
      for (let i = 0; i < files.length; i++) {
        const file = files[i]
        rawFiles.push(file)
        urlFiles.push(URL.createObjectURL(file))
      }

      setImgFiles(rawFiles)
      setImgSrc(urlFiles)
    }
  }

  const onSubmit = (data: any) => {
    console.log('data: ', data)

    const formData = new FormData()
    if (thumbnailFile) {
      formData.append('thumbnail', thumbnailFile as File)
    }

    if (imgFiles) {
      for (const file of imgFiles) {
        formData.append('images', file)
      }
    }

    formData.append('productId', productId)

    formData.append('price', data.price)

    formData.append('quantity', data.quantity)

    optionsGroup.forEach(element => {
      formData.append('productConfiguration', data[element.variationName].value)
    })

    for (const tag of data.tags) {
      formData.append('tags', tag.value)
    }

    const res = dispatch(updateProdItem({ body: formData, itemId: prodItem._id })).unwrap()

    toast.promise(res, {
      loading: 'Updating new product item ...',
      success: 'Update product item success',
      error: err => (err as IResponseError).error
    })
  }

  useEffect(() => {
    optionsGroup.forEach(options => {
      const defautVal = options.variationOptions.find(
        op => prodItem.productConfigurations.findIndex(prodConfig => prodConfig === op.value) > -1
      )
      setValue(options.variationName, defautVal)
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <ProtectRoute auth={auth}>
      <Card>
        <CardHeader title='Cập nhập sản phẩm con' titleTypographyProps={{ variant: 'h6' }} />
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)}>
            <Grid container spacing={7}>
              <Grid item xs={12} sx={{ marginTop: 4.8, marginBottom: 3 }}>
                <FormLabel style={{ fontWeight: 500 }} error={errors.thumbnail?.message ? true : false}>
                  Ảnh đại diện
                </FormLabel>
                <Box sx={{ display: 'flex', alignItems: 'center', mt: 4 }}>
                  <ImgStyled src={thumbnail} alt='Profile Pic' />
                  <Box>
                    <ButtonStyled component='label' variant='contained' htmlFor='thumbnail-upload-image'>
                      Tải lên
                      <input
                        {...register('thumbnail')}
                        hidden
                        type='file'
                        onChange={e => {
                          onChangeThumbnail(e)
                        }}
                        accept='image/png, image/jpeg'
                        id='thumbnail-upload-image'
                      />
                    </ButtonStyled>
                    <ResetButtonStyled
                      color='error'
                      variant='outlined'
                      onClick={() => {
                        setValue('thumbnail', undefined)
                        setThumbnail('/images/avatars/1.png')
                      }}
                    >
                      Reset
                    </ResetButtonStyled>
                  </Box>
                </Box>
              </Grid>

              <Grid item xs={12}>
                <FormLabel style={{ fontWeight: 500 }} error={errors.images?.message ? true : false}>
                  Ảnh khác
                </FormLabel>
                <Box sx={{ marginTop: 4 }}>
                  {imgSrc.map((img, index) => (
                    <ImgStyled key={index} src={img} alt='Product item' />
                  ))}
                  <Box sx={{ mt: 4 }}>
                    <ButtonStyled component='label' variant='contained' htmlFor='products-upload-image'>
                      Tải lên
                      <input
                        hidden
                        {...register('images')}
                        type='file'
                        multiple
                        onChange={e => {
                          onChangeImgs(e)
                        }}
                        accept='image/png, image/jpeg'
                        id='products-upload-image'
                      />
                    </ButtonStyled>
                    <ResetButtonStyled
                      color='error'
                      variant='outlined'
                      onClick={() => {
                        setValue('images', undefined)
                        setImgSrc(['/images/avatars/1.png'])
                      }}
                    >
                      Reset
                    </ResetButtonStyled>
                  </Box>
                </Box>
              </Grid>

              <Grid item xs={12} sm={6}>
                <Controller
                  name={'price'}
                  defaultValue={0}
                  rules={{
                    required: { value: true, message: 'Nhập giá tiền' },
                    min: { value: 1000, message: 'Giá tiền phải lớn hơn hoặc bằng 1000 đ' }
                  }}
                  control={control}
                  render={({ field: { onChange, value }, fieldState: { error, invalid } }) => (
                    <TextField
                      fullWidth
                      error={invalid}
                      helperText={error?.message}
                      label='Giá tiền'
                      InputProps={{
                        startAdornment: <InputAdornment position='start'>VND</InputAdornment>
                      }}
                      value={value}
                      onChange={onChange}
                    />
                  )}
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <Controller
                  name={'quantity'}
                  defaultValue={0}
                  rules={{
                    required: { value: true, message: 'Nhập số lượng' },
                    min: { value: 1, message: 'Số lượng phải lớn hơn hoặc bằng 1' }
                  }}
                  control={control}
                  render={({ field: { onChange, value }, fieldState: { error, invalid } }) => (
                    <TextField
                      fullWidth
                      error={invalid}
                      helperText={error?.message}
                      label='Số lượng'
                      value={value}
                      onChange={onChange}
                    />
                  )}
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <Controller
                  name={'tags'}
                  rules={{ required: { value: true, message: `Chọn thẻ` } }}
                  control={control}
                  render={({ field: { onChange }, fieldState: { error, invalid } }) => (
                    <Autocomplete
                      disablePortal
                      multiple
                      isOptionEqualToValue={(option, value) => option.value === value.value}
                      groupBy={option => option.group}
                      defaultValue={tags.filter(item => prodItem.tags.includes(item.value))}
                      id={'tags'}
                      options={tags}
                      sx={{ width: '100%' }}
                      renderInput={params => (
                        <TextField {...params} error={invalid} helperText={error?.message} label={'Thẻ'} />
                      )}
                      onChange={(e, value) => {
                        onChange(value)

                        return value
                      }}
                    />
                  )}
                />
              </Grid>

              {optionsGroup.map(item => (
                <Grid item xs={12} sm={6} key={item.variationName}>
                  <Controller
                    name={item.variationName}
                    rules={{ required: { value: true, message: `${item.variationName} bắt buộc` } }}
                    control={control}
                    render={({ field: { onChange }, fieldState: { error, invalid } }) => (
                      <Autocomplete
                        disablePortal
                        isOptionEqualToValue={(option, value) => option.value === value.value}
                        defaultValue={item.variationOptions.find(
                          op => prodItem.productConfigurations.findIndex(prodConfig => prodConfig === op.value) > -1
                        )}
                        id={item.variationName}
                        options={item.variationOptions}
                        sx={{ width: '100%' }}
                        renderInput={params => (
                          <TextField
                            {...params}
                            error={invalid}
                            helperText={error?.message}
                            label={item.variationName}
                          />
                        )}
                        onChange={(e, value) => {
                          onChange(value)

                          return value
                        }}
                      />
                    )}
                  />
                </Grid>
              ))}

              <Grid item xs={12}>
                <Button variant='contained' type='submit' sx={{ marginRight: 3.5 }}>
                  Lưu
                </Button>
              </Grid>
            </Grid>
          </form>
        </CardContent>
      </Card>
    </ProtectRoute>
  )
}

export default UpdateProductItem
