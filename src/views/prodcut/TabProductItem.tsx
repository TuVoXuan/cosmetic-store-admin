// ** React Imports
import { useState, ElementType, ChangeEvent, Fragment, useEffect, useRef } from 'react'

// ** MUI Imports
import Box from '@mui/material/Box'
import Grid from '@mui/material/Grid'
import { styled } from '@mui/material/styles'
import TextField from '@mui/material/TextField'
import Typography from '@mui/material/Typography'
import CardContent from '@mui/material/CardContent'
import Button, { ButtonProps } from '@mui/material/Button'

// ** Icons Imports
import { Autocomplete, CardHeader, FormLabel, InputAdornment } from '@mui/material'
import { Controller, useForm } from 'react-hook-form'
import productApi from '../../api/product-api'
import variationApi from '../../api/variation-api'
import { toast } from 'react-hot-toast'
import { useAppDispatch } from '../../store/configureStore'
import { addProductItem } from '../../redux/reducers/product-slice'
import { tagApi } from '../../api/product-tag-api'

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
  product: IProductNameOption
  thumbnail: any
  images: any
  price: number
  quantity: number
  [index: string]: any
}

const TabProductItem = () => {
  // ** State
  const [thumbnailFile, setThumbnailFile] = useState<File>()
  const [thumbnail, setThumbnail] = useState<string>('/images/avatars/1.png')
  const [imgFiles, setImgFiles] = useState<File[]>([])
  const [imgSrc, setImgSrc] = useState<string[]>(['/images/avatars/1.png'])
  const [productNames, setProductNames] = useState<IProductNameOption[]>([])
  const [variationsGroup, setVariationsGroup] = useState<IVariationGroup[]>([])
  const [tags, setTags] = useState<IOption[]>([])

  // **Ref
  const imagesRef = useRef<HTMLInputElement | null>(null)
  const thumbnailRef = useRef<HTMLInputElement | null>(null)

  // ** Redux Toolkit
  const dispatch = useAppDispatch()

  // ** react-hook-form
  const {
    control,
    handleSubmit,
    formState: { errors },
    getValues,
    reset
  } = useForm<FormValue>({
    defaultValues: {
      product: undefined,
      thumbnail: undefined,
      images: undefined
    }
  })

  const onChangeThumbnail = (file: ChangeEvent) => {
    const { files } = file.target as HTMLInputElement
    if (files && files.length !== 0) {
      setThumbnail(URL.createObjectURL(files[0]))
      setThumbnailFile(files[0])
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

  const handleGetProductNames = async () => {
    try {
      const res = await productApi.getListName()
      const options: IProductNameOption[] = res.data.data.map(item => {
        let option: IProductNameOption = { value: '', label: '', variations: [] }
        for (let i = 0; i < item.name.length; i++) {
          const element = item.name[i]
          if (element.language === 'vi') {
            option = {
              label: element.value,
              value: item._id,
              variations: item.variations
            }
          }
        }

        return option
      })

      setProductNames(options)
    } catch (error) {
      console.log('error: ', error)
    }
  }

  const handleGetVariationOptions = async () => {
    try {
      const product = getValues('product')
      const optionsGroup: IVariationGroup[] = []
      for (let i = 0; i < product.variations.length; i++) {
        const variationId: string = product.variations[i]
        const res = await variationApi.getVariationOptions(variationId)
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

      setVariationsGroup([...optionsGroup])
    } catch (error) {
      console.log('error: ', error)
    }
  }

  const onSubmit = (data: any) => {
    const formData = new FormData()
    formData.append('thumbnail', thumbnailFile as File)

    formData.append('productId', data.product.value)

    formData.append('price', data.price)

    formData.append('quantity', data.quantity)

    for (const file of imgFiles) {
      formData.append('images', file)
    }

    variationsGroup.forEach(element => {
      formData.append('productConfiguration', data[element.variationName].value)
    })

    for (const tag of data.tags) {
      formData.append('tags', tag.value)
    }

    const res = productApi.createProductItem(formData)

    res.then(res => {
      dispatch(addProductItem(res.data.data))
    })

    toast.promise(res, {
      loading: 'Creating new product item ...',
      success: 'Create product item success',
      error: err => (err as IResponseError).error
    })
  }

  const fetchTags = async () => {
    const response = await tagApi.getTags()

    setTags(response.data.data.map(item => ({ label: item.name, value: item._id })))
  }

  useEffect(() => {
    handleGetProductNames()

    if (tags.length === 0) {
      fetchTags()
    }
  }, [])

  return (
    <Fragment>
      <CardHeader title='Create Product Item' titleTypographyProps={{ variant: 'h6' }} />
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)}>
          <Grid container spacing={7}>
            <Grid item xs={12} sx={{ marginTop: 4.8, marginBottom: 3 }}>
              <FormLabel style={{ fontWeight: 500 }} error={errors.thumbnail?.message ? true : false}>
                Product thumbnail
              </FormLabel>
              <Box sx={{ display: 'flex', alignItems: 'center', mt: 4 }}>
                <ImgStyled src={thumbnail} alt='Profile Pic' />
                <Box>
                  <ButtonStyled component='label' variant='contained' htmlFor='thumbnail-upload-image'>
                    Upload Thumbnail
                    <Controller
                      name='thumbnail'
                      control={control}
                      rules={{ required: { value: true, message: 'Thumbnail is required' } }}
                      render={({ field: { onChange, value, ref } }) => (
                        <input
                          hidden
                          type='file'
                          value={value}
                          ref={e => {
                            ref(e)
                            thumbnailRef.current = e
                          }}
                          onChange={e => {
                            onChange(e)
                            onChangeThumbnail(e)
                          }}
                          accept='image/png, image/jpeg'
                          id='thumbnail-upload-image'
                        />
                      )}
                    />
                  </ButtonStyled>
                  <ResetButtonStyled
                    color='error'
                    variant='outlined'
                    onClick={() => {
                      reset({ ...getValues(), thumbnail: null })
                      if (thumbnailRef.current) {
                        thumbnailRef.current.value = ''
                      }
                      setThumbnail('/images/avatars/1.png')
                    }}
                  >
                    Reset
                  </ResetButtonStyled>
                  <Typography variant='body2' sx={{ marginTop: 5 }}>
                    Allowed PNG or JPEG. Max size of 800K.
                  </Typography>
                </Box>
              </Box>
            </Grid>

            <Grid item xs={12}>
              <FormLabel style={{ fontWeight: 500 }} error={errors.images?.message ? true : false}>
                Product images
              </FormLabel>
              <Box sx={{ marginTop: 4 }}>
                {imgSrc.map((img, index) => (
                  <ImgStyled key={index} src={img} alt='Product item' />
                ))}
                <Box sx={{ mt: 4 }}>
                  <ButtonStyled component='label' variant='contained' htmlFor='products-upload-image'>
                    Upload product images
                    <Controller
                      name='images'
                      defaultValue={undefined}
                      control={control}
                      rules={{ required: { value: true, message: 'Images is required' } }}
                      render={({ field: { onChange, value, ref } }) => (
                        <input
                          type='file'
                          multiple
                          hidden
                          ref={e => {
                            ref(e), (imagesRef.current = e)
                          }}
                          accept='image/png, image/jpeg'
                          value={value}
                          onChange={e => {
                            onChange(e)
                            onChangeImgs(e)
                          }}
                          id='products-upload-image'
                        />
                      )}
                    />
                  </ButtonStyled>
                  <ResetButtonStyled
                    color='error'
                    variant='outlined'
                    onClick={() => {
                      reset({ ...getValues(), images: null })
                      if (imagesRef.current) {
                        imagesRef.current.value = ''
                      }
                      setImgSrc(['/images/avatars/1.png'])
                    }}
                  >
                    Reset
                  </ResetButtonStyled>
                  <Typography variant='body2' sx={{ marginTop: 5 }}>
                    Allowed PNG or JPEG. Max size of 800K.
                  </Typography>
                </Box>
              </Box>
            </Grid>

            <Grid item xs={12} sm={6}>
              <Controller
                name={'price'}
                defaultValue={0}
                rules={{
                  required: { value: true, message: 'Price is required' },
                  min: { value: 1000, message: 'Price must be greate than 1000' }
                }}
                control={control}
                render={({ field: { onChange, value }, fieldState: { error, invalid } }) => (
                  <TextField
                    fullWidth
                    error={invalid}
                    helperText={error?.message}
                    label='Price'
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
                  required: { value: true, message: 'Quantity is required' },
                  min: { value: 1, message: 'Price must be greate than 1' }
                }}
                control={control}
                render={({ field: { onChange, value }, fieldState: { error, invalid } }) => (
                  <TextField
                    fullWidth
                    error={invalid}
                    helperText={error?.message}
                    label='Quantity'
                    value={value}
                    onChange={onChange}
                  />
                )}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <Controller
                name={'product'}
                rules={{ required: { value: true, message: 'Product is required' } }}
                control={control}
                render={({ field: { onChange, value }, fieldState: { error, invalid } }) => (
                  <Autocomplete
                    disablePortal
                    id='product'
                    options={productNames}
                    sx={{ width: '100%' }}
                    renderInput={params => (
                      <TextField {...params} error={invalid} helperText={error?.message} label='Product' />
                    )}
                    onChange={(e, value) => {
                      onChange(value)
                      handleGetVariationOptions()

                      return value
                    }}
                  />
                )}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <Controller
                name={'tags'}
                rules={{ required: { value: true, message: `Tags is required` } }}
                control={control}
                render={({ field: { onChange, value }, fieldState: { error, invalid } }) => (
                  <Autocomplete
                    disablePortal
                    multiple
                    isOptionEqualToValue={(option, value) => option.value === value.value}
                    id={'tags'}
                    options={tags}
                    sx={{ width: '100%' }}
                    renderInput={params => (
                      <TextField {...params} error={invalid} helperText={error?.message} label={'Tags'} />
                    )}
                    onChange={(e, value) => {
                      onChange(value)

                      return value
                    }}
                  />
                )}
              />
            </Grid>

            {variationsGroup.map(item => (
              <Grid item xs={12} sm={6} key={item.variationName}>
                <Controller
                  name={item.variationName}
                  rules={{ required: { value: true, message: `${item.variationName} is required` } }}
                  control={control}
                  render={({ field: { onChange, value }, fieldState: { error, invalid } }) => (
                    <Autocomplete
                      disablePortal
                      isOptionEqualToValue={(option, value) => option.value === value.value}
                      id={item.variationName}
                      options={item.variationOptions}
                      sx={{ width: '100%' }}
                      renderInput={params => (
                        <TextField {...params} error={invalid} helperText={error?.message} label={item.variationName} />
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
                Save
              </Button>
            </Grid>
          </Grid>
        </form>
      </CardContent>
    </Fragment>
  )
}

export default TabProductItem
