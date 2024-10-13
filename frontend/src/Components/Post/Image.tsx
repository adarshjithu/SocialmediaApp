import React from 'react'
import { IPost } from '../../interfaces/Interface'

function Image({data}:{data:IPost}) {
  return (
    <div style={{width:`${data.contentType=='text'?'100%':""}`}}>
      {data.contentType=='text'? <h1 className='text-bold text-[30px] mt-10  p-8'>{data?.description}</h1>:
      <img className=" h-full" src={data.images?data.images[0]:''} alt="" />}
    </div>
  )
}

export default Image
