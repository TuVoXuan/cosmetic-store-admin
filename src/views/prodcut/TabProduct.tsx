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

  register('desEn', { required: { value: true, message: 'Description (En) is required' } })
  register('desVi', { required: { value: true, message: 'Description (Vi) is required' } })

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
    'script',
    'header',
    'blockquote',
    // "code-block",
    // "indent",
    'list',
    // "direction",
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
      const res = await categoryApi.getCategory()
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
      const res = await productApi.create({
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
        categories: data.category.map(item => item.value),
        variations: data.variation.map(item => item.value)
      })
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
      <CardHeader title='Create Product' titleTypographyProps={{ variant: 'h6' }} />
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)}>
          <Grid container spacing={7}>
            <Grid item xs={12} sm={6}>
              <Controller
                name={'nameVi'}
                defaultValue={''}
                rules={{ required: { value: true, message: 'Name (vi) is required' } }}
                control={control}
                render={({ field: { onChange, value }, fieldState: { error, invalid } }) => (
                  <TextField
                    error={invalid}
                    helperText={error?.message}
                    fullWidth
                    label='Name (vi)'
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
                rules={{ required: { value: true, message: 'Name (en) is required' } }}
                control={control}
                render={({ field: { onChange, value }, fieldState: { error, invalid } }) => (
                  <TextField
                    error={invalid}
                    helperText={error?.message}
                    fullWidth
                    label='Name (en)'
                    placeholder='Sun care'
                    onChange={onChange}
                    value={value}
                  />
                )}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <FormControl fullWidth color='error'>
                <FormLabel error={errors.desVi?.message ? true : false}>Description (vi)</FormLabel>
                <QuillNoSSRWrapper
                  onChange={value => {
                    setValue('desVi', value)
                  }}
                  theme='snow'
                  // value={
                  //   '<p><strong>Cách sử dụng</strong>:</p><p>- Thoa 1 đến 2 lần/ngày lên điểm mụn sau khi được rửa sạch và lau khô.</p><p><br></p><p><strong>Thành phần</strong>:</p><p>Water, Hamamelis, Virginiana Extract, Centella Asiatica Extract, Polysorbate 60, Lactic Acid, Cetyl Alcohol, Glycolic Acid, Manganese Chloride, Dimethicone Phenoxyethanol, Zinc Oxide, Pyridoxine HCL, Niacinamide, Retinal, Bisanolol, Salicylic Acid.</p><p><br></p><p><strong>Công dụng</strong>:</p><p>Ngừa mụn trứng cá, ngừa thâm, dưỡng da..</p><p>Chống lão hóa, giảm mụn sưng viêm..</p><p><br></p><p><strong>Sản phẩm khuyên dùng</strong>:</p><p>Trường hợp da bị mụn là da hỗn hợp, da khô...rửa mặt sạch và vùng da bị mụn bằng sữa rửa mặt chuyên biệt Skinsiogel trước khi thoa Megaduo plus Gel.</p><p>Trường hợp da bị mụn là da dầu, rửa mặt sạch và vùng da bị mụn bằng sữa rửa mặt Vinatid để loại sạch dầu trươc khi thoa Megaduo plus Gel</p><p><br></p><p><strong>Xuất xứ</strong> : Việt Nam, nhà sản xuất Gamma Chemical.</p><p><strong>Hạn sử dụng</strong> : 3 năm kể từ ngày sản xuất..</p><p><strong>Khối lượng</strong> : 15 gram.</p><p><strong>Thương Hiệu</strong> : Gamma</p>'
                  // }
                  modules={modules}
                  formats={formats}
                />
                {errors.desVi?.message && <FormHelperText error>{errors.desVi.message}</FormHelperText>}
              </FormControl>
            </Grid>

            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <FormLabel error={errors.desEn?.message ? true : false}>Description (en)</FormLabel>
                <QuillNoSSRWrapper
                  onChange={value => {
                    setValue('desEn', value)
                  }}
                  theme='snow'
                  // value={
                  //   '<p><strong>Cách sử dụng</strong>:</p><p>- Thoa 1 đến 2 lần/ngày lên điểm mụn sau khi được rửa sạch và lau khô.</p><p><br></p><p><strong>Thành phần</strong>:</p><p>Water, Hamamelis, Virginiana Extract, Centella Asiatica Extract, Polysorbate 60, Lactic Acid, Cetyl Alcohol, Glycolic Acid, Manganese Chloride, Dimethicone Phenoxyethanol, Zinc Oxide, Pyridoxine HCL, Niacinamide, Retinal, Bisanolol, Salicylic Acid.</p><p><br></p><p><strong>Công dụng</strong>:</p><p>Ngừa mụn trứng cá, ngừa thâm, dưỡng da..</p><p>Chống lão hóa, giảm mụn sưng viêm..</p><p><br></p><p><strong>Sản phẩm khuyên dùng</strong>:</p><p>Trường hợp da bị mụn là da hỗn hợp, da khô...rửa mặt sạch và vùng da bị mụn bằng sữa rửa mặt chuyên biệt Skinsiogel trước khi thoa Megaduo plus Gel.</p><p>Trường hợp da bị mụn là da dầu, rửa mặt sạch và vùng da bị mụn bằng sữa rửa mặt Vinatid để loại sạch dầu trươc khi thoa Megaduo plus Gel</p><p><br></p><p><strong>Xuất xứ</strong> : Việt Nam, nhà sản xuất Gamma Chemical.</p><p><strong>Hạn sử dụng</strong> : 3 năm kể từ ngày sản xuất..</p><p><strong>Khối lượng</strong> : 15 gram.</p><p><strong>Thương Hiệu</strong> : Gamma</p>'
                  // }
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
                  rules={{ required: { value: true, message: 'Brand is required' } }}
                  control={control}
                  render={({ field: { onChange, value }, fieldState: { error, invalid } }) => (
                    <Autocomplete
                      disablePortal
                      id='brand'
                      options={brands}
                      sx={{ width: '100%' }}
                      renderInput={params => (
                        <TextField {...params} error={invalid} helperText={error?.message} label='Brand' />
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
                  rules={{ required: { value: true, message: 'Category is required' } }}
                  control={control}
                  render={({ field: { onChange, value }, fieldState: { error, invalid } }) => (
                    <Autocomplete
                      disablePortal
                      id='category'
                      multiple
                      options={categories}
                      sx={{ width: '100%' }}
                      renderInput={params => (
                        <TextField {...params} error={invalid} helperText={error?.message} label='Category' />
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
                  rules={{ required: { value: true, message: 'Variation is required' } }}
                  control={control}
                  render={({ field: { onChange, value }, fieldState: { error, invalid } }) => (
                    <Autocomplete
                      disablePortal
                      id='variantion'
                      multiple
                      options={variations}
                      sx={{ width: '100%' }}
                      renderInput={params => (
                        <TextField {...params} error={invalid} helperText={error?.message} label='Variation' />
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
                submit
              </Button>
            </Grid>
          </Grid>
        </form>
      </CardContent>
    </Fragment>
  )
}

export default TabProduct
