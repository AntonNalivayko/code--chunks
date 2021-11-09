import React from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { bannersActions, bannersThunks } from '../../store/012_bannersSectionReducer/bannersActions'
import { Banners } from './Banners'
import { CreateBannerContainer } from './utils/CreateBannerContainer'
import Tooltip from '@material-ui/core/Tooltip'
import IconButton from '@material-ui/core/IconButton'
import AssignmentIcon from '@material-ui/icons/Assignment'
import AddBoxIcon from '@material-ui/icons/AddBox'

export const BannersContainer = () => {
   const dispatch = useDispatch()
   const { banners, count, loading } = useSelector(state => state.bannersReducer)
   const [page, setPage] = React.useState(1)
   const [pageSize, setPageSize] = React.useState(25)
   const [offset, setOffset] = React.useState(25)
   const [banner, setBanner] = React.useState({})
   const [open, setOpen] = React.useState(false)
   const [createMode, setCreateMode] = React.useState(false)

   const pageChangeHandler = params => {
      if (params.page > page) {
         dispatch(bannersThunks.getBanners(`?limit=${pageSize}&offset=${offset}}`))
         setPage(params.page)
         setOffset(prevState => prevState + pageSize)
      }
   }

   const pageSizeHandler = params => {
      if (pageSize < params.pageSize && params.page === 1) {
         const difference = params.pageSize - pageSize
         setOffset(prevState => prevState + difference)
         dispatch(bannersThunks.getBanners(`?limit=${difference}&offset=0`))
      } else if (pageSize < params.pageSize) {
         const currentPage = Math.ceil(banners.length / params.pageSize)
         params.page = currentPage
         setPage(currentPage - 1)
         const expectedBannersLength = params.page * params.pageSize
         if (expectedBannersLength !== banners.length) {
            const difference = expectedBannersLength - banners.length
            setOffset(prevState => prevState + difference)
            dispatch(bannersThunks.getBanners(`?limit=${difference}&offset=${offset}`))
         }
      } else if (pageSize > params.pageSize) {
         const currentPage = Math.ceil(banners.length / params.pageSize)
         params.page = currentPage
         setPage(currentPage - 1)
      }
      setPageSize(params.pageSize)
   }

   React.useEffect(() => {
      dispatch(bannersThunks.getBanners(`?limit=${pageSize}`))
      return () => dispatch(bannersActions.setEmpty())
      // eslint-disable-next-line react-hooks/exhaustive-deps
   }, [])

   const translationObject = {
      main: 'Личный кабинет',
      franch: 'Франшиза',
      news: 'Новости',
      tradein: 'Трейд-ин',
      service: 'Сервис',
      contacts: 'Контакты',
      all: 'Показывать везде',
      tel: 'Звонок',
   }

   const getDataForRow = row => {
      if (row) {
         const value = Object.entries(translationObject).find(([key, value]) => key === row)
         return value[1]
      } else {
         return ''
      }
   }

   const columns = [
      { field: 'title', headerName: <strong>Название</strong>, width: 170, sortable: false },
      {
         field: 'image',
         headerName: <strong>Баннер</strong>,
         width: 300,
         sortable: false,
         renderCell: params => (
            <div style={{ height: '100%', width: '300px', objectFit: 'contain' }}>
               {params.row?.image ? <img style={{ height: '100%' }} src={params.row.image} alt='---' /> : '---'}
            </div>
         ),
      },
      {
         field: 'action',
         headerName: <strong>Действие</strong>,
         flex: 1,
         sortable: false,
      },
      {
         field: 'area',
         headerName: <strong>Где отображается</strong>,
         flex: 1,
         sortable: false,
      },
      {
         field: 'actions',
         headerName: <strong>Действия</strong>,
         width: 120,
         sortable: false,
         renderCell: params => (
            <Tooltip title='Редактировать баннер'>
               <IconButton
                  onClick={e => {
                     const banner = { ...params.row?.banner, src: params.row?.image, image: '' }
                     setOpen(true)
                     setBanner(banner)
                  }}
                  children={<AssignmentIcon />}></IconButton>
            </Tooltip>
         ),
      },
   ]

   const rows = banners.map(row => {
      return {
         id: row.id,
         title: row.title,
         image: row.image,
         action: getDataForRow(row.action),
         area: getDataForRow(row.area),
         banner: row,
      }
   })
   const text = {
      footerRowSelected: count =>
         count !== 1 ? `${count.toLocaleString()} рядов выбрано` : `${count.toLocaleString()} ряд выбран`,
   }

   const updateTable = () => {
      dispatch(bannersThunks.updateTableAfterBannerEditing(`?limit=${pageSize}`))
      setPage(1)
      setOffset(pageSize)
   }

   return (
      <>
         <CreateBannerContainer
            banner={banner}
            setBanner={setBanner}
            open={open}
            setOpen={setOpen}
            createMode={createMode}
            setCreateMode={setCreateMode}
            updateTable={updateTable}
         />
         <div>
            <Tooltip title='Создать баннер'>
               <IconButton
                  onClick={e => {
                     setCreateMode(true)
                     setOpen(true)
                  }}>
                  <AddBoxIcon />
               </IconButton>
            </Tooltip>
            <span>Добавить баннер</span>
         </div>
         <Banners
            count={count}
            columns={columns}
            rows={rows}
            loading={loading}
            pageChangeHandler={pageChangeHandler}
            text={text}
            pageSizeHandler={pageSizeHandler}
         />
      </>
   )
}
