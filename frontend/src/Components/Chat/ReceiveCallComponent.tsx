import { useContext, useEffect, useRef, useState } from "react";
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
    const [time, setTime] = useState<NodeJS.Timeout | null>(null);
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
    }, [socket]);

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
            await peerConnection.current.setRemoteDescription(new RTCSessionDescription(data.offer));
            const answer = await peerConnection.current.createAnswer();
            await peerConnection.current.setLocalDescription(answer);

            if (socket) {
                socket.emit("send-answer", { roomID: data.roomID, answer });
            }
        }
    };

    const handleReceiveAnswer = (data: { answer: RTCSessionDescriptionInit }) => {
        if (peerConnection.current) {
            peerConnection.current.setRemoteDescription(new RTCSessionDescription(data.answer));
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
        if (peerConnection.current) {
            peerConnection.current.close();
            peerConnection.current = null;
        }

        const localStream = localAudioRef.current?.srcObject as MediaStream;
        if (localStream) {
            localStream.getTracks().forEach((track) => track.stop());
        }

        if (localAudioRef.current) {
            localAudioRef.current.srcObject = null;
        }

        if (remoteAudioRef.current) {
            remoteAudioRef.current.srcObject = null;
        }

        setIsJoined(false);
        setIsCallActive(false);
        setRoomID("");
    };

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
        if (socket) {
            socket.emit("end-call", { receiverId: user._id });
        }
        setModalOpen(false);
        setAccepted(false);
        setIsCallActive(false);
    };

    useEffect(() => {
        if (socket) {
            socket.on("call-friend", (data: any) => {
                setUser(data);
                setRoomID(String(data._id));
                setModalOpen(true);
            });
        }
        return () => {
            if (socket) {
                socket.off("call-friend");
            }
        };
    }, [socket]);

    const acceptCall = () => {
        joinRoom();
        setIsCallActive(true);
        setAccepted(true);
        if (socket) {
            socket.emit("call-accepted", user._id);
        }
    };

    const declineCall = () => {
        if (socket) {
            socket.emit("decline-call", user._id);
        }
        setModalOpen(false);
        setIsCallActive(false);
        setCallDuration(0);
    };

    const endTheCall = () => {
        endCall();
        if (socket) {
            socket.emit("end-call", { receiverId: user._id });
        }
        setModalOpen(false);
        setAccepted(false);
        setIsCallActive(false);
        setCallDuration(0);
    };

    useEffect(() => {
        let timer: NodeJS.Timeout | null = null;

        if (isCallActive) {
            timer = setInterval(() => {
                setCallDuration((prevDuration) => prevDuration + 1);
            }, 1000);
            setTime(timer);
        } else if (!isCallActive && timer) {
            clearInterval(timer);
        }
        return () => {
            if (timer) clearInterval(timer);
            if (time) clearInterval(time);
        };
    }, [isCallActive]);

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
            });
            socket.on("unmute-audio", () => {
                setRemoteAudioMuted(false);
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
        <div>
            <audio ref={localAudioRef} autoPlay muted />
            <audio ref={remoteAudioRef} autoPlay muted={remoteAudioMuted} />
            <button onClick={acceptCall}>Accept</button>
            <button onClick={declineCall}>Decline</button>
            {muted ? <button onClick={unmuteAudio}>Unmute</button> : <button onClick={muteAudio}>Mute</button>}
            <button onClick={endTheCall}>End Call</button>
        </div>
    ) : null;
}

export default IncomingCallModal;
