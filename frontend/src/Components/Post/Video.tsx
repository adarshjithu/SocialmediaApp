import React from "react";
import { IPost } from "../../interfaces/Interface";

const Video: React.FC<IPost> = ({ post }) => {
     return (
          <div className="w-[600px] max-w-full  h-[400px] p-2 flex justify-center items-center border rounded-lg bg-[#CCCCCC] overflow-hidden">
               <video src={post.video} controls width="100%" height="100%" />
          </div>
     );
};

export default Video;
