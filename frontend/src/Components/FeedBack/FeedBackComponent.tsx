import React, { useState, useCallback, useContext } from "react";
import ImageUploading, { ImageListType } from "react-images-uploading";
import Cropper, { Area } from "react-easy-crop";
import { Button, Dialog, DialogTitle, DialogContent, DialogActions } from "@mui/material";
import toast from "react-hot-toast";
import getCroppedImg from "../UploadImage/cropUtil";
import axiosInstance from "../../Services/api";
import { colorContext } from "../../Context/colorContext";
import errorHandler from "../../Services/erroHandler";
import { useNavigate } from "react-router-dom";
import LoadingComponent from "../Loading/LoadingComponent";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../app/store";
import { isUploadFeedback } from "../../features/post/status";
import { sendFeedback } from "../../Services/apiService/chatServices";



const FeedbackComponent: React.FC = () => {
    const dispatch = useDispatch();
    const feedbackStatus = useSelector((data: RootState) => data.status.isUploadFeedback);
    const [text, setText] = useState<string>("");
    const feedback = () => {
        dispatch(isUploadFeedback(!feedbackStatus));
    };

    const handleSubmit =async()=>{
      const res = await sendFeedback(text)
      if(res?.data?.success){
          dispatch(isUploadFeedback(!feedbackStatus))
      }
    }

    return (
        <div className="w-[100%] h-[100%] mt-4 flex flex-col items-center justify-center  inset-0 bg-gray-800 bg-opacity-60 z-50 fixed">
            <div className="modal-overlay fixed inset-0 bg-black bg-opacity-50 z-[9999] flex items-center justify-center ">
                <div className="modal-container bg-white rounded-lg p-8 shadow-lg">
                    <h2 className="text-2xl font-bold mb-4">Feedback</h2>
                    <textarea
                        value={text}
                        onChange={(e) => setText(e.target.value)}
                        className="w-full p-2 border border-gray-300 rounded-lg mb-4"
                        rows={4}
                        placeholder="Share your feedback..."
                    ></textarea>
                    <div className="flex justify-end">
                        <button onClick={feedback} className="mr-2 px-4 py-2 bg-gray-500 text-white rounded-lg">
                            Cancel
                        </button>
                        <button onClick={handleSubmit} className="px-4 py-2 bg-blue-500 text-white rounded-lg">Submit</button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default FeedbackComponent;
