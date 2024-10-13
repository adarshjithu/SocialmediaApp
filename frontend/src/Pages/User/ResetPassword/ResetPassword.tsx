import React, { useContext, useEffect, useState } from "react";
import { colorContext } from "../../../Context/colorContext";
import { TextField, Button } from "@mui/material";
import Icon from "../../../Components/Icon/Icon";
import { resetPasswordSchema } from "../../../Validations/SignupValidationSchema";
import { resetPassword } from "../../../Services/apiService/userService";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";

export interface ResetPasswordInterface {
     oldpassword: string;
     newpassword: string;
     confirmpassword: string;
}

function ResetPassword() {
     const theme: any = useContext(colorContext);
     const navigate = useNavigate()
     const user  = useSelector((data:any)=>data.auth.userData)
     const [error,setError]  =useState<ResetPasswordInterface|any>({oldpassword:'',newpassword:'',confirmpassword:''})
     const [formData, setFormData] = useState<ResetPasswordInterface>({ oldpassword: "", newpassword: "", confirmpassword: "" });
     const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
          setFormData({ ...formData, [e.target.name]: e.target.value });
     };

     const handleSubmit =async ()=>{
          try {
               await resetPasswordSchema.validate(formData, { abortEarly: false });
              let res =  await resetPassword(formData)
              console.log(res)
              if(res.success){
                    navigate('/')
              }
              //success
            

          } catch (err: any) {
               const validationErrors: Record<string, string> = {};
               if (err.inner) {
                    err.inner.forEach((error: any) => {
                         validationErrors[error.path] = error.message;
                    });
               }
     //User validation failed errors
               setError(validationErrors);
          }
     }
   
     useEffect(() => {
      
          document.title = "ResetPassword";
          if(!user){
               navigate("/login")
          }
     }, [user]);
     return (
          <div className="w-full h-screen bg-[#E0E0E0] d flex justify-center items-center">
               <Icon auth={true} />
               <div className="bg-white h-[70vh]  md:h-[500px] sm:h-[500px]   w-[768px] rounded-[20px] flex m-4 shadow-[2px_2px_15px_grey] ">
                    <div className="left h-[100%] flex items-center flex-col justify-center shadow-xl">
                         <div className="flex justify-center items-center mt-10">
                              <h1 className="text-[35px] font-medium">Reset Password</h1>
                         </div>

                         <form action="" className="flex flex-col">
                              <div className="p-8 ">
                              <TextField
                                             name="oldpassword"
                                             type="password"
                                             onChange={(e)=>handleChange(e)}
                                             size="small"
                                             placeholder="Old Password"
                                             className="w-[100%]"
                                             sx={{
                                                  "& .MuiInputBase-input::placeholder": {
                                                       color: "black", // Change this to your desired color
                                                       opacity: 0.8, // Adjust opacity if needed
                                                  },
                                             }}
                                        />
                                     <span className="text-sm text-[red]" style={{ display: "inline-block", width: "200px" }}>
                                             {error.oldpassword ? error.oldpassword : ""}
                                        </span>
                                    <TextField
                                             name="newpassword"
                                             type="password"
                                             onChange={(e)=>handleChange(e)}
                                             size="small"
                                             placeholder="New Password"
                                             className="w-[100%]"
                                             sx={{
                                                  "& .MuiInputBase-input::placeholder": {
                                                       color: "black", // Change this to your desired color
                                                       opacity: 0.8, // Adjust opacity if needed
                                                  },
                                             }}
                                        />
                                     <span className="text-sm text-[red]" style={{ display: "inline-block", width: "200px" }}>
                                             {error.newpassword ? error.newpassword : ""}
                                        </span>
                                        <TextField
                                             name="confirmpassword"
                                             type="password"
                                             onChange={(e)=>handleChange(e)}
                                             size="small"
                                             placeholder="Confirm New Password"
                                             className="w-[100%]"
                                             sx={{
                                                  "& .MuiInputBase-input::placeholder": {
                                                       color: "black", // Change this to your desired color
                                                       opacity: 0.8, // Adjust opacity if needed
                                                  },
                                             }}
                                        />
                                     <span className="text-sm text-[red]" style={{ display: "inline-block", width: "200px" }}>
                                             {error.confirmpassword ? error.confirmpassword : ""}
                                        </span>
                                   <Button
                                        onClick={handleSubmit}
                                        variant="contained"
                                        className="w-[100%]"
                                        sx={{
                                             marginTop: "20px",
                                             color: `${theme.normalButton.color}`,
                                             backgroundColor: `${theme.normalButton.backgroundColor}`,
                                             "&:hover": {
                                                  backgroundColor: "secondary.main",
                                             },
                                        }}
                                   >
                                        SUBMIT
                                   </Button>
                              </div>
                         </form>
                    </div>

                    <div
                         className={`right h-[100%]  rounded-r-[20px] rounded-tl-[100px] rounded-bl-[70px] `}
                         style={{ backgroundColor: `${theme.themeColor.backgroundColor}` }}
                    >
                         <div className="flex justify-center items-center mt-10 flex-col ">
                              <h1 className="text-[40px] font-medium text-white">Welcome </h1>
                              <div className=" w-[65%]">
                                   <img src="public\Images\login2-removebg-preview.png" alt="" />
                              </div>
                              <div className="">
                                   <h3 className={` text-[19px] mt-[20px]`} style={{ color: `${theme.textColor}` }}>
                                        Lets Meet New People Around You
                                   </h3>
                                   <div className="w-[100%] flex justify-center items-center">
                                        <Button
                                             variant="contained"
                                             className=" btn w-[50%]"
                                             sx={{
                                                  marginTop: "20px",
                                                  color: `${theme.normalButton.color}`,
                                                  backgroundColor: `${theme.normalButton.backgroundColor}`,
                                                  border: "0.5px  solid white",
                                                  "&:hover": {
                                                       backgroundColor: "secondary.main",
                                                  },
                                             }}
                                        >
                                             SIGN IN
                                        </Button>
                                   </div>
                              </div>
                         </div>
                    </div>
               </div>
          </div>
     );
}

export default ResetPassword;
