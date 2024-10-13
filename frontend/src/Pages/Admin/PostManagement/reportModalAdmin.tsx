import React, { useEffect, useState } from "react";
import { reportDetails } from "../../../Services/apiService/adminServices";
import { noUserImage } from "../../../Utils/utils";

function ReportModalAdmin({ post, setToggleReportModal }: any) {
    const [allReport, setAllReport] = useState<any[]>([]);

    useEffect(() => {
        const fetchData = async () => {
            const res = await reportDetails(post);
            console.log(res?.data?.result);
            setAllReport(res?.data?.result);
        };
        fetchData();
    }, []);
    return (
        <div>
            <div id="report-view-modal" className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
                <div className="bg-white w-full max-w-4xl p-6 rounded-lg shadow-lg overflow-auto">
                    <div className="flex justify-between items-center">
                        <h2 className="text-xl font-semibold">User Reports</h2>
                        <button
                            onClick={() => setToggleReportModal((prev: any) => !prev)}
                            id="close-modal"
                            className="text-gray-600 hover:text-gray-800 text-2xl"
                        >
                            &times;
                        </button>
                    </div>
                    <div className="mt-4 space-y-4 overflow-scroll" >
                        {/* Example Report Item */}
                        {allReport.map((report:any,index)=>{
                          return (
                             <div className="flex items-center p-4 border border-gray-200 rounded-lg">
                                <img src={report?.userId?.image?report?.userId?.image:noUserImage} alt="User Picture" className="w-12 h-12 rounded-full mr-4" />
                                <div className="flex-grow">
                                    <h3 className="font-semibold text-lg">{report?.userId?.name}</h3>
                                    <p className="text-gray-600">Reason for report: {report?.reason}</p>
                                    <p className="text-gray-500 text-sm">Reported on: {new Date(report?.createdAt).toDateString()}</p>
                                </div>
                            </div>
                          )
                        })
                           
                        }
                    </div>
                    <div className="mt-6 flex justify-end">
                        <button id="confirm-btn" className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
                            Close
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default ReportModalAdmin;
