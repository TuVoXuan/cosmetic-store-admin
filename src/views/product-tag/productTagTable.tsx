import {
  Box,
  Button,
  Card,
  CardHeader,
  Chip,
  IconButton,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow
} from '@mui/material'
import React, { useEffect } from 'react'
import { toast } from 'react-hot-toast'
import { useTag } from '../../context/tag'
import { deleteTag, deleteTagGroup, getTags } from '../../redux/actions/tag-action'
import { selectTags } from '../../redux/reducers/tag-slice'
import { useAppDispatch, useAppSelector } from '../../store/configureStore'
import WarningRoundedIcon from '@mui/icons-material/WarningRounded'
import EditIcon from '@mui/icons-material/Edit'
import DeleteIcon from '@mui/icons-material/Delete'

export default function ProductTagTable() {
  const { setSelectedTag, setSelectedTagGroup } = useTag()
  const tagGroups = useAppSelector(selectTags).tagGroups
  const dispatch = useAppDispatch()

  const handleDeleteTag = async (id: string) => {
    try {
      await dispatch(deleteTag(id)).unwrap()
      toast.success('Xóa thẻ sản phẩm thành công')
    } catch (error) {
      console.log('error: ', error)
      toast.error((error as IResponseError).error)
    }
  }

  const handleDeleteTagGroup = async (id: string) => {
    try {
      await dispatch(deleteTagGroup(id)).unwrap()
      toast.success('Xóa nhóm thẻ thành công')
    } catch (error) {
      console.log('error: ', error)
      toast.error((error as IResponseError).error)
    }
  }

  const handleConfirmDeleteTag = (tag: ITag) => () => {
    toast.loading(
      t => (
        <Box>
          <p>
            Bạn có muốn xóa thẻ <span style={{ fontWeight: 700 }}>{tag.name}</span>?
          </p>
          <Box sx={{ display: 'flex', justifyContent: 'end', columnGap: '12px' }}>
            <Button onClick={() => toast.dismiss(t.id)} type='button' color='error' variant='text'>
              Không
            </Button>
            <Button
              onClick={() => {
                toast.dismiss(t.id)
                handleDeleteTag(tag._id)
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

  const handleConfirmDeleteTagGroup = (tagGroup: ISubTagGroup) => () => {
    toast.loading(
      t => (
        <Box>
          <p>
            Bạn có muốn xóa nhóm thẻ <span style={{ fontWeight: 700 }}>{tagGroup.name}</span>?
          </p>
          <Box sx={{ display: 'flex', justifyContent: 'end', columnGap: '12px' }}>
            <Button onClick={() => toast.dismiss(t.id)} type='button' color='error' variant='text'>
              Không
            </Button>
            <Button
              onClick={() => {
                toast.dismiss(t.id)
                handleDeleteTagGroup(tagGroup._id)
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
        id: 'warningTagGroup',
        style: { maxWidth: '500px' },
        icon: <WarningRoundedIcon color='error' />
      }
    )
  }

  const fetchTags = async () => {
    await dispatch(getTags()).unwrap()
  }

  const handleOnClickTag = (tag: ITag) => () => {
    setSelectedTag(tag)
  }

  const handleClickUpdateTagGroup = (tagGroup: ISubTagGroup) => {
    setSelectedTagGroup(tagGroup)
  }

  useEffect(() => {
    fetchTags()
  }, [])

  return (
    <Card>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <CardHeader title='Thẻ sản phẩm' titleTypographyProps={{ variant: 'h6' }} />
        <Button
          onClick={() => setSelectedTag(undefined)}
          size='medium'
          variant='contained'
          type='submit'
          sx={{ mr: 5 }}
        >
          Tạo thẻ
        </Button>
      </Box>
      <TableContainer component={Paper} sx={{ maxHeight: 440 }}>
        <Table stickyHeader aria-label='simple table'>
          <TableHead>
            <TableRow>
              <TableCell>Nhóm thẻ</TableCell>
              <TableCell align='center'>Thẻ</TableCell>
              <TableCell align='right'>Hành động</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {tagGroups.length > 0 ? (
              tagGroups.map(tagGroup => (
                <TableRow key={tagGroup._id} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                  <TableCell component='th' scope='row'>
                    {tagGroup.name}
                  </TableCell>
                  <TableCell align='center'>
                    {tagGroup.children.map(tag => (
                      <Chip
                        key={tag._id}
                        label={tag.name}
                        onClick={handleOnClickTag({ ...tag, parent: tagGroup._id })}
                        onDelete={handleConfirmDeleteTag({ ...tag, parent: tagGroup._id })}
                      />
                    ))}
                  </TableCell>
                  <TableCell align='right'>
                    <IconButton
                      onClick={() => handleClickUpdateTagGroup({ _id: tagGroup._id, name: tagGroup.name })}
                      aria-label='delete'
                      color='primary'
                    >
                      <EditIcon />
                    </IconButton>
                    <IconButton
                      onClick={handleConfirmDeleteTagGroup({ _id: tagGroup._id, name: tagGroup.name })}
                      color='error'
                      aria-label='add an alarm'
                    >
                      <DeleteIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <p>Đang lấy dữ liệu</p>
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </Card>
  )
}
