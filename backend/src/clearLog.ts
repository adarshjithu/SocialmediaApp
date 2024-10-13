import fs from "fs";
import path from "path";
import cron from "node-cron";
import { User } from "./Models/userModel";
import Birthday from "./Models/birthdayModel";
const logFilePath = path.join(__dirname, "../error.log");

// function for clear all the error logs

const clearLogFile = () => {
    if (fs.existsSync(logFilePath)) {
        fs.truncateSync(logFilePath, 0);
        console.log("Cleared error.log"); 
    } else {
        console.log("error.log does not exist");
    }
};

// Function for shedule birthday

const sheduleBirthday = async()=>{

    const today = new Date();
    const day = today.getDay();
    const month =  today.getMonth();


    const user =  await User.aggregate([{$match:{dateofbirth:{$exists:true}}},{$project:{_id:1,dateofbirth:1}}]);
     const allbirthDay  =user.filter((obj)=>{
        
        const dob =  new Date(obj.dateofbirth);
       if(month==dob.getMonth()&&day==dob.getDay()){
             return obj._id;
     }
   
        
     });

   const birthdayIds = allbirthDay.map((obj)=>obj._id);
   await Birthday.updateOne({},{$set:{birthdays:birthdayIds}},{upsert:true})
    
}


//Schedule the task to run every days at midnight

cron.schedule('0 0 * * *', () => {
   
    console.log('Running birthday scheduler at midnight');
    sheduleBirthday();
});

// Shedule delete error logs 20 day
cron.schedule("0 0 */20 * *", () => {
    clearLogFile();
}); 


 