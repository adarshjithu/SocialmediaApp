import { useEffect, useRef, useState } from "react";
import Picker from "emoji-picker-react";
import { noUserImage } from "../../Utils/utils";
import SingleChat from "./SingleChat";
import { getAllMessages } from "../../Services/apiService/chatServices";
import ClearMessagesModal from "./CleaMessageModal";
import toast from "react-hot-toast";
import EmptyMessage from "./EmptyMessage";
import { IMessage } from "../../interfaces/Interface";
import CallModal from "./SendCall";
import { ImageModal } from "./ImageModal";
import { AudioModal } from "./AudioModal";
import VideoCallModal from "./VideoCallModal";

function Message({ receiverId, user, socket,setToggle }: IMessage) {
    // Getting user detaiils
    const userData = JSON.parse(localStorage.getItem("userData") || "{}");

    // Message States
    const [message, setMessage] = useState("");
    const [messages, setMessages] = useState<any[]>([]);
    const [showEmojiPicker, setShowEmojiPicker] = useState(false);
    const [modalOpen, setModalOpen] = useState(false);
    const [callModal, setCallModal] = useState<boolean>(false);
    const [videoModal,setVideoModal] = useState<boolean>(false)
    const [status, setStatus] = useState("Offline");
    const [typing, setTyping] = useState<boolean>(false);
    const [showAudioModal, setShowAudioModal] = useState(false); // State for audio modal
    const [showImageModal, setShowImageModal] = useState(false);

    const messageEndRef = useRef<HTMLDivElement>(null);

    // Function to scroll to the bottom
    const scrollToBottom = () => {
        if (messageEndRef.current) {
            messageEndRef.current.scrollIntoView({ behavior: "smooth" });
        }
    };

    // Emit message to server and add to local state
    const sendMessage = async () => {
        const senderId = userData?._id;
        if (socket)
            if (message.trim() && receiverId) {
                socket.emit("sendMessage", { senderId, receiverId, message, status, type: "text" ,file:''});
                setMessages((prev) => [...prev, { senderId, message, timestamp: new Date(), read: status == "online" ? true : false, type: "text",file:"" }]);
                setMessage(""); // Clear message input
                socket.emit("typing", { senderId: userData._id, receiverId, status: false });
            }
    };

    // Add emoji function
    const addEmoji = (emoji: any) => {
        setMessage((msg) => msg + emoji.emoji);
    };

    // To check user typing or not
    const handleTyping = (e: any) => {
        setMessage(e.target.value);
        socket.emit("typing", { senderId: userData._id, receiverId, status: true });

        if (e.target.value == "") {
            socket.emit("typing", { senderId: userData._id, receiverId, status: false });
        }
    };

    // Listening user typing event
    useEffect(() => {
        if (socket) {
            socket.on("userTyping", (result: any) => {
                setTyping(result);
            });
        }

        return () => {
            socket.off("userTyping");
        };
    }, []);

    useEffect(() => {
        // Listen for received messages from the server
        if (socket)
            socket.on("receiveMessage", (newMessage: any) => {
                setMessages((prev) => [...prev, newMessage]);
            });

        // Cleanup function to disconnect the socket
        return () => {
            socket.off("receiveMessage");
        };
    }, [socket]);

    useEffect(() => {
        const fetchData = async () => {
            const res = await getAllMessages(userData._id, receiverId);
            setMessages(res?.data.result);
            res?.data.result.forEach((data: any) => {});
        };

        fetchData();
    }, [receiverId]);

    useEffect(() => {
        if (socket) {
            socket.emit("update");
            // Listen for online/offline status updates
            socket.on("updateUserStatus", (usersOnline: any) => {
                if (usersOnline[receiverId]) {
                    setStatus("online");
                    toast.success(`${user?.otherUser?.name} Is online`);
                } else {
                    setStatus("Offline");
                }
            });

            return () => {
                socket.off("updateUserStatus");
            };
        }
    }, [socket, receiverId]);

    useEffect(() => {
        // Automatically scroll to the bottom whenever messages change
        scrollToBottom();
    }, [messages]);

    return (
        <div className=" h-[100%] w-full rounded-xl">
            {videoModal&&<VideoCallModal setVideoModal={setVideoModal} user={user}/>}
            {callModal && <CallModal user={user} setCallModal={setCallModal} userData={userData} />}
            {modalOpen && (
                <ClearMessagesModal
                    modalOpen={modalOpen}
                    setModalOpen={setModalOpen}
                    senderId={userData._id}
                    receiverId={receiverId}
                    setMessages={setMessages}
                />
            )}
            {/* User details div */}
            <div className="header w-full h-[10%] flex flex-row justify-between border-l">
                <div className="user flex flex-row items-center h-full p-4">
                    <button className="md:hidden" onClick={()=>setToggle((prev:any)=>!prev)}>
                        <i className="fa-solid fa-xl mr-2 fa-arrow-left"></i>
                    </button>
                    <img src={`${user.image ? user.image : noUserImage}`} className="  mr-8 rounded-full h-[50px] w-[50px]" alt="" />
                    <span className="md:text-[20px] flex flex-col">
                        <span>{user?.otherUser?.name}</span>
                        <span className="text-[12px] text-medium" style={{ color: `${status == "online" ? "#10ed2e" : "black"}`, fontWeight: "700" }}>
                            {typing ? "Typing" : status}
                        </span>
                    </span>
                </div>
                <div className="h-full flex justify-center items-center">
                    <button onClick={() => setCallModal(!callModal)}>
                        <i className="fa-solid fa-phone  mr-4" style={{ color: "#383638" }}></i>
                    </button>
                    <button onClick={()=>{
                        if(status=='online'){
                               setVideoModal(!videoModal)
                        }else{
                            toast.error('User is offline')
                        }
                     }}>
                        <i className="fa-solid fa-video  mr-4" style={{ color: "#383638" }}></i>
                    </button>
                    <button>
                        <i onClick={() => setModalOpen(!modalOpen)} className="fa-solid fa-ellipsis  mr-4" style={{ color: "#383638" }}></i>
                    </button>
                </div>
            </div>

            {/* chat div */}

            <div className="h-[90%] border border-2">
                <div className="h-full w-full  relative rounded-md">
                    {messages.length == 0 ? (
                         <EmptyMessage />
                       
                    ) : (
                        <div className="overflow-x-hidden overflow-auto h-[88%] bg-[#F0F0F0]" style={{ scrollbarWidth: "none" }}>
                            {/* Render messages */}

                            {messages.map((msg, index) => (
                                <div
                                    className={`text-white p-4 w-full flex justify-${
                                        String(msg.senderId) === String(userData._id) ? "end" : "start"
                                    }`}
                                    key={index}
                                >
                                    <img
                                        className="w-[25px] h-[25px] rounded-full"
                                        src={msg.senderId == userData?._id ? userData?.image : user?.otherUser?.image}
                                        alt=""
                                    />
                                    <SingleChat message={msg} color={msg.senderId == userData?._id ? false : true} userData={userData} />
                                </div>
                            ))}
                            <div ref={messageEndRef} />
                        </div>
                    )}
                    {/* Imoji picker */}
                    {showEmojiPicker && (
                        <div className="absolute top-12 ">
                            <i className="fa-solid fa-xmark fa-xl" onClick={() => setShowEmojiPicker(false)} style={{ color: "#f00f0f" }}></i>

                            <Picker onEmojiClick={addEmoji} style={{ position: "absolute", zIndex: 1000 }} />
                        </div>
                    )}
                    {/* Send message section */}

                    <div className="w-[100%] bg-white bottom-0 h-[12%] flex justify-between items-center">
                        <div className="w-[80%] bg-white rounded-xl flex flex-row">

                            <div className="buttons w-[35%] flex">

                            <button
                                onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                                className="bg-gray-100 ml-4   text-gray-600 py-2 rounded-lg ml-4"
                            >
                                😀
                            </button>

                            <button
                                onClick={() => setShowImageModal(true)} // Opens the image modal
                                className="bg-gray-100 ml-4  text-gray-600 py-2 rounded-lg"
                            >
                                <i className="fa-solid fa-image"></i>
                            </button>

                            <button
                                onClick={() => setShowAudioModal(true)} // Opens the audio modal
                                className="bg-gray-100 ml-4  text-gray-600 py-2 rounded-lg"
                            >
                                <i className="fa-solid fa-microphone fa-lg"></i>
                            </button>
                            </div>

                            <input

                                className="rounded-xxl  h-full w-[65%]"
                                style={{ outline: "none" }}
                                type="text"
                                value={message}
                                onChange={handleTyping}
                                placeholder="Type a message"
                            />
                        </div>

                        <div className="w-[20%] flex justify-end">
                            <i onClick={sendMessage} className="fa-solid mr-5 fa-lg fa-paper-plane"></i>
                        </div>

                        {/* Modals */}
                        <ImageModal showModal={showImageModal} setShowModal={setShowImageModal} content={<p>Select or upload an image...</p>} senderId={userData._id} receiverId={receiverId} status={status} setMessages={setMessages} messages={messages} />
                        <AudioModal showModal={showAudioModal} setShowModal={setShowAudioModal} content={<p>Audio recording options...</p>} senderId={userData._id} receiverId={receiverId} status={status} setMessages={setMessages} messages={messages}  />
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Message;
