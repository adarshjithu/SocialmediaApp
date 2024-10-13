import React, { useState } from "react";
import { IBioDialog } from "../../interfaces/Interface";
import toast from "react-hot-toast";
import { updateBio } from "../../Services/apiService/userService";
import { useDispatch, useSelector } from "react-redux";
import { setProfileData } from "../../features/user/profileSlice";
import { RootState } from "../../app/store";

const BioDialog: React.FC<IBioDialog> = ({ setBioDialogOpen, closeBioDialog }) => {

    const [bio,setBio] = useState<string>('');
    const dispatch = useDispatch()
    const profileData  =useSelector((data: RootState) => data.profile.profileData);
    // Checking bio length
    if(bio.length>50) toast.error("Maximum bio length is 50 letters");

    // Post the bio
    const handleSubmit = async()=>{
              const res = await updateBio(bio);
              if(res.success){
                const newProfile = {...profileData,bio:bio}
                dispatch(setProfileData(newProfile));
              }
    }
    return (
        <div className="fixed inset-0 bg-gray-800 bg-opacity-60 flex items-center justify-center z-50">
            <div className="bg-white p-4 sm:p-6 rounded-lg shadow-lg max-w-md w-full">
                <h2 className="text-lg sm:text-2xl font-semibold mb-4 text-gray-800">Update Bio</h2>
                <textarea value={bio} className="w-full p-2 border rounded-md text-gray-800" onChange={(e)=>setBio(e.target.value)} rows={4} placeholder="Enter your new bio here..." />
                <div className="flex justify-end space-x-4 mt-4">
                    <button onClick={handleSubmit} className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition duration-300">Post</button>
                    <button
                        className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 transition duration-300"
                        onClick={closeBioDialog}
                    >
                        Cancel
                    </button>
                </div>
            </div>
        </div>
    );
};

export default BioDialog;
