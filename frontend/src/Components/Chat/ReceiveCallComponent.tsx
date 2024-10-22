import { useContext, useEffect, useRef, useState } from "react";
import { noUserImage } from "../../Utils/utils";
import { SocketContext } from "../../Context/SocketProvider";
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


function IncomingCallModal() {
    const localAudioRef = useRef<HTMLAudioElement>(null);
    const remoteAudioRef = useRef<HTMLAudioElement>(null);
    const peerConnection = useRef<RTCPeerConnection | null>(null);
    const [roomID, setRoomID] = useState<string>("");
    const [isJoined, setIsJoined] = useState<boolean>(false);
    const socket = useContext(SocketContext);
    const constraints = { audio: true }; // Only request audio
    const [isModalOpen,setIsModalOpen] = useState(false)
    const [senderData,setSenderData] = useState<Record<string,any>>({})

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
        navigator.mediaDevices
            .getUserMedia(constraints)
            .then((stream) => {
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

                // Optionally modify SDP for Edge compatibility if necessary
                // const offerSDP = offer.sdp?.replace('use=opus', 'some_other_codec');

                await peerConnection.current.setLocalDescription(offer);
                console.log("Sending Offer:", offer);

                if (socket) socket.emit("audio-send-offer", { roomID, offer });
            } catch (error) {
                console.error("Error creating offer:", error);
            }
        }
    };


    useEffect(()=>{

        if(socket){
            socket.on('start-call',(data:any)=>{
       
                setIsModalOpen(true)
                setRoomID(data?.password)
                setSenderData(data?.senderData)
            })
        }
    },[socket])

    const acceptCall = ()=>{
       joinRoom()
       if(socket){
        socket.emit('voice-call-accepted',senderData)
       }
    }
    return (
        isModalOpen&&
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-70 transition-opacity duration-300">
            <div className="bg-gradient-to-b from-blue-600 to-blue-800 rounded-lg shadow-lg p-6 flex flex-col items-center md:w-[30%] w-[70%]">
                <div className="flex items-center justify-between w-full mb-4">
                    <h2 className="text-xl font-semibold text-white">{"Incoming Call"}</h2>
                    <button className="p-2 text-white hover:text-gray-300">
                        <span className="material-icons">close</span>
                    </button>
                </div>

                <img
                    src={noUserImage}
                    alt="User"
                    className="w-28 h-28 rounded-full border-4 border-white mb-4 transition-transform transform hover:scale-105"
                />

                <h3 className="text-lg font-semibold text-white">{senderData?.name}</h3>
                <h3 className="text-lg font-medium text-white">Muted</h3>

                <div className="flex space-x-8 mb-4 flex flex-col">
                    {/* Decline Call Button */}
                    <p className="text-gray-300 text-lg flex items-center justify-center"> Iscalling</p> {/* Call duration */}
                    {/* <div className="p-2">
                        <button className="p-3 mr-2 bg-red-500 text-white rounded-full shadow-lg hover:bg-red-600 transition duration-200">
                            <span className="material-icons">End_call</span>
                        </button>
                        <button className="bg-blue-600 rounded-full p-2 w-[45px]">
                            <i className="fa-solid fa-microphone-slash " style={{ color: "white" }}></i>
                        </button>
                    </div> */}
                </div>

                <div className="flex space-x-8 mb-4">
                    {/* Decline Call Button */}
                    <button className="p-3 bg-red-500 text-white rounded-full shadow-lg hover:bg-red-600 transition duration-200">
                        <span className="material-icons">Decline</span> {/* Decline Icon */}
                    </button>
                    {/* Accept Call Button */}
                    <button onClick={acceptCall} className="p-3 bg-green-500 text-white rounded-full shadow-lg hover:bg-green-600 transition duration-200">
                        <span className="material-icons">Accept </span> {/* Accept Icon */}
                    </button>
                </div>

            </div>
        </div>
    );
}

export default IncomingCallModal;
