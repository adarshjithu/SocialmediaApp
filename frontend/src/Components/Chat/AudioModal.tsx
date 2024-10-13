import React, { useState, useEffect, useRef, useContext } from "react";
import axiosInstance from "../../Services/api"; // Assuming you have this set up for API calls
import { SocketContext } from "../../Context/SocketProvider";

export const AudioModal = ({ showModal, setShowModal, senderId, receiverId, status, setMessages }: any) => {
    
    const [isRecording, setIsRecording] = useState(false); // Start with recording off
    const [audioUrl, setAudioUrl] = useState<string | null>(null); // URL to play recorded audio
    const [audioBlob, setAudioBlob] = useState<Blob | null>(null); // Recorded audio blob
    const [mediaRecorder, setMediaRecorder] = useState<MediaRecorder | null>(null);
    const [uploading, setUploading] = useState(false); // Track uploading state
    const [duration, setDuration] = useState<number>(0); // Track the audio duration
    const audioRef = useRef<HTMLAudioElement | null>(null); // Ref for the audio element to play recording
    const mediaStreamRef = useRef<MediaStream | null>(null); // Ref to hold the media stream
    const socket = useContext(SocketContext);
    useEffect(() => {
        // Reset state variables when the modal opens
        if (showModal) {
            setIsRecording(true); // Start recording when the modal is opened
            setAudioUrl(null);
            setAudioBlob(null);
            setDuration(0);
        }
    }, [showModal]);

    useEffect(() => {
        if (!showModal) return; // Don't do anything if the modal is closed

        // Request audio permission and start recording
        navigator.mediaDevices
            .getUserMedia({ audio: true })
            .then((stream) => {
                mediaStreamRef.current = stream; // Save the stream reference

                const recorder = new MediaRecorder(stream);
                setMediaRecorder(recorder);

                const audioChunks: Blob[] = [];
                recorder.start();

                // Track the duration
                const timer = setInterval(() => {
                    setDuration((prev) => prev + 1); // Increment duration every second
                }, 1000);

                recorder.ondataavailable = (event) => {
                    audioChunks.push(event.data);
                };

                recorder.onstop = () => {
                    const audioBlob = new Blob(audioChunks, { type: "audio/webm" });
                    const audioUrl = URL.createObjectURL(audioBlob);
                    setAudioBlob(audioBlob);
                    setAudioUrl(audioUrl); // Set the audio URL to play the recorded audio
                    setIsRecording(false);
                    clearInterval(timer); // Clear the duration timer when stopped
                };

                return () => {
                    clearInterval(timer); // Clean up timer on component unmount
                };
            })
            .catch((err) => {
                console.error("Audio permission denied:", err);
                alert("Please allow microphone access to record audio.");
            });
    }, [showModal]);

    // Stop the recording
    const stopRecording = () => {
        if (mediaRecorder) {
            mediaRecorder.stop(); // Stop the recording
            setIsRecording(false); // Update the recording state
        }
    };

    // Reset modal state and close
    const handleCloseModal = () => {
        setShowModal(false);
        if (mediaStreamRef.current) {
            mediaStreamRef.current.getTracks().forEach((track) => track.stop()); // Stop all tracks to release the media devices
        }
    };

    // Upload recorded audio to the backend
    const uploadAudio = async () => {
        if (!audioBlob) return;

        const formData = new FormData();
        formData.append("audio", audioBlob, "recording.webm");

        // Update messages with new audio

        try {
            setUploading(true);
            // Uncomment and modify this when ready to upload
            const res = await axiosInstance.post("/chat/audio", formData, {
                headers: { "Content-Type": "multipart/form-data" },
            });

            const audioUrl = res?.data?.url;
            if (socket) socket.emit("sendMessage", { senderId, receiverId, message: "", status, type: "audio", file: audioUrl });
            setMessages((prev: any) => [
                ...prev,
                {
                    senderId,
                    message: "",
                    timestamp: new Date(),
                    read: status === "online" ? true : false,
                    type: "audio",
                    file: audioUrl,
                },
            ]);

            handleCloseModal(); // Close the modal after successful upload
        } catch (error) {
            console.error("Audio upload failed:", error);
            alert("Failed to upload audio.");
        } finally {
            setUploading(false);
        }
    };

    if (!showModal) return null; // If showModal is false, don't render the modal

    // Helper to format the audio duration in "mm:ss" format
    const formatDuration = (time: number) => {
        const minutes = Math.floor(time / 60);
        const seconds = Math.floor(time % 60);
        return `${minutes < 10 ? "0" : ""}${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
            <div className="bg-white w-[300px] p-5 rounded-md shadow-lg">
                <h3 className="text-lg font-semibold mb-4">Recording Audio</h3>
                <p className="text-gray-500 mb-4">{formatDuration(duration)}</p>

                {/* Display recorded audio playback */}
                {audioUrl && <audio ref={audioRef} src={audioUrl} controls className="mb-4 w-full" />}

                {isRecording ? (
                    <button onClick={stopRecording} className="mt-2 bg-red-600 text-white px-4 py-2 rounded-lg">
                        Stop Recording
                    </button>
                ) : (
                    <button
                        onClick={uploadAudio}
                        disabled={uploading}
                        className={`mt-2 bg-purple-600 text-white px-4 py-2 rounded-lg ${uploading ? "opacity-50 cursor-not-allowed" : ""}`}
                    >
                        {uploading ? "Sending..." : "Send Audio"}
                    </button>
                )}
            </div>
        </div>
    );
};
