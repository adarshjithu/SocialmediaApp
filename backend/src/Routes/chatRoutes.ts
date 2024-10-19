
import express from 'express'
import { ChatRepository } from '../Repositories/Chat/chatRepository';
import { ChatServices } from '../Services/chatServices';
import { ChatControler } from '../Controlers/chatControler';
import { authenticate } from '../Middleware/userAuth';
import upload from '../Middleware/upload';
import multer from 'multer';
const chatRouter =  express.Router();
const storage = multer.memoryStorage(); // Store files in memory
const uploadAudio = multer({ storage: storage });
const chatRepository = new ChatRepository();
const chatServices  = new ChatServices(chatRepository);
const controler = new ChatControler(chatServices);

chatRouter.get('/messages',authenticate,(req,res,next)=>controler.getAllMessages(req,res,next));
chatRouter.get("/users",authenticate,(req,res,next)=>controler.getAllChatedUsers(req,res,next));
chatRouter.get('/users/search',authenticate,(req,res,next)=>controler.searchUserForChat(req,res,next))
chatRouter.post("/feedback",authenticate,(req,res,next)=>{controler.sendFeedBack(req,res,next)})
chatRouter.get("/feedback",authenticate,(req,res,next)=>{controler.getFeedback(req,res,next)});
chatRouter.post("/active-friends",authenticate,(req,res,next)=>controler.activeFriends(req,res,next))
chatRouter.delete("/clear",authenticate,(req,res,next)=>controler.clearAllChat(req,res,next));
chatRouter.post("/image",authenticate,upload.any(),(req,res,next)=>controler.sendImage(req,res,next));
chatRouter.post("/audio",authenticate,uploadAudio.single("audio"),(req,res,next)=>controler.uploadAudio(req,res,next))
chatRouter.delete('/message',authenticate,(req,res,next)=>controler.deleteMessage(req,res,next))


export default chatRouter