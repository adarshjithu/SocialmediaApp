import React from 'react'

function NoPost() {
  return (
    <div>
      <div className="flex flex-col items-center justify-center w-full h-64 p-4 text-gray-600 bg-gray-100 border border-gray-300 rounded-lg shadow-md">
                        <h3 className="mb-2 text-xl font-semibold">No Posts Available</h3>
                        <p className="text-center">It looks like there are no posts to display. Check back later!</p>
                        <svg
                          className="w-12 h-12 mt-4 text-gray-400"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M12 4v16m8-8H4"
                          />
                        </svg>
                      </div>
    </div>
  )
}

export default NoPost
