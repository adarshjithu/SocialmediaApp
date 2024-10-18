import express,{Request,response, Router} from 'express'
import { AdminRepository } from '../Repositories/admin/adminRepository';
import { AdminServices } from '../Services/adminServices';
import { AdminControler } from '../Controlers/adminControler';
import { adminAuth } from '../Middleware/adminAuth';
const adminRouter:Router =  express.Router();

const adminRepository =  new AdminRepository();
const adminService =  new AdminServices(adminRepository);
const controler = new AdminControler(adminService);

adminRouter.get("/users",adminAuth,(req,res,next)=> controler.getAllUsers(req,res,next));
adminRouter.get("/user/block",adminAuth,(req,res,next)=> controler.blockUser(req,res,next));
adminRouter.delete("/user/delete",adminAuth,(req,res,next)=> controler.deleteUser(req,res,next));
adminRouter.post("/login",(req,res,next)=> controler.login(req,res,next));
adminRouter.get("/logout",(req,res,next)=>controler.logout(req,res,next));
adminRouter.get("/posts",adminAuth,(req,res,next)=>controler.getAllPosts(req,res,next))
adminRouter.delete("/post",adminAuth,(req,res,next)=>controler.deletePost(req,res,next))
adminRouter.get('/post/block',adminAuth,(req,res,next)=>controler.blockPost(req,res,next))
adminRouter.get('/post/getpostinfo',adminAuth,(req,res,next)=>{controler.getPostInfo(req,res,next)})
adminRouter.delete("/post/comment/delete",adminAuth,(req,res,next)=>controler.deleteComment(req,res,next));
adminRouter.get('/dashboard',adminAuth,(req,res,next)=>controler.dashboard(req,res,next));
adminRouter.get('/report',adminAuth,(req,res,next)=>controler.getReports(req,res,next))
adminRouter.post("/report/notification",adminAuth,(req,res,next)=>controler.addNotification(req,res,next))


export default adminRouter;