import React, { useContext, useEffect, useState } from "react";
import { TextField, Button } from "@mui/material";
import { colorContext } from "../../../Context/colorContext";
import GoogleIcon from "../../../Components/GoogleIcon/GoogleIcon";
import Icon from "../../../Components/Icon/Icon";
import { ThemeInterface } from "../../../Components/ThemeHandler/Themes";
import { CSpinner } from '@coreui/react';
import { userSchema } from "../../../Validations/SignupValidationSchema";
import { registerUser, verifyEmail } from "../../../Services/apiService/userService";
import { useNavigate } from "react-router-dom";
import OtpToPhone from "../../../Components/OtpType/OtpToPhone";
import OtpToEmail from "../../../Components/OtpType/OtpToEmail";
import { useDispatch, useSelector } from "react-redux";
import LoadingComponent from "../../../Components/Loading/LoadingComponent";

export interface SignupInterface {
     name: string;
     email: string;
     phonenumber: number;
     password: string;
     confirmpassword: string;
     isOtpEmail?: boolean;
}

function Signup() {
     const theme: ThemeInterface = useContext(colorContext);
     const navigate = useNavigate();
     const user = useSelector<any>((data)=>data.auth.userData)
     const [loading,setLoading]  =useState<boolean>(false)
     const [passwordHide,setPasswordHide] =useState<boolean>(true)

     //singup
     const [error, setError] = useState<any>({});
     const [formData, setFormData] = useState<SignupInterface>({ name: "", email: "", phonenumber: 0, password: "", confirmpassword: "" });
     const [isSignup, isSetSignup] = useState<boolean>(true);

     //Otp type
     const [otpEmail, setOtpEmail] = useState<string>("");
     const [otpPhone, setOtpPhone] = useState<number | string>();
     const [isEmail, setIsEmail] = useState<boolean>(true);

     const handleChange = (e: any) => {
          setError({ ...error, [e.target.name]: "" });
          setFormData({ ...formData, [e.target.name]: e.target.value });
     };

     //Handlesubmt for signup form
     const handleSubmit = async (e: React.FormEvent) => {
          e.preventDefault();
          try {
               await userSchema.validate(formData, { abortEarly: false });
               const emailExists = await verifyEmail(formData.email);
               if(emailExists.success){

                    setOtpEmail(formData.email);
                    setOtpPhone(formData.phonenumber);
                    isSetSignup(!isSetSignup);
               }
               else{
                    alert(emailExists.message)
               }

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
     };

     //SignupWithEmail
     const signupWithEmail = async (type:boolean) => {
          setLoading(true)
          formData.isOtpEmail = type;

          let res = await registerUser(formData);
          console.log(res)
          if (res?.data.success) {
               localStorage.setItem("time", String(res?.data.time));
               localStorage.setItem("otpPlace",String(res?.data.otpPlace))
               navigate("/submit-otp");
               setLoading(false)
          }
     };
     //Signup with phonenumber
     

     useEffect(() => {
          if(user){
               navigate("/")
          }
          document.title = "Signup";
     }, []);
     
     return (
          
          
          <div className="w-full h-screen bg-[#E0E0E0] d flex justify-center items-center">
               <Icon auth={true} />
                 
               <div className="bg-white h-[80vh] md:h-[500px] sm:h-[500px]   w-[768px] rounded-[20px] flex m-4 shadow-[2px_2px_15px_grey]">
                    
                    {
                    
                    (isSignup ? (
                         <div className="left h-[100%] ">
                              <div className="flex justify-center items-center mt-[45] md:mt-[0px]">
                                   <h1 className="text-[30px] font-medium">Sign Up</h1>
                              </div>

                              <form action="" className="flex flex-col" onSubmit={handleSubmit}>
                                   <div className="pl-8 pr-8 ">
                                        <TextField
                                             InputLabelProps={{
                                                  shrink: false, // This keeps the label in the top position
                                             }}
                                             name="name"
                                             type="text"
                                             onChange={handleChange}
                                             size="small"
                                             placeholder="Name"
                                             // label="Name"
                                             className="w-[100%]"
                                             sx={{
                                                  "& .MuiInputBase-input::placeholder": {
                                                       color: "black", // Change this to your desired color
                                                       opacity: 0.8, // Adjust opacity if needed
                                                  },
                                             }}
                                        />
                                        <span className="text-sm text-[red]" style={{ display: "inline-block", width: "200px" }}>
                                             {error.name ? error.name : ""}
                                        </span>
                                        <TextField
                                             name="email"
                                             type="emai"
                                             onChange={handleChange}
                                             size="small"
                                             placeholder="Email"
                                             className="w-[100%]"
                                             sx={{
                                                  "& .MuiInputBase-input::placeholder": {
                                                       color: "black", // Change this to your desired color
                                                       opacity: 0.8, // Adjust opacity if needed
                                                  },
                                             }}
                                        />
                                        <span className="text-sm text-[red]" style={{ display: "inline-block", width: "200px" }}>
                                             {error.email ? error.email : ""}
                                        </span>
                                        <TextField
                                             name="phonenumber"
                                             type="number"
                                             onChange={handleChange}
                                             size="small"
                                             placeholder="Phonenumber"
                                             className="w-[100%]"
                                             sx={{
                                                  "& .MuiInputBase-input::placeholder": {
                                                       color: "black", // Change this to your desired color
                                                       opacity: 0.8, // Adjust opacity if needed
                                                  },
                                             }}
                                        />
                                        <span className="text-sm text-[red]" style={{ display: "inline-block", width: "200px" }}>
                                             {error.phonenumber ? error.phonenumber : ""}
                                        </span>
                                        <div className="relative">

                                        <TextField
                                             name="password"
                                             type={passwordHide?"password":"text"}
                                             onChange={handleChange}
                                             size="small"
                                             placeholder="Password"
                                             className="w-[100%]"
                                             sx={{
                                                  "& .MuiInputBase-input::placeholder": {
                                                       color: "black", // Change this to your desired color
                                                       opacity: 0.8, // Adjust opacity if needed
                                                  },
                                             }}
                                        />
                                        {passwordHide?<i onClick={()=>setPasswordHide(!passwordHide)} className="fa-solid fa-eye-slash absolute right-5 top-3"></i>:<i onClick={()=>setPasswordHide(!passwordHide)} className="fa-solid fa-eye absolute right-5 top-3"></i>}
                                        
                                                  </div>
                                        <span className="text-sm text-[red]" style={{ display: "inline-block", width: "200px" }}>
                                             {error.password ? error.password : ""}
                                        </span>
                                        <TextField
                                             name="confirmpassword"
                                             type={passwordHide?"password":"text"}
                                             onChange={handleChange}
                                             size="small"
                                             placeholder="Confirm Password"
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
                                             type="submit"
                                             variant="contained"
                                             className="w-[100%]"
                                             sx={{
                                                  marginTop: "",
                                                  color: `${theme.normalButton.color}`,
                                                  backgroundColor: `${theme.normalButton.backgroundColor}`,
                                                  "&:hover": {
                                                       backgroundColor: "secondary.main",
                                                  },
                                             }}
                                        >
                                             SIGN UP
                                        </Button>
                                        <Button
                                             style={{ textTransform: "none" }}
                                             variant="outlined"
                                             className="w-[100%]"
                                             sx={{ marginTop: "20px", color: "#4B164C", borderColor: "#4B164C" }}
                                        >
                                             Signup With Google <GoogleIcon />
                                        </Button>
                                   </div>
                              </form>
                         </div>
                    ) : (
                         // Otp selection page--------------------------------------------------------------------------
                       
                         <div className="left h-[100%] ">
                             
                              <div className="flex justify-center items-center mt-10">
                                   <h1 className="text-[30px] font-medium">Send OTP</h1>
                              </div>
                             

                              {isEmail ? 
                                   <OtpToEmail
                                       loading={loading}
                                        signupWithEmail={signupWithEmail}
                                        isEmail={isEmail}
                                        setIsEmail={setIsEmail}
                                        otpPhone={otpPhone}
                                        otpEmail={otpEmail}
                                        setOtpPhone={setOtpPhone}
                                        setOtpEmail={setOtpEmail}
                                        
                                   />
                               : 
                                   <OtpToPhone
                                        isEmail={isEmail}
                                        setIsEmail={setIsEmail}
                                        otpPhone={otpPhone}
                                        otpEmail={otpEmail}
                                        setOtpPhone={setOtpPhone}
                                        setOtpEmail={setOtpEmail}
                                        signupWithEmail={signupWithEmail}
                                   />
                              }
                         </div>
                    ))}
                    <div
                         className={`right h-[100%]  rounded-r-[20px] rounded-tl-[100px] rounded-bl-[70px]`}
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
                                            onClick={()=>navigate("/login")}
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

export default Signup;
