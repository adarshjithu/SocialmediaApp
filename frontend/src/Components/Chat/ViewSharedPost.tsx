import React, { useEffect, useState } from "react";
import { getPostById } from "../../Services/apiService/postServices";
import PostComponent from "../Post/Post1";

interface PostView {
    message: string;
    setModalOpen: any;
}

function ViewSharedPost({ message, setModalOpen }: any) {
    const [postData, setPostData] = useState<Record<string, any> | null>(null);

    useEffect(() => {
        const postId = message.split("=")[1];

        const fetchData = async () => {
            const res = await getPostById(postId);
            setPostData(res?.data?.result[0]);
            console.log(res?.data?.result[0]);
        };
        fetchData();
    }, []);

    return (
        <>
            <div
                onClick={() => setModalOpen(false)}
                className="fixed inset-0 w-full h-full bg-black bg-opacity-50 flex items-center justify-center text-white text-2xl"
            >
                {postData ? (
                    <div className=" p-2 flex jusity-center items-center">
                        <PostComponent post={postData} />

              
                    </div>
                ) : (
                    ""
                )}
            </div>
        </>
    );
}

export default ViewSharedPost;
