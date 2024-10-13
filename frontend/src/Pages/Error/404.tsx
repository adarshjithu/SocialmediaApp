import React from 'react'
import { useNavigate } from 'react-router-dom'

function Error404() {

    const navigate = useNavigate()
  return (
    <div onClick={()=>navigate('/')}>
      <img src="https://colorlib.com/wp/wp-content/uploads/sites/2/404-error-page-templates.jpg" alt="" />
    </div>
  )
}

export default Error404
