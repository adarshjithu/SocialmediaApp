import axios from "axios";
import React, { useContext, useRef, useState } from "react";
import Dropzone from "react-dropzone";
import axiosInstance from "../../Services/api";
import { Button } from "@mui/material";
import { colorContext } from "../../Context/colorContext";
import toast from "react-hot-toast";
import LoadingComponent from "../Loading/LoadingComponent";
import { useNavigate } from "react-router-dom";

const VideoUpload: React.FC = () => {
     const [videoFile, setVideoFile] = useState<File | null>(null);
     const [videoUrl, setVideoUrl] = useState<string>("");
     const [startTime, setStartTime] = useState<number>(0);
     const [endTime, setEndTime] = useState<number>(60);
     const [videoDuration, setVideoDuration] = useState<number>(60); // Holds the video duration
     const videoRef = useRef<HTMLVideoElement>(null);
     const [loading,setLoading] = useState<boolean>(false)
     const [description, setDescription] = useState<string>("");
     const navigate =  useNavigate()
     const handleDrop = (acceptedFiles: File[]) => {
          const file = acceptedFiles[0];
          setVideoFile(file);
          setVideoUrl(URL.createObjectURL(file));
     };
     const theme: any = useContext(colorContext);

     // Triggered when the video metadata (duration) is loaded
     const handleLoadedMetadata = () => {
          if (videoRef.current) {
               const duration = videoRef.current.duration;
               setVideoDuration(duration);
               setEndTime(Math.min(60, duration)); // Set end time based on video duration
          }
     };

     const handleTimeChange = (e: React.ChangeEvent<HTMLInputElement>, type: "start" | "end") => {
          const time = parseFloat(e.target.value);
          if (type === "start") {
               setStartTime(Math.min(time, endTime - 1));
          } else {
               setEndTime(Math.max(time, startTime + 1));
          }
     };

     const handleTrim = async () => {
          if (!videoFile) return;

          const formData = new FormData();
          formData.append("video", videoFile);
          formData.append("startTime", startTime.toString());
          formData.append("endTime", endTime.toString());
          formData.append("description", description);

          try {
               setLoading(true)
               const response = await axiosInstance.post("/post/video/upload", formData, {
                    headers: {
                         "Content-Type": "multipart/form-data",
                    },
               });
              setLoading(false)
              navigate("/")
          } catch (error) {
               console.error("Error trimming video:", error);
               setLoading(false)
          }
     };

     return (
          <div className="">
               <Dropzone onDrop={handleDrop} accept={{ "video/*": [".mp4", ".mkv", ".avi"] }}>
                    {({ getRootProps, getInputProps }) => (
                         <div {...getRootProps()} style={{ border: "2px dashed black", padding: "20px",margin:"20px" }}>
                              <input {...getInputProps()} />
                              {videoFile ? (
                                   <video
                                        ref={videoRef}
                                        src={videoUrl}
                                        controls
                                        width="100%"
                                        onLoadedMetadata={handleLoadedMetadata} // Load metadata
                                   />
                              ) : (
                                   <p>Drag and drop a video file here, or click to select one</p>
                              )}
                         </div>
                    )}
               </Dropzone>

               {videoFile && (
                    <div className="p-4">
                         <label>
                              Start Time:
                              <input
                                   type="range"
                                   min="0"
                                   max={Math.max(0, videoDuration - 1)} // Set the max to the video duration
                                   step="0.1"
                                   value={startTime}
                                   onChange={(e) => handleTimeChange(e, "start")}
                              />
                              {startTime}s
                         </label>
                         <label>
                              End Time:
                              <input
                                   type="range"
                                   min="1"
                                   max={Math.min(videoDuration, startTime + 60)} // Ensure end time is within duration
                                   step="0.1"
                                   value={endTime}
                                   onChange={(e) => handleTimeChange(e, "end")}
                              />
                              {endTime}s
                         </label>
                    </div>
               )}
                   

                   <div className="p-4">

               <input
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    type="text"
                    placeholder="Description"
                    name=""
                    className="w-[100%] h-[100%] rounded-lg p-2 mt-2 mb-2"
                    id=""
               />

               <Button
                    variant="contained"
                    size="large"
                    onClick={()=>
                      
                        handleTrim()
                      
                }
                    className="w-[100%]  mt-4"
                    style={{ backgroundColor: `${theme?.themeColor?.backgroundColor}` }}
                    >
                    {loading?<LoadingComponent/>:'   Upload'}
               </Button>
                   </div>
             
          </div>
     );
};

export default VideoUpload;
