import { useContext, useEffect, useState } from "react";
import VideoReceiver from "./VideoReceiver";
import { SocketContext } from "../../Context/SocketProvider";
import IncomingVideoCall from "./IncomingVideoCall";

function VideoReceiverContainer() {
    const [showModal, setShowModal] = useState<boolean>(false);
    const [user, setUser] = useState<any>({});
    const [incomingModal, setIncomingModal] = useState<boolean>(false);

    const acceptVideoCall = () => {
        setShowModal(true);
        setIncomingModal(false);
    };

    const declineVideoCall = () => {};
    const socket = useContext(SocketContext);
    useEffect(() => {
        if (socket)
            socket.on("incoming-video-call", (data: any) => {
                setUser(data.userData);
                setIncomingModal(true);
            });

        return () => {
            if (socket) socket.off("incoming-video-call");
        };
    }, [socket]);
    return (
        <div>
            {
                incomingModal && user && <IncomingVideoCall user={user} acceptVideoCall={acceptVideoCall} />
                //
            }
            {showModal && user && <VideoReceiver setShowModal={setShowModal} user={user} />}
        </div>
    );
}

export default VideoReceiverContainer;
