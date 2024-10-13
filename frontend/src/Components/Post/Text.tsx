import React, { useState } from "react";
import { IPost } from "../../interfaces/Interface";

const Text: React.FC<Partial<IPost>> = ({ post }) => {




  return (
    <div className="mb-4 relative">
      <div className="w-[600px] max-w-full  h-[400px] flex justify-center items-center border rounded-lg bg-[#CCCCCC] overflow-hidden">
        <h1>{post?.description}</h1>
      </div>
    </div>
  );
};

export default Text;
