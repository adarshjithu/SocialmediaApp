import React, { useContext, useEffect, useState } from "react";
import { colorContext } from "../../../Context/colorContext";
import { TextField, Button } from "@mui/material";
import Icon from "../../../Components/Icon/Icon";
import { ThemeInterface } from "../../../Components/ThemeHandler/Themes";
import { resendOTP, submitOtp } from "../../../Services/apiService/userService";
import { useNavigate } from "react-router-dom";
import { setUserCreadential } from "../../../features/user/authSlice";
import { useDispatch, useSelector } from "react-redux";
import LoadingComponent from "../../../Components/Loading/LoadingComponent";
import toast from "react-hot-toast";

function SubmitOtp() {
     const theme: ThemeInterface = useContext(colorContext);
     const [data, setData] = useState<string>("");
     const [otp, setOtp] = useState<number>(0);
     const [resend, setResend] = useState(true);
     const navigate = useNavigate();
     const dispatch = useDispatch();
     const user = useSelector<any>((data)=>data?.auth?.userData)
     const [loading,setLoading]=useState(false)

   
     useEffect(() => {
          document.title = 'Submit Otp'
          if(user){
              navigate("/")
          }
          let interval = setInterval(() => {
               let dt = Date.now();
               let diff = Math.floor((dt - parseInt(localStorage.getItem("time") || "0")) / 1000);
               let second = 30 - diff;
               if (second < 0) {
                    clearInterval(interval);
               } else {
                    setOtp(second);
               }
          }, 1000);
          return () => {
               clearInterval(interval);
          };
     }, [resend]);

     const handleOtp = async (event: React.FormEvent) => {
          event.preventDefault();
 
          const res = await submitOtp(data);

          if (res.success) {
               
               dispatch(setUserCreadential(res.user));
               navigate("/");
          } else {
               toast.error('Already send')
          }
     };

     const resendOtp = async () => {
          if (otp > 0) {
               toast.error('Already send')
          } else {
               setLoading(true)
               const res = await resendOTP(localStorage.getItem("otpPlace"));
               if (!res.success) {
                    alert(res.message);
               } else {
                    localStorage.setItem("time", String(res.time));
                    setResend(!resend);
               }
               setLoading(false)
          }
     };

    
     return (
          <div className="w-full h-screen bg-[#E0E0E0] d flex justify-center items-center">
               <Icon auth={true} />
               <div className="bg-white h-[70vh]  md:h-[500px] sm:h-[500px]   w-[768px] rounded-[20px] flex m-4 shadow-[2px_2px_15px_grey] ">
                    <div className="left h-[100%] flex items-center flex-col justify-center shadow-xl">
                         <div className="flex justify-center items-center mt-10 flex-col">
                              <h1 className="text-[30px] font-medium">OTP Verification </h1>
                              <div>
                                   <h1 className="mt-4">
                                        Enter Your OTP In <span className="text-xl font-bold">{otp}s</span>
                                   </h1>
                              </div>
                         </div>

                         <form action="" className="flex flex-col" onSubmit={handleOtp}>
                              <div className="p-8 ">
                                   <TextField
                                        value={data}
                                        onChange={(e) => setData(e.target.value)}
                                        size="small"
                                        label="  Enter the OTP"
                                        className="w-[100%] mt-[20px]"
                                        sx={{ marginTop: "20px" }}
                                   />

                                   <Button
                                        variant="contained"
                                        className="w-[100%]"
                                        type="submit"
                                        sx={{
                                             marginTop: "20px",
                                             color: `${theme.normalButton.color}`,
                                             backgroundColor: `${theme.normalButton.backgroundColor}`,
                                             "&:hover": {
                                                  backgroundColor: "secondary.main",
                                             },
                                        }}
                                   >
                                        Verify
                                   </Button>
                                   <Button
                                        onClick={resendOtp}
                                        variant="contained"
                                        className="w-[100%]"
                                        sx={{
                                             marginTop: "20px",
                                             color: "#4B164C",
                                             backgroundColor: "#E0E0E0",

                                             "&:hover": {
                                                  backgroundColor: "secondary.main",
                                             },
                                        }}
                                   >
                                      {  loading?<LoadingComponent color={"#4B164C"}/> :'RESEND'}
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

export default SubmitOtp;
