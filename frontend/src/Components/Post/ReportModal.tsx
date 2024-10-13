import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'; // Import FontAwesomeIcon
import { faTimes, faPaperPlane } from '@fortawesome/free-solid-svg-icons'; // Import specific icons
import toast from 'react-hot-toast';
import { reportPost } from '../../Services/apiService/postServices';

const ReportModal = ({setReportModal,postId}:any) => {
  const [selectedReason, setSelectedReason] = useState('');
  const [additionalDetails, setAdditionalDetails] = useState('');

  const reasons = [
    'Spam or Misleading',
    'Harassment or Bullying',
    'Violence or Harmful Content',
    'Sexually Explicit Content',
    'Self-harm or Suicide',
  ];

  const handleSubmit =async () => {
    if (!selectedReason) {
      toast.error('Please select a reason for reporting.');
      return;
    }
       const res = await reportPost(postId,selectedReason+" "+additionalDetails) ;
       if(res?.data?.success){setReportModal((prev:any)=>!prev)}

  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white rounded-lg p-4 w-80 shadow-lg transition-transform transform hover:scale-105">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold">Report Content</h2>
          <button onClick={()=>setReportModal((prev:any)=>!prev)} className="text-gray-600 hover:text-gray-800 transition">
            <FontAwesomeIcon icon={faTimes} className="w-6 h-6" /> {/* Close icon */}
          </button>
        </div>
        <p className="mb-3 text-gray-600 text-sm">
          Please select a reason for reporting this content. Your report will be reviewed by our team.
        </p>
        
        {/* Radio button list for report reasons */}
        <div className="mb-3">
          {reasons.map((reason, index) => (
            <label key={index} className="flex items-center mb-1 text-sm">
              <input
                type="radio"
                name="reportReason"
                value={reason}
                checked={selectedReason === reason}
                onChange={(e) => setSelectedReason(e.target.value)}
                className="mr-2"
              />
              <span className={`flex-1 ${selectedReason === reason ? 'font-bold' : ''}`}>{reason}</span>
            </label>
          ))}
        </div>

        {/* Text area for additional details */}
        <textarea
          className="w-full p-2 border border-gray-300 rounded mb-3 text-sm focus:outline-none focus:border-blue-500"
          placeholder="Additional details (optional)"
          value={additionalDetails}
          onChange={(e) => setAdditionalDetails(e.target.value)}
        />

        {/* Modal buttons */}
        <div className="flex justify-end">
          <button
            className="bg-red-500 text-white py-1 px-3 rounded mr-2 text-sm hover:bg-gray-400 transition"
            onClick={()=>setReportModal((prev:any)=>!prev)}
          >
            Cancel
          </button>
          <button
            className="bg-blue-500 text-white py-1 px-3 rounded text-sm flex items-center transition hover:bg-blue-600"
            onClick={handleSubmit}
          >
            <FontAwesomeIcon icon={faPaperPlane} className="mr-1" /> {/* Submit icon */}
            Submit Report
          </button>
        </div>
      </div>
    </div>
  );
};

export default ReportModal;
