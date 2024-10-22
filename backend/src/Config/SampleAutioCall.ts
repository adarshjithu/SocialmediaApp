

export const sampleDemoCall = (socket:any,io:any)=>{

    socket.on('join-room', (roomID:any) => {
        console.log('room joined')
         socket.join(roomID);
         socket.to(roomID).emit('user-connected', socket.id);
     
      
       });
     
       socket.on('send-offer', (data:any) => {
         console.log('sendOffer')
         socket.to(data.roomID).emit('receive-offer', data);
       });
     
       socket.on('send-answer', (data:any) => {
         console.log('sendAnser')
         socket.to(data.roomID).emit('receive-answer', data);
       });
     
       socket.on('send-ice-candidate', (data:any) => {
         console.log('send ice candidate')
         socket.to(data.roomID).emit('receive-ice-candidate', data);
       });
     
}