import React, { useEffect, useState } from "react";
import ProfileHeader from "./ProfileHeader";
import EditProfile from "./EditProfile";
import { RootState } from "../../app/store";
import { useSelector } from "react-redux";
import PostDetailView from "./PostDetailView";
import NoPost from "./NoPost";

const ProfilePage = () => {
   const [activeTab, setActiveTab] = useState("image"); // Default to "posts" tab
   const [isModalOpen, setIsModalOpen] = useState(false); // State for modal visibility
   const [selectedPost, setSelectedPost] = useState<any>(null); // State to store the clicked post
   const posts = useSelector((data: RootState) => data.profile.allPost);
   const [emptyPost,setEmptyPost] = useState<boolean>(false)

   // Handle tab click
   const handleTabClick = (tab: any) => {
      setActiveTab(tab);
   };

   // Open post view modal
   const handlePostClick = (post: any) => {
    
      setSelectedPost(post);
      setIsModalOpen(true);
   };

   // Close modal
   const closeModal = () => {
      setIsModalOpen(false);
      setSelectedPost(null);
   };

   useEffect(()=>{
     if(posts){
      
        const arr = posts.filter((data:any)=>{
           data.contentType==activeTab
        })
        if(arr.length==0) setEmptyPost(true)
           else setEmptyPost(false)
     }
   },[activeTab])

   return (
      <div className="max-w-4xl w-full mx-auto py-10 h-full overflow-scroll" style={{ scrollbarWidth: 'thin' }}>
         {/* Profile Header */}
         <ProfileHeader
            isModalOpen={isModalOpen}
            setIsModalOpen={setIsModalOpen}
            activeTab={activeTab}
            setActiveTab={setActiveTab}
         />

         {/* Tab Buttons */}
         <div className="flex justify-around mt-8 border-t border-[#b2a4a4]">
            <button
               className={`py-2 px-4 text-lg font-semibold ${activeTab === "image" ? "border-b-2 border-purple-600 text-purple-600" : "text-gray-600"} hover:text-purple-600 transition duration-300`}
               onClick={() => handleTabClick("image")}
            >
               Images
            </button>
            <button
               className={`py-2 px-4 text-lg font-semibold ${activeTab === "posts" ? "border-b-2 border-purple-600 text-purple-600" : "text-gray-600"} hover:text-purple-600 transition duration-300`}
               onClick={() => handleTabClick("posts")}
            >
               Posts
            </button>
            <button
               className={`py-2 px-4 text-lg font-semibold ${activeTab === "videos" ? "border-b-2 border-purple-600 text-purple-600" : "text-gray-600"} hover:text-purple-600 transition duration-300`}
               onClick={() => handleTabClick("videos")}
            >
               Videos
            </button>
         </div>

         {/* Conditional Rendering of Content */}
         <div className="mt-8 w-full">
            {/* For Images */}
            {activeTab === "image" && (
               <div className="grid grid-cols-3 gap-4">
                  {posts
                     ?.filter((obj: any) => obj.contentType === "image")
                     .map((post: any) => (
                        <div
                           key={post.id}
                           className="relative group bg-black cursor-pointer overflow-hidden"
                           style={{ paddingTop: "100%" }}
                           onClick={() => handlePostClick(post)} // Open modal on click
                        >
                           <img src={`${post.images[0]}`} alt="" className="absolute top-0 left-0 h-full w-full object-cover" />
                        </div>
                     ))}
               </div>
            )}

            {/* For Videos */}
            {activeTab === "videos" && (
               <div className="grid grid-cols-3 gap-4">
                  {posts
                     ?.filter((post: any) => post.contentType=='video')
                     .map((post: any) => (
                        <div
                           key={post.id}
                           className="relative group cursor-pointer bg-black rounded-lg overflow-hidden"
                           style={{ paddingTop: "100%" }}
                           onClick={() => handlePostClick(post)} // Open modal on click
                        >
                           <video src={post.video} controls className="absolute top-0 left-0 h-full w-full object-cover" />
                        </div>
                     ))}
               </div>
            )}
           
            {/* For Text Posts */}
            {activeTab === "posts" && (
               <div className="grid grid-cols-3 gap-4">
                  {posts?.filter((post:any)=>post.contentType == 'text').map((post: any) => (
                     <div
                        key={post.id}
                        className="relative group bg-white cursor-pointer shadow-lg flex items-center justify-center p-4"
                        style={{ paddingTop: "100%" }}
                        onClick={() => handlePostClick(post)} // Open modal on click
                     >
                        <h1 className="text-black text-center">{post?.description}</h1>
                     </div>
                  ))}
               </div>
            )}
            {
               emptyPost?<NoPost/>:""
            }

            
         </div>

         {/* Post View Modal */}
         {isModalOpen && selectedPost && (
            <div className="fixed inset-0 overflow-scroll bg-black bg-opacity-50 flex items-center justify-center z-50">
               <PostDetailView post={selectedPost} setSelectedPost={setSelectedPost} setIsModalOpen={setIsModalOpen} closeModal={closeModal}/>
            </div>
         )}

         {/* Profile Edit Modal */}
         {isModalOpen && !selectedPost && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
               <EditProfile
                  isModalOpen={isModalOpen}
                  setIsModalOpen={setIsModalOpen}
               />
            </div>
         )}
      </div>
   );
};

export default ProfilePage;
