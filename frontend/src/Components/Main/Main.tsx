import React, { useContext } from "react";
import "./Main.css";
import StatusBar from "../StatusBar/StatusBar";
import Thoughts from "../Thoughts/Thoughts";
import Post from "../Post/Post";
import { colorContext } from "../../Context/colorContext";
import { createPost } from "../SideBar/SideBar";
import UploadImage from "../UploadImage/UploadImage";
import AllComment from "../LikeAndComment/AllComment";
import { useState } from "react";
import { useSelector } from "react-redux";
import UploadStatus from "../StatusBar/UploadStatus";
import Storybar from "../StatusBar/Storybar";
import { ThemeInterface } from "../ThemeHandler/Themes";
import { RootState } from "../../app/store";
import FeedbackComponent from "../FeedBack/FeedBackComponent";
function Main() {
     const theme: ThemeInterface = useContext(colorContext);
     const comment = useSelector((data: RootState) => data?.comment);
     const status = useSelector((data:RootState) => data.status.isUploadStatus);
     const story = useSelector((data:RootState) => data.status.storyBar);
     const feedback = useSelector((data:RootState) => data.status.isUploadFeedback);

     console.log(status,'status')

     const [reload, setReload] = useState<boolean>(false);

     return (
          <div className="main " style={{ position: "relative", overflow: "auto", scrollbarWidth: "none" }}>
               {comment.isComment ? <AllComment /> : ""}
               {status ? <UploadStatus /> : ""}
               {story.view ? <Storybar /> : ""}
               {feedback?<FeedbackComponent/>:""}

               <>
                    <div
                         className={`mb-2 overflow-hidden rounded mt-4 ${comment.isComment || status ? "hidden" : ""}`}
                         style={{ backgroundColor: `${theme.theme}` }}
                    >
                         <StatusBar />
                         <div className="bg-white  rounded">
                              <Thoughts reload={reload} setReload={setReload} />
                         </div>
                    </div>
                    <div>
                         <Post reload={reload} setReload={setReload} />
                    </div>
               </>
          </div>
     );
}

export default Main;
