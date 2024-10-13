import React, { useEffect, useState } from "react";
import Chart from "react-apexcharts";
import { dashBoard } from "../../../Services/apiService/adminServices";

const AdminDashboard = () => {
    const [totalPost,setTotalPost] = useState<number>(0);
    const [totalUser,setTotalUser] = useState<number>(0)
    const [todayPost,setTodayPost] = useState<number>(0)
    const [todayUser,setTodayUser] = useState<number>(0)
    const [totalLike,setTotalLike] = useState<number>(0)
    const [totalComment,setTotalComment] = useState<number>(0);
    const [monthlyUser,setMonthlyUser] = useState<number[]>([])
    const [monthlyPost,setMonthlyPost] = useState<number[]>([])

    useEffect(() => {
        const fetchData = async () => {
            const res = await dashBoard();
        console.log(res?.data.result)
            const data = res?.data.result;
            setTotalPost(data?.totalPost);
            setTotalUser(data?.totalUsers);
            setTodayUser(data?.todayUserCount);
            setTodayPost(data?.todayPostCount)
            setTotalLike(data.totalLikes)
            setTotalComment(data?.totalComments);
            setMonthlyUser(data?.monthlyUser)
            setMonthlyPost(data?.monthlyPost)
         
          
        };
        fetchData();
    }, []);
    // Line Chart: User and Post Growth Over Time
    const lineChartOptions = {
        chart: {
            id: "user-post-growth-chart",
        },
        xaxis: {
            categories: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep",'oct','nov','dec'],
        },
    };

    const lineChartData = [
        {
            name: "New Users",
            data: monthlyUser,
        },
        {
            name: "New Posts",
            data: monthlyPost,
        },
    ];

    // Pie Chart: Likes and Comments Distribution
    const pieChartOptions = {
        labels: ["Likes", "Comments"],
    };

    const pieChartData = [totalLike, totalComment]; // 350 likes, 150 comments

    // Bar Chart: Total Users, Posts, and Today's Activity
    const barChartOptions = {
        chart: {
            id: "user-post-activity-chart",
        },
        xaxis: {
            categories: ['Total Post', 'Total User', 'Today Post','Today User'] ,
        },
    };

    const barChartData = [
        {
            name: "Activity",
            data:[totalPost, totalUser,todayPost,todayUser], // Example data: total posts, total users, today's posts, today's users
        },
    ];

    return (
        <div style={containerStyle}>
            <h2  className="text-xl mb-4">ADMIN DASHBOARD</h2>
            <div style={gridStyle}>
                {/* Line Chart Card */}
                <div style={cardStyle}>
                    <h3 style={cardTitleStyle}>User and Post Growth </h3>
                    <Chart options={lineChartOptions} series={lineChartData} type="line" height={300} />
                </div>

                {/* Pie Chart Card */}
                <div style={cardStyle}>
                    <h3 style={cardTitleStyle}>Total Likes vs Comments</h3>
                    <Chart options={pieChartOptions} series={pieChartData} type="pie" height={300} />
                </div>

                {/* Bar Chart Card */}
                <div style={cardStyle}>
                    <h3 style={cardTitleStyle}>Total and Today's Activity</h3>
                    <Chart options={barChartOptions} series={barChartData} type="bar" height={300} />
                </div>
            </div>
        </div>
    );
};

// Style for the container
const containerStyle = {
    padding: "20px",
    backgroundColor: "#f4f6f9",
    minHeight: "100vh",
};

// Title style
const titleStyle = {
    textAlign: "center",
    marginBottom: "30px",
    color: "#4B164C",
    fontSize: "24px",
};

// Grid layout with responsive media query
const gridStyle = {
    display: "grid",
    gridTemplateColumns: "repeat(2, 1fr)",
    gap: "20px",
    // Media query for mobile devices (screens less than 768px wide)
    "@media (max-width: 768px)": {
        gridTemplateColumns: "1fr", // Single column layout on mobile
    },
};

// Card style for individual charts
const cardStyle = {
    padding: "20px",
    backgroundColor: "#fff",
    boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
    borderRadius: "8px",
    width: "100%", // Full width for mobile
};

// Card title style
const cardTitleStyle = {
    fontSize: "16px",
    color: "#333",
    marginBottom: "15px",
};

export default AdminDashboard;
