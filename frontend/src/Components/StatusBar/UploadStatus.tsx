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

interface CroppedImage {
    file: File;
    dataURL: string;
}

const UploadImage: React.FC = () => {
    const theme: any = useContext(colorContext);
    const [images, setImages] = useState<Array<any>>([]);
    const [currentImageIndex, setCurrentImageIndex] = useState<number | null>(null);
    const [croppedImages, setCroppedImages] = useState<CroppedImage[]>([]);
    const [description, setDescription] = useState<string>("");
    const [crop, setCrop] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
    const [zoom, setZoom] = useState<number>(1);
    const [croppedAreaPixels, setCroppedAreaPixels] = useState<Area | null>(null);
    const [cropDialogOpen, setCropDialogOpen] = useState<boolean>(false);
    const navigate = useNavigate();
    const [buttonLoading, setButtonLoading] = useState<boolean>(false);
    const dispatch = useDispatch();
    const stories = useSelector((data: any) => data.status.allStory);

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
            formData.append("description", description);

            try {
                setButtonLoading(true);
                const res = await axiosInstance.post("post/story/image/upload", formData, {
                    headers: {
                        "Content-Type": "multipart/form-data",
                    },
                });
                setButtonLoading(false);
                if (res.data.success) {
                    console.log(res.data);

                    dispatch(isStatusUpload(false));
                    location.reload();
                    // dispatch(getAllStatusData(modified))
                }
            } catch (error) {
                errorHandler(error);
            }
        }
    };

    const toggleModal = ()=>{
     dispatch(isStatusUpload(false))
    }
    //--------------
    return (
        <div className="w-[100%] h-[100%] mt-4 flex flex-col items-center justify-center  inset-0 bg-gray-800 bg-opacity-60 z-50 fixed">
            <div className="w-[100%] md:w-[40%]  h-[80vh] mt-4 flex flex-col items-center">
                <div className="w-[90%] h-[55%] rounded-xl">

                    <div className="crop w-[90%] bg-red h-[90%] bg-[#EEEEEE] rounded-md border border-gray " style={{ border: "1px solid #968d8d" }}>
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
                                    <div className="image-list flex flex-row justify-around w-[100%] mt-2 h-[50%]">
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
                                    <div className="w-[100%] flex justify-center mb-4 items-center h-[20%]">
                                        <button
                                            style={isDragging ? { color: "red" } : undefined}
                                            onClick={onImageUpload}
                                            {...dragProps} // Props for drag-and-drop functionality
                                            className="border border-dashed border-gray-400  p-4 rounded-lg"
                                        >
                                            Click or Drag here to upload images
                                        </button>
                                    </div>
                                </div>
                            )}
                        </ImageUploading>
                        <div className="w-[100%]   flex flex-row justify-end bg-[#EEEEEE]">
                            <Button
                                variant="contained"
                                size="medium"
                                onClick={handleUpload}
                                className=""
                                style={{ backgroundColor: `${theme?.themeColor?.backgroundColor}` ,margin:"10px"}}
                            >
                                {buttonLoading ? <LoadingComponent color={"#fff"} /> : "Upload"}
                            </Button>
                            <Button
                                
                                variant="contained"
                                size="medium"
                                color="error"
                                onClick={toggleModal}
                                className=""
                                style={{margin:"10px"}}
                            >
                         Cancel
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default UploadImage;
