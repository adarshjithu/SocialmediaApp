import express from 'express'
import { PostRepository } from '../Repositories/post/postRepository'
import { PostServices } from '../Services/postServices';
import { PostControlers } from '../Controlers/postControler';
import upload from '../Middleware/upload';
import { authenticate } from '../Middleware/userAuth';
import multer from 'multer';
import { Readable } from 'stream';
const postRouter =express.Router()  
const uploadVideo = multer()

const postRepository = new PostRepository();
const postServices =  new PostServices(postRepository);
const controler  = new PostControlers(postServices);

// Comment
postRouter.get("/comment/like",authenticate,(req,res,next)=>controler.likeComment(req,res,next));
postRouter.post("/comment",authenticate,(req,res,next)=>controler.commentPost(req,res,next));
postRouter.get("/comment/unlike",authenticate,(req,res,next)=>controler.unlikeComment(req,res,next));
postRouter.post("/comment/reply",authenticate,(req,res,next)=>controler.replyComment(req,res,next));
postRouter.get('/comments',authenticate,(req,res,next)=>controler.getAllComments(req,res,next));
postRouter.get("/comment/reply",authenticate,(req,res,next)=>controler.getReply(req,res,next));
postRouter.patch("/comment/reply/like",authenticate,(req,res,next)=>controler.likeRepliedComment(req,res,next));
postRouter.post("/comment/reply/reply",authenticate,(req,res,next)=>controler.replyRepliedComment(req,res,next))

// Story
postRouter.get("/story",authenticate,(req,res,next)=>controler.getAllStories(req,res,next));
postRouter.post('/story/image/upload',authenticate,upload.any(),(req,res,next)=>controler.uploadStory(req,res,next));
postRouter.patch('/story/like',authenticate,(req,res,next)=>controler.likeStory(req,res,next));

// Upload
postRouter.post('/image/upload',authenticate,upload.any(),(req,res,next)=>{controler.uploadImage(req,res,next)});//
postRouter.post('/video/upload',authenticate,uploadVideo.single('video'),(req,res,next)=>controler.uploadVideo(req,res,next));

postRouter.get("/posts",authenticate,(req,res,next)=>controler.getAllPost(req,res,next));
postRouter.get("/like",authenticate,(req,res,next)=>{controler.likePost(req,res,next)});
postRouter.get("/unlike",authenticate,(req,res,next)=>controler.unlikePost(req,res,next));
postRouter.post('/feeling',authenticate,(req,res,next)=>controler.postFeeling(req,res,next));
postRouter.get("/post",authenticate,(req,res,next)=>controler.getPost(req,res,next));
postRouter.get('/share',authenticate,(req,res,next)=>controler.getUsersForShare(req,res,next));
postRouter.post('/report',authenticate,(req,res,next)=>controler.reportPost(req,res,next))
 

export default postRouter;