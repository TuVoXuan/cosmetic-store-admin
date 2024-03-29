// ** React import
import { Fragment, useEffect, useState } from 'react'

// ** MUI Imports
import Grid from '@mui/material/Grid'
import TextField from '@mui/material/TextField'
import CardContent from '@mui/material/CardContent'
import FormControl from '@mui/material/FormControl'
import Button from '@mui/material/Button'
import dynamic from 'next/dynamic'
import { Autocomplete, CardHeader, FormHelperText, FormLabel } from '@mui/material'

//** css import
import 'react-quill/dist/quill.snow.css'
import { useForm, Controller } from 'react-hook-form'

// ** api import
import brandApi from '../../api/brand-api'
import variationApi from '../../api/variation-api'
import categoryApi from '../../api/category-api'
import productApi from '../../api/product-api'
import { toast } from 'react-hot-toast'
import { useAppDispatch } from '../../store/configureStore'
import { addProduct } from '../../redux/reducers/product-slice'
import { ICreateProduct } from '../../types/api/product-api'

interface FormValue {
  nameVi: string
  nameEn: string
  brand: IOption
  category: IOption[]
  variation: IOption[]
  desVi: string
  desEn: string
}

const QuillNoSSRWrapper = dynamic(import('react-quill'), {
  ssr: false,
  loading: () => <p>Loading ...</p>
})

const TabProduct = () => {
  // ** State
  const [brands, setBrands] = useState<IOption[]>([])
  const [variations, setVariations] = useState<IOption[]>([])
  const [categories, setCategories] = useState<IOption[]>([])

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
      brand: undefined,
      category: undefined,
      variation: undefined
    }
  })

  register('desEn', { required: { value: true, message: 'Nhập mô tả tiếng Việt' } })
  register('desVi', { required: { value: true, message: 'Nhập mô tả tiếng Anh' } })

  //* text editor
  const modules = {
    toolbar: [
      ['bold', 'italic', 'underline', 'strike'], // toggled buttons
      [{ header: 1 }, { header: 2 }], // custom button values
      [{ list: 'ordered' }, { list: 'bullet' }],
      [{ header: [1, 2, 3, 4, 5, 6, false] }],
      [{ color: [] }, { background: [] }], // dropdown with defaults from theme
      [{ align: [] }],
      ['clean']
    ]
  }

  const formats = [
    'font',
    'size',
    'bold',
    'italic',
    'underline',
    'strike',
    'color',
    'background',
    'header',
    'blockquote',
    'list',
    'align',
    'link',
    'image',
    'video',
    'formula'
  ]

  const handleGetbrand = async () => {
    try {
      const res = await brandApi.getBrand()
      const options: IOption[] = res.data.data.map(item => ({ value: item._id, label: item.name }))

      setBrands(options)
    } catch (error) {
      console.log('error: ', error)
    }
  }

  const handleGetVariations = async () => {
    try {
      const res = await variationApi.getVariation()
      const options: IOption[] = res.data.data.map(item => {
        let option: IOption = { value: '', label: '' }
        for (let i = 0; i < item.name.length; i++) {
          const element = item.name[i]
          if (element.language === 'vi') {
            option = {
              label: element.value,
              value: item._id
            }
          }
        }

        return option
      })

      setVariations(options)
    } catch (error) {
      console.log('error: ', error)
    }
  }

  const handleGetCategories = async () => {
    try {
      const res = await categoryApi.getCategoryLeaf()
      const options: IOption[] = res.data.data.map(item => {
        let option: IOption = { value: '', label: '' }
        for (let i = 0; i < item.name.length; i++) {
          const element = item.name[i]
          if (element.language === 'vi') {
            option = {
              label: element.value,
              value: item._id
            }
          }
        }

        return option
      })

      setCategories(options)
    } catch (error) {
      console.log('error: ', error)
    }
  }

  const onSubmit = async (data: FormValue) => {
    try {
      const body = {
        name: [
          {
            language: 'vi',
            value: data.nameVi
          },
          {
            language: 'en',
            value: data.nameEn
          }
        ],
        description: [
          {
            language: 'vi',
            value: data.desVi
          },
          {
            language: 'en',
            value: data.desEn
          }
        ],
        brand: data.brand.value,
        categories: data.category.map(item => item.value)
      } as ICreateProduct

      if (data.variation && data.variation.length > 0) {
        body.variations = data.variation.map(item => item.value)
      }
      const res = await productApi.create(body)
      dispatch(addProduct(res.data.data))
      toast.success('Create product success')
    } catch (error) {
      console.log('error: ', error)
      toast.error((error as IResponseError).error)
    }
  }

  useEffect(() => {
    handleGetbrand()
    handleGetVariations()
    handleGetCategories()
  }, [])

  return (
    <Fragment>
      <CardHeader title='Tạo sản phẩm' titleTypographyProps={{ variant: 'h6' }} />
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)}>
          <Grid container spacing={7}>
            <Grid item xs={12} sm={6}>
              <Controller
                name={'nameVi'}
                defaultValue={''}
                rules={{ required: { value: true, message: 'Nhập tên tiếng Việt' } }}
                control={control}
                render={({ field: { onChange, value }, fieldState: { error, invalid } }) => (
                  <TextField
                    error={invalid}
                    helperText={error?.message}
                    fullWidth
                    label='Tên tiếng Việt'
                    placeholder='Kem chống nắng'
                    onChange={onChange}
                    value={value}
                  />
                )}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <Controller
                name={'nameEn'}
                defaultValue={''}
                rules={{ required: { value: true, message: 'Nhập tên tiếng anh' } }}
                control={control}
                render={({ field: { onChange, value }, fieldState: { error, invalid } }) => (
                  <TextField
                    error={invalid}
                    helperText={error?.message}
                    fullWidth
                    label='Tên tiếng anh'
                    placeholder='Sun care'
                    onChange={onChange}
                    value={value}
                  />
                )}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <FormControl fullWidth color='error'>
                <FormLabel error={errors.desVi?.message ? true : false}>Mô tả tiếng Việt</FormLabel>
                <QuillNoSSRWrapper
                  onChange={value => {
                    setValue('desVi', value)
                  }}
                  theme='snow'
                  modules={modules}
                  formats={formats}
                />
                {errors.desVi?.message && <FormHelperText error>{errors.desVi.message}</FormHelperText>}
              </FormControl>
            </Grid>

            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <FormLabel error={errors.desEn?.message ? true : false}>Mô tả tiếng Anh</FormLabel>
                <QuillNoSSRWrapper
                  onChange={value => {
                    setValue('desEn', value)
                  }}
                  theme='snow'
                  modules={modules}
                  formats={formats}
                />
                {errors.desEn?.message && <FormHelperText error>{errors.desEn.message}</FormHelperText>}
              </FormControl>
            </Grid>

            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <Controller
                  name={'brand'}
                  rules={{ required: { value: true, message: 'Nhập thương hiệu' } }}
                  control={control}
                  render={({ field: { onChange }, fieldState: { error, invalid } }) => (
                    <Autocomplete
                      disablePortal
                      id='brand'
                      options={brands}
                      sx={{ width: '100%' }}
                      renderInput={params => (
                        <TextField {...params} error={invalid} helperText={error?.message} label='Thương hiệu' />
                      )}
                      onChange={(e, value) => {
                        onChange(value)

                        return value
                      }}
                    />
                  )}
                />
              </FormControl>
            </Grid>

            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <Controller
                  name={'category'}
                  rules={{ required: { value: true, message: 'Nhập danh muc' } }}
                  control={control}
                  render={({ field: { onChange }, fieldState: { error, invalid } }) => (
                    <Autocomplete
                      disablePortal
                      id='category'
                      multiple
                      options={categories}
                      sx={{ width: '100%' }}
                      renderInput={params => (
                        <TextField {...params} error={invalid} helperText={error?.message} label='Danh mục' />
                      )}
                      onChange={(e, value) => {
                        onChange(value)

                        return value
                      }}
                    />
                  )}
                />
              </FormControl>
            </Grid>

            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <Controller
                  name={'variation'}
                  control={control}
                  render={({ field: { onChange }, fieldState: { error, invalid } }) => (
                    <Autocomplete
                      disablePortal
                      id='variantion'
                      multiple
                      options={variations}
                      sx={{ width: '100%' }}
                      renderInput={params => (
                        <TextField {...params} error={invalid} helperText={error?.message} label='Biến thể' />
                      )}
                      onChange={(e, value) => {
                        onChange(value)

                        return value
                      }}
                    />
                  )}
                />
              </FormControl>
            </Grid>

            <Grid item xs={12}>
              <Button variant='contained' type='submit'>
                Xong
              </Button>
            </Grid>
          </Grid>
        </form>
      </CardContent>
    </Fragment>
  )
}

export default TabProduct
