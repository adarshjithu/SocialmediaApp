import React, { useContext, useEffect, useState } from "react";
import { TextField, Button } from "@mui/material";
import "./ALogin.css";
import { colorContext } from "../../../Context/colorContext";

import { ThemeInterface } from "../../../Components/ThemeHandler/Themes";

import { useNavigate } from "react-router-dom";

import { useDispatch, useSelector } from "react-redux";

import LoadingComponent from "../../../Components/Loading/LoadingComponent";
import { adminLogin } from "../../../Services/apiService/adminServices";
import { setAdminCredential } from "../../../features/user/authSlice";
interface loginInterface {
     email: string;
     password: string;
}

function AdminLogin() {
     const theme: ThemeInterface = useContext(colorContext);
     const [formData, setFormData] = useState<loginInterface>({ email: "", password: "" });
     const navigate = useNavigate();
     const dispatch = useDispatch();
     const admin = useSelector<any>((data) => data.auth.adminData);
     

     const [loading,setLoading]  =useState(false)

     const handleFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
          setFormData({ ...formData, [e.target.name]: e.target.value });
     };

     const handleSubmit = async ():Promise<void> => {
          const res = await adminLogin(formData);
          
           dispatch(setAdminCredential(res.admin))
     };
     useEffect(() => {
          document.title = 'Admin Login'
          if(admin){
               navigate("/admin")
          }
     }, [admin]);

     return (
          <div className="w-full h-screen bg-[#E0E0E0] d flex justify-center items-center">
               <div className="bg-white h-[95vh] md:h-[500px] sm:h-[500px]   w-[768px] rounded-[20px] flex m-4 shadow-[2px_2px_15px_grey]">
                    <div className="left h-[100%] ">
                         {/* <div className=" w-[100%] md:hidden flex items-center justify-center mt-[20px]">
                                  <img src="public\Images\login2-removebg-preview.png" alt="" className="w-[30%]" />  
                              </div> */}
                         <div className="flex justify-center items-center mt-20">
                              <h1 className="text-[35px] font-medium">Sign In Admin</h1>
                         </div>

                         <form action="" className="flex flex-col">
                              <div className="p-8 ">
                                   <TextField
                                        onChange={(e) => handleFormChange(e)}
                                        name="email"
                                        type="text"
                                        size="small"
                                        label="Email"
                                        className="w-[100%]"
                                   />
                                   <TextField
                                        onChange={(e) => handleFormChange(e)}
                                        name="password"
                                        type="password"
                                        size="small"
                                        label="Password"
                                        className="w-[100%]"
                                        sx={{ marginTop: "20px" }}
                                   />
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
                                        {loading? <LoadingComponent/>:'SIGN IN'}
                                   </Button>
                                   <div className="w-[100%] forget">
                                        <span onClick={()=>navigate('/verify-email')}>Forget Password</span>
                                   </div>
                                   <div className="w-[100%] flex justify-center">
                                        
                                   </div>

                                   
                              </div>
                         </form>
                    </div>

                    <div
                         className={`right h-[100%]  rounded-r-[20px] rounded-tl-[100px] rounded-bl-[70px]`}
                         style={{ backgroundColor: `${theme.themeColor.backgroundColor}` }}
                    >
                         <div className="flex justify-center items-center mt-10 flex-col ">
                              <h1 className="text-[40px] font-medium text-white">Welcome </h1>
                              <div className=" w-[65%]">
                                   <img src="E:\BRO-CAMP\Week-23\Friendzy\FrontEnd\public\Images\photo_2024-02-09_18-59-08.jpg" alt="" />
                              </div>
                              <div className="">
                                 
                                   <div className="w-[100%] flex justify-center items-center">
                                    
                                   </div>
                              </div>
                         </div>
                    </div>
               </div>
          </div>
     );
}

export default AdminLogin;
