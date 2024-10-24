import { useContext, useEffect, useRef, useState } from "react";
import { noUserImage } from "../../Utils/utils";
import { SocketContext } from "../../Context/SocketProvider";
import toast from "react-hot-toast";
import { ICallModal } from "../../interfaces/Interface";
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
function CallModal({ user, setCallModal, userData }: ICallModal) {
    const localAudioRef = useRef<HTMLAudioElement>(null);
    const remoteAudioRef = useRef<HTMLAudioElement>(null);
    const outgoingAudioRef = useRef<HTMLAudioElement>(null);
    const peerConnection = useRef<RTCPeerConnection | null>(null);
    const [roomID, setRoomID] = useState<string>("a");
    const [isJoined, setIsJoined] = useState<boolean>(false);
    const socket = useContext(SocketContext);
    const constraints = { audio: true }; // Only request audio
    const [callStarted, setCallStarted] = useState<boolean>(false);
    const [accepted, setAccepted] = useState<boolean>(false);
    const [callDuration, setCallDuration] = useState<number>(0);
    const [mute, setMute] = useState<boolean>(false);
    const [muteRemoteAudio, setMuteRemoteAudio] = useState(false);
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

    const joinRoom = async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia(constraints);
            if (localAudioRef.current) {
                localAudioRef.current.srcObject = stream; // Using audio element for local stream
            }
            if (socket) socket.emit("audio-join-room", roomID);
            setIsJoined(true);

            const pc = new RTCPeerConnection({
                iceServers: [{ urls: "stun:stun.l.google.com:19302" }], // Fallback STUN server
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
                    remoteAudioRef.current.srcObject = event.streams[0]; // Using audio element for remote stream
                }
            };

            stream.getTracks().forEach((track) => pc.addTrack(track, stream));
            peerConnection.current = pc;
        } catch (error) {
            console.error("Error accessing media devices.", error);
            toast.error("Failed to access media devices. Please check your microphone settings.");
            throw error; // Re-throw the error to handle it in startCall
        }
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
                throw error; // Re-throw the error to handle it in startCall
            }
        }
    };

    const startCall = async () => {
        setCallStarted(true);
      
        if (socket) {
            socket.emit("audio-start-call", { senderData: userData, receiverId: user?.otherUser?._id, password: roomID });
        }

        try {
            // Join the room first and then create an offer
            await joinRoom();
            await createOffer();
        } catch (error) {
            console.error("Error starting the call:", error);
            toast.error("Failed to start the call. Please try again.");
        }
    };

    useEffect(() => {
        const password = String(userData?._id + "_" + String(user?.otherUser?._id));
        setRoomID(password);
    }, []);

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
        setCallStarted(false);
        setRoomID(""); // Reset the roomID if needed
        setCallModal((prev: boolean) => !prev);
    };

    const cancelCall = () => {
        endCall();
        if (socket) {
            socket.emit("audio-cancel-call", { receiverId: user?.otherUser?._id });
        }
    };

    useEffect(() => {
        if (socket) {
            socket.on("audio-decline-call", () => {
                toast.error(`${user?.otherUser?.name} declined your call`);
                endCall();
            });

            socket.on("audio-accept-call", () => {
              
                console.log("acceptd");
                setAccepted(true);
            });

            socket.on("audio-stop-calling", () => {
                endCall();
                setCallModal(false);
            });

            socket.on("audio-mute", () => {
                console.log("muted");
                setMute(!mute);
            });
        }
        return () => {
            if (socket) {
                socket.off("audio-decline-call");
                socket.off("audio-stop-calling");
                socket.off("audio-accept-call");
                socket.off("audio-mute");
            }
        };
    }, [socket, mute]);

    // Stop calling function
    const stopCalling = () => {
        endCall();
        if (socket) {
            socket.emit("audio-stop-calling", { receiverId: user?.otherUser?._id });
        }
    };

    // Call duration function
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

    // Mute function

    const muteAudio = () => {
        setMuteRemoteAudio(!muteRemoteAudio);
        if (socket) {
            socket.emit("audio-mute", { receiverId: user?.otherUser?._id });
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-70 transition-opacity duration-300">
            <div className="bg-gradient-to-b from-purple-600 to-purple-800 rounded-lg shadow-lg p-6  flex flex-col items-center w-[70%] md:w-[30%]">
                <div className="flex items-center justify-between w-full mb-4">
                    <button className="p-2 text-white hover:text-gray-300">
                        <span className="material-icons" onClick={endCall}>
                            Back
                        </span>
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
                {/* Username */}
                <h3 className="text-lg font-semibold text-white mb-2">{user?.otherUser?.name}</h3>

                {/* {accepted && <p className="text-gray-300 mb-6">In call</p>} */}
                <p className="text-gray-300 text-lg mb-2">{mute ? "Muted" : <>{accepted ? formatTime(callDuration) : ""}</>}</p>
                <div className="flex space-x-8 mb-4">
                    {/* If call accepted then endcall button visible else cancel call */}
                    {callStarted ? (
                        <>
                            {accepted ? (
                                <button
                                    onClick={stopCalling}
                                    className="p-3 bg-red-500 text-white rounded-full shadow-lg hover:bg-red-900 transition duration-200"
                                >
                                    <span className="material-icons">End_call</span> {<i className="fa-solid fa-phone"></i>}
                                </button>
                            ) : (
                                <button
                                    onClick={cancelCall}
                                    className="p-3 bg-red-500 text-white rounded-full shadow-lg hover:bg-red-900 transition duration-200"
                                >
                                    <span className="material-icons">Cancel</span> {<i className="fa-solid fa-phone"></i>}
                                </button>
                            )}
                        </>
                    ) : (
                        <button
                            onClick={startCall}
                            className="p-3 bg-green-500 text-white rounded-full shadow-lg hover:bg-green-900 transition duration-200"
                        >
                            <span className="material-icons">Start_call</span> {<i className="fa-solid fa-phone"></i>}
                        </button>
                    )}

                    <button className="bg-blue-600 rounded-full p-2 w-[45px]">
                        {muteRemoteAudio ? (
                            <i onClick={muteAudio} className="fa-solid fa-microphone-slash " style={{ color: "white" }}></i>
                        ) : (
                            <i onClick={muteAudio} className="fa-solid fa-microphone " style={{ color: "white" }}></i>
                        )}
                    </button>
                </div>
            </div>

            <div className="App bg-[yellow]">
                <div>
                    <audio ref={localAudioRef} autoPlay muted={true}></audio>
                    <audio ref={remoteAudioRef} muted={mute} autoPlay></audio>
                    <audio ref={outgoingAudioRef} src="public\audio\outgoing.mp3"></audio>
                </div>
            </div>
        </div>
    );
}

export default CallModal;
