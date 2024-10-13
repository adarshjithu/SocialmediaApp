import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { viewStoryBar } from "../../features/post/status";
import { RootState } from "../../app/store";

const FullscreenStoryViewer: React.FC = () => {
    const story = useSelector((data: RootState) => data.status.storyBar);
    const [currentStoryIndex, setCurrentStoryIndex] = useState<number>(0);
    const [autoPlayProgress, setAutoPlayProgress] = useState<number>(0);
    const [liked, setLiked] = useState<boolean>(false); // State to manage like status
    const currentStory = story?.stories?.stories[currentStoryIndex];
    const dispatch = useDispatch();
    

    useEffect(() => {
        const timer = setTimeout(() => {
            if (autoPlayProgress < 100) {
                setAutoPlayProgress((prev) => prev + 5);
            } else {
                handleNextStory();
            }
        }, 100);

        return () => clearTimeout(timer);
    }, [autoPlayProgress]);

    const handleNextStory = () => {
        if (currentStoryIndex < story.stories.stories.length - 1) {
            setCurrentStoryIndex(currentStoryIndex + 1);
            setAutoPlayProgress(0);
        } else {
            closeStoryBar();
        }
    };

    const handlePreviousStory = () => {
        if (currentStoryIndex > 0) {
            setCurrentStoryIndex(currentStoryIndex - 1);
            setAutoPlayProgress(0);
        }
    };

    const closeStoryBar = () => {
        setCurrentStoryIndex(0);
        dispatch(viewStoryBar({ view: false, stories: story.stories }));
    };

    const toggleLike = () => {
        setLiked(!liked); // Toggle the liked state
    };

    return (
        <div className="fixed inset-0 w-full h-full flex justify-center items-center bg-black bg-opacity-80 z-50">
            <div className="relative w-[90%] md:w-[50%] h-[90%] bg-black text-white flex items-center justify-center rounded-lg overflow-hidden">
                {/* Story Image */}
                <img src={currentStory.image} alt="story" className="w-full h-full object-cover transition-opacity duration-500" />

                {/* User Info */}
                <div className="absolute top-4 left-4 flex items-center space-x-4">
                    <img className="w-12 h-12 rounded-full border-2 border-white" src={story.stories.userId.image} />
                    <p className="font-semibold">{story.stories.userId.name}</p>
                </div>

                {/* Story Progress Bars */}
                <div className="absolute top-0 left-0 w-full px-4 flex space-x-1">
                    {story.stories.stories.map((_: any, index: number) => (
                        <div key={index} className="flex-1 h-2 bg-gray-500 rounded-lg">
                            <div
                                className={`h-full bg-purple-500 rounded-lg transition-all`}
                                style={{
                                    width: index === currentStoryIndex ? `${autoPlayProgress}%` : index < currentStoryIndex ? '100%' : '0%',
                                }}
                            ></div>
                        </div>
                    ))}
                </div>

                {/* Navigation Controls */}
                <div className="absolute inset-0 flex justify-between items-center">
                    <button className="w-1/2 h-full" onClick={handlePreviousStory}></button>
                    <button className="w-1/2 h-full" onClick={handleNextStory}></button>
                </div>

                {/* Close and Like Buttons (Top-right corner) */}
                <div className="absolute top-4 right-4 flex space-x-2">
                    {/* Like Button */}
                    <button
                        className={`p-2 rounded-full text-white transition duration-300 ${liked ? 'text-red-500' : 'text-white'}`}
                        onClick={toggleLike}
                    >
                        {liked ? <i className="fa-solid fa-xl fa-heart" style={{color:'red'}}></i> : <i className="fa-solid fa-xl fa-heart"></i>}
                    </button>

                    {/* Close Button */}
                    <button
                        className="p-2 rounded-full text-white"
                        onClick={closeStoryBar}
                    >
                        <i  className="text-[red] fa-xl fa-solid fa-xmark" ></i>
                    </button>
                </div>
            </div>
        </div>
    );
};

export default FullscreenStoryViewer;
