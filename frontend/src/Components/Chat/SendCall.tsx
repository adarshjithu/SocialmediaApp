import { useContext, useEffect, useRef, useState } from "react";
import { noUserImage } from "../../Utils/utils";
import { SocketContext } from "../../Context/SocketProvider";
import toast from "react-hot-toast";
import { ICallModal } from "../../interfaces/Interface";

function CallModal({ user, setCallModal, userData }: ICallModal) {
    const socket = useContext(SocketContext);
    const localAudioRef = useRef<HTMLAudioElement>(null);
    const remoteAudioRef = useRef<HTMLAudioElement>(null);
    const peerConnection = useRef<RTCPeerConnection | null>(null);
    const [roomID, setRoomID] = useState<string>(String(userData._id));
    const [muted, setMuted] = useState<boolean>(false);
    const [remoteAudioMuted, setRemoteAudioMuted] = useState<boolean>(false);

    const [startCall, setStartCall] = useState<boolean>(true);
    const [acceptCall, setAcceptCall] = useState<boolean>(false);

    const [callDuration, setCallDuration] = useState<number>(0);
    const [isCallActive, setIsCallActive] = useState<boolean>(false);
    const constraints: MediaStreamConstraints = { audio: true };

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
                    localAudioRef.current.srcObject = stream;
                }

                const pc = new RTCPeerConnection();
                pc.onicecandidate = (event) => {
                    if (event.candidate && socket) {
                        socket.emit("send-ice-candidate", { roomID, candidate: event.candidate });
                    }
                };
                pc.ontrack = (event) => {
                    if (remoteAudioRef.current) {
                        remoteAudioRef.current.srcObject = event.streams[0];
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

    const handleReceiveAnswer = async (data: { answer: RTCSessionDescriptionInit }) => {
        if (peerConnection.current) {
            await peerConnection.current.setRemoteDescription(new RTCSessionDescription(data.answer));
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

    const EndCallFunction = () => {
        endCall();
        if (socket) {
            socket.emit("end-call", { receiverId: user.otherUser._id });
        }

        setStartCall(true);
        setRoomID("");
        setAcceptCall(false);
        setIsCallActive(false);
    };

    const initiateCall = () => {
        if (socket) {
            socket.emit("call-friend", { receiverId: user.otherUser._id, senderData: userData });
        }
        joinRoom();
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
    };

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
            if (socket) {
                socket.off("online-users-list-result");
            }
            setAcceptCall(false);
        };
    }, [socket]);

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
                toast.error(`${user?.otherUser?.name} Declined`);
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
                socket.off("decline-call");
                socket.off("call-accepted");
            }
            endCall();
        };
    }, [socket]);

    useEffect(() => {
        let timer: NodeJS.Timeout | null = null;
        if (isCallActive) {
            timer = setInterval(() => {
                setCallDuration((prevDuration) => prevDuration + 1);
            }, 1000);
        } else if (!isCallActive && timer) {
            clearInterval(timer);
        }
        return () => {
            if (timer) clearInterval(timer);
        };
    }, [isCallActive]);

    const formatTime = (totalSeconds: number) => {
        const hours = Math.floor(totalSeconds / 3600);
        const minutes = Math.floor((totalSeconds % 3600) / 60);
        const seconds = totalSeconds % 60;
        return `${hours.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")}`;
    };

    const muteAudio = () => {
        setMuted(true);
        if (socket) socket.emit("mute-audio", { receiverId: user?.otherUser?._id });
    };

    const unmuteAudio = () => {
        setMuted(false);
        if (socket) socket.emit("unmute-audio", { receiverId: user?.otherUser?._id });
    };

    useEffect(() => {
        if (socket) {
            socket.on("mute-audio", () => setRemoteAudioMuted(true));
            socket.on("unmute-audio", () => setRemoteAudioMuted(false));
        }

        return () => {
            if (socket) {
                socket.off("mute-audio");
                socket.off("unmute-audio");
            }
        };
    }, [socket]);

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-70 transition-opacity duration-300">
            <div className="bg-gradient-to-b from-purple-600 to-purple-800 rounded-lg shadow-lg p-6  flex flex-col items-center w-[70%] md:w-[30%]">
                <div className="flex items-center justify-between w-full mb-4">
                    <button className="p-2 text-white hover:text-gray-300">
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
                        <audio ref={remoteAudioRef} muted={remoteAudioMuted} autoPlay playsInline></audio>
                    </button>
                    <h2 className="text-xl font-semibold text-white">Voice Call</h2>
                    <button className="p-2 text-white hover:text-gray-300">
                        <span className="material-icons">info</span>
                    </button>
                </div>
                <img
                    src={user?.otherUser?.image || noUserImage}
                    alt="User"
                    className="w-24 h-24 rounded-full object-cover mb-4"
                />
                <p className="text-lg text-white font-semibold">{user?.otherUser?.name}</p>
                <p className="text-sm text-gray-300">Calling {user?.otherUser?.name}...</p>
                <p className="text-white text-lg">{formatTime(callDuration)}</p>
                <div className="flex items-center justify-center mt-6 space-x-4">
                    {!acceptCall ? (
                        <>
                            {!startCall ? (
                                <button className="p-2 rounded-full bg-green-500 hover:bg-green-700 text-white">
                                    <span className="material-icons" onClick={() => EndCallFunction()}>
                                        call_end
                                    </span>
                                </button>
                            ) : (
                                <button className="p-2 rounded-full bg-green-500 hover:bg-green-700 text-white">
                                    <span className="material-icons" onClick={joinRoom}>
                                        call
                                    </span>
                                </button>
                            )}
                        </>
                    ) : (
                        <>
                            {muted ? (
                                <button className="p-2 rounded-full bg-gray-500 hover:bg-gray-700 text-white">
                                    <span className="material-icons" onClick={unmuteAudio}>
                                        mic_off
                                    </span>
                                </button>
                            ) : (
                                <button className="p-2 rounded-full bg-green-500 hover:bg-green-700 text-white">
                                    <span className="material-icons" onClick={muteAudio}>
                                        mic
                                    </span>
                                </button>
                            )}
                            <button className="p-2 rounded-full bg-red-500 hover:bg-red-700 text-white">
                                <span className="material-icons" onClick={() => EndCallFunction()}>
                                    call_end
                                </span>
                            </button>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
}

export default CallModal;
