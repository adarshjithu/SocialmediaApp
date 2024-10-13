import { useContext, useEffect, useState } from "react";
import { TextField, Button } from "@mui/material";
import { colorContext } from "../../../Context/colorContext";

import Icon from "../../../Components/Icon/Icon";
import { verifyUser } from "../../../Services/apiService/userService";
import LoadingComponent from "../../../Components/Loading/LoadingComponent";
import { useNavigate } from "react-router-dom";
function VerifyEmail() {
    const [loading, setLoading] = useState<boolean>(false);
    const theme: any = useContext(colorContext);
    const [formData, setFormData] = useState<string>("");
    const navigate = useNavigate();
    useEffect(() => {
        document.title = "VerifyEmail";
    }, []);

    const handleSubmit = async () => {
        setLoading(true);

        let res = await verifyUser(formData);

        if (res.success) {
            localStorage.setItem("forgetpasswordtime", res.time);

            navigate("/forget-password-otp", { state: { formData } });
        }

        setLoading(false);
    };
    return (
        <div className="w-full h-screen bg-[#E0E0E0] d flex justify-center items-center">
            <Icon auth={true} />
            <div className="bg-white h-[70vh]  md:h-[500px] sm:h-[500px]   w-[768px] rounded-[20px] flex m-4 shadow-[2px_2px_15px_grey] ">
                <div className="left h-[100%] flex items-center flex-col justify-center shadow-xl">
                    <div className="flex justify-center items-center mt-10">
                        <h1 className="text-[35px] font-medium">User Verification</h1>
                    </div>

                    <form action="" className="flex flex-col">
                        <div className="p-8 ">
                            <TextField
                                value={formData}
                                onChange={(e) => setFormData(e.target.value)}
                                size="small"
                                label="  Email Or Phonenumber"
                                className="w-[100%]"
                                type="te"
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
                                {loading ? <LoadingComponent /> : "SUBMIT"}
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

export default VerifyEmail;
