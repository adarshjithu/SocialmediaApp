import { useContext, useEffect, useRef, useState } from "react";
import { noUserImage } from "../../Utils/utils";
import { SocketContext } from "../../Context/SocketProvider";
import toast from "react-hot-toast";
import { ICallModal } from "../../interfaces/Interface";

function CallModal({ user, setCallModal, userData }: ICallModal) {
    // This States are related to webrtc and socket connection for sending audio
    const socket = useContext(SocketContext);
    const localAudioRef = useRef<HTMLAudioElement>(null);
    const remoteAudioRef = useRef<HTMLAudioElement>(null);
    const peerConnection = useRef<RTCPeerConnection | null>(null);
    const [roomID, setRoomID] = useState<string>(String(userData._id));
    const [muted,setMuted] = useState<boolean>(false);
    const [remoteAudioMuted,setRemoteAudioMuted] = useState<boolean>(false)

    // To change the start call and end call button once started calling the button should be end call

    const [startCall, setStartCall] = useState<boolean>(true);
    const [acceptCall, setAcceptCall] = useState<boolean>(false);

    const [callDuration, setCallDuration] = useState<number>(0); // Call duration in seconds
    const [isCallActive, setIsCallActive] = useState<boolean>(false); // To toggle timer
    // To Send only audio
    const constraints: MediaStreamConstraints = { audio: true }; // Only request audio

    // Listeners for WebRTC
    useEffect(() => {
        if (socket) {
            socket.on("receive-offer", handleReceiveOffer);
            socket.on("receive-answer", handleReceiveAnswer);
            socket.on("receive-ice-candidate", handleReceiveICECandidate);
        }

        return () => {
            if (socket) {
                socket.off("receive-offer", handleReceiveOffer);
                socket.off("receive-answer", handleReceiveAnswer);
                socket.off("receive-ice-candidate", handleReceiveICECandidate);
            }
        };
    }, [socket]); // Add socket as a dependency

    // This function for join room for making  a webRTC connection
    const joinRoom = () => {
        navigator.mediaDevices
            .getUserMedia(constraints)
            .then((stream) => {
                if (localAudioRef.current) {
                    localAudioRef.current.srcObject = stream; // Using audio element for local stream
                }

                if (socket) {
                    socket.emit("join-room", roomID);
                }

                const pc = new RTCPeerConnection();
                pc.onicecandidate = (event) => {
                    if (event.candidate) {
                        socket.emit("send-ice-candidate", { roomID, candidate: event.candidate });
                    }
                };
                pc.ontrack = (event) => {
                    if (remoteAudioRef.current) {
                        remoteAudioRef.current.srcObject = event.streams[0]; // Using audio element for remote stream
                    }
                };

                stream.getTracks().forEach((track) => pc.addTrack(track, stream));

                peerConnection.current = pc;
                createOffer();
            })
            .catch((error) => {
                console.error("Error accessing media devices.", error);
            });
    };

    // Receive offer function
    const handleReceiveOffer = async (data: { roomID: string; offer: RTCSessionDescriptionInit }) => {
        if (peerConnection.current) {
            await peerConnection.current.setRemoteDescription(data.offer);
            const answer = await peerConnection.current.createAnswer();
            await peerConnection.current.setLocalDescription(answer);

            if (socket) {
                socket.emit("send-answer", { roomID: data.roomID, answer });
            }
        }
    };

    // Receiver answer function
    const handleReceiveAnswer = (data: { answer: RTCSessionDescriptionInit }) => {
        if (peerConnection.current) {
            peerConnection.current.setRemoteDescription(data.answer);
        }
    };

    const handleReceiveICECandidate = (data: { candidate: RTCIceCandidateInit }) => {
        if (peerConnection.current) {
            peerConnection.current.addIceCandidate(new RTCIceCandidate(data.candidate));
        }
    };

    // Create offer function
    const createOffer = async () => {
        if (peerConnection.current) {
            const offer = await peerConnection.current.createOffer();
            await peerConnection.current.setLocalDescription(offer);

            if (socket) {
                socket.emit("send-offer", { roomID, offer });
            }
        }
    };

    // ----------------------------------------- End of Webrtc functions--------------------------------------------------
    const start = () => {
        if (socket) {
            socket.emit("online-users-list");
        }
    };

    // End call by clicking end button
    const EndCallFunction = () => {
        endCall();
        if (socket) {
            socket.emit("end-call", { receiverId: user.otherUser._id });
        }

        // Reset the state
        setStartCall(true);
        setRoomID("");
        setAcceptCall(false);
        setIsCallActive(false);
    };

    // This is for  call to another friend with his current user details
    const initiateCall = () => {
        if (socket) {
            socket.emit("call-friend", { receiverId: user.otherUser._id, senderData: userData });
        }
        joinRoom();
    };

    // To get online users list for checking the current user online or not

    // This is for closing the connection and ending the call
    const endCall = () => {
        // Close the peer connection
        if (peerConnection.current) {
            peerConnection.current.close();
            peerConnection.current = null; // Reset the peer connection object
        }

        // Stop local media tracks
        const localStream = localAudioRef.current?.srcObject as MediaStream;
        if (localStream) {
            localStream.getTracks().forEach((track) => track.stop());
        }

        // Reset the local audio element
        if (localAudioRef.current) {
            localAudioRef.current.srcObject = null;
        }

        // Reset the remote audio element
        if (remoteAudioRef.current) {
            remoteAudioRef.current.srcObject = null;
        }
    };

    // Clicking start call checks user online or not and if online creates call;
    useEffect(() => {
        if (socket) {
            socket.on("online-users-list-result", (data: any) => {
                if (data[user.otherUser._id]) {
                    setStartCall(false);
                    initiateCall();
                } else {
                    toast.error("Requested user is offline");
                }
            });
        }

        return () => {
            socket.off("online-users-list-result");
            setAcceptCall(false);
        };
    }, [socket]);

    // End Call listener
    useEffect(() => {
        if (socket) {
            socket.on("end-call", () => {
                endCall();
                setStartCall(true);
                setRoomID("");
                setAcceptCall(false);
                setCallModal(false);
                setIsCallActive(false);
            });
        }
        if (socket) {
            socket.on("decline-call", () => {
                toast.error(`${user?.otherUser?.name} Declined `);
                endCall();
                setStartCall(true);
                setRoomID("");
                setAcceptCall(false);
                setIsCallActive(false);
            });
        }
        if (socket) {
            socket.on("call-accepted", () => {
                setAcceptCall(true);
                setIsCallActive(true);
            });
        }

        return () => {
            if (socket) {
                socket.off("end-call");

                endCall();
            }
            if (socket) {
                socket.off("decline-call");
            }
            if (socket) socket.off("call-accepted");
        };
    }, [socket]);

    useEffect(() => {
        let timer: NodeJS.Timeout | null = null;
        if (isCallActive) {
            // Increment call duration every second when the call is active
            timer = setInterval(() => {
                setCallDuration((prevDuration) => prevDuration + 1);
            }, 1000);
        } else if (!isCallActive && timer) {
            clearInterval(timer); // Clear interval if call is not active
        }
        return () => {
            if (timer) clearInterval(timer); // Cleanup on component unmount
        };
    }, [isCallActive]);

    // Function to format time from seconds to hh:mm:ss
    const formatTime = (totalSeconds: number) => {
        const hours = Math.floor(totalSeconds / 3600);
        const minutes = Math.floor((totalSeconds % 3600) / 60);
        const seconds = totalSeconds % 60;

        return `${hours.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
    };

    const muteAudio =()=>{
        setMuted(true)
        if(socket)socket.emit('mute-audio',{receiverId:user?.otherUser?._id})
    }

    const unmuteAudio =()=>{
        setMuted(false)
        if(socket)socket.emit('unmute-audio',{receiverId:user?.otherUser?._id})
    }

    useEffect(()=>{
        if(socket){
          socket.on('mute-audio',()=>{
            setRemoteAudioMuted(true)
            
        }) 
        socket.on('unmute-audio',()=>{
            setRemoteAudioMuted(false)
            
        })  
        }
        return ()=>{
            if(socket){

                socket.off('mute-audio');
                socket.off('unmute-audio')
                
            }
        }
    },[socket])
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-70 transition-opacity duration-300">
            <div className="bg-gradient-to-b from-purple-600 to-purple-800 rounded-lg shadow-lg p-6  flex flex-col items-center w-[70%] md:w-[30%]">
                <div className="flex items-center justify-between w-full mb-4">
                    <button
                        className="p-2 text-white hover:text-gray-300"
                        // Close modal on back button click
                    >
                        <span
                            className="material-icons"
                            onClick={() => {
                                setCallModal(false);
                                endCall();
                                if (socket) {
                                    socket.emit("end-call", { receiverId: user.otherUser._id });
                                }
                            }}
                        >
                            Back
                        </span>
                        <audio ref={localAudioRef} autoPlay playsInline muted></audio>
                        <audio ref={remoteAudioRef} muted={remoteAudioMuted?true:false} autoPlay playsInline></audio>
                    </button>
                    <h2 className="text-xl font-semibold text-white">Voice Call</h2>
                    <button className="p-2 text-white hover:text-gray-300">
                        <span className="material-icons">info</span>
                    </button>
                </div>
                <img
                    src={user?.otherUser?.image || noUserImage}
                    alt="User"
                    className="w-28 h-28 rounded-full border-4 border-white mb-4 transition-transform transform hover:scale-105"
                />
                <h3 className="text-lg font-semibold text-white">{user?.otherUser?.name}</h3>
                <p className="text-gray-300 mb-6">{remoteAudioMuted?'Muted':(acceptCall ? "In Call" : "Calling")}</p>
                <div className="flex space-x-8 mb-4">
                    {startCall ? (
                        <button
                            onClick={start}
                            className="p-3 bg-green-500 text-white rounded-full shadow-lg hover:bg-green-900 transition duration-200"
                        >
                            <span className="material-icons">Start_call</span> {<i className="fa-solid fa-phone"></i>}
                        </button>
                    ) : (
                        <button
                            onClick={EndCallFunction}
                            className="p-3 bg-red-500 text-white rounded-full shadow-lg hover:bg-red-900 transition duration-200"
                        >
                            <span className="material-icons">End_call</span> {<i className="fa-solid fa-phone"></i>}
                        </button>
                    )}

                    <button className="bg-blue-600 rounded-full p-2 w-[45px]">
                        {!muted?<i onClick={muteAudio} className="fa-solid fa-microphone " style={{ color: "white" }}></i>:
                        <i onClick={unmuteAudio}  className="fa-solid fa-microphone-slash " style={{ color: "white" }}></i>}
                    </button>
                </div>
                <p className="text-gray-300 text-lg"> {isCallActive ? formatTime(callDuration) : ""}</p> {/* Call duration */}
            </div>
        </div>
    );
}

export default CallModal;
