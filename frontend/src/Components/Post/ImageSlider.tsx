import React, { useState } from 'react';
import { IPost } from '../../interfaces/Interface';




const ImageSlider: React.FC<Partial<IPost>> = ({ post }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
 

  // Function to go to the previous image
  const prevImage = () => {
    setCurrentIndex((prevIndex) => (prevIndex === 0 ? post?.images.length - 1 : prevIndex - 1));
  };

  // Function to go to the next image
  const nextImage = () => {
    setCurrentIndex((prevIndex) => (prevIndex === post.images.length - 1 ? 0 : prevIndex + 1));
  };

  return (
    <div className="mb-4 relative">
      <div className="w-[600px] max-w-full  h-[400px] flex justify-center items-center border rounded-lg bg-[#CCCCCC] overflow-hidden">
        <img
          src={post?.images[currentIndex]}
          alt="post"
          className="rounded-lg h-full w-auto"
        />
      </div>

      {/* Navigation Buttons */}
      {post?.images.length>1?
      <>
      <button
      onClick={prevImage}
      className="absolute top-1/2 left-2 transform -translate-y-1/2 bg-gray-700 text-white p-2 rounded-full"
      >
        &lt;
      </button>
      <button
      onClick={nextImage}
      className="absolute top-1/2 right-2 transform -translate-y-1/2 bg-gray-700 text-white p-2 rounded-full"
      >
        &gt;
      </button>
        </>:''
      }
    </div>
  );
};

export default ImageSlider;
