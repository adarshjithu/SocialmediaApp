import { useContext, useEffect, useRef, useState } from "react";
import { noUserImage } from "../../Utils/utils";
import { SocketContext } from "../../Context/SocketProvider";

function IncomingCallModal() {
    const [modalOpen, setModalOpen] = useState(false);
    const socket = useContext(SocketContext);
    const localAudioRef = useRef<HTMLAudioElement>(null);
    const remoteAudioRef = useRef<HTMLAudioElement>(null);
    const peerConnection = useRef<RTCPeerConnection | null>(null);
    const [isJoined, setIsJoined] = useState<boolean>(false);
    const [user, setUser] = useState<any>({});
    const [muted, setMuted] = useState<boolean>(false);
    const [remoteAudioMuted, setRemoteAudioMuted] = useState<boolean>(false);
    const [roomID, setRoomID] = useState<string>("");
    const [time, setTime] = useState<any>(null);
    const [accepted, setAccepted] = useState<boolean>(false);
    const [callDuration, setCallDuration] = useState<number>(0); // Call duration in seconds
    const [isCallActive, setIsCallActive] = useState<boolean>(false); // To toggle timer
    const constraints: MediaStreamConstraints = { audio: true }; // Only request audio

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
                setIsJoined(true);

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

    const createOffer = async () => {
        if (peerConnection.current) {
            const offer = await peerConnection.current.createOffer();
            await peerConnection.current.setLocalDescription(offer);

            if (socket) {
                socket.emit("send-offer", { roomID, offer });
            }
        }
    };

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

        // Reset the state
        setIsJoined(false);
        setIsCallActive(false);
        setRoomID("");
    };

    // Listen for call end signal from the other user
    useEffect(() => {
        if (socket) {
            socket.on("end-call", () => {
                endCall();
                setModalOpen(false);
                setAccepted(false);
                setIsCallActive(false);
            });
        }

        return () => {
            if (socket) {
                socket.off("end-call");
            }
        };
    }, [socket]);

    const closeCall = () => {
        endCall();
        socket.emit("end-call", { receiverId: user._id });
        setModalOpen(false);
        setAccepted(false);
        setIsCallActive(false);
    };

    useEffect(() => {
        if (socket) {
            socket.on("incoming-call", (data: any) => {});
        }
        if (socket) {
            socket.on("call-friend", (data: any) => {
                setUser(data);
                setRoomID(String(data._id));
                setModalOpen(true);
            });
        }
        return () => {
            if (socket) {
                socket.off("incoming-call");
                socket.off("call-friend");
            }
        };
    }, [socket]);

    const acceptCall = () => {
        joinRoom();
        setIsCallActive(true);
        setAccepted(true);
        socket.emit("call-accepted", user._id);
    };

    const declineCall = () => {
        socket.emit("decline-call", user._id);
        setModalOpen(false);
        setIsCallActive(false);
        setCallDuration(0);
    };

    const endTheCall = () => {
        endCall();
        socket.emit("end-call", { receiverId: user._id });
        setModalOpen(false);
        setAccepted(false);
        setIsCallActive(false);
        setCallDuration(0);
    };

    useEffect(() => {
        let timer: NodeJS.Timeout | null = null;

        if (isCallActive) {
            // Increment call duration every second when the call is active
            timer = setInterval(() => {
                setCallDuration((prevDuration) => prevDuration + 1);
            }, 1000);
            setTime(timer);
        } else if (!isCallActive && timer) {
            clearInterval(timer); // Clear interval if call is not active
        }
        return () => {
            if (timer) clearInterval(timer);
            clearInterval(time); // Cleanup on component unmount
        };
    }, [isCallActive]);

    // Function to format time from seconds to hh:mm:ss
    const formatTime = (totalSeconds: number) => {
        const hours = Math.floor(totalSeconds / 3600);
        const minutes = Math.floor((totalSeconds % 3600) / 60);
        const seconds = totalSeconds % 60;

        return `${hours.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
    };

    const muteAudio = () => {
        setMuted(true);
        if (socket) {
            socket.emit("mute-audio", { receiverId: user?._id });
        }
    };

    const unmuteAudio = () => {
        setMuted(false);
        if (socket) {
            socket.emit("unmute-audio", { receiverId: user?._id });
        }
    };

    

    useEffect(() => {
        if (socket) {
            socket.on("mute-audio", () => {
                setRemoteAudioMuted(true);
                console.log('mute')
            });
            socket.on("unmute-audio", () => {
                setRemoteAudioMuted(false);
                console.log('unmute')
            });
        }

        return () => {
            if (socket) {
                socket.off("mute-audio");
                socket.off("unmute-audio");
            }
        };
    }, [socket]);
    return modalOpen ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-70 transition-opacity duration-300">
            <div className="bg-gradient-to-b from-blue-600 to-blue-800 rounded-lg shadow-lg p-6 flex flex-col items-center md:w-[30%] w-[70%]">
                <div className="flex items-center justify-between w-full mb-4">
                    <h2 className="text-xl font-semibold text-white">{"Incoming Call"}</h2>
                    <button className="p-2 text-white hover:text-gray-300">
                        <span className="material-icons" onClick={closeCall}>
                            close
                        </span>
                    </button>
                </div>
                <audio ref={localAudioRef} autoPlay playsInline muted></audio>
                <audio ref={remoteAudioRef} muted={remoteAudioMuted ? true : false} autoPlay playsInline></audio>
                <img
                    src={user.image ? user.image : noUserImage}
                    alt="User"
                    className="w-28 h-28 rounded-full border-4 border-white mb-4 transition-transform transform hover:scale-105"
                />

                <h3 className="text-lg font-semibold text-white">{user?.name}</h3>
                <h3 className="text-lg font-medium text-white">{remoteAudioMuted?"Muted":(accepted?"In Call":'Calling')}</h3>


                {accepted ? (
                    <div className="flex space-x-8 mb-4 flex flex-col">
                        {/* Decline Call Button */}
                        <p className="text-gray-300 text-lg flex items-center justify-center"> {isCallActive ? formatTime(callDuration) : ""}</p>{" "}
                        {/* Call duration */}
                        <div className="p-2">
                            <button className="p-3 mr-2 bg-red-500 text-white rounded-full shadow-lg hover:bg-red-600 transition duration-200">
                                <span className="material-icons" onClick={endTheCall}>
                                    End_call
                                </span>
                            </button>
                            <button className="bg-blue-600 rounded-full p-2 w-[45px]">
                                {!muted ? (
                                    <i onClick={muteAudio} className="fa-solid fa-microphone " style={{ color: "white" }}></i>
                                ) : (
                                    <i onClick={unmuteAudio} className="fa-solid fa-microphone-slash " style={{ color: "white" }}></i>
                                )}
                            </button>
                        </div>
                    </div>
                ) : (
                    <div className="flex space-x-8 mb-4">
                        {/* Decline Call Button */}
                        <button className="p-3 bg-red-500 text-white rounded-full shadow-lg hover:bg-red-600 transition duration-200">
                            <span className="material-icons" onClick={declineCall}>
                                Decline
                            </span>{" "}
                            {/* Decline Icon */}
                        </button>
                        {/* Accept Call Button */}
                        <button className="p-3 bg-green-500 text-white rounded-full shadow-lg hover:bg-green-600 transition duration-200">
                            <span className="material-icons" onClick={acceptCall}>
                                Accept{" "}
                            </span>{" "}
                            {/* Accept Icon */}
                        </button>
                    </div>
                )}
            </div>
        </div>
    ) : (
        <></>
    );
}

export default IncomingCallModal;
