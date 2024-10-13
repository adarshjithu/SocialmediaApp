import { useContext, useEffect, useState } from "react";
import { followUser, unFollowUser, userSuggessions } from "../../../Services/apiService/userService";
import { IUser } from "../../../interfaces/Interface";
import { colorContext } from "../../../Context/colorContext";
import Navbar from "../../../Components/Navbar/Navbar";
import Footer from "../../../Components/Footer/Footer";

function Suggessions() {
    const [loading, setLoading] = useState<boolean>(false);
    const [allUsers, setAllUsers] = useState<IUser[]>([]);
    const theme:Record<string,any> = useContext(colorContext);

    const follow = async (id: string) => {
        const modified = allUsers?.map((obj: any) => {
            if (obj._id == id) {
                obj.isFollow = false;
            }
            return obj;
        });
        setAllUsers(modified);
        await followUser(id);
    };
    const unfollow = async (id: string) => {
        const modified = allUsers?.map((obj: any) => {
            if (obj._id == id) {
                obj.isFollow = true;
            }
            return obj;
        });
        setAllUsers(modified);
        await unFollowUser(id);
    };

    useEffect(() => {
        document.title = 'Suggessions'
        const fetchData = async () => {
            setLoading(true);
            const res = await userSuggessions();

            setLoading(false);
            const modified = res?.users.map((obj: any) => {
                obj.isFollow = true;
                return obj;
            });

            setAllUsers(modified);
        };
        fetchData();
    }, []);

    return (
        <div>
            <Navbar />
            <div className="suggessions w-full p-7 h-[100%] rounded-xl  relative overflow-scroll overflow-x-hidden">
                <h1 className="text-[20px]">Suggessions for you</h1>
                {loading ? (
                    <div className="w-full h-full flex justify-center items-center">
                        <div className=" h-20 w-20 rounded-full border-t-8 border-b-8 border-blue-500 animate-spin"></div>
                    </div>
                ) : (
                    allUsers?.map((obj: any) => {
                        return (
                            <div className="friends flex flex-row w-full mt-4">
                                <div className="w-[20%]">
                                    <img
                                        className="w-[]35px h-[35px] rounded-[100%]"
                                        src={
                                            obj?.image
                                                ? obj?.image
                                                : "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAJYAAACUCAMAAABGFyDbAAAAY1BMVEX///8AAADs7Oz7+/uoqKj29vaamprk5OTe3t7w8PC2trbo6OidnZ3T09NPT092dnYlJSVXV1cfHx/IyMg3NzdwcHA8PDxpaWkxMTFGRkYXFxePj49iYmIRERFdXV29vb2AgIDyxjPtAAAFuElEQVR4nO1c2XLiMBDE+L4wxmAwYPD/f+VCyGYTrKNbB6naot8l2mg00zMaabF44403/gvEeZmm2SfStMzj32aU10WU7Np+E3xh07e7JCrq/Lc41cl+dQgkOKz2Sf1qRnFWXGSEvuNSpK9b0TpqEE4P7KLX/GldI105yXo2nW9Oy2LkOH2iWHokVSZbI1I3bKvSF6tqMCV1x1D54BRfbTg90Dnflt3ZnlUQ7B0bf7LR/yaCYxK6I9WRLkGFras/LI7ckbojcmJh+d4tq5uFOQjjtWtSd1jHo+Log9axsGN1Mos1el4nC1IhoRRYTMaeIvbI6sbLdEM6cexy7I1IhTu/rG4K0WAdw8k3KyP7OvlnFQT0fnQccGQg/VfnSDHosKEC99JYHLPoGZFPC5lx3Q+r1dCv6aiwxVmR5j6ek6LLb7sqzLsiOZPMYLPvuPBc/aw35HVFDT+C5pX2xKTbShBD4oqxzT6FaDF+tJFMmTLhdEJYMbovkrrpkHF8gCrMV/Bsx0w1UYZb6EovJnB77TUfWeM2GulYLWGXtdbuoG6NzrXVOVXc3q86VosFXh+YNH+Wq4nYj1TnaPA8A1QXKuEaj/Ira9iyQEVSoPMdVPsnQWe5gPlB3KIzJvJJcD0Dyzf471IoHHiOAGW1WMBTyr8U9jMNTgvOnw6yGTL4ywip28GTyoQE7B2OmBT5QAqHxkk8AR6kV4QAX+Kzil3qFf6uhigfxLBxHcXhDHZaXNaJJwZC17WEPV9AFf5xpdSKVjGFh+vl0XcQMlW0k3BfqgoUc+C2IfSoRDWLsa2QSDpFFS98dLDzshNvebBgOEELE1sPlEzWOf9c6gBMmfL8BB7RApEQp+oOgI7/C2InifYSVSld4bTwtPOG3Ww41EDwBdjmGZO9id7n4UvuwBf284TXCgTRuubqfwOoIfDU5wPb50SDLZaCjp77s+al1CtZw1tDSjCDZfgD4/MWp/bxHQNCi3GlH3iOinwdXh8YmXD4iWdtwtMatfLG4MjBnpY2hzWZ0gUt5Rm9WT+AE1rBTrofU7N+ACe0DpPUqy4no5YOB7RW6saUMKGitCtahVYLlvyktrR2WDWQPVh+psV5+QOsAwvOxJ59DhUTL0QzSo1nxYKYiNfQuRIE100xq/VneFSdGFJ34GXw/jl3watIJ7pLAA/Z88MfVMsb9eyg/9d5NhK0ALMOlAUYiuY1Waze0xp224JVqnnmAp1uKs8alMDORwTTI8MsmtQgfy0YB6Q+rTkrKL1eC4bpbV59CKwDcEg8CYbp6/pUEXAOfc4oOoVIdVER7FeQQttfITyF0La92jQ/fkDn7MVtsjrJZd0kraveiDM8jYgw9O/foV4PSatAqPbEDi6gqF12K1kO5VZhjp9kUB9LyWpmuWqQpXd4QPnhUnGpWkXL5ugHVBFIHkIUHnWmG42g0sDyE91c/ndZhcN/UPyAom9E7rqIQ3MV5IFXVZaS15sd3R2Sik11jVi6VZxYvMLmNZ8tG+boNp/UoWrGyazL0TUrmWvULYZsMzq6zBSKZ1dtwwckq++GlcxIAMsV72GvtBDvU76eFqQChL7FJy3MJ8YiteaRFnognwkyYH+0DrAIEOxGf7SI+OH1OtRPTMQ3xdzJtQXOVPjIXnRHZEuqS6qrwhgjrXnp41gTGMilF9yLovrAXsbLiBXdLcDCOPPkLuyQsMgODF9/ADBaJQfkAReMLdFqJQLZewNCd+lFj9DDxdz5GYoBL9cbcnT0+ILja/vOHpCJJ2c390fjW94idHRvkRiD41c9SicXmk/un7PJ95a3hzcunqcQoLPS0pO3J4liqnvgB9ra4ZMsc5SNgfH3jbeXiL4APr31D5fC8gwLRJ5VsLIYq+yVz6mV0XnQ7MzNcI78L96cWRdNrYTapp2i7hc4PRDmaVZXTXv4WtTx0DZVnaW51433xhtvvAR/AFhPUahci3jdAAAAAElFTkSuQmCC"
                                        }
                                        alt=""
                                    />
                                </div>
                                <div className="w-[50%]">
                                    <h1 className="" style={{ color: `${theme.rightSidebar.subTextcolor}` }}>
                                        {obj?.name}
                                    </h1>
                                </div>
                                <div className="w-[30%]">
                                    {obj.isFollow ? (
                                        <button
                                            onClick={() => follow(obj._id)}
                                            className="w-[80%] rounded-md text-[13px]"
                                            style={{ backgroundColor: `${theme?.rightSidebar?.buttonColor}`, color: "white" }}
                                        >
                                            Follow
                                        </button>
                                    ) : (
                                        <button
                                            onClick={() => unfollow(obj._id)}
                                            className="w-[80%] rounded-md text-[13px]"
                                            style={{ backgroundColor: `${theme?.rightSidebar?.buttonColor}`, color: "white" }}
                                        >
                                            Unfollow
                                        </button>
                                    )}
                                </div>
                            </div>
                        );
                    })
                )}
            </div>
            <Footer />
        </div>
    );
}

export default Suggessions;
