import { Server } from "socket.io"; // Import Socket.IO
import { User } from "../Models/userModel";
import Birthday from "../Models/birthdayModel";
import { Types } from "mongoose";
import { io } from "../app";

// Function to create the Socket.IO connection
export const createBirthdayNotification = async(socket:any,userId:string,socketId:string,io:any) => {


        if (userId) {
            try {
               

                const user = await User.findOne({ _id: userId });
                if (!user) {
                    console.log(`User with ID ${userId} not found.`);
                    return;
                }

                
                const birthdaysData = await Birthday.findOne({});
                const birthdayArr:Record<string,any> = birthdaysData?.birthdays || []; 

                if (birthdayArr.includes(user._id.toString())) { 
                    socket.emit("receiveNotification", `Happy Birthday, ${user?.name}!`);
                    await Birthday.updateOne({},{$pull:{birthdays:user._id}})
                }
            } catch (error) {
                console.error("Error checking or sending birthday notification:", error);
            }
     


}
}
