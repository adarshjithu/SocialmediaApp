import React from 'react'

function Share({postData}:any) {
  return (
    <div className='flex ml-4 flex-col mt-2'>
      <i className="fa-solid fa-paper-plane fa-lg"></i>
      <p className="mt-2" style={{fontSize:"14px"}}>Share</p>
    </div>
  )
}

export default Share
