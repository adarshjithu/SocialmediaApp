import { useContext, useEffect, useState } from "react";
import { colorContext } from "../../Context/colorContext";
import { LoadingComponentThree } from "../Loading/LoadingComponent";
import { getAllPost } from "../../Services/apiService/postServices";
import { PostInterface } from "../../interfaces/Interface";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../app/store";
import { setAllPosts } from "../../features/post/postSlice";
import PostComponent from "./Post1";
import { ThemeInterface } from "../ThemeHandler/Themes";

const Post: React.FC<PostInterface> = ({ reload, setReload }) => {
    const theme: ThemeInterface = useContext(colorContext);
    const [loading, setLoading] = useState(false);
    const dispatch = useDispatch();
    const allPostData = useSelector((data: RootState) => data.post.allPostData);

    //Getting all the post data
    useEffect(() => {
        setLoading(true);
        const fetchData = async () => {
            const res = await getAllPost();

            if (res?.data.posts) {
                dispatch(setAllPosts(res.data.posts));
            }
            setLoading(false);
        };
        fetchData();
    }, [reload]);

    return (
        <>
            {loading ? (
                <LoadingComponentThree />
            ) : (
                <div className="post-container w-[100%] flex flex-col items-center  top-[400px] " style={{ zIndex: ".1" }}>
                    {allPostData.length == 0 ? (
                        <div className="flex flex-col items-center justify-center w-full h-64 p-4 text-gray-600 bg-gray-100 border border-gray-300 rounded-lg shadow-md">
                            <h3 className="mb-2 text-xl font-semibold">No Posts Available</h3>
                            <p className="text-center">It looks like there are no posts to display. Check back later!</p>
                            <svg
                                className="w-12 h-12 mt-4 text-gray-400"
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                            >
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                            </svg>
                        </div>
                    ) : (
                        <>
                            {allPostData?.map((post: PostInterface, index: number) => {
                                return (
                                    <PostComponent post={post} key={index} index={index} />

                                    //   <SinglePost posts={posts} setPosts={setPosts} />
                                );
                            })}
                        </>
                    )}
                </div>
            )}
        </>
    );
};

export default Post;
