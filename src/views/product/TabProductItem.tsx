// ** React Imports
import { useState, ElementType, ChangeEvent, Fragment, useEffect, useRef } from 'react'

// ** MUI Imports
import Box from '@mui/material/Box'
import Grid from '@mui/material/Grid'
import { styled } from '@mui/material/styles'
import TextField from '@mui/material/TextField'
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
import { IProductNameOption } from '../../types/api/product-api'

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
  tags: IOptionGroup[]
  [index: string]: any
}

const TabProductItem = () => {
  // ** State
  const [thumbnailFile, setThumbnailFile] = useState<File>()
  const [thumbnail, setThumbnail] = useState<string>('/images/cards/default-img.png')
  const [imgFiles, setImgFiles] = useState<File[]>([])
  const [imgSrc, setImgSrc] = useState<string[]>(['/images/cards/default-img.png'])
  const [productNames, setProductNames] = useState<IProductNameOption[]>([])
  const [variationsGroup, setVariationsGroup] = useState<IVariationGroup[]>([])
  const [tags, setTags] = useState<IOptionGroup[]>([])
  const [selectedProd, setSeletedProd] = useState<IProductNameOption>()

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
    setValue,
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
        let option: IProductNameOption = { value: '', label: '', variations: [], description: '' }
        for (let i = 0; i < item.name.length; i++) {
          const element = item.name[i]
          if (element.language === 'vi') {
            option = {
              label: element.value,
              value: item._id,
              variations: item.variations,
              description: item.description.find((des) => des.language === 'vi')?.value || ''
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

  const handleChangeProduct = (value: IProductNameOption) => {
    const existTagInDes: IOptionGroup[] = []
    for (const tag of tags) {
      const existed = value.description.toLowerCase().includes(tag.label.toLowerCase())
      if (existed) {
        existTagInDes.push(tag)
      }
    }
    console.log("existTagInDes: ", existTagInDes);
    setValue('tags', existTagInDes)
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
    const tags = await tagApi.getTags()

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

    setTags(tagOptions)
  }

  const handleDescription = () => {
    if (selectedProd) {
      const description = selectedProd.description;
      if (description) {
        let descipt = description
        descipt = descipt.replaceAll("<h1>", '<h1 class="py-2 text-heading-1 dark:text-white">');
        descipt = descipt.replaceAll("<h2>", '<h2 class="py-2 text-heading-2 dark:text-white">');
        descipt = descipt.replaceAll("<h3>", '<h3 class="py-2 text-heading-3 dark:text-white">');
        descipt = descipt.replaceAll("<h4>", '<h4 class="py-2 text-heading-4 dark:text-white">');
        descipt = descipt.replaceAll("<h5>", '<h5 class="py-2 text-heading-5 dark:text-white">');
        descipt = descipt.replaceAll("<h6>", '<h6 class="py-2 text-heading-6 dark:text-white">');
        descipt = descipt.replaceAll("<p>", '<p class="dark:text-white py-2">');
        descipt = descipt.replaceAll("<ul>", '<ul class="list-disc list-inside pl-4">');

        return descipt;
      }
    }
    return "";
  };

  useEffect(() => {
    handleGetProductNames()

    if (tags.length === 0) {
      fetchTags()
    }
  }, [])

  return (
    <Fragment>
      <CardHeader title='Tạo sản phẩm con' titleTypographyProps={{ variant: 'h6' }} />
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
                    <Controller
                      name='thumbnail'
                      control={control}
                      rules={{ required: { value: true, message: 'Vui lòng chọn ảnh đại diện' } }}
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
                      setThumbnail('/images/cards/default-img.png')
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
                    <Controller
                      name='images'
                      defaultValue={undefined}
                      control={control}
                      rules={{ required: { value: true, message: 'Vui lòng chọn ảnh' } }}
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
                      setImgSrc(['/images/cards/default-img.png'])
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
                  min: { value: 1000, message: 'Giá tiền phải lớn hơn 1000 đ' }
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
                  min: { value: 1, message: 'số lượng phải lớn hơn hoặc bằng 1' }
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
                name={'product'}
                rules={{ required: { value: true, message: 'Chọn sản phẩm' } }}
                control={control}
                render={({ field: { onChange }, fieldState: { error, invalid } }) => (
                  <Autocomplete
                    disablePortal
                    id='product'
                    options={productNames}
                    isOptionEqualToValue={(option, value) => option.value === value.value}
                    sx={{ width: '100%' }}
                    renderInput={params => (
                      <TextField {...params} error={invalid} helperText={error?.message} label='Sản phẩm' />
                    )}
                    onChange={(e, value) => {
                      onChange(value)
                      handleGetVariationOptions()
                      if (value) {
                        handleChangeProduct(value)
                        setSeletedProd(value)
                      }
                      return value
                    }}
                  />
                )}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <Controller
                name={'tags'}
                rules={{ required: { value: true, message: `Chọn thẻ` } }}
                control={control}
                render={({ field: { onChange, value }, fieldState: { error, invalid } }) => (
                  <Autocomplete
                    disablePortal
                    multiple
                    value={value ? value : []}
                    isOptionEqualToValue={(option, value) => option.value === value.value}
                    groupBy={option => option.group}
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

            {variationsGroup.map(item => (
              <Grid item xs={12} sm={6} key={item.variationName}>
                <Controller
                  name={item.variationName}
                  rules={{ required: { value: true, message: `${item.variationName} bắt buộc` } }}
                  control={control}
                  render={({ field: { onChange }, fieldState: { error, invalid } }) => (
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

            {selectedProd && (
              <Grid item xs={12}>
                <FormLabel style={{ fontWeight: 500 }}>
                  Mô tả sản phẩm
                </FormLabel>
                <div
                  className="mt-8 text-paragraph-5 lg:text-paragraph-4 dark:text-white"
                  dangerouslySetInnerHTML={{
                    __html: handleDescription(),
                  }}
                ></div>
              </Grid>
            )}

            <Grid item xs={12}>
              <Button variant='contained' type='submit' sx={{ marginRight: 3.5 }}>
                Lưu
              </Button>
            </Grid>
          </Grid>
        </form>
      </CardContent>
    </Fragment>
  )
}

export default TabProductItem
