// client/src/VideoCall.tsx
import React, { useContext, useEffect, useRef, useState } from "react";
import { SocketContext } from "../../Context/SocketProvider";
import UserDetails from "./UserDetails";
import MutedComponent from "./MutedComponent";
import { Button } from "@mui/material";

const VideoCall = ({ user, setVideoModal }: any) => {
    const [stream, setStream] = useState<MediaStream | null>(null);
    const [peerConnection, setPeerConnection] = useState<RTCPeerConnection | null>(null);
    const [roomId, setRoomId] = useState<string>("a");
    const localVideoRef = useRef<HTMLVideoElement | null>(null);
    const remoteVideoRef = useRef<HTMLVideoElement | null>(null);
    const socket = useContext(SocketContext);
    const userData = JSON.parse(localStorage.getItem("userData") || "{}");
    const [callStarted, setCallStarted] = useState<boolean>(true);
    const [callAccepted, setCallAccepted] = useState<boolean>(false);
    const [remoteVideoMute, setRemoteVideoMute] = useState<boolean>(false);
    const [videoMute, setVideoMute] = useState<boolean>(false);
    useEffect(() => {
        const pc = new RTCPeerConnection();
        setPeerConnection(pc); // Set the peer connection

        // Get local media stream
        navigator.mediaDevices.getUserMedia({ video: true, audio: true }).then((mediaStream) => {
            setStream(mediaStream);
            if (localVideoRef.current) {
                localVideoRef.current.srcObject = mediaStream;
            }
            mediaStream.getTracks().forEach((track) => {
                if (pc.signalingState !== "closed") {
                    pc.addTrack(track, mediaStream);
                }
            });
        });

        pc.onicecandidate = (event) => {
            if (event.candidate) {
                socket.emit("ice-candidate", { roomId, candidate: event.candidate });
            }
        };

        pc.ontrack = (event) => {
            if (remoteVideoRef.current) {
                remoteVideoRef.current.srcObject = event.streams[0];
            }
        };

        socket?.on("offer", async (offer: RTCSessionDescriptionInit) => {
            await pc.setRemoteDescription(new RTCSessionDescription(offer));
            const answer = await pc.createAnswer();
            await pc.setLocalDescription(answer);
            socket.emit("answer", { roomId, answer });
        });

        socket?.on("answer", (answer: RTCSessionDescriptionInit) => {
            pc.setRemoteDescription(new RTCSessionDescription(answer));
        });

        socket?.on("ice-candidate", (candidate: RTCIceCandidateInit) => {
            if (pc && pc.signalingState !== "closed") {
                pc.addIceCandidate(new RTCIceCandidate(candidate)).catch((error) => {
                    console.error("Error adding ICE candidate:", error);
                });
            }
        });

        return () => {
            if (stream) {
                stream.getTracks().forEach((track) => track.stop());
            }
            socket.off("offer");
            socket.off("answer");
            socket.off("ice-candidate");

            pc.close(); // Clean up on component unmount
        };
    }, [roomId, socket]);

    const joinRoom = () => {
        setRoomId(userData._id);
        if (roomId) {
            socket.emit("join-room", userData._id);
        }
    };

    const callUser = async () => {
        setCallStarted(false);
        if (socket) socket.emit("incoming-video-call", { userData, receiverId: user?.otherUser?._id });
        joinRoom();
        if (!peerConnection) {
            console.error("Peer connection is not established yet.");
            return;
        }
        const offer = await peerConnection.createOffer();
        await peerConnection.setLocalDescription(offer);
        socket.emit("offer", { roomId, offer });
    };

    // Incoming outgoing functions

    useEffect(() => {
        if (socket) {
            socket.on("call-accepted", () => {
                setCallAccepted(true);
            });
        }
        return () => {};
    }, [socket]);

    const muteVideo = () => {
        setVideoMute(true);

        if (socket) socket.emit("mute-video", { receiverId: user?.otherUser._id });
    };

    const unMuteVideo = () => {
        setVideoMute(false);
        if (socket) socket.emit("unmute-video", { receiverId: user?.otherUser._id });
    };

    useEffect(() => {
        if (socket) {
            socket.on("mute-video", () => {
                setRemoteVideoMute(true);
            });
        }
        if (socket) {
            socket.on("unmute-video", () => {
                setRemoteVideoMute(false);
            });
        }
        if(socket){
            socket.on("end-call",()=>{
               endCall()
            })
        }

        return ()=>{
            socket.off('mute-video');
            socket.off('end-call')
            socket.off("unmute-video")
           
        }
    }, [socket]);

    const endCall = () => {
        // Close the peer connection
        if (peerConnection) {
            peerConnection.close();
            setPeerConnection(null);
        }

        // Stop all the tracks of the local media stream
        if (stream) {
            stream.getTracks().forEach((track) => track.stop());
            setStream(null);
        }

        socket.emit("end-call", { roomId });

        socket.off("ice-candidate");
        socket.off("offer");
        socket.off("answer");
        socket.off("mute-video");
        socket.off("unmute-video");
        socket.emit("end-call", { receiverId: user.otherUser._id });

        location.reload();
    };

    return (
        <div className="fixed w-full h-full inset-0 bg-black bg-opacity-80 flex justify-center items-center z-50">
            <div className="bg-gray-900 rounded-lg shadow-lg w-[100%] h-[100%]  p-4 ">
                <div className="top h-[5%]">
                    <h2 className="text-xl font-semibold text-white mb-4">Video Call</h2>
                </div>

                <div className="flex justify-center mb-4 h-[85%] flex-col md:flex-row">
                    <div className="w-full md:w-[40%] flex justify-center items-center">
                        {videoMute && <MutedComponent user={userData} unMuteVideo={unMuteVideo} />}
                        <video
                            ref={localVideoRef}
                            autoPlay
                            playsInline
                            muted
                            className={`w-full h-full border rounded-lg ${videoMute ? "hidden" : ""}`} // Ensuring full width and auto height
                        />
                    </div>
                    {callAccepted ? (
                        <div className="w-full md:w-[40%] h-[100%] md:h-full ">
                            {remoteVideoMute ? <MutedComponent user={user.otherUser} /> : ""}
                            <video
                                muted={remoteVideoMute ? true : false}
                                ref={remoteVideoRef}
                                autoPlay
                                playsInline
                                className={`w-full h-full  border rounded-lg ${remoteVideoMute ? "hidden" : ""}`}
                            />
                        </div>
                    ) : (
                        <div className="w-full md:w-[40%] h-[50%] flex justify-center items-center md:h-full">
                            <UserDetails callUser={callUser} user={user?.otherUser} message={"Calling"} />
                        </div>
                    )}
                </div>

                <div className="flex justify-center mt-4 w-full h-[10%]  ">
                    <button
                        onClick={() => {
                            {
                                setVideoModal((prev: any) => !prev);
                                endCall();
                            }
                        }}
                        className="bg-red-600 h-[80%] p-2  text-white py-1 px-1 rounded-xl flex items-center hover:bg-red-500 transition"
                    >
                        <i className="fas fa-phone-alt mr-1"></i>
                        End Call
                    </button>
              
                    <div className="w-[50px] h-[50px] ml-2 rounded-full flex justify-center items-center bg-gray-600">
                        {videoMute ? (
                            <i onClick={unMuteVideo} className="fa-solid fa-video-slash " style={{ color: "white" }}></i>
                        ) : (
                            <button>
                                <i onClick={muteVideo} className="fa-solid fa-video " style={{ color: "white" }}></i>
                            </button>
                        )}
                    </div>
                    <div className="w-[50px] h-[50px] ml-2 rounded-full flex justify-center items-center bg-gray-600">
                        <i className="fa-solid fa-microphone " style={{ color: "white" }}></i>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default VideoCall;
