import { ISingleChat } from "../../interfaces/Interface";
import ImageHoverModal from "./ImageHoverModal";

function SingleChat({ message, color, userData }: ISingleChat) {

    return (
        <div
            className="pt-2 pr-2 pl-2 flex flex-col"
            style={{
                maxWidth: "50%",
                maxHeight: "200px",
                overflowY: "auto",
                whiteSpace: "normal",
                wordBreak: "break-word",
                borderRadius: "10px 0px 10px 10px",
                color: `${color ? "#4B164C" : "white"}`,
                backgroundColor: `${color ? "white" : "#8A39E6"}`,
            }}
        >
            {message.type == "audio" ? (
                <audio className="h-[35px]" src={message.file} controls></audio>
            ) : (
                <>{message.type == "image" ?
                    <div>

                        <ImageHoverModal message={message}/> 
                    </div>
                     
                     : <span>{message?.message}</span>}</>
            )}

            <div className="flex justify-end">
                <span className="text-[8px]">
                    {message ? new Date(message.timestamp).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", hour12: true }) : ""}
                    {userData._id === message.senderId && (
                        <>
                            {message.read ? (
                                <i className="fa-solid ml-2 fa-check-double fa-lg"></i>
                            ) : (
                                <i className="ml-2 fa-lg fa-solid fa-check"></i>
                            )}
                        </>
                    )}
                </span>
            </div>
        </div>
    );
}

export default SingleChat;
