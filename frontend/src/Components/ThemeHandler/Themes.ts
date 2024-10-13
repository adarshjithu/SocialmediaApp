export interface ThemeInterface {
     normalButton: {
         color: string;
         backgroundColor: string;
     };
     themeColor: {
         backgroundColor: string;
     };
     textColor: string;
     iconColor: string;
     navbarIcon: {
         backgroundColor: string;
         color: string;
     };
     sidebar: {
         iconColor: string;
         textColor: string;
     };
     thoughts: {
         fontColor: string;
         iconColor: string;
     };
     theme: string;
 }

export let colorObj = {
    normalButton: {
         color: "#fff",
         backgroundColor: "#4B164C",
    },
    themeColor: {
         backgroundColor: "#4B164C",
    },
    textColor: "#fff",
    iconColor: "#4B164C",
    navbarIcon: { backgroundColor: "#fff", color: "#4B164C" },
    sidebar: { iconColor: "#4B164C", textColor: "#4B164C" },
    rightSidebar:{textColor:"#4B164C",subTextcolor:"black",buttonColor:'#4B164C'},
    
    
    thoughts:{
       fontColor:'#4B164C',
       iconColor:'#4B164C'
    }
    ,theme:'#dadfef'
};
