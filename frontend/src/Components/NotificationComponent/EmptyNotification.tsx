import React from 'react'

function EmptyNotification() {
  return (
    <div>
      <div className="flex flex-col items-center justify-center h-80 p-6 bg-gray-100 shadow-lg rounded-lg border border-gray-300">
                    <img
                        src="https://cdn-icons-png.flaticon.com/512/3991/3991145.png" // A more visually appealing notification image
                        alt="No notifications"
                        className="w-32 h-32 mb-4"
                    />
                    <h2 className="text-2xl font-bold text-gray-700">You're All Caught Up!</h2>
                    <p className="text-gray-500 mt-2 text-center">There are no new notifications for you right now.</p>
                    <button
                        onClick={() => location.reload()}
                        className="mt-4 px-6 py-2 bg-purple-600 text-white font-semibold rounded-full hover:bg-purple-700 transition duration-300"
                    >
                        Refresh
                    </button>
                </div>
    </div>
  )
}

export default EmptyNotification
