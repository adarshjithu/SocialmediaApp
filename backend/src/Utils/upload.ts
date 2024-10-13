import cloudinary from "./cloudinary";


export const uploadImageToCloudinary =async(files:any)=>{

    try{
        if (!files || !Array.isArray(files)) {
            return { success:false,message: "No files uploaded" };
       }
    
       const uploadToCloudinary = (filePath: string) => {
        
            return new Promise((resolve, reject) => {
               
                 cloudinary.uploader.upload(filePath, { folder: "uploads" }, (error, result) => {
                      if (error) {
                         
                           reject(error);
                      } else {
                 
                           resolve(result);
                      }
                 });
            });
       };
    
       // Upload all files to Cloudinary
       const uploadPromises = files.map((file: Express.Multer.File) => uploadToCloudinary(file.path));
    
       const results = await Promise.all(uploadPromises);
       
       if(results){
        return {success:true,message:"Image uploaded successfully",results:results}
       }else{
          return {success:false,message:"Uploading failed"}
       }
    }catch(error){
          console.log(error as Error)
          return {success:false,message:"Uploading failed"}
    }
   
   
}