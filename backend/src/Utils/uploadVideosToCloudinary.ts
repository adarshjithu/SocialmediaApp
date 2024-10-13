import { Readable } from "stream";
import cloudinary from "../Utils/cloudinary";
export const uploadVideoToCloudinary = (file:any)=>{
    return new Promise((resolve,reject)=>{

        try {
    
            if (!file) {
              reject ({success:false, message: 'No file uploaded' });
            }
        
            // Create a readable stream from the uploaded file
            const bufferStream = new Readable();
            bufferStream.push(file.buffer);
            bufferStream.push(null);
        
            // Upload video to Cloudinary
            const result =  cloudinary.uploader.upload_stream(
              { resource_type: 'video' },
              (error, res) => {
                if (error) {
                  reject ({ success:false,message: 'Error uploading video' });
                }
                if(res){
    
                   resolve ({ videoUrl: res?.secure_url,success:true,message:"Video uploaded successfully" })
                }
    
              }
            );
        
            bufferStream.pipe(result);
          } catch (error) {
            console.log(error)
             reject ({success:false,message:"Error uploading video"})
          }
    })
}