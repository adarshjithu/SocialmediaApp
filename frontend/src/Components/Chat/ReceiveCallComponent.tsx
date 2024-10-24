import { useContext, useEffect, useRef, useState } from "react";
import { noUserImage } from "../../Utils/utils";
import { SocketContext } from "../../Context/SocketProvider";
import toast from "react-hot-toast";
interface OfferData {
    roomID: string;
    offer: RTCSessionDescriptionInit;
}

interface AnswerData {
    roomID: string;
    answer: RTCSessionDescriptionInit;
}

interface IceCandidateData {
    roomID: string;
    candidate: RTCIceCandidateInit;
}

function IncomingCallModal({ isModalOpen, setIsModalOpen, roomID, setRoomID, senderData, setSenderData }: any) {
    const localAudioRef = useRef<HTMLAudioElement>(null);
    const remoteAudioRef = useRef<HTMLAudioElement>(null);
    const outgointAudioRef =useRef<HTMLAudioElement>(null);
    const peerConnection = useRef<RTCPeerConnection | null>(null);
    const [callDuration, setCallDuration] = useState<number>(0);
    const [isJoined, setIsJoined] = useState<boolean>(false);
    const socket = useContext(SocketContext);
    const constraints = { audio: true }; // Only request audio
    const [mute, setMute] = useState<boolean>(false);
    const [accepted, setAccepted] = useState<boolean>(false);
    const [reload, setReload] = useState(false);
    const [muteRemoteAudio,setMuteRemoteAudio] = useState<boolean>(false)

    useEffect(() => {
        if (socket) {
            socket.on("audio-receive-offer", handleReceiveOffer);
            socket.on("audio-receive-answer", handleReceiveAnswer);
            socket.on("audio-receive-ice-candidate", handleReceiveICECandidate);
        }

        // Cleanup on unmount
        return () => {
            if (socket) {
                socket.off("audio-receive-offer", handleReceiveOffer);
                socket.off("audio-receive-answer", handleReceiveAnswer);
                socket.off("audio-receive-ice-candidate", handleReceiveICECandidate);
            }

            // Cleanup peer connection and media stream when component unmounts
            if (peerConnection.current) {
                peerConnection.current.close();
            }
            if (localAudioRef.current?.srcObject) {
                (localAudioRef.current.srcObject as MediaStream).getTracks().forEach((track) => track.stop());
            }
        };
    }, [socket]);

    const joinRoom = () => {
        return navigator.mediaDevices
            .getUserMedia(constraints)
            .then((stream) => {
                if (localAudioRef.current) {
                    localAudioRef.current.srcObject = stream; // Using audio element for local stream
                }
                if (socket) socket.emit("audio-join-room", roomID);
                setIsJoined(true);

                const pc = new RTCPeerConnection({
                    iceServers: [{ urls: "stun:stun.l.google.com:19302" }],
                });

                pc.onicecandidate = (event) => {
                    if (event.candidate) {
                        console.log("ICE candidate:", event.candidate);
                        if (socket) socket.emit("audio-send-ice-candidate", { roomID, candidate: event.candidate });
                    } else {
                        console.log("All ICE candidates have been sent");
                    }
                };

                pc.ontrack = (event) => {
                    console.log("Remote track received");
                    if (remoteAudioRef.current) {
                        remoteAudioRef.current.srcObject = event.streams[0];
                    }
                };

                stream.getTracks().forEach((track) => pc.addTrack(track, stream));

                peerConnection.current = pc;
            })
            .catch((error) => {
                console.error("Error accessing media devices.", error);
            });
    };

    const handleReceiveOffer = async (data: OfferData) => {
        if (peerConnection.current) {
            try {
                console.log("Received Offer:", data.offer);
                await peerConnection.current.setRemoteDescription(new RTCSessionDescription(data.offer));
                const answer = await peerConnection.current.createAnswer();
                await peerConnection.current.setLocalDescription(answer);
                console.log("Sending Answer:", answer);

                if (socket) socket.emit("audio-send-answer", { roomID: data.roomID, answer });
            } catch (error) {
                console.error("Error handling received offer:", error);
            }
        }
    };

    const handleReceiveAnswer = async (data: AnswerData) => {
        if (peerConnection.current) {
            try {
                console.log("Received Answer:", data.answer);
                await peerConnection.current.setRemoteDescription(new RTCSessionDescription(data.answer));
            } catch (error) {
                console.error("Error handling received answer:", error);
            }
        }
    };

    const handleReceiveICECandidate = async (data: IceCandidateData) => {
        if (peerConnection.current) {
            try {
                console.log("Received ICE Candidate:", data.candidate);
                await peerConnection.current.addIceCandidate(new RTCIceCandidate(data.candidate));
            } catch (error) {
                console.error("Error adding received ICE candidate:", error);
            }
        }
    };

    const createOffer = async () => {
        if (peerConnection.current) {
            try {
                const offer = await peerConnection.current.createOffer();
                console.log("Created Offer:", offer);

                await peerConnection.current.setLocalDescription(offer);
                console.log("Sending Offer:", offer);

                if (socket) socket.emit("audio-send-offer", { roomID, offer });
            } catch (error) {
                console.error("Error creating offer:", error);
            }
        }
    };

    const endCall = () => {
        // Stop the local media stream (microphone)
        if (localAudioRef.current?.srcObject) {
            (localAudioRef.current.srcObject as MediaStream).getTracks().forEach((track) => {
                track.stop(); // Stops the microphone stream
            });
            localAudioRef.current.srcObject = null;
        }

        // Close the peer connection
        if (peerConnection.current) {
            peerConnection.current.close();
            peerConnection.current = null; // Set it to null to clean up the reference
        }

        // Remove socket listeners related to the call
        if (socket) {
            socket.off("audio-receive-offer", handleReceiveOffer);
            socket.off("audio-receive-answer", handleReceiveAnswer);
            socket.off("audio-receive-ice-candidate", handleReceiveICECandidate);
        }

        // Optionally, you can also reset the state if needed
        setIsJoined(false);

        setRoomID(""); // Reset the roomID if needed
    };

    useEffect(() => {
        if (socket) {
            socket.on("audio-cancel-call", () => {
                setIsModalOpen(false);
            });

            socket.on("audio-stop-calling", () => {
                endCall();
                setReload(!reload);
                setAccepted(false);
                setIsModalOpen(false);
            });

            socket.on("audio-mute", () => {
                setMute(!mute);
            });
        }

        return () => {
            if (socket) {
                socket.off("audio-start-call");
                socket.off("audio-stop-calling");
                socket.off("audio-cancel-call");
            }
        };
    }, [socket, mute]);

    const acceptCall = async () => {
        await joinRoom(); // Wait for joining the room
        await createOffer(); // Then create the offer
        setAccepted(true);
        if (socket) {
            socket.emit("audio-accept-call", { receiverId: senderData?._id });
        }
    };

    const declineCall = () => {
        endCall();
        if (socket) {
            socket.emit("audio-decline-call", { receiverId: senderData?._id });
        }
        setIsModalOpen(false);
    };

    const stopCalling = () => {
        endCall();
        setIsModalOpen(false);
        setAccepted(false);
        if (socket) {
            socket.emit("audio-stop-calling", { receiverId: senderData?._id });
        }
    };

    useEffect(() => {
        let timer: NodeJS.Timeout | null = null;
        if (accepted) {
            // Increment call duration every second when the call is active
            timer = setInterval(() => {
                setCallDuration((prevDuration: any) => prevDuration + 1);
            }, 1000);
        } else if (!accepted && timer) {
            clearInterval(timer); // Clear interval if call is not active
        }
        return () => {
            if (timer) clearInterval(timer); // Cleanup on component unmount
        };
    }, [accepted]);

    // Function to format time from seconds to hh:mm:ss
    const formatTime = (totalSeconds: number) => {
        const hours = Math.floor(totalSeconds / 3600);
        const minutes = Math.floor((totalSeconds % 3600) / 60);
        const seconds = totalSeconds % 60;

        return `${hours.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
    };

    const muteAudio = ()=>{
        setMuteRemoteAudio(!muteRemoteAudio)
        if(socket){
            socket.emit("audio-mute",{receiverId:senderData?._id})
        }
    }

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-70 transition-opacity duration-300">
            <div className="bg-gradient-to-b from-blue-600 to-blue-800 rounded-lg shadow-lg p-6 flex flex-col items-center md:w-[30%] w-[70%]">
                <div className="flex items-center justify-between w-full mb-4">
                    <h2 className="text-xl font-semibold text-white">{"Incoming Call"}</h2>
                    <button className="p-2 text-white hover:text-gray-300">
                        <span onClick={stopCalling} className="material-icons">close</span>
                    </button>
                </div>

                <img
                    src={senderData?.image ? senderData?.image : noUserImage}
                    alt="User"
                    className="w-28 h-28 rounded-full border-4 border-white mb-4 transition-transform transform hover:scale-105"
                />

                <h3 className="text-lg font-semibold text-white">{senderData?.name}</h3>
                <p className="text-gray-300 text-lg mb-2">{mute ? "Muted" : <>{accepted ? formatTime(callDuration) : ""}</>}</p>
                {/* <h3 className="text-lg font-medium text-white">Muted</h3> */}

                <div className="flex space-x-8 mb-4 flex flex-col"></div>

                <div className="flex space-x-8 mb-4">
                    {accepted ? (
                        <>
                            <button
                                onClick={stopCalling}
                                className="p-3 bg-red-500 text-white rounded-full shadow-lg hover:bg-red-600 transition duration-200"
                            >
                                <span className="material-icons">End_call</span> {/* Decline Icon */}
                            </button>
                            <button className="bg-blue-600 rounded-full p-2 w-[45px]">
                                {

                                muteRemoteAudio?<i onClick={muteAudio} className="fa-solid fa-microphone-slash " style={{ color: "white" }}></i>:<i onClick={muteAudio} className="fa-solid fa-microphone " style={{ color: "white" }}></i>
                                }
                            </button>
                        </>
                    ) : (
                        <>
                            <button
                                onClick={declineCall}
                                className="p-3 bg-red-500 text-white rounded-full shadow-lg hover:bg-red-600 transition duration-200"
                            >
                                <span className="material-icons">Decline</span> {/* Decline Icon */}
                            </button>

                            <button
                                onClick={acceptCall}
                                className="p-3 bg-green-500 text-white rounded-full shadow-lg hover:bg-green-600 transition duration-200"
                            >
                                <span className="material-icons">Accept </span> {/* Accept Icon */}
                            </button>
                        </>
                    )}
                </div>

                <div className="App bg-[yellow]">
                    <div>
                        <audio ref={localAudioRef} autoPlay muted></audio>
                        <audio ref={remoteAudioRef} autoPlay muted={mute}></audio>
                        <audio ref={outgointAudioRef} src="public\audio\outgoing.mp3"></audio>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default IncomingCallModal;
