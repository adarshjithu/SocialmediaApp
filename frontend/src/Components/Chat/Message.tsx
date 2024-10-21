import { useEffect, useRef, useState } from "react";
import Picker from "emoji-picker-react";
import { noUserImage } from "../../Utils/utils";
import SingleChat from "./SingleChat";
import { deleteMessages, getAllMessages } from "../../Services/apiService/chatServices";
import ClearMessagesModal from "./CleaMessageModal";
import toast from "react-hot-toast";
import EmptyMessage from "./EmptyMessage";
import { IMessage } from "../../interfaces/Interface";
import CallModal from "./SendCall";
import { ImageModal } from "./ImageModal";
import { AudioModal } from "./AudioModal";
import VideoCallModal from "./VideoCallModal";

function Message({ receiverId, user, socket, setToggle }: IMessage) {
    const userData = JSON.parse(localStorage.getItem("userData") || "{}");
    const [page, setPage] = useState(20);
    const [message, setMessage] = useState("");
    const [messages, setMessages] = useState<any[]>([]);
    const [showEmojiPicker, setShowEmojiPicker] = useState(false);
    const [modalOpen, setModalOpen] = useState(false);
    const [callModal, setCallModal] = useState<boolean>(false);
    const [videoModal, setVideoModal] = useState<boolean>(false);
    const [status, setStatus] = useState("Offline");
    const [typing, setTyping] = useState<boolean>(false);
    const [showAudioModal, setShowAudioModal] = useState(false);
    const [showImageModal, setShowImageModal] = useState(false);
    const [deleteId, setDeleteId] = useState<string>("");
    const [toggleDeleteModal, setToggleDeleteModal] = useState(false);
    console.log(toggleDeleteModal);

    const messageEndRef = useRef<HTMLDivElement>(null);
    const messageContainerRef = useRef<HTMLDivElement>(null);

    // Scroll to bottom function
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
                socket.emit("sendMessage", { senderId, receiverId, message, status, type: "text", file: "" });
                setMessages((prev) => [
                    ...prev,
                    { senderId, message, timestamp: new Date(), read: status === "online" ? true : false, type: "text", file: "" },
                ]);
                scrollToBottom();
                setMessage(""); // Clear message input
                socket.emit("typing", { senderId: userData._id, receiverId, status: false });
            }
    };

    const addEmoji = (emoji: any) => {
        setMessage((msg) => msg + emoji.emoji);
    };

    const handleTyping = (e: any) => {
        setMessage(e.target.value);
        socket.emit("typing", { senderId: userData._id, receiverId, status: true });

        if (e.target.value === "") {
            socket.emit("typing", { senderId: userData._id, receiverId, status: false });
        }
    };

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
        if (socket) {
            socket.on("receiveMessage", (newMessage: any) => {
                setMessages((prev) => [...prev, newMessage]);
            });

            return () => {
                socket.off("receiveMessage");
            };
        }
    }, [socket]);

    useEffect(() => {
        const fetchData = async () => {
            const res = await getAllMessages(userData._id, receiverId, page);
            setMessages(res?.data.result);
        };

        fetchData();
    }, [receiverId]);

    useEffect(() => {
        if (socket) {
            socket.emit("update");
            socket.on("updateUserStatus", (usersOnline: any) => {
                if (usersOnline[receiverId]) {
                    setStatus("online");
                    toast.success(`${user?.otherUser?.name} is online`);
                } else {
                    setStatus("Offline");
                }
            });

            return () => {
                socket.off("updateUserStatus");
            };
        }
    }, [socket, receiverId]);

    // useEffect(() => {
    //     scrollToBottom();
    // }, [messages]);

    // Function to handle scrolling event
    const handleScroll = () => {
        if (messageContainerRef.current) {
            const { scrollTop } = messageContainerRef.current;
            if (scrollTop === 0) {
                setPage(page + 20);
                const fetchData = async () => {
                    const res = await getAllMessages(userData._id, receiverId, page);
                    setMessages(res?.data.result);
                };

                fetchData();
                // You can load more messages here if needed
            }
        }
    };

    const deleteMessage = async () => {
        const res = await deleteMessages(deleteId);
        setMessages(
            messages.filter((msg: any) => {
                return msg._id !== deleteId;
            })
        );
        setToggleDeleteModal(false);
    };
    return (
        <div className="h-[100%] w-full rounded-xl">
            {videoModal && <VideoCallModal setVideoModal={setVideoModal} user={user} />}
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

            <div className="header w-full h-[10%] flex flex-row justify-between border-l">
                <div className="user flex flex-row items-center h-full p-4">
                    <button className="md:hidden" onClick={() => setToggle((prev: any) => !prev)}>
                        <i className="fa-solid fa-xl mr-2 fa-arrow-left"></i>
                    </button>
                    <img src={`${user.image ? user.image : noUserImage}`} className="mr-8 rounded-full h-[50px] w-[50px]" alt="" />
                    <span className="md:text-[20px] flex flex-col">
                        <span>{user?.otherUser?.name}</span>
                        <span
                            className="text-[12px] text-medium"
                            style={{ color: `${status === "online" ? "#10ed2e" : "black"}`, fontWeight: "700" }}
                        >
                            {typing ? "Typing" : status}
                        </span>
                    </span>
                </div>
                <div className="h-full flex justify-center items-center">
                    <button onClick={() => {if(status=='online'){setCallModal(!callModal)}else{toast.error('User is Offline')}}}>
                        <i className="fa-solid fa-phone mr-4" style={{ color: "#383638" }}></i>
                    </button>
                    <button
                        onClick={() => {
                            if (status === "online") {
                                setVideoModal(!videoModal);
                            } else {
                                toast.error("User is offline");
                            }
                        }}
                    >
                        <i className="fa-solid fa-video mr-4" style={{ color: "#383638" }}></i>
                    </button>
                    <button>
                        <i onClick={() => setModalOpen(!modalOpen)} className="fa-solid fa-ellipsis mr-4" style={{ color: "#383638" }}></i>
                    </button>
                </div>
            </div>
            {toggleDeleteModal && (
                <div style={{ zIndex: 1 }} className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white p-4 rounded-lg">
                        <h2 className="text-lg mb-4">Are you sure you want to delete this message?</h2>
                        <button onClick={deleteMessage} className="bg-red-500 text-white px-4 py-2 rounded-lg mr-2">
                            Delete
                        </button>
                        <button
                            onClick={() => {
                                setToggleDeleteModal(false);
                            }}
                            className="bg-gray-500 text-white px-4 py-2 rounded-lg"
                        >
                            Cancel
                        </button>
                    </div>
                </div>
            )}
            {/* chat div */}
            <div className="h-[90%] border border-2">
                <div className="h-full w-full relative rounded-md">
                    {messages.length === 0 ? (
                        <EmptyMessage />
                    ) : (
                        <div
                            className="overflow-x-hidden   overflow-auto h-[88%] bg-[#F0F0F0]"
                            style={{ scrollbarWidth: "none" }}
                            onScroll={handleScroll} // Add the scroll handler here
                            ref={messageContainerRef} // Add ref to the container
                        >
                            {messages.map((msg, index) => (
                                <div
                                    style={{ zIndex: 0 }}
                                    onClick={() => {
                                        setDeleteId(msg._id);
                                        setToggleDeleteModal(true);
                                    }}
                                    className={`text-white relative p-4 w-full flex justify-${
                                        String(msg.senderId) === String(userData._id) ? "end" : "start"
                                    }`}
                                    key={index}
                                >
                                    <img
                                        className="w-[25px] h-[25px] rounded-full"
                                        src={
                                            msg.senderId === userData?._id
                                                ? userData?.image
                                                    ? userData?.image
                                                    : noUserImage
                                                : user?.otherUser?.image
                                                ? user?.otherUser?.image
                                                : noUserImage
                                        }
                                        alt=""
                                    />
                                    <SingleChat message={msg} color={msg.senderId === userData?._id ? false : true} userData={userData} />
                                </div>
                            ))}
                            <div ref={messageEndRef} />
                        </div>
                    )}

                    {/* Send message section */}
                    <div className="w-[100%] bg-white bottom-0 h-[12%] flex justify-between items-center">
                        <div className="w-[80%] bg-white rounded-xl flex flex-row">
                            <div className="buttons w-[35%] flex">
                                <button
                                    onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                                    className="bg-gray-100 ml-4 text-gray-600 py-2 rounded-lg ml-4"
                                >
                                    😀
                                </button>
                                <button onClick={() => setShowImageModal(true)} className="bg-gray-100 ml-4 text-gray-600 py-2 rounded-lg ml-4">
                                    <i className="fa-solid fa-image"></i>
                                </button>
                                <button onClick={() => setShowAudioModal(true)} className="bg-gray-100 ml-4 text-gray-600 py-2 rounded-lg ml-4">
                                    <i className="fa-solid fa-microphone"></i>
                                </button>
                            </div>

                            <input
                                type="text"
                                className="bg-gray-100 focus:outline-none w-[70%] h-[100%] px-4 py-3 text-md"
                                placeholder="Type a message..."
                                value={message}
                                onChange={handleTyping}
                            />
                        </div>

                        <button className="w-[10%]  rounded-lg text-white text-[25px] flex items-center justify-center" onClick={sendMessage}>
                            <i className="fa-solid fa-paper-plane text-[#4B164C]"></i>
                        </button>
                    </div>
                </div>
            </div>
            {showEmojiPicker && (
                <Picker
                    onEmojiClick={addEmoji}
                    className="absolute bottom-[16%] md:bottom-[30%] left-[8%] bg-white shadow-md shadow-gray-300 border-none"
                />
            )}
            {showImageModal && <ImageModal setShowImageModal={setShowImageModal} />}
            {showAudioModal && <AudioModal setShowAudioModal={setShowAudioModal} />}
        </div>
    );
}

export default Message;
