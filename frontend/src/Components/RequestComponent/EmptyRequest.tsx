import React from "react";


export default function EmptyFriendRequest() {
  return (
    <div className="flex flex-col items-center justify-center h-[80%] bg-gray-100 p-6">
      {/* Circular Background with Image */}
      <div className="bg-white p-8 rounded-full shadow-lg mb-6">
        <img
         src="data:image/png;base64,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"
          alt="No Friend Requests"
          className="w-40 h-40 rounded-full"
        />
      </div>

      {/* Title */}
      <h1 className="text-3xl font-bold text-gray-700 mb-4">
        You're All Caught Up!
      </h1>

      {/* Message */}
      <p className="text-gray-500 mb-8">
        There are no new friend requests at the moment. Relax, or find more people to connect with.
      </p>

      {/* Subtle Button */}

    </div>
  );
}
