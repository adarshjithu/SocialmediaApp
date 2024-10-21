import { useContext, useEffect, useRef, useState } from "react";
import { generateRandomString, noUserImage } from "../../Utils/utils";
import { SocketContext } from "../../Context/SocketProvider";
import toast from "react-hot-toast";
import { ICallModal } from "../../interfaces/Interface";

function CallModal() {
    
    const socket = useContext(SocketContext); // Assuming SocketContext is initialized elsewhere
  const localAudioRef = useRef<HTMLAudioElement>(null);
  const remoteAudioRef = useRef<HTMLAudioElement>(null);
  const peerConnection = useRef<RTCPeerConnection | null>(null);
  const [roomID, setRoomID] = useState<string>(""); // Room ID from user input
  const [inRoom, setInRoom] = useState<boolean>(false); // Track if user has joined the room
  const constraints = { audio: true };

  // Join the room when user enters Room ID and clicks Join Room
  const joinRoom = () => {
    if (!roomID) {
      alert("Please enter a room ID to join!");
      return;
    }

    socket.emit("join-room", roomID);
    setInRoom(true); // Mark that the user has joined the room
  };

  // WebRTC logic: Initialize the call once user clicks Start Call
  const startCall = () => {
    navigator.mediaDevices.getUserMedia(constraints).then((stream) => {
      if (localAudioRef.current) localAudioRef.current.srcObject = stream;

      const pc = new RTCPeerConnection();
      pc.onicecandidate = (event) => {
        if (event.candidate) {
          socket.emit("send-ice-candidate", { roomID, candidate: event.candidate });
        }
      };

      pc.ontrack = (event) => {
        if (remoteAudioRef.current) remoteAudioRef.current.srcObject = event.streams[0];
      };

      stream.getTracks().forEach((track) => pc.addTrack(track, stream));
      peerConnection.current = pc;
      createOffer();
    }).catch((err) => console.error("Error accessing audio devices", err));
  };

  // Create WebRTC offer
  const createOffer = async () => {
    if (peerConnection.current) {
      const offer = await peerConnection.current.createOffer();
      await peerConnection.current.setLocalDescription(offer);
      socket.emit("send-offer", { roomID, offer });
    }
  };

  // Handle receiving offer
  const handleReceiveOffer = async (data: any) => {
    if (peerConnection.current) {
      await peerConnection.current.setRemoteDescription(new RTCSessionDescription(data.offer));
      const answer = await peerConnection.current.createAnswer();
      await peerConnection.current.setLocalDescription(answer);
      socket.emit("send-answer", { roomID: data.roomID, answer });
    }
  };

  // Handle receiving answer
  const handleReceiveAnswer = (data: any) => {
    if (peerConnection.current) {
      peerConnection.current.setRemoteDescription(new RTCSessionDescription(data.answer));
    }
  };

  // Handle ICE candidates
  const handleReceiveICECandidate = (data: any) => {
    if (peerConnection.current) {
      peerConnection.current.addIceCandidate(new RTCIceCandidate(data.candidate));
    }
  };

  // Socket event listeners
  useEffect(() => {
    socket.on("receive-offer", handleReceiveOffer);
    socket.on("receive-answer", handleReceiveAnswer);
    socket.on("receive-ice-candidate", handleReceiveICECandidate);

    return () => {
      socket.off("receive-offer", handleReceiveOffer);
      socket.off("receive-answer", handleReceiveAnswer);
      socket.off("receive-ice-candidate", handleReceiveICECandidate);
    };
  }, [socket]);

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-70 transition-opacity duration-300">
            <div>
      <div>
        {/* Room ID input */}
        <input
          type="text"
          placeholder="Enter room ID"
          value={roomID}
          onChange={(e) => setRoomID(e.target.value)}
        />
        
        {/* Join Room Button */}
        <button onClick={joinRoom} disabled={inRoom}>
          Join Room
        </button>
        
        {/* Start Call Button (only enabled after joining the room) */}
        <button onClick={startCall} disabled={!inRoom}>
          Start Call
        </button>
      </div>

      <audio ref={localAudioRef} autoPlay muted></audio>
      <audio ref={remoteAudioRef} autoPlay></audio>
    </div>
     
        </div>
    );
}

export default CallModal;
