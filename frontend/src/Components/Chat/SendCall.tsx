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
function CallModal({ user, setCallModal, userData }: any) {
    console.log(user, setCallModal, userData);

    const localAudioRef = useRef<HTMLAudioElement>(null);
    const remoteAudioRef = useRef<HTMLAudioElement>(null);
    const peerConnection = useRef<RTCPeerConnection | null>(null);
    const [roomID, setRoomID] = useState<string>("");
    const [isJoined, setIsJoined] = useState<boolean>(false);
    const socket = useContext(SocketContext);
    const constraints = { audio: true }; // Only request audio

    useEffect(() => {
        if (socket) {
            socket.on("receive-offer", handleReceiveOffer);
            socket.on("receive-answer", handleReceiveAnswer);
            socket.on("receive-ice-candidate", handleReceiveICECandidate);
        }

        // Cleanup on unmount
        return () => {
            if (socket) {
                socket.off("receive-offer", handleReceiveOffer);
                socket.off("receive-answer", handleReceiveAnswer);
                socket.off("receive-ice-candidate", handleReceiveICECandidate);
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
                if (socket) socket.emit("join-room", roomID);
                setIsJoined(true);

                const pc = new RTCPeerConnection({
                    iceServers: [{ urls: "stun:stun.l.google.com:19302" }], // Fallback STUN server
                });

                pc.onicecandidate = (event) => {
                    if (event.candidate) {
                        console.log("ICE candidate:", event.candidate);
                        if (socket) socket.emit("send-ice-candidate", { roomID, candidate: event.candidate });
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

                if (socket) socket.emit("send-answer", { roomID: data.roomID, answer });
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

                if (socket) socket.emit("send-offer", { roomID, offer });
            } catch (error) {
                console.error("Error creating offer:", error);
            }
        }
    };

    return (
        <div className="App">
            <input type="text" placeholder="Enter Room ID" value={roomID} onChange={(e) => setRoomID(e.target.value)} disabled={isJoined} />
            <button onClick={joinRoom} disabled={isJoined}>
                Join Room
            </button>
            <button onClick={createOffer} disabled={!isJoined}>
                Start Call
            </button>

            <div>
                <audio ref={localAudioRef} autoPlay muted></audio>
                <audio ref={remoteAudioRef} autoPlay></audio>
            </div>
        </div>
    );
}

export default CallModal;
