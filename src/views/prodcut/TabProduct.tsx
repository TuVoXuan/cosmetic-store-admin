// ** MUI Imports
import Grid from '@mui/material/Grid'
import TextField from '@mui/material/TextField'
import CardContent from '@mui/material/CardContent'
import FormControl from '@mui/material/FormControl'
import Button from '@mui/material/Button'
import dynamic from 'next/dynamic'
import { Autocomplete, Card, CardHeader, FormHelperText, FormLabel } from '@mui/material'

//* css import
import 'react-quill/dist/quill.snow.css'
import { useForm, Controller } from 'react-hook-form'
import { Fragment } from 'react'

interface FormValue {
  nameVi: string
  nameEn: string
  brand: string
  category: string
  variation: string
  desVi: string
  desEn: string
}

const QuillNoSSRWrapper = dynamic(import('react-quill'), {
  ssr: false,
  loading: () => <p>Loading ...</p>
})

const top100Films = [
  { label: 'The Shawshank Redemption', year: 1994 },
  { label: 'The Godfather', year: 1972 },
  { label: 'The Godfather: Part II', year: 1974 },
  { label: 'The Dark Knight', year: 2008 },
  { label: '12 Angry Men', year: 1957 },
  { label: "Schindler's List", year: 1993 },
  { label: 'Pulp Fiction', year: 1994 },
  {
    label: 'The Lord of the Rings: The Return of the King',
    year: 2003
  },
  { label: 'The Good, the Bad and the Ugly', year: 1966 },
  { label: 'Fight Club', year: 1999 },
  {
    label: 'The Lord of the Rings: The Fellowship of the Ring',
    year: 2001
  },
  {
    label: 'Star Wars: Episode V - The Empire Strikes Back',
    year: 1980
  },
  { label: 'Forrest Gump', year: 1994 },
  { label: 'Inception', year: 2010 },
  {
    label: 'The Lord of the Rings: The Two Towers',
    year: 2002
  },
  { label: "One Flew Over the Cuckoo's Nest", year: 1975 },
  { label: 'Goodfellas', year: 1990 },
  { label: 'The Matrix', year: 1999 },
  { label: 'Seven Samurai', year: 1954 },
  {
    label: 'Star Wars: Episode IV - A New Hope',
    year: 1977
  },
  { label: 'City of God', year: 2002 },
  { label: 'Se7en', year: 1995 },
  { label: 'The Silence of the Lambs', year: 1991 },
  { label: "It's a Wonderful Life", year: 1946 },
  { label: 'Life Is Beautiful', year: 1997 },
  { label: 'The Usual Suspects', year: 1995 },
  { label: 'Léon: The Professional', year: 1994 },
  { label: 'Spirited Away', year: 2001 },
  { label: 'Saving Private Ryan', year: 1998 },
  { label: 'Once Upon a Time in the West', year: 1968 },
  { label: 'American History X', year: 1998 },
  { label: 'Interstellar', year: 2014 },
  { label: 'Casablanca', year: 1942 },
  { label: 'City Lights', year: 1931 },
  { label: 'Psycho', year: 1960 },
  { label: 'The Green Mile', year: 1999 },
  { label: 'The Intouchables', year: 2011 },
  { label: 'Modern Times', year: 1936 },
  { label: 'Raiders of the Lost Ark', year: 1981 },
  { label: 'Rear Window', year: 1954 },
  { label: 'The Pianist', year: 2002 },
  { label: 'The Departed', year: 2006 },
  { label: 'Terminator 2: Judgment Day', year: 1991 },
  { label: 'Back to the Future', year: 1985 },
  { label: 'Whiplash', year: 2014 },
  { label: 'Gladiator', year: 2000 },
  { label: 'Memento', year: 2000 },
  { label: 'The Prestige', year: 2006 },
  { label: 'The Lion King', year: 1994 },
  { label: 'Apocalypse Now', year: 1979 },
  { label: 'Alien', year: 1979 },
  { label: 'Sunset Boulevard', year: 1950 },
  {
    label: 'Dr. Strangelove or: How I Learned to Stop Worrying and Love the Bomb',
    year: 1964
  },
  { label: 'The Great Dictator', year: 1940 },
  { label: 'Cinema Paradiso', year: 1988 },
  { label: 'The Lives of Others', year: 2006 },
  { label: 'Grave of the Fireflies', year: 1988 },
  { label: 'Paths of Glory', year: 1957 },
  { label: 'Django Unchained', year: 2012 },
  { label: 'The Shining', year: 1980 },
  { label: 'WALL·E', year: 2008 },
  { label: 'American Beauty', year: 1999 },
  { label: 'The Dark Knight Rises', year: 2012 },
  { label: 'Princess Mononoke', year: 1997 },
  { label: 'Aliens', year: 1986 },
  { label: 'Oldboy', year: 2003 },
  { label: 'Once Upon a Time in America', year: 1984 },
  { label: 'Witness for the Prosecution', year: 1957 },
  { label: 'Das Boot', year: 1981 },
  { label: 'Citizen Kane', year: 1941 },
  { label: 'North by Northwest', year: 1959 },
  { label: 'Vertigo', year: 1958 },
  {
    label: 'Star Wars: Episode VI - Return of the Jedi',
    year: 1983
  },
  { label: 'Reservoir Dogs', year: 1992 },
  { label: 'Braveheart', year: 1995 },
  { label: 'M', year: 1931 },
  { label: 'Requiem for a Dream', year: 2000 },
  { label: 'Amélie', year: 2001 },
  { label: 'A Clockwork Orange', year: 1971 },
  { label: 'Like Stars on Earth', year: 2007 },
  { label: 'Taxi Driver', year: 1976 },
  { label: 'Lawrence of Arabia', year: 1962 },
  { label: 'Double Indemnity', year: 1944 },
  {
    label: 'Eternal Sunshine of the Spotless Mind',
    year: 2004
  },
  { label: 'Amadeus', year: 1984 },
  { label: 'To Kill a Mockingbird', year: 1962 },
  { label: 'Toy Story 3', year: 2010 },
  { label: 'Logan', year: 2017 },
  { label: 'Full Metal Jacket', year: 1987 },
  { label: 'Dangal', year: 2016 },
  { label: 'The Sting', year: 1973 },
  { label: '2001: A Space Odyssey', year: 1968 },
  { label: "Singin' in the Rain", year: 1952 },
  { label: 'Toy Story', year: 1995 },
  { label: 'Bicycle Thieves', year: 1948 },
  { label: 'The Kid', year: 1921 },
  { label: 'Inglourious Basterds', year: 2009 },
  { label: 'Snatch', year: 2000 },
  { label: '3 Idiots', year: 2009 },
  { label: 'Monty Python and the Holy Grail', year: 1975 }
]

const TabProduct = () => {
  // ** State

  // ** react-hook-form
  const {
    register,
    control,
    handleSubmit,
    formState: { errors },
    setValue
  } = useForm<FormValue>()

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

  const onSubmit = (data: any) => {
    console.log('data: ', data)
  }

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
                  defaultValue={''}
                  rules={{ required: { value: true, message: 'Brand is required' } }}
                  control={control}
                  render={({ field: { onChange, value }, fieldState: { error, invalid } }) => (
                    <Autocomplete
                      disablePortal
                      id='brand'
                      options={top100Films}
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
                  defaultValue={''}
                  rules={{ required: { value: true, message: 'Category is required' } }}
                  control={control}
                  render={({ field: { onChange, value }, fieldState: { error, invalid } }) => (
                    <Autocomplete
                      disablePortal
                      id='category'
                      multiple
                      options={top100Films}
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
                  defaultValue={''}
                  rules={{ required: { value: true, message: 'Variation is required' } }}
                  control={control}
                  render={({ field: { onChange, value }, fieldState: { error, invalid } }) => (
                    <Autocomplete
                      disablePortal
                      id='variantion'
                      multiple
                      options={top100Films}
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
