import React from 'react'

function EmptyMessage() {
  return (
    <div className='w-full h-[85%] text-white flex justify-center items-center'>
  <div className="flex flex-col w-[50%] items-center] bg-[#1E2B32] rounded-xl p-1 ">
    
      <p className="text-white-500 text-center mb-2 text-lg">No Messages</p>
      <p className="text-white-500 text-sm text-center mb-2">
        Send messages to start a conversation.
      </p>
      <p className="text-sm text-white text-center">
        Messages and calls are end-to-end encrypted.
      </p>
    </div>
    </div>
  )
}

export default EmptyMessage
