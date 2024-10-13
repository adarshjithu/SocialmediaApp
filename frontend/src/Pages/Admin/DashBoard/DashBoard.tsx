import React, { useEffect } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import AdminDashboard from "../../../Components/Admin/DashboardComponent/DashboardComponent";

function DashBoard() {
     const admin = useSelector((data: any) => data.auth.adminData);
     const navigate = useNavigate();
     useEffect(() => {
          document.title = 'Admin Dashboard'
          if (!admin) {
               navigate("/admin/login");
          }
     }, [admin]);
     return <div className='bg-white'>

        <AdminDashboard/>
     </div>;
}

export default DashBoard;
