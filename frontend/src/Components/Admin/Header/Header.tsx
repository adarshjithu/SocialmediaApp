import { Button, TextField } from '@mui/material'
import React from 'react'

function Header() {
  return (
    <div className='flex flex-row justify-between w-full bg-[#22154E] h-[60px] w-[100%] p-2'>
       <div className='w-[50%] rounded-xl' >
        
       </div>
       <div className='flex flex-row p-2'>
        <Button variant='contained' size='small'sx={{backgroundColor:"#4B164C",height:"30px",marginRight:"10px"}}>Download</Button>
        <div className='ml-2 mr-2'>

        <i className="fa-regular fa-bell fa-xl" style={{ color: `${'#4B164C'}` }}></i>
        </div>
        <img className='mr-2 w-[35px] h-[35px] rounded-full' src="/Images/photo_2024-02-09_18-59-08.jpg" alt="" />
       </div>
    </div>
  )
}

export default Header
