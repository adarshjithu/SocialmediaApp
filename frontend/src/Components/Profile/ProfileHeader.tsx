import React, { useState, useContext, useEffect } from "react";
import { colorContext } from "../../Context/colorContext";
import { getProfile, logoutUser } from "../../Services/apiService/userService";
import { useNavigate } from "react-router-dom";
import { noUserImage } from "../../Utils/utils";
import { useDispatch, useSelector } from "react-redux";
import { addAllPostForProfile, setProfileData } from "../../features/user/profileSlice";
import { RootState } from "../../app/store";
import { LoadingComponentTailwind1 } from "../Loading/LoadingComponent";
import { IProfileHeaderProp, IUser } from "../../interfaces/Interface";
import BioDialog from "./BioDialog";
import ImageUploadDialog from "./ImageUploadDialog";
import FollowButton from "./FollowButton";
import { ThemeInterface } from "../ThemeHandler/Themes";
import FollowComponent from "./FollowersComponent";
import FollowingComponent from "./FollowingComponent";

const ProfileHeader: React.FC<IProfileHeaderProp> = ({ isModalOpen, setIsModalOpen, setActiveTab, activeTab }) => {
    const [follow, setFollow] = useState<any>([]);
    const [postCount, setPostCount] = useState<string | number>("");
 
    const [bioDialogOpen, setBioDialogOpen] = useState<boolean>(false);

    
    const [loading, setLoading] = useState(false);
    const [isImageUploadDialogOpen, setIsImageUploadDialogOpen] = useState(false);
    const dispatch = useDispatch();
    const theme: ThemeInterface = useContext(colorContext);
    const navigate = useNavigate();
    const isCurrentUser = useSelector((data: RootState) => data.profile.isCurrentUser);
    const profileData = useSelector((data: RootState) => data.profile.profileData);

    // Fetching all the data for profile
    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            const result = await getProfile(isCurrentUser);
            setLoading(false);
            dispatch(setProfileData(result?.user));
         
            setPostCount(result.posts.length);
            dispatch(addAllPostForProfile(result?.posts));
        };
        fetchData();
    }, [dispatch]);




    // Function for logout
    const logout = async () => {
        await logoutUser();

        navigate("/login");
    };

    //Image upload section
    const openImageUploadDialog = () => {
        if (isCurrentUser.status) setIsImageUploadDialogOpen(true);
    };

    const closeImageUploadDialog = () => {
        setIsImageUploadDialogOpen(false);
    };

    // Bio section------------------------------------------------------------------
    const openBioDialog = () => {
        setBioDialogOpen(true);
    };

    const closeBioDialog = () => {
        setBioDialogOpen(false);
    };

    return loading ? (
        <LoadingComponentTailwind1 />
    ) : (
        <div className="p-4 sm:p-6 shadow-md rounded-lg">
            <div className="flex flex-col sm:flex-row items-center space-y-4 sm:space-y-0 sm:space-x-6">
                {/* Profile Image with Click Event */}

                <img
                    className="w-24 h-24 sm:w-32 sm:h-32 rounded-full object-cover border-4 border-gray-300 shadow-md cursor-pointer"
                    src={profileData?.image ? profileData.image : noUserImage}
                    alt="Profile"
                    onClick={openImageUploadDialog} // Open dialog on image click
                />

                <div className="text-center sm:text-left">
                    <div className="flex flex-col sm:flex-row items-center sm:space-x-4 mb-4">
                        <h1 className="text-xl sm:text-3xl font-bold text-gray-800">
                            {profileData?.username ? profileData.username : profileData?.name}
                        </h1>
                        <div className="flex space-x-2 sm:space-x-4 mt-2 sm:mt-0">
                            {/* If not current users profile hide buttons */}
                            {isCurrentUser.status ? (
                                <>
                                    <button
                                        className="px-2 py-1 text-xs sm:text-sm font-semibold text-white rounded-md hover:bg-purple-700 transition duration-300"
                                        onClick={() => setIsModalOpen(true)}
                                        style={{ backgroundColor: `${theme.normalButton.backgroundColor}` }}
                                    >
                                        Edit Profile
                                    </button>
                                    <button
                                        className="px-2 py-1 text-xs sm:text-sm font-semibold text-white rounded-md hover:bg-red-700 transition duration-300"
                                        onClick={logout}
                                        style={{ backgroundColor: `${theme.normalButton.backgroundColor}` }}
                                    >
                                        Logout
                                    </button>
                                    <button
                                        className="px-2 py-1 text-xs sm:text-sm font-semibold text-white rounded-md hover:bg-red-700 transition duration-300"
                                        onClick={()=>navigate("/reset-password")}
                                        style={{ backgroundColor: `${theme.normalButton.backgroundColor}` }}
                                    >
                                       <i className="fa-solid fa-lock"></i>
                                    </button>
                                </>
                            ) : (
                             <FollowButton/>
                            )}
                        </div>
                    </div>

                    <div className="flex flex-wrap justify-center sm:justify-start space-x-4 mt-2">
                        <span className="px-3 py-1 sm:px-4 sm:py-2 rounded-xl text-gray-700 cursor-pointer">{postCount} Posts</span>
                        <span
                            className="px-3 py-1 sm:px-4 sm:py-2 rounded-xl text-gray-700 cursor-pointer hover:bg-gray-200 transition duration-300"
                            
                        >
                        <FollowComponent/>
                        </span>
                        <span
                            className="px-3 py-1 sm:px-4 sm:py-2 rounded-xl text-gray-700 cursor-pointer hover:bg-gray-200 transition duration-300"
                           
                        >
                            <FollowingComponent/>
                        </span>
                    </div>
                    <div className="flex flex-row">
                        <p className="mt-4 flex justify-center  items-center font-medium text-[black]">
                            {isCurrentUser.status ? <i onClick={openBioDialog} className="mr-2 cursor-pointer  fa-solid fa-pen-to-square"></i> : ""}
                            {profileData?.bio}
                        </p>
                    </div>
                </div>
            </div>

        

            {/* Image Upload Dialog */}
            {isImageUploadDialogOpen && <ImageUploadDialog closeImageUploadDialog={closeImageUploadDialog} />}

            {/* For uploading bio */}
            {bioDialogOpen && <BioDialog setBioDialogOpen={setBioDialogOpen} closeBioDialog={closeBioDialog} />}
        </div>
    );
};

export default ProfileHeader;
