import React from "react";
import { Atom, Riple } from "react-loading-indicators";
import ReactLoading from "react-loading";

function LoadingComponent({ color }: any) {
    const type = "spin"; // Type of loading indicator

    const height = 25; // Height of the loading indicator
    const width = 25; // Width of the loading indicator

    return (
        <div>
            <ReactLoading type={type} color={color ? color : "#fff"} height={height} width={width} />
        </div>
    );
}

export default LoadingComponent;

export const LoadingComponentTwo = () => {
    return (
        <div style={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
            <Riple color="#4B164C" size="large" text="" textColor="" />
        </div>
    );
};
export const LoadingComponentThree = () => {
    return (
        <div className="flex justify-center items-center mt[40px]">
            <div className="rounded-full h-20 w-20 bg-violet-800 animate-ping"></div>
        </div>
    );
};
export const LoadingTailwindComponent = () => {
    return <div className="border-gray-300 h-20 w-20 animate-spin rounded-full border-8 border-t-blue-600" />;
};

export const LoadingComponentTaiwind = () => {
    return (
        <div className="flex space-x-2 justify-center items-center h-[80%] dark:invert">
            <span className="sr-only">Loading...</span>
            <div className="h-8 w-8 bg-[#941599] rounded-full animate-bounce [animation-delay:-0.3s]"></div>
            <div className="h-8 w-8 bg-[#941599] rounded-full animate-bounce [animation-delay:-0.15s]"></div>
            <div className="h-8 w-8 bg-[#941599] rounded-full animate-bounce"></div>
        </div>
    );
};


export const LoadingComponentTailwind1 = ()=>{
    return (
<div className="flex justify-center items-center h-[90%] f">
    <div className="relative inline-flex">
        <div className="w-20 h-20 bg-[#941599] rounded-full"></div>
        <div className="w-20 h-20 bg-[#941599] rounded-full absolute top-0 left-0 animate-ping"></div>
        <div className="w-20 h-20 bg-[#941599] rounded-full absolute top-0 left-0 animate-pulse"></div>
    </div>
</div>
    )
}

