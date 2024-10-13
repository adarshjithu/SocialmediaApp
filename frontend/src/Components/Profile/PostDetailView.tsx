import { useEffect, useState } from "react";
import { IPostDetails } from "../../interfaces/Interface";
import PostComponent from "../Post/Post1";
import { getPostById } from "../../Services/apiService/postServices";

function PostDetailView({ post ,closeModal,setIsModalOpen,setSelectedPost}: IPostDetails) {
    const [postData, setPostData] = useState();
     
    useEffect(() => {
        const fetchData = async () => {
            const res = await getPostById(post._id);
            console.log("res", res?.data.result[0]);
            setPostData(res?.data.result[0]);
        };
        fetchData();
    }, []);


    const close = () => {
        setIsModalOpen(false);
        setSelectedPost(null);
     };
    return (
        <div className="flex flex-row">
            <div>{postData && <PostComponent post={postData} setIsModalOpen ={setIsModalOpen} />}</div>
            <div className="">
                <i onClick={close} className="fa-solid fa-xl fa-xmark mt-8 ml-2" style={{ color: "white" }}></i>
            </div>
        </div>
    );
}

export default PostDetailView;
