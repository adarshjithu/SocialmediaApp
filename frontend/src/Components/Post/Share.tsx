import React, { useEffect, useState } from "react";
import { getShare } from "../../Services/apiService/postServices";
import { noUserImage } from "../../Utils/utils";

function Share() {
    // Temporary list of friends to share with
    const [shareableFriends, setSharableFriends] = useState<any>([]);
    console.log(shareableFriends, "asdfasd");
    // State management

    const [showShareOptions, setShowShareOptions] = useState(false);

    const toggleShareOptions = () => {
        setShowShareOptions(!showShareOptions);
    };

    const handleShare = (friendName: string) => {
        alert(`Post shared with ${friendName}`);
    };

    useEffect(() => {
        const fetchData = async () => {
            const res = await getShare();
            console.log(res?.data.result);
            setSharableFriends([...res?.data.result.following, ...res?.data.result.followers]);
        };

        fetchData();
    }, []);
    return (
        <>
            <div className="bg-gray-100 p-2 rounded-lg mt-4">
                <p className="font-bold mb-2">Share with:</p>
                <ul>
                    {shareableFriends.map((friend: any, index: number) => {
                        return (
                            <li key={index} className="flex justify-between items-center mb-2">
                                <div className="flex flex-row">

                                <img className="mr-3 w-[40px] h-[40px] rounded-full" src={`${friend.image?friend.image:noUserImage}`} alt="" />
                                <span>{friend.name}</span>
                                </div>
                                <button
                                    onClick={() => handleShare(friend.name)}
                                    className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                                >
                                    Share
                                </button>
                            </li>
                        );
                    })}
                </ul>
            </div>
        </>
    );
}

export default Share;
