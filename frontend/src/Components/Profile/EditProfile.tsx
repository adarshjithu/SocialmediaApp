import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../app/store";
import { profileSchema } from "../../Validations/profileValidation";
import toast from "react-hot-toast";
import { updateProfile } from "../../Services/apiService/userService";
import { IEditProfile, IProfileHeaderProp } from "../../interfaces/Interface";
import { setProfileData } from "../../features/user/profileSlice";

function EditProfile({ isModalOpen, setIsModalOpen }: IProfileHeaderProp) {
    const profileData = useSelector((data: RootState) => data.profile.profileData);
    const [error, setError] = useState({ name: "", username: "", email: "", phonenumber: "" });
    const dispatch = useDispatch();
    const [userData, setUserData] = useState<IEditProfile>({
        name: profileData?.name,
        username: profileData?.username,
        email: profileData?.email,
        phonenumber: profileData?.phonenumber || null,
        dateofbirth: profileData?.dateofbirth,
    });

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setUserData({ ...userData, [e.target.name]: e.target.value });
    };

    const handleFormSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        try {
            // Validating profile form
            await profileSchema.validate(userData, { abortEarly: false });

            // Date validation;
            const date = userData.dateofbirth;
            const selectedYear = new Date(date).getFullYear();
            console.log(selectedYear)
            if (selectedYear< 2010) {
                toast.error("Date of birth must be before 2010");
                
            } else {
                const result = await updateProfile(userData);
                if (result.success) {
                    const newUserData = {
                        ...profileData,
                        name: userData.name,
                        email: userData.email,
                        phonenumber: userData.phonenumber,
                        username: userData.username,
                    };
                    newUserData.dateofbirth = userData.dateofbirth;

                    dispatch(setProfileData(newUserData));
                    setIsModalOpen(false)
                }else{
                    setIsModalOpen(false)
                }
            }
        } catch (err: any) {
            const validationErrors: any = {};
            if (err.inner) {
                err.inner.forEach((error: any) => {
                    validationErrors[error.path] = error.message;
                });
            }

            setError(validationErrors);
        }
    };

    return (
        <div>
            {isModalOpen && (
                <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
                        <h2 className="text-xl font-bold mb-4">Edit Profile</h2>
                        <form onSubmit={handleFormSubmit}>
                            <div className="mb-4">
                                <label className="block text-sm font-medium text-gray-700 relative">
                                    Name {error.name && <span className="absolute right-0 ml-8 font-small text-[red] text-small">{error.name}</span>}
                                </label>
                                <input
                                    placeholder="Enter Name"
                                    type="text"
                                    name="name"
                                    value={userData?.name}
                                    onChange={handleInputChange}
                                    className="mt-1 p-2 block w-full border border-gray-300 rounded-md"
                                />
                            </div>
                            <div className="mb-4">
                                <label className="block text-sm font-medium text-gray-700 relative">
                                    Username{" "}
                                    {error.username && (
                                        <span className="ml-8 absolute right-0 font-small text-[red] text-small">{error.username}</span>
                                    )}
                                </label>
                                <input
                                    placeholder="Enter Username"
                                    type="text"
                                    name="username"
                                    value={userData?.username}
                                    onChange={handleInputChange}
                                    className="mt-1 p-2 block w-full border border-gray-300 rounded-md"
                                />
                            </div>
                            <div className="mb-4">
                                <label className="block text-sm font-medium text-gray-700 relative">
                                    Email
                                    {error.email && <span className="ml-8 absolute right-0 font-small text-[red] text-small">{error.email}</span>}
                                </label>
                                <input
                                    type="text"
                                    placeholder="Enter Email"
                                    name="email"
                                    value={userData?.email}
                                    onChange={handleInputChange}
                                    className="mt-1 p-1 block w-full border border-gray-300 rounded-md"
                                />
                            </div>
                            <div className="mb-4">
                                <label className="block text-sm font-medium text-gray-700 relative">
                                    Phone Number
                                    {error.phonenumber && (
                                        <span className=" absolute right-0 ml-8 font-small text-[red] text-small">{error.phonenumber}</span>
                                    )}
                                </label>
                                <input
                                    type="number"
                                    name="phonenumber"
                                    placeholder="Enter phonenumber"
                                    value={userData?.phonenumber}
                                    onChange={handleInputChange}
                                    className="mt-1 p-2 block w-full border border-gray-300 rounded-md"
                                />
                            </div>
                            <div className="mb-4">
                                <label className="block text-sm font-medium text-gray-700">Date of birth</label>
                                <input
                                    type="date"
                                    name="dateofbirth"
                                    placeholder="Enter Date of birth"
                                    value={userData?.dateofbirth}
                                    onChange={handleInputChange}
                                    className="mt-1 p-2 block w-full border border-gray-300 rounded-md"
                                />
                            </div>

                            <div className="flex justify-between">
                                <button type="submit" className="px-4 py-2 bg-blue-500 text-white rounded-md">
                                    Save
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setIsModalOpen(false)}
                                    className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md"
                                >
                                    Cancel
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}

export default EditProfile;
