import React, { useContext, useState } from "react";
import axiosInstance from "../../Services/api";
import { SocketContext } from "../../Context/SocketProvider";

export const ImageModal = ({ showModal, setShowModal, senderId, receiverId, status, setMessages, messages }: any) => {
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [uploading, setUploading] = useState<boolean>(false);
  const socket = useContext(SocketContext);

  // Function to handle image selection and generate a preview
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setSelectedImage(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  // Function to handle image upload to the backend
  const handleImageUpload = async () => {
    if (!selectedImage) return alert("Please select an image first.");

    const formData = new FormData();
    formData.append("image", selectedImage);

    try {
      setUploading(true);
      const res = await axiosInstance.post("/chat/image", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      if (socket) {
        socket.emit("sendMessage", { senderId, receiverId, message: "", status, type: "image", file: res?.data?.image });
        setMessages((prev: any) => [
          ...prev,
          {
            senderId,
            message: "",
            timestamp: new Date(),
            read: status === "online" ? true : false,
            type: "image",
            file: res?.data?.image,
          },
        ]);
      }

      setSelectedImage(null);
      setImagePreview(null);
      setShowModal(false);
    } catch (error) {
      console.error("Image upload failed:", error);
      alert("Failed to upload image.");
    } finally {
      setUploading(false);
    }
  };

  if (!showModal) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
      <div className="bg-white w-[350px] p-3 rounded-lg shadow-lg relative">
        {/* Close Button */}
        <button onClick={() => setShowModal(false)} className="absolute top-2 right-2 text-gray-500">
          <i className="fas fa-times"></i>
        </button>

        <div className="flex flex-col items-center justify-center mt-2">
          {/* Image Preview */}
          {imagePreview ? (
            <div className="rounded-lg overflow-hidden w-full mb-3">
              <img src={imagePreview} alt="Preview" className="w-full h-auto object-cover" />
            </div>
          ) : (
            <p className="text-gray-500 mb-3">No image selected</p>
          )}

          {/* Upload button and file input */}
          <div className="flex items-center justify-between w-full">
            <label className="cursor-pointer text-purple-600">
              <i className="fas fa-paperclip"></i>
              <input type="file" accept="image/*" onChange={handleImageChange} className="hidden" />
            </label>
            <button
              onClick={handleImageUpload}
              disabled={uploading}
              className={`flex items-center bg-purple-600 text-white px-4 py-2 rounded-lg ${uploading ? "opacity-50 cursor-not-allowed" : ""}`}
            >
              {uploading ? "Uploading..." : <i className="fas fa-paper-plane"></i>}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
