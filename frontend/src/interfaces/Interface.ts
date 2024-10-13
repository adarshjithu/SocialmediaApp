export interface IEditProfile {
    name:string;
    username:string;
    email:string;
    phonenumber:number;
    dateofbirth:string
}
export interface IBioDialog {
    setBioDialogOpen: React.Dispatch<React.SetStateAction<boolean>>;
    closeBioDialog: () => void;
}

export interface IImageUploadingDialog {
  closeImageUploadDialog:()=>void
}
export interface IProfileHeaderProp {
    isModalOpen: boolean;
    setIsModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
    setActiveTab?: React.Dispatch<React.SetStateAction<string>>;
    activeTab?: string | boolean;
}
export interface PostInterface {
    reload: boolean;
    setReload: React.Dispatch<React.SetStateAction<boolean>>;
}
export interface IPost {

    likes?: Record<string, any>[];
    comments?: Record<string, any>[];
      description?: string;
      private?: boolean;
      isBlocked?: boolean;
      contentType?: string;
      user?: string;
      images?: string[];
      video?: string;
      post?: any;
      isLiked?: boolean;  
      _id?: any;
      
}
export interface ReplyCommentInterface {
    reply: any
    replyIndex?: number;
    index:number
}



export interface CommentInterface {
    content?: string;
    createdAt?: string;
    isLiked?: boolean;
    likes?: [];
    postId?: string;
    replies?: [];
    updatedAt: string;
    userData?: Record<string, any>;
    userId?: string;
    comment?: string;
    _id: any;

}

export interface IUser {
    isFollowing?:boolean
    _id?: any;
    name: string;
    username: string;
    email: string;
    phonenumber: number;
    password: string;
    confirmpassword?: string;
    isOtpEmail?: boolean;
    time?: number | string;
    otp?: number | string;
    isBlocked?: boolean;
    createdAt?: Date;
    updatedAt?: Date;
    isAdmin?: false;
    image?: string;
    success?: boolean;
    bio?: string;
    dateOfBirth: Date;
}






export interface IPostDetails{
  post:{  comments:any[];
    contentType:string;
    createdAt:Date|string;
    description:string;
    images:string[];
    isBlocked:boolean;
    isLiked:boolean;
    likes:string[];
    likesData:any[];
    private:boolean;
    updatedAt:boolean;
    user:string;
    userData:IUser
    post:any;
    _id:string|any};
    setIsModalOpen:React.Dispatch<React.SetStateAction<boolean>>;
    setSelectedPost:any;
    closeModal:()=>void
}
export interface IFolloList {
    user: IUser;
    dialogType: string;
    toggleFollow: (userId: number) => void;
    users:any
    setUsers:any
    index:number
}



export interface IChatUserList{
users:IUser[];
setUsers:React.Dispatch<React.SetStateAction<IUser[]>>
receiverId:string;
setReceiverId:React.Dispatch<any>
}


export interface IMessage {
    receiverId:string;
    setReceiverId:React.Dispatch<any>
    user:Record<string,any>;
    socket:any
    setToggle:any
}

export interface ISingleChat {
   message:Record<string,any>;
   color:any;
   userData:Record<string,any>
}

export interface clearChatInterface {
    modalOpen:boolean;
    setModalOpen:any
    senderId:string;
    receiverId:string;
    setMessages: any
}

export interface ICallModal {
    user:Record<string,any>;
    setCallModal:any;
    userData:Record<string,any>
}
