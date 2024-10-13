import Icon from "../../../Components/Icon/Icon";
import React, { useEffect, useState } from "react";
import Header from "../Header/Header";
import { useNavigate } from "react-router-dom";
import { logoutAdmin } from "../../../Services/apiService/adminServices";
import { useDispatch } from "react-redux";
import { adminLogout } from "../../../features/user/authSlice";


function ASidebar({ children }: any) {
     const [isSidebarOpen, setIsSidebarOpen] = useState(false);
     const navigate = useNavigate();
     const dispatch = useDispatch()

     const toggleSidebar = () => {
          setIsSidebarOpen((prevState) => !prevState);
     };

     const logout = async():Promise<void>=>{
               const res =  await logoutAdmin();
               console.log(res)
               dispatch(adminLogout());
               navigate("/admin")
                      
     }

     useEffect(() => {
          console.log(document.title);
     }, []);
     return (
          <div className="bg-[#CFF7EF]" style={{borderRight:"1px solid black"}}>
               <button
                    onClick={toggleSidebar}
                    data-drawer-target="default-sidebar"
                    data-drawer-toggle="default-sidebar"
                    aria-controls="default-sidebar"
                    type="button"
                    className="inline-flex items-center p-2 mt-2 ms-3 text-sm text-gray-500 rounded-lg sm:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-600"
               >
                    <span className="sr-only">Open sidebar</span>
                    <svg className="w-6 h-6" aria-hidden="true" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                         <path
                              clip-rule="evenodd"
                              fill-rule="evenodd"
                              d="M2 4.75A.75.75 0 012.75 4h14.5a.75.75 0 010 1.5H2.75A.75.75 0 012 4.75zm0 10.5a.75.75 0 01.75-.75h7.5a.75.75 0 010 1.5h-7.5a.75.75 0 01-.75-.75zM2 10a.75.75 0 01.75-.75h14.5a.75.75 0 010 1.5H2.75A.75.75 0 012 10z"
                         ></path>
                    </svg>
               </button>

               <aside
                    id="default-sidebar"
                    className={`fixed top-0 left-0 z-40 w-64 h-screen transition-transform ${
                         isSidebarOpen ? "translate-x-0" : "-translate-x-full"
                    } sm:translate-x-0`}
                    aria-label="Sidebar"
               >
                    <div className="h-full px-3 py-4 overflow-y-auto bg-white-50 dark:bg-gray-800" style={{ borderRight: ".5px solid #dddddd" }}>
                         <ul className={`space-y-2 font-medium ${isSidebarOpen ? "block" : ""}`}>
                              <li>
                                   <div className="m-8 ml-10">
                                        <Icon auth={true} />
                                   </div>
                              </li>
                              <li onClick={() => navigate("/admin")}>
                                   <a href="#" className="flex items-center p-2 text-gray-900 rounded-lg hover:bg-[#7c007c] hover:text-white group">
                                        <svg
                                             className="w-5 h-5 text-black-500 transition duration-75 group-hover:text-white"
                                             aria-hidden="true"
                                             xmlns="http://www.w3.org/2000/svg"
                                             fill="currentColor"
                                             viewBox="0 0 22 21"
                                        >
                                             <path d="M16.975 11H10V4.025a1 1 0 0 0-1.066-.998 8.5 8.5 0 1 0 9.039 9.039.999.999 0 0 0-1-1.066h.002Z" />
                                             <path d="M12.5 0c-.157 0-.311.01-.565.027A1 1 0 0 0 11 1.02V10h8.975a1 1 0 0 0 1-.935c.013-.188.028-.374.028-.565A8.51 8.51 0 0 0 12.5 0Z" />
                                        </svg>
                                        <span className="ms-3 hover:text-white">Dashboard</span>
                                   </a>
                              </li>

                              <li onClick={() => navigate("/admin/usermanagement")}>
                                   <a  className={`flex items-center p-2 text-gray-900 rounded-lg hover:bg-[#7c007c] hover:text-white group`}>
                                        <i className="fa-regular fa-user fa-solid fa-lg icon"></i>
                                        <span className="flex-1 ms-3 whitespace-nowrap">User Management</span>
                                   </a>
                              </li>
                              <li onClick={()=>navigate("/admin/postmanagement")}>
                                   <a href="" className="flex items-center p-2 text-gray-900 rounded-lg hover:bg-[#7c007c] hover:text-white group">
                                        <i className="fa-regular fa-image fa-solid fa-lg icon"></i>
                                        <span className="flex-1 ms-3 whitespace-nowrap">Post Management</span>
                                   </a>
                              </li>
                         
                             
                           
                              <li>
                                   <a onClick={()=>navigate("/admin/feedback")} className="flex items-center p-2 text-gray-900 rounded-lg hover:bg-[#7c007c] hover:text-white group">
                                        <i className="fa-regular fa-book fa-solid fa-lg icon"></i>
                                        <span className="flex-1 ms-3 whitespace-nowrap">Feedback</span>
                                   </a>
                              </li>
                              <li>
                                   <a onClick={logout} className="flex items-center p-2 text-gray-900 rounded-lg hover:bg-[#7c007c] hover:text-white group">
                                        <i className="fa-regular fa-right-from-bracket fa-solid fa-lg icon"></i>
                                        <span className="flex-1 ms-3 whitespace-nowrap">Logout</span>
                                   </a>
                              </li>
                            
                         </ul>
                    </div>
               </aside>

               <div onClick={() => setIsSidebarOpen(!isSidebarOpen)} className="sm:ml-64 h-[100%] bg-[#dedfe0] ">
                    <Header />
                    {children}
               </div>
          </div>
     );
}

export default ASidebar;
