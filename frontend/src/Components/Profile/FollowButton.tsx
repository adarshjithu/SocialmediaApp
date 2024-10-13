import { useContext, useEffect, useState } from "react";
import { colorContext } from "../../Context/colorContext";
import { RootState } from "../../app/store";
import { useSelector } from "react-redux";
import { checkUserFollowingOrNot, followUser, unFollowUser } from "../../Services/apiService/userService";
import LoadingComponent from "../Loading/LoadingComponent";

function FollowButton() {
    const theme: any = useContext(colorContext);
    const profile = useSelector((data: RootState) => data.profile.isCurrentUser);
    const [follow, setFollow] = useState<boolean>(false);
    const [loading, setLoading] = useState<boolean>(false);

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            const res = await checkUserFollowingOrNot(profile.userId);
            setLoading(false);
            setFollow(res?.result.success);
        };

        fetchData();
    }, []); 

    const unfollow = async () => {
        setLoading(true);
        const res = await unFollowUser(profile.userId);
        setLoading(false);
        if (res.success) setFollow(!follow);
       
    }; 
  
    const Follow = async () => {
        setLoading(true);
        const res = await followUser(profile.userId);
        setLoading(false);
        if (res.success) setFollow(!follow);
        
    };
    return (
        <div>
            {follow ? (
                <button
                    onClick={unfollow}
                    className="px-2 py-1 text-xs sm:text-sm font-semibold text-white rounded-md hover:bg-#4B164C-700 transition duration-300"
                    style={{color:"#31223F",border:"1px solid #31223F" }}
                >
                    {loading ? <LoadingComponent /> : "Unfollow"}
                </button>
            ) : (
                <button
                    onClick={Follow}
                    className="px-3 py-1 sm:px-4 sm:py-2 text-xs sm:text-sm font-semibold text-white rounded-md hover:bg-red-700 transition duration-300"
                    style={{ backgroundColor: `${theme.normalButton.backgroundColor}` }}
                >
                    {loading ? <LoadingComponent /> : "Follow"}
                </button>
            )}
        </div>
    );
}

export default FollowButton;
