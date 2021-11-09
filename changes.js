import React from 'react'
import Checkbox from '@material-ui/core/Checkbox'
import FormControlLabel from '@material-ui/core/FormControlLabel'

import { useMediaQuery } from "@material-ui/core";
import { useTheme } from "@material-ui/core/styles"

import Accordion from '@material-ui/core/Accordion'
import AccordionSummary from '@material-ui/core/AccordionSummary'
import AccordionDetails from '@material-ui/core/AccordionDetails';
import Typography from '@material-ui/core/Typography';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore'


const Changes = ({changes, check, setCheck}) => {

   const permissionsArray = changes;

   const [permissionOut, setPermissionOut] = React.useState(permissionsArray)
   const [resultSearch, setResultSearch] = React.useState()
   const [search, setSearch] = React.useState()

   const columnStyle = {
      display: 'flex', 
      flexFlow: 'column',
      margin: '20px',
      maxWidth: '25%',
      minWidth: '150px'
   } 
   const columnStyleMob = {
      display: 'flex', 
      flexFlow: 'column',
      margin: '20px',
      
   } 
   
     const checkBoxStyle = {
      listStyleType: 'none',  
      wordBreak:  'break-all', 
      whiteSpace: 'normal', 
      marginTop: '5px', 
      marginBottom: '5px'
     }

   const handleChange = id => event => {
    
         const updatedPermissions = permissionOut.map(item => {
            if (item.id === id) {
               return { ...item, isEnabled: event.target.checked }
            }
            return item
         })
         setPermissionOut(updatedPermissions)
      if (resultSearch){
         const updatedPermissionsSearch = resultSearch.map(item => {
            if (item.id === id) {
               return { ...item, isEnabled: event.target.checked }
            }
            return item
         })
         setResultSearch(updatedPermissionsSearch)
      }
         const CheckedId = { ...check, [id]: event.target.checked }
         setCheck(CheckedId)
     
   }
   const theme = useTheme();
   const isSmallScreen = useMediaQuery(theme.breakpoints.down("sm"));
   return (
      <>
      {isSmallScreen && 
         <Accordion style={{margin: '15px', width: '80%'}}>
         <AccordionSummary
           expandIcon={<ExpandMoreIcon />}
           aria-controls="panel1a-content"
           id="panel1a-header"
         >
           <Typography ><strong>Изменение</strong></Typography>
         </AccordionSummary>
         <AccordionDetails>
            <div style={columnStyleMob}>
            <input
               onChange={e => {
                  const test = permissionOut.filter(item => {
                     return item.name.toLowerCase().includes(e.target.value.toLowerCase())
                  })
                  
                  setResultSearch(test)
                  setSearch(e.target.value)
               }}
               type='text'
               value={search}
               style={{width: '100%', padding:'10px', marginBottom: 20}}
               placeholder='Поиск...'
            />
             <div style={{maxHeight:300, overflowY: 'scroll'}}>
            {resultSearch
               ? resultSearch.map(item => (
                    <li style={checkBoxStyle} key={item.id} >
                       <FormControlLabel
                          control={<Checkbox name={item.id} checked={item.isEnabled} onChange={handleChange(item.id)} />}
                          label={item.name.substring(11)}
                       />
                    </li>
                 ))
               : permissionOut.map(item => (
                    <li style={checkBoxStyle} key={item.id}>
                       <FormControlLabel
                          control={<Checkbox name={item.id} checked={item.isEnabled} onChange={handleChange(item.id)} />}
                          label={item.name.substring(11)}
                       />
                    </li>
                 ))}</div>
                 </div>
         </AccordionDetails>
       </Accordion>
         }
         
         {!isSmallScreen && <div style={columnStyle}>
         <h2>Изменение</h2>
            <input
               onChange={e => {
                  const test = permissionOut.filter(item => {
                     return item.name.toLowerCase().includes(e.target.value.toLowerCase())
                  })
                  
                  setResultSearch(test)
                  setSearch(e.target.value)
               }}
               type='text'
               value={search}
               style={{width: '100%', padding:'10px', marginBottom: '20px'}}
               placeholder='Поиск...'
            />
             <div style={{maxHeight:500, overflowY: 'scroll'}}>
            {resultSearch
               ? resultSearch.map(item => (
                    <li style={checkBoxStyle} key={item.id}>
                       <FormControlLabel
                          control={<Checkbox name={item.id} checked={item.isEnabled} onChange={handleChange(item.id)} />}
                          label={item.name.substring(11)}
                       />
                    </li>
                 ))
               : permissionOut.map(item => (
                    <li style={checkBoxStyle} key={item.id}>
                       <FormControlLabel
                          control={<Checkbox name={item.id} checked={item.isEnabled} onChange={handleChange(item.id)} />}
                          label={item.name.substring(11)}
                       />
                    </li>
                 ))}</div>
         </div>}
      </>
   )
}
export default Changes
