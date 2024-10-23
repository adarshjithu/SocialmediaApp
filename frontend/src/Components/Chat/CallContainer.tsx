import React, { useContext, useEffect, useState } from 'react'
import IncomingCallModal from './ReceiveCallComponent'
import { SocketContext } from '../../Context/SocketProvider';

function CallContainer() {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const socket = useContext(SocketContext)
    const [roomID,setRoomID] = useState('')
    const [senderData, setSenderData] = useState<Record<string, any>>({});
    useEffect(()=>{
       if(socket) {socket.on("audio-start-call", (data: any) => {
            setIsModalOpen(true);
            setSenderData(data?.senderData);
            setRoomID(data?.password);
        });}
    },[socket,isModalOpen])

  return (
    <div>
     {isModalOpen&&<IncomingCallModal isModalOpen={isModalOpen} setIsModalOpen={setIsModalOpen} roomID={roomID} setRoomID={setRoomID} senderData={senderData} setSenderData={setSenderData}/>} 
    </div>
  )
}

export default CallContainer
