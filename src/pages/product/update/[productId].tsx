// ** React import
import { useForm, Controller } from 'react-hook-form'
import toast from 'react-hot-toast'
import brandApi from '../../../api/brand-api'
import categoryApi from '../../../api/category-api'
import productApi from '../../../api/product-api'
import { useAppDispatch } from '../../../store/configureStore'

// ** MUI Imports
import Grid from '@mui/material/Grid'
import TextField from '@mui/material/TextField'
import CardContent from '@mui/material/CardContent'
import FormControl from '@mui/material/FormControl'
import Button from '@mui/material/Button'
import dynamic from 'next/dynamic'
import { Autocomplete, Card, CardHeader, FormHelperText, FormLabel } from '@mui/material'

//** css import
import 'react-quill/dist/quill.snow.css'
import { useRouter } from 'next/router'
import { updateProduct } from '../../../redux/actions/product-action'
import ProtectRoute from '../../../layouts/components/ProtectRoute'
import { getCookie } from 'cookies-next'
import { IProductSimPle } from '../../../types/api/product-api'

interface FormValue {
  nameVi: string
  nameEn: string
  brand: IOption
  category: IOption[]
  desVi: string
  desEn: string
}

interface Props {
  product: IProductSimPle
  categories: IOption[]
  brands: IOption[]
  auth: string
}

const QuillNoSSRWrapper = dynamic(import('react-quill'), {
  ssr: false,
  loading: () => <p>Loading ...</p>
})

export const getServerSideProps = async (context: any) => {
  const productId = context.query.productId as string
  const resProduct = await productApi.getProductById(productId)
  const auth = getCookie('Authorization', { req: context.req, res: context.res })

  // fetch brands
  const resBrand = await brandApi.getBrand()
  const brands: IOption[] = resBrand.data.data.map(item => ({ value: item._id, label: item.name }))

  // fetch categories
  const resCategories = await categoryApi.getCategoryLeaf()
  const categories: IOption[] = resCategories.data.data.map(item => {
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

  return {
    props: {
      product: resProduct.data.data,
      categories,
      brands,
      auth
    }
  }
}

function UpdateProduct({ brands, categories, product, auth }: Props) {
  const router = useRouter()
  const productId = router.query.productId as string

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
      nameVi: product?.name.find(item => item.language === 'vi')?.value,
      nameEn: product?.name.find(item => item.language === 'en')?.value,
      brand: brands.find(item => item.value === product?.brand),
      category: product?.categories.map(item => {
        return categories.find(cate => cate.value === item)
      }),
      desEn: product.description.find(des => des.language === 'en')?.value,
      desVi: product.description.find(des => des.language === 'vi')?.value
    }
  })

  register('desEn', { required: { value: true, message: 'Nhập mô tả tiếng Anh' } })
  register('desVi', { required: { value: true, message: 'Nhập mô tả tiếng Việt' } })

  //* text editor
  const modules = {
    toolbar: [
      ['bold', 'italic', 'underline', 'strike'], // toggled buttons
      ['blockquote', 'code-block'],
      [{ header: 1 }, { header: 2 }], // custom button values
      [{ list: 'ordered' }, { list: 'bullet' }],
      [{ script: 'sub' }, { script: 'super' }], // superscript/subscript
      // [{ indent: "-1" }, { indent: "+1" }], // outdent/indent
      // [{ direction: "rtl" }], // text direction
      [{ header: [1, 2, 3, 4, 5, 6, false] }],
      [{ color: [] }, { background: [] }], // dropdown with defaults from theme
      [{ align: [] }],
      ['clean']
    ],
    clipboard: {
      matchVisual: false
    }
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
    'script',
    'header',
    'blockquote',
    'list',
    'align',
    'link',
    'image',
    'video',
    'formula'
  ]

  const onSubmit = async (data: FormValue) => {
    try {
      await dispatch(
        updateProduct({
          productId,
          body: {
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
          }
        })
      )
      toast.success('Update product success')
    } catch (error) {
      console.log('error: ', error)
      toast.error((error as IResponseError).error)
    }
  }

  return (
    <ProtectRoute auth={auth}>
      <Card>
        <CardHeader title='Cập nhập sản phẩm' titleTypographyProps={{ variant: 'h6' }} />
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)}>
            <Grid container spacing={7}>
              <Grid item xs={12} sm={6}>
                <Controller
                  name={'nameVi'}
                  defaultValue={''}
                  rules={{ required: { value: true, message: 'Nhập tên sản phẩm' } }}
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
                  rules={{ required: { value: true, message: 'Nhập tên sản phẩmphẩm' } }}
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
                    defaultValue={product.description.find(des => des.language === 'vi')?.value || undefined}
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
                    defaultValue={product.description.find(des => des.language === 'en')?.value || undefined}
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
                        defaultValue={brands.find(item => item.value === product?.brand)}
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
                    rules={{ required: { value: true, message: 'Nhập danh mục' } }}
                    control={control}
                    render={({ field: { onChange }, fieldState: { error, invalid } }) => (
                      <Autocomplete
                        disablePortal
                        id='category'
                        defaultValue={product?.categories.map(item => {
                          return categories.find(cate => cate.value === item)
                        })}
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
              <Grid item xs={12}>
                <Button variant='contained' type='submit'>
                  Xong
                </Button>
              </Grid>
            </Grid>
          </form>
        </CardContent>
      </Card>
    </ProtectRoute>
  )
}

export default UpdateProduct
