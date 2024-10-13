import { NextFunction ,Request,Response} from "express";
import { verifyRefreshToken } from "../Utils/token";
import { Admin } from "../Models/adminModel";
import { STATUS_CODES } from "../Constants/httpStatusCodes";
const { UNAUTHORIZED } = STATUS_CODES;

export const adminAuth =async(req:Request,res:Response,next:NextFunction)=>{

    try{
       
        const admin_access_token= req.cookies.admin_access_token
        
        if(!admin_access_token){

            res.status(401).json({success:false,message:"Admin Credentials Invalid please SignIn"}) 
        }else{

            const decoded =  verifyRefreshToken(admin_access_token);
            if(decoded.data){
                const admin = await Admin.findOne({_id:decoded.data});
                if(!admin){
                    res.status(UNAUTHORIZED).json({success:true,message:"Admin Credentials Invalid please SignIn"});
                }else{ 
                    
                    next()
                }
            }else{
                res.status(UNAUTHORIZED).json({success:'false',message:"Admin Credentials Invalid please SignIn"})
            }
         }
    }catch(error){
        next(error)
    }


}