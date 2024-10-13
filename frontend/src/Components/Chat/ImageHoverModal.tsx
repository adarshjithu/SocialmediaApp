import React, { useState } from 'react';

const ImageToggleModal = ({ message }:{message:Record<string,any>}) => {
    const [isOpen, setIsOpen] = useState(false);

    // Function to toggle modal
    const toggleModal = () => {
        setIsOpen((prev) => !prev);
    };

    return (
        <div className="relative inline-block">
            <img
                className="w-[100px] h-[100px] cursor-pointer"
                src={message?.file}
                alt=""
                onClick={toggleModal}
            />
            {isOpen && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50" onClick={toggleModal}>
                    <img
                        className="w-auto h-auto max-w-[90%] max-h-[90%] cursor-pointer"
                        src={message?.file}
                        alt=""
                    />
                </div>
            )}
        </div>
    );
};

export default ImageToggleModal;
