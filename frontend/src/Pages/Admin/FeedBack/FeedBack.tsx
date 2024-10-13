import React, { useEffect, useState } from "react";
import { getFeedback } from "../../../Services/apiService/chatServices";
import { noUserImage } from "../../../Utils/utils";
import { Button } from "@mui/material";

function FeedBack() {
    const [page, setPage] = useState<number>(1);
    const [allFeedback, setAllFeedback] = useState<Record<string, any>[]>([]);

    const showMore =async()=>{
      const res = await getFeedback(page+1);
      console.log(res?.data?.result);
      setAllFeedback(res?.data?.result);
    }
    useEffect(() => {
        document.title = 'Feedback'
        const fetchData = async () => {
            const res = await getFeedback(1);
            console.log(res?.data?.result);
            setAllFeedback(res?.data?.result);
        };
        fetchData();
    }, []);
    return (
        <div className="feedback-list p-4 max-w-4xl mx-auto">
            <h2 className="text-xl md:text-2xl font-semibold mb-4 md:mb-6 text-center">User Feedbacks</h2>

            <div className="space-y-6">
                {/* Feedback Item 1 */}
                {allFeedback.map((obj: any) => {
                    return (
                        <div className="p-4 border rounded-lg shadow-md bg-white flex flex-col sm:flex-row items-start space-y-4 sm:space-y-0 sm:space-x-4">
                            {/* User Image */}
                            <img className="w-16 h-16 rounded-full object-cover mx-auto sm:mx-0" src={`${obj?.userId?.image?obj.userId.image:noUserImage}`} alt="User" />
                            {/* Feedback Content */}
                            <div className="flex-1 text-center sm:text-left">
                                <div className="flex justify-between items-center mb-2">
                                    <div>
                                        <h3 className="font-bold text-lg">{obj?.userId?.name}</h3>
                                        <p className="text-sm text-gray-500">{obj?.userId?.email}</p>
                                    </div>
                                    <div className="h-full">

                                    <p className="text-xs text-gray-400">{new Date(obj?.createdAt).toDateString()}</p>
                                    
                                    </div>
                                </div>
                                <p className="text-gray-700">
                                    {obj.feedback}
                                </p>
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Show More Button */}
            <div className="text-center mt-6">
                <button onClick={showMore} className="px-6 py-2 bg-purple-600 text-white font-semibold rounded-lg hover:bg-purple-700 focus:outline-none">
                    Show More
                </button>
            </div>
        </div>
    );
}

export default FeedBack;
