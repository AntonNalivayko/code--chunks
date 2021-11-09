import React from 'react'
import { yabloosApi } from '../../api/yabloosApi'
import { Managers } from './Managers'
import { managersActions, managersThunks } from '../../store/018_managersSectionReduser/managersActions'
import Button from '@material-ui/core/Button'
import { useDispatch, useSelector } from 'react-redux'
import CloseIcon from '@material-ui/icons/Close'
import { makeStyles } from '@material-ui/core/styles'
import { EditManagerContainer } from '../020_managers/editManager/EditManagerContainer'
import PersonIcon from '@material-ui/icons/Person'
import Tooltip from '@material-ui/core/Tooltip'
import IconButton from '@material-ui/core/IconButton'
import AddBoxIcon from '@material-ui/icons/AddBox'
import { ManagerCard } from './UpdateManager/managerCard'
import { DeleteManagerModal } from './UpdateManager/DeleteManagerModal'
import { AlertMessage } from '../../components/alert/AlertMessage'

import { useMediaQuery } from '@material-ui/core'
import { useTheme } from '@material-ui/core/styles'
import  {CircularProgress}  from '@material-ui/core'

const useStyles = makeStyles(() => ({
   wrapper: {
      width: 400,
      display: 'flex',
      flexDirection: 'row',
      alignItems: 'center',
      textAlign: 'center',
      justifyContent: 'space-between',
   },
   MUIDataTableHeadCell: {
      toolButton: {
        justifyContent: 'center'
      },
    },
}))

export const ManagersContainer = () => {
   const classes = useStyles()
   const dispatch = useDispatch()

   const { managers, filter, loading } = useSelector(state => state.managersReducer)
   const [page, setPage] = React.useState(1)
   const [pageSize, setPageSize] = React.useState(25)
   const [offset, setOffset] = React.useState(25)
   const [manager, setManager] = React.useState({})

   const [createMode, setCreateMode] = React.useState(false)
   const [open, setOpen] = React.useState(false)
   const [openDeleteModal, setOpenDeleteModal] = React.useState(false)
   const [loadingManagerPage, setLoadingManagerPage] =React.useState()

   const [permissionsAll, setPermissionsAll] = React.useState()
   const [permissionsAllforEdit, setPermissionsAllforEdit]= React.useState()
   const [permissionsUser, setPermissionsUser] = React.useState()
   
   const [openManagerCard, setOpenManagerCard] = React.useState(false)
   const [openAlert, setOpenAlert] = React.useState(false)
   const [openAddAlert, setOpenAddAlert] = React.useState(false)
   const [alertError, setAlertError] = React.useState(false)
   const [managerDeleted, setManagerDeleted] = React.useState()

   const [yabloosAllUserPermissions, setYabloosAllUserPermissions] = React.useState()
   const [yablokoAllUserPermissions, setYablokoAllUserPermissions] = React.useState()
   const [yablobronAllUserPermissions, setYablobronAllUserPermissions] = React.useState()

   React.useEffect(() => {
      if (permissionsAll && permissionsUser) {
         setOpenManagerCard(true)
      }
   }, [permissionsAll, permissionsUser])

   const pageChangeHandler = params => {
      if (params.page > page) {
         // dispatch(managersThunks.getManagers(`?limit=${pageSize}&offset=${offset}${filter ? `&title=${filter}` : ''}`))
         setPage(params.page)
         setOffset(prevState => prevState + pageSize)
      }
   }

   const pageSizeHandler = params => {
      if (pageSize < params.pageSize && params.page === 1) {
         const difference = params.pageSize - pageSize
         setOffset(prevState => prevState + difference)
         dispatch(managersThunks.getManagers(`?limit=${difference}&offset=0`))
      } else if (pageSize < params.pageSize) {
         const currentPage = Math.ceil(managers.length / params.pageSize)
         params.page = currentPage
         setPage(currentPage - 1)
         const expectedManagersLength = params.page * params.pageSize

         if (expectedManagersLength !== managers.length) {
            const difference = expectedManagersLength - managers.length
            setOffset(prevState => prevState + difference)
            dispatch(managersThunks.getManagers(`?limit=${difference}&offset=${offset}`))
         }
      } else if (pageSize > params.pageSize) {
         const currentPage = Math.ceil(managers.length / params.pageSize)
         params.page = currentPage
         setPage(currentPage - 1)
      }
      setPageSize(params.pageSize)
   }

   React.useEffect(() => {
      dispatch(managersThunks.getManagers(`?limit=${pageSize}`))

      return () => dispatch(managersActions.setEmpty())
      // eslint-disable-next-line react-hooks/exhaustive-deps
   }, [])

   // const handleSetPage = () => {
   //    setPage(1)
   // }

   const getAllprojects = async () => {
      const responseAllProjects = await yabloosApi.getProjectsManagerYou()
      const AllProjectsPermissions = responseAllProjects.data
      setPermissionsAllforEdit(AllProjectsPermissions)
   }

   const handleDeletManager = async id => {
      const response = await yabloosApi.deleteManager(id)
      if (response.status === 204) {
         setOpenDeleteModal(false)
         setOpenAlert(true)
         updateTable()
      } else {
         setOpenAlert(true)
         setAlertError(true)
      }
   }

   const getPerrmissions = async id => {
      const data = {
         user: id,
      }
      const responseAll = await yabloosApi.getProjectsManager(data)
      const responseUser = await yabloosApi.getProjectsManagerYou()
      const projectsUser = responseAll.data.data
      const projectsAll = responseUser.data

      projectsUser.forEach(element => {
         if (element.project === 'yabloos') {
            const yabloosUserPermissions = element.content.permissions
            const yabloosUse = element
            setYabloosAllUserPermissions(yabloosUserPermissions)
            console.log('OS',yabloosUserPermissions)
         }
         if (element.project === 'yabloko') {
            const yablokoUserPermissions = element.content.permissions
            setYablokoAllUserPermissions(yablokoUserPermissions)
            console.log('KO',yablokoUserPermissions)

         }
         if (element.project === 'yablobron') {
            const yablobronUserPermissions = element.content.permissions
            setYablobronAllUserPermissions(yablobronUserPermissions)
            console.log('BRON',yablobronUserPermissions)

         }
      })

      setPermissionsAll(projectsAll)
      setPermissionsUser(projectsUser)
      console.log('ProjectsAll',projectsAll)
   }

   const updateTable = () => {
      dispatch(managersThunks.updateTableAfterManagerEditing())
   }

   const columns = [
      { field: 'id',  headerName: <strong>ID</strong>, width: 70, sortable: false },
      {
         field: 'fullName',
         headerName: <strong>ФИО</strong>,
         width: 300,
         sortable: false,
         renderHeader: params => (
            <div className={classes.wrapper}>
               <div>{params.colDef.headerName}</div>
            </div>
         ),
      },
      {
         field: 'userName',
         headerName: <strong>Логин</strong>,
         width: 300,
         sortable: false,
         renderHeader: params => (
            <div className={classes.MUIDataTableHeadCell}>
               <div>{params.colDef.headerName}</div>
            </div>
         ),
      },
      {
         field: 'actions',
         headerName: <strong>Действия</strong>,
         sortable: false,
         width: 130,
         renderCell: params => {
            if (params.row.id === loadingManagerPage){
               return (
               <div style={{ width: '100%', display: 'flex', flexDirection: 'row', justifyContent: 'space-around' }}>
               <Tooltip title='Карточка менеджера'>
                  <IconButton
                     onClick={e => {
                        // setOpenCard(true)
                        setManager(params.row)
                        getPerrmissions(params.row.userId)
                        setLoadingManagerPage(params.row.id)
                     }}
                     children={<CircularProgress disableShrink size={20}/>}></IconButton>
               </Tooltip>
               <Tooltip title='Удалить менеджера'>
                  <IconButton
                     onClick={e => {
                        setManager(params.row)
                        setOpenDeleteModal(true)
                        // handleDeletManager(params.row.id)
                        // updateTable()
                     }}>
                     <CloseIcon style={{ color: 'red' }} />
                  </IconButton>
               </Tooltip>
            </div>)
            } else {
               return (
            <div style={{ width: '100%', display: 'flex', flexDirection: 'row', justifyContent: 'space-around' }}>
               <Tooltip title='Карточка менеджера'>
                  <IconButton
                     onClick={e => {
                        // setOpenCard(true)
                        setManager(params.row)
                        getPerrmissions(params.row.userId)
                        setLoadingManagerPage(params.row.id)
                     }}
                     children={<PersonIcon />}></IconButton>
               </Tooltip>
               <Tooltip title='Удалить менеджера'>
                  <IconButton
                     onClick={e => {
                        setManager(params.row)
                        setOpenDeleteModal(true)
                        // handleDeletManager(params.row.id)
                        // updateTable()
                     }}>
                     <CloseIcon style={{ color: 'red' }} />
                  </IconButton>
               </Tooltip>
            </div>)}
         },
      },
   ]

   const rows = managers.map(row => {
      return {
         id: row.id,
         userId: row.user.id,
         fullName: row.name,
         userName: row.user.username,
      }
   })

   const text = {
      footerRowSelected: count =>
         count !== 1 ? `${count.toLocaleString()} рядов выбрано` : `${count.toLocaleString()} ряд выбран`,
   }
   const theme = useTheme()
   const isSmallScreen = useMediaQuery(theme.breakpoints.down('sm'))
   return (
      <>
         <EditManagerContainer
            manager={manager}
            open={open}
            setOpen={setOpen}
            setManager={setManager}
            createMode={createMode}
            setCreateMode={setCreateMode}
            updateTable={updateTable}
            permissionsAllforEdit={permissionsAllforEdit}
            setOpenAddAlert={setOpenAddAlert}
            setAlertError={setAlertError}
         />
         <DeleteManagerModal
            manager={manager}
            openDeleteModal={openDeleteModal}
            setOpenManagerCard={setOpenManagerCard}
            setOpenDeleteModal={setOpenDeleteModal}
            setOpen={setOpen}
            handleDeletManager={handleDeletManager}
            setManagerDeleted={setManagerDeleted}
            
         />

         {openManagerCard ? (
            <ManagerCard
               permissionsAll={permissionsAll}
               permissionsUser={permissionsUser}
               manager={manager}
               yabloosAllUserPermissions={yabloosAllUserPermissions}
               yablokoAllUserPermissions={yablokoAllUserPermissions}
               yablobronAllUserPermissions={yablobronAllUserPermissions}
               setOpenManagerCard={setOpenManagerCard}
               getPerrmissions={getPerrmissions}
               setLoadingManagerPage={setLoadingManagerPage}
            />
         ) : (
            <>
               <div style={isSmallScreen ? {marginTop: '50px'} : null}>
                  <Tooltip title='Добавить менеджера'>
                     <IconButton
                        onClick={e => {
                           setCreateMode(true)
                           setOpen(true)
                           getAllprojects()
                        }}>
                        <AddBoxIcon />
                     </IconButton>
                  </Tooltip>
                  <span>Добавить менеджера</span>
               </div>
               <Managers
                  columns={columns}
                  rows={rows}
                  loading={loading}
                  pageChangeHandler={pageChangeHandler}
                  text={text}
                  pageSizeHandler={pageSizeHandler}
                  handleDeletManager={handleDeletManager}
               />
               {openAlert && (
                  <AlertMessage
                     open={openAlert}
                     setOpen={setOpenAlert}
                     message={alertError ? ('') : (<>Менеджер <strong>{managerDeleted}</strong> успешно удалён</>)}
                     error={alertError}
                  />
               )}
               {openAddAlert && (
                  <AlertMessage
                     open={openAddAlert}
                     setOpen={setOpenAddAlert}
                     message={alertError ? ('') : (<>Менеджер сохранен!</>)}
                     error={alertError}
                  />
               )}
            </>
         )}
      </>
   )
}
