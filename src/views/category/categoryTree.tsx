import React, { useEffect } from 'react'
import { useAppDispatch, useAppSelector } from '../../store/configureStore'
import { selectCategories } from '../../redux/reducers/category-slice'
import { deleteCategory, getCategories } from '../../redux/actions/category-action';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import Box from '@mui/material/Box';
import TreeView from '@mui/lab/TreeView';
import TreeItem, { TreeItemProps, treeItemClasses } from '@mui/lab/TreeItem';
import { styled, useTheme } from '@mui/material/styles';
import Typography from '@mui/material/Typography';
import { Button, Card, CardContent, CardHeader, IconButton } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import { useCategory } from '../../context/category';
import toast from 'react-hot-toast';
import productApi from '../../api/product-api';
import WarningRoundedIcon from '@mui/icons-material/WarningRounded'


declare module 'react' {
    interface CSSProperties {
        '--tree-view-color'?: string;
        '--tree-view-bg-color'?: string;
    }
}

type StyledTreeItemProps = TreeItemProps & {
    category: ICategory;
    level: number;
    bgColor?: string;
    bgColorForDarkMode?: string;
    color?: string;
    colorForDarkMode?: string;
    labelIcon?: string;
    labelText: string;
};

const StyledTreeItemRoot = styled(TreeItem)(({ theme }) => ({
    color: theme.palette.text.secondary,
    [`& .${treeItemClasses.content}`]: {
        color: theme.palette.text.secondary,
        borderTopRightRadius: theme.spacing(2),
        borderBottomRightRadius: theme.spacing(2),
        paddingRight: theme.spacing(1),
        fontWeight: theme.typography.fontWeightMedium,
        '&.Mui-expanded': {
            fontWeight: theme.typography.fontWeightRegular,
        },
        '&:hover': {
            backgroundColor: theme.palette.action.hover,
        },
        '&.Mui-focused, &.Mui-selected, &.Mui-selected.Mui-focused': {
            backgroundColor: `var(--tree-view-bg-color, ${theme.palette.action.selected})`,
            color: 'var(--tree-view-color)',
        },
        [`& .${treeItemClasses.label}`]: {
            fontWeight: 'inherit',
            color: 'inherit',
        },
    },
    [`& .${treeItemClasses.group}`]: {
        marginLeft: 0,
        [`& .${treeItemClasses.content}`]: {
            paddingLeft: 18,
        },
    },
}));


function StyledTreeItem(props: StyledTreeItemProps) {
    const dispatch = useAppDispatch();
    const theme = useTheme();
    const { setSelectedCategory, setActionWithLeafCategory } = useCategory();
    const {
        category,
        level,
        bgColor,
        color,
        labelIcon: LabelIcon,
        labelText,
        colorForDarkMode,
        bgColorForDarkMode,
        ...other
    } = props;

    const styleProps = {
        '--tree-view-color': theme.palette.mode !== 'dark' ? color : colorForDarkMode,
        '--tree-view-bg-color':
            theme.palette.mode !== 'dark' ? bgColor : bgColorForDarkMode,
    };

    const handleClickEditRoot = (category: ICategory) => {
        setSelectedCategory(category);
        setActionWithLeafCategory(undefined);
    }

    const handleClickEditLeaf = (category: ICategory) => {
        setSelectedCategory(category);
        setActionWithLeafCategory('update');
    }

    const handleClickAddLeaf = (category: ICategory) => {
        setSelectedCategory(category);
        setActionWithLeafCategory('create');
    }

    const handleDeleteCategory = async (categoryId: string) => {
        try {
            const checkCateUsed = await productApi.checkCategoryUsed(categoryId);
            if (checkCateUsed.data.data) {
                toast.error('Loại sản phẩm này đang được sử dụng nên không thể xóa')
                return;
            } else {
                toast.loading('Đang xóa loại sản phẩm...', { id: 'deleteCate' })
                await dispatch(deleteCategory(categoryId)).unwrap();
                toast.dismiss('deleteCate');
                toast.success('Xóa loại sản phẩm thành công');
            }
        } catch (error) {
            console.log("error: ", error);
            toast.dismiss('deleteCate');
            toast.error((error as IResponseError).error)
        }
    }

    const handleConfirmDeleteCategory = (cate: ICategory) => {
        toast.loading(
            t => (
                <Box>
                    <p>
                        Bạn có muốn xóa loại sản phẩm <span style={{ fontWeight: 700 }}>{cate.name.find((name) => name.language === 'vi')?.value}</span>?
                    </p>
                    <Box sx={{ display: 'flex', justifyContent: 'end', columnGap: '12px' }}>
                        <Button onClick={() => toast.dismiss(t.id)} type='button' color='error' variant='text'>
                            Không
                        </Button>
                        <Button
                            onClick={() => {
                                toast.dismiss(t.id)
                                handleDeleteCategory(cate._id)
                            }}
                            type='button'
                            color='error'
                            variant='contained'
                        >
                            Có
                        </Button>
                    </Box>
                </Box>
            ),
            {
                id: 'warningToast',
                style: { maxWidth: '500px' },
                icon: <WarningRoundedIcon color='error' />
            }
        )
    }

    return (
        <StyledTreeItemRoot
            label={
                <Box
                    sx={{
                        display: 'flex',
                        alignItems: 'center',
                        p: 2,
                        '&:hover .action': {
                            visibility: "visible",
                        },
                    }}
                >
                    {LabelIcon && <img style={{ height: '24px', width: '24px', marginRight: '12px' }} src={LabelIcon} alt='label icon' />}
                    <Typography variant="body2" sx={{ fontWeight: 'inherit', flexGrow: 1 }}>
                        {labelText}
                    </Typography>

                    <Box className='action' sx={{ visibility: 'hidden' }}>
                        {level < 3 && (<IconButton size="small" onClick={(event) => {
                            event.stopPropagation();
                            handleClickAddLeaf(category);
                        }} aria-label="edit">
                            <AddIcon fontSize='small' color='info' />
                        </IconButton>)}

                        <IconButton size="small" onClick={(event) => {
                            event.stopPropagation();
                            if (level === 1) {
                                handleClickEditRoot(category);
                            } else {
                                handleClickEditLeaf(category);
                            }
                        }} aria-label="edit">
                            <EditIcon fontSize='small' color='primary' />
                        </IconButton>

                        <IconButton size="small" onClick={(event) => {
                            event.stopPropagation();
                            handleConfirmDeleteCategory(category);
                        }} aria-label="edit">
                            <DeleteIcon fontSize='small' color='error' />
                        </IconButton>
                    </Box>
                </Box >}
            style={styleProps}
            {...other} />
    );
}


export default function CategoryTree() {
    const dispatch = useAppDispatch();
    const { setActionWithLeafCategory, setSelectedCategory } = useCategory();
    const categories = useAppSelector(selectCategories).categories;

    const handleClickAdd = () => {
        setActionWithLeafCategory(undefined)
        setSelectedCategory(undefined)
    }

    const handleFetchCategories = async () => {
        try {
            await dispatch(getCategories()).unwrap()
        } catch (error) {
            console.log("error: ", error);
        }
    }

    const renderTree = (category: ICategory, level: number) => (
        <StyledTreeItem category={category} level={level} key={category._id} labelIcon={category.icon} nodeId={category._id} labelText={category.name.find((name) => name.language === 'vi')?.value || ''}>
            {Array.isArray(category.children)
                ? category.children.map((node) => renderTree(node, level + 1))
                : null}
        </StyledTreeItem>)


    useEffect(() => {
        if (categories.length === 0) {
            handleFetchCategories()
        }
    }, [])

    return (
        <Card>
            <CardHeader title={'Danh sách loại sản phẩm'}
                titleTypographyProps={{ variant: 'h5' }} action={<Button onClick={() => handleClickAdd()} variant='contained'>Thêm</Button>}>
            </CardHeader>
            <CardContent>
                <TreeView
                    aria-label="file system navigator"
                    defaultCollapseIcon={<ExpandMoreIcon />}
                    defaultExpandIcon={<ChevronRightIcon />}
                    sx={{ flexGrow: 1, overflowY: 'auto' }}
                >
                    {categories.map((category) => {
                        if (category.children) {
                            return renderTree(category, 1)
                        }
                    })}
                </TreeView>
            </CardContent>
        </Card>

    )
}
