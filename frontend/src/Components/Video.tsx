// // client/src/VideoCall.tsx
// import React, { useContext, useEffect, useRef, useState } from 'react';
// import { SocketContext } from '../Context/SocketProvider';

// const VideoCall: React.FC = () => {
//   const [stream, setStream] = useState<MediaStream | null>(null);
//   const [peerConnection, setPeerConnection] = useState<RTCPeerConnection | null>(null);
//   const [roomId, setRoomId] = useState<string>('');
//   const localVideoRef = useRef<HTMLVideoElement | null>(null);
//   const remoteVideoRef = useRef<HTMLVideoElement | null>(null);
//   const socket = useContext(SocketContext);

//   useEffect(() => {
//     const pc = new RTCPeerConnection();
//     setPeerConnection(pc); // Set the peer connection

//     // Get local media stream
//     navigator.mediaDevices.getUserMedia({ video: true, audio: true })
//       .then((mediaStream) => {
//         setStream(mediaStream);
//         if (localVideoRef.current) {
//           localVideoRef.current.srcObject = mediaStream;
//         }
//         // Add tracks only if the connection is not closed
//         mediaStream.getTracks().forEach((track) => {
//           if (pc.signalingState !== 'closed') {
//             pc.addTrack(track, mediaStream);
//           }
//         });
//       });

//     pc.onicecandidate = (event) => {
//       if (event.candidate) {
//         socket.emit('ice-candidate', { roomId, candidate: event.candidate });
//       }
//     };

//     pc.ontrack = (event) => {
//       if (remoteVideoRef.current) {
//         remoteVideoRef.current.srcObject = event.streams[0];
//       }
//     };

//     // Handle offer
//     if(socket)socket.on('offer', async (offer: RTCSessionDescriptionInit) => {
//       await pc.setRemoteDescription(new RTCSessionDescription(offer));
//       const answer = await pc.createAnswer();
//       await pc.setLocalDescription(answer);
//       socket.emit('answer', { roomId, answer });
//     });

//     // Handle answer
//     if(socket)socket.on('answer', (answer: RTCSessionDescriptionInit) => {
//       pc.setRemoteDescription(new RTCSessionDescription(answer));
//     });

//     // Handle ICE candidates
//     if(socket)socket.on('ice-candidate', (candidate: RTCIceCandidateInit) => {
//       if (pc && pc.signalingState !== 'closed') {
//         pc.addIceCandidate(new RTCIceCandidate(candidate)).catch(error => {
//           console.error('Error adding ICE candidate:', error);
//         });
//       }
//     });

//     return () => {
//       pc.close(); // Clean up on component unmount
//     };
//   }, [roomId, socket]);

//   const joinRoom = () => {
//     if (roomId) {
//       socket.emit('join-room', roomId);
//     }
//   };

//   const callUser = async () => {
//     if (!peerConnection) {
//       console.error('Peer connection is not established yet.');
//       return;
//     }
//     const offer = await peerConnection.createOffer();
//     await peerConnection.setLocalDescription(offer);
//     socket.emit('offer', { roomId, offer });
//   };

//   return (
//     <div>
//       <h1>Video Call</h1>
//       <input
//         type="text"
//         value={roomId}
//         onChange={(e) => setRoomId(e.target.value)}
//         placeholder="Enter room ID"
//       />
//       <button onClick={joinRoom}>Join Room</button>
//       <button onClick={callUser}>Start Call</button>
//       <video ref={localVideoRef} autoPlay playsInline muted style={{ width: '300px' }} />
//       <video ref={remoteVideoRef} autoPlay playsInline style={{ width: '300px' }} />
//     </div>
//   );
// };

// export default VideoCall;

import React, { useState } from 'react';

const VideoCall: React.FC = () => {
  // State to store the currently selected user/chat
  const [selectedChat, setSelectedChat] = useState<number | null>(null);

  // State to toggle between list and messages on mobile view
  const [isMobileView, setIsMobileView] = useState<boolean>(window.innerWidth < 768);

  // Handle window resize to toggle mobile/desktop view
  React.useEffect(() => {
    const handleResize = () => {
      setIsMobileView(window.innerWidth < 768);
    };

    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  const chats = [
    { id: 1, name: 'User 1', messages: ['Hello!', 'How are you?'] },
    { id: 2, name: 'User 2', messages: ['Hi!', 'What\'s up?'] },
  ];

  return (
    <div className="flex h-screen">
      {/* Chat list */}
      {(isMobileView && selectedChat === null) || !isMobileView ? (
        <div className={`w-full md:w-1/3 h-full bg-gray-200 ${isMobileView && selectedChat !== null ? 'hidden' : ''}`}>
          <h2 className="p-4 font-bold">Chat List</h2>
          {chats.map((chat) => (
            <div
              key={chat.id}
              className="p-4 cursor-pointer border-b border-gray-300 hover:bg-gray-300"
              onClick={() => setSelectedChat(chat.id)}
            >
              {chat.name}
            </div>
          ))}
        </div>
      ) : null}

      {/* Selected chat messages */}
      {(!isMobileView || selectedChat !== null) && (
        <div className="w-full md:w-2/3 h-full bg-white">
          <button
            className="md:hidden p-2 bg-blue-500 text-white"
            onClick={() => setSelectedChat(null)}
          >
            Back to Chats
          </button>
          {selectedChat !== null ? (
            <div>
              <h2 className="p-4 font-bold">Chat with {chats.find((chat) => chat.id === selectedChat)?.name}</h2>
              <div className="p-4">
                {chats
                  .find((chat) => chat.id === selectedChat)
                  ?.messages.map((msg, idx) => (
                    <p key={idx} className="mb-2">{msg}</p>
                  ))}
              </div>
            </div>
          ) : (
            <p className="p-4">Select a chat to view messages.</p>
          )}
        </div>
      )}
    </div>
  );
};

export default VideoCall;

