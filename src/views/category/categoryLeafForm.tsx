import React, { useEffect, } from 'react'
import { Card, CardContent, CardHeader, Grid, TextField } from '@mui/material'
import { Controller, useForm } from 'react-hook-form'
import Button from '@mui/material/Button'
import { useAppDispatch } from '../../store/configureStore'
import { toast } from 'react-hot-toast'
import { useCategory } from '../../context/category'
import { createLeafCategory, updateLeafCategory } from '../../redux/actions/category-action'

interface FormValue {
    parentCategory?: string;
    nameVi: string;
    nameEn: string;
}

export default function CreateAndUpdateLeafCategory() {
    const { selectedCategory, setSelectedCategory, actionWithLeafCategory, setActionWithLeafCategory } = useCategory()

    const {
        control,
        handleSubmit,
        setValue,
        reset
    } = useForm<FormValue>()

    const dispatch = useAppDispatch()

    const onSubmit = async (values: FormValue) => {
        if (actionWithLeafCategory === 'create' && selectedCategory) {
            try {
                toast.loading('Đang tạo loại sản phẩm phụ...', { id: 'createLeafCate' })
                const body: ICreateLeafCategory = {
                    parentCategory: selectedCategory._id,
                    name: [
                        {
                            language: 'vi',
                            value: values.nameVi
                        },
                        {
                            language: 'en',
                            value: values.nameEn
                        }
                    ]
                }
                await dispatch(createLeafCategory(body)).unwrap()
                toast.dismiss('createLeafCate');
                toast.success('Tạo loại sản phẩm phụ thành công');
                reset()
            } catch (error) {
                toast.dismiss('createLeafCate');
                toast.error((error as IResponseError).error)
            }
        } else if (actionWithLeafCategory === 'update' && selectedCategory) {
            try {
                toast.loading('Đang cập nhật loại sản phẩm phụ...', { id: 'updateLeafCate' })
                const body: IUpdateChildCategory = {
                    categoryId: selectedCategory._id,
                    nameEn: values.nameEn,
                    nameVi: values.nameVi
                }
                await dispatch(updateLeafCategory(body)).unwrap()
                toast.dismiss('updateLeafCate');
                toast.success('Cập nhật loại sản phẩm phụ thành công');
                reset()
            } catch (error) {
                toast.dismiss('updateLeafCate');
                toast.error((error as IResponseError).error)
            }
        }

        setSelectedCategory(undefined);
    }

    useEffect(() => {
        if (actionWithLeafCategory === 'create') {
            if (selectedCategory) {
                setValue('parentCategory', selectedCategory._id);
            }
        } else if (actionWithLeafCategory === 'update') {
            if (selectedCategory) {
                setValue('nameVi', selectedCategory.name.find((name) => name.language === 'vi')?.value || '');
                setValue('nameEn', selectedCategory.name.find((name) => name.language === 'en')?.value || '');
            }
        }
    }, [selectedCategory])

    return (
        <Card>
            <CardHeader
                title={actionWithLeafCategory === 'update' ? 'Cập nhập loại sản phẩm phụ' : actionWithLeafCategory === 'create' ? 'Thêm loại sản phẩm phụ' : null}
                titleTypographyProps={{ variant: 'h5' }}
            />
            <CardContent>
                {actionWithLeafCategory === 'create' && <p>Thêm loại sản phẩm phụ cho loại sản phẩm <strong>{selectedCategory?.name.find((name) => name.language === 'vi')?.value}</strong></p>}

                <form onSubmit={handleSubmit(onSubmit)}>
                    <Grid container spacing={7}>
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
