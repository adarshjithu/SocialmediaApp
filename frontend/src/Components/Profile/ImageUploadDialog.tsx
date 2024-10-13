import React, { useState, useCallback, useContext } from "react";
import ImageUploading, { ImageListType } from "react-images-uploading";
import Cropper, { Area } from "react-easy-crop";
import { Button, Dialog, DialogTitle, DialogContent, DialogActions } from "@mui/material";
import toast from "react-hot-toast";
import getCroppedImg from "../UploadImage/cropUtil";
import axiosInstance from "../../Services/api";
import { colorContext } from "../../Context/colorContext";
import errorHandler from "../../Services/erroHandler";
import { useNavigate } from "react-router-dom";
import LoadingComponent from "../Loading/LoadingComponent";
import { useDispatch, useSelector } from "react-redux";
import { getAllStatusData, isStatusUpload } from "../../features/post/status";
import { IImageUploadingDialog } from "../../interfaces/Interface";
import { RootState } from "../../app/store";
import { setProfileData } from "../../features/user/profileSlice";
import { setUserCreadential } from "../../features/user/authSlice";

interface CroppedImage {
    file: File;
    dataURL: string;
}

const UploadImage: React.FC<IImageUploadingDialog> = ({ closeImageUploadDialog }) => {
    const theme: any = useContext(colorContext);
    const [images, setImages] = useState<Array<any>>([]);
    const [currentImageIndex, setCurrentImageIndex] = useState<number | null>(null);
    const [croppedImages, setCroppedImages] = useState<CroppedImage[]>([]);

    const profileData  =useSelector((data: RootState) => data.profile.profileData);
    const user  =useSelector((data: RootState) => data.auth.userData);
    const [crop, setCrop] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
    const [zoom, setZoom] = useState<number>(1);
    const [croppedAreaPixels, setCroppedAreaPixels] = useState<Area | null>(null);
    const [cropDialogOpen, setCropDialogOpen] = useState<boolean>(false);
  
    const [buttonLoading, setButtonLoading] = useState<boolean>(false);
    const dispatch = useDispatch();


    // Used to upload image from react Image Uploading component
    const onChange = (imageList: ImageListType) => {
        if (imageList.length > 5) {
            toast.error("Maximum Image Limit Exceeded!");
        } else {
            setImages(imageList);
        }
    };
    //This function is used to open crop window and close after cropping
    const openCropDialog = (index: number) => {
        setCurrentImageIndex(index);
        setCropDialogOpen(true);
    };

    // This function is used to create a croped image
    const handleCropComplete = useCallback(async () => {
        if (currentImageIndex === null || croppedAreaPixels === null) return;

        const imageToCrop = images[currentImageIndex];

        if (!imageToCrop?.dataURL) return;

        const croppedImage = await getCroppedImg(imageToCrop.dataURL, croppedAreaPixels);

        const croppedFile = new File([croppedImage], imageToCrop.file?.name || "cropped.png", {
            type: "image/png",
        });
        setImages(
            images.filter((e, index) => {
                if (index !== currentImageIndex) {
                    return e;
                }
            })
        );
        setCroppedImages((prevImages) => [...prevImages, { file: croppedFile, dataURL: URL.createObjectURL(croppedFile) }]);
        setImages((prevImages) => [...prevImages, { file: croppedFile, dataURL: URL.createObjectURL(croppedFile) }]);

        setCropDialogOpen(false);
    }, [currentImageIndex, croppedAreaPixels, images]);

    
    //upload
    const handleUpload = async () => {
        if (images.length == 0) {
             toast.error("Select Image");
        } else if (images.length > 1) {
             toast.error("Only One image allowed");
        } else {
             const formData = new FormData();
             images.forEach((image, index) => {
                  formData.append(`image${index}`, image?.file);
             });
            

             try {
                  setButtonLoading(true);
                  const res = await axiosInstance.post("profile/image", formData, {
                       headers: {
                            "Content-Type": "multipart/form-data",
                       },
                  });
                  const newProfile = {...profileData,image:res.data.image}
                  dispatch(setProfileData(newProfile));
                  closeImageUploadDialog()
                  dispatch(setUserCreadential({...user,image:res.data.image}))
                  setButtonLoading(false);
              
             } catch (error) {
                  errorHandler(error);
             }
        }
   };
    //--------------
    return (
        <div className="w-[100%] h-[100%] mt-4 flex flex-col items-center justify-center  inset-0 bg-gray-800 bg-opacity-60 z-50 fixed">
            <div className="w-[90%] md:w-[30%]  h-[55%] rounded-xl mt-[100px] ">
                <div className="crop w-[100%] h-[100%] bg-[#EEEEEE] rounded-md border border-gray " style={{ border: "1px solid #968d8d" }}>
                    {currentImageIndex !== null && images[currentImageIndex]?.dataURL && (
                        <Dialog open={cropDialogOpen} maxWidth="sm" fullWidth>
                            <DialogContent>
                                <div style={{ position: "relative", width: "50%", height: 300 }}>
                                    <Cropper
                                        image={images[currentImageIndex].dataURL || ""}
                                        crop={crop}
                                        zoom={zoom}
                                        aspect={1}
                                        onCropChange={setCrop}
                                        onZoomChange={setZoom}
                                        onCropComplete={(_, croppedAreaPixels) => {
                                            setCroppedAreaPixels(croppedAreaPixels);
                                        }}
                                    />
                                </div>
                            </DialogContent>
                            <DialogActions>
                                <Button onClick={() => setCropDialogOpen(false)}>Cancel</Button>
                                <Button onClick={() => handleCropComplete()} color="primary">
                                    Save
                                </Button>
                            </DialogActions>
                        </Dialog>
                    )}
                    <ImageUploading multiple value={images} onChange={onChange} maxNumber={10}>
                        {({ imageList, onImageUpload, dragProps, isDragging, onImageUpdate, onImageRemove }) => (
                            <div className="flex flex-col justify-between h-full">
                                <div className="image-list flex flex-row justify-around w-[100%] mt-2 h-[70%]">
                                    {imageList.map((image, index) => (
                                        <div key={index} className="image-item relative flex flex-col h-[120px] w-[100px] mt-4">
                                            <div className="flex flex-row justify-end">
                                                {/* <i className="fa-solid fa-scissors"></i> */}
                                                <i className="fa-solid fa-pen-to-square" onClick={() => onImageUpdate(index)}></i>
                                                <i
                                                    className="fa-regular fa-circle-xmark "
                                                    style={{ color: "red" }}
                                                    onClick={() => onImageRemove(index)}
                                                ></i>
                                            </div>
                                            <img
                                                onClick={() => openCropDialog(index)}
                                                className="w-[100px] border border-[#a8a8a8]  h-[100px] rounded-lg"
                                                src={image.dataURL}
                                                alt=""
                                                width="100"
                                            />
                                            {/* <div className="image-item__btn-wrapper">
                                                       
                                                       <Button onClick={() => onImageUpdate(index)}>Update</Button>
                                                  </div> */}
                                        </div>
                                    ))}
                                </div>
                                <div className="w-[100%] mb-4 h-[100%] flex justify-center items-center h-[30%]">
                                    <button
                                        style={isDragging ? { color: "red" } : undefined}
                                        onClick={onImageUpload}
                                        {...dragProps} // Props for drag-and-drop functionality
                                        className="border border-dashed border-gray-400  p-4 rounded-lg"
                                    >
                                        Click or Drag here to upload images
                                    </button>
                                </div>
                                <div className="w-[100%] mb-4 h-[100%] flex justify-end  items-center h-[30%]">
                                    <Button
                                        variant="contained"
                                        
                                        onClick={handleUpload}
                                        className="  mt-2"
                                        style={{ backgroundColor: `${theme?.themeColor?.backgroundColor}`,marginRight:"10px" }}
                                    >
                                        {buttonLoading ? <LoadingComponent color={"#fff"} /> : "Upload"}
                                    </Button>
                                    <Button onClick={closeImageUploadDialog} variant="contained" color="error" style={{marginRight:"30px"}} >Cancel</Button>
                                </div>
                            </div>
                        )}
                    </ImageUploading>
                </div>
            </div>
        </div>
    );
};

export default UploadImage;

// import { IImageUploadingDialog } from "../../interfaces/Interface"

// const  ImageUploadDialog:React.FC<IImageUploadingDialog>=({closeImageUploadDialog}) =>{
//   return (
//     <div className="fixed inset-0 bg-gray-800 bg-opacity-60 flex items-center justify-center z-50">
//     <div className="bg-white p-4 sm:p-6 rounded-lg shadow-lg max-w-md w-full">
//         <h2 className="text-lg sm:text-2xl font-semibold mb-4 text-gray-800">Upload Profile Image</h2>
//         <input type="file" accept="image/*" className="mb-4" />
//         <div className="flex justify-end">
//             <button
//                 className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 transition duration-300"
//                 onClick={closeImageUploadDialog}
//             >
//                 Cancel
//             </button>
//         </div>
//     </div>
// </div>
//   )
// }

// export default ImageUploadDialog
