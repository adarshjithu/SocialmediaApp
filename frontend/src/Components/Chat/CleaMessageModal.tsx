import React from 'react';
import { clearChatInterface } from '../../interfaces/Interface';
import { clearAllChat } from '../../Services/apiService/chatServices';



function ClearMessagesModal({modalOpen,setModalOpen,senderId,receiverId,setMessages}:clearChatInterface) {

const clearChat = async()=>{
 const res  =  await clearAllChat(senderId,receiverId);
 setModalOpen(!modalOpen)
  setMessages([])
}
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white rounded-lg shadow-lg p-6 w-96">
        <h2 className="text-xl font-semibold mb-4">Clear All Messages</h2>
        <p className="text-gray-600 mb-6">Are you sure you want to clear all messages? </p>
        <div className="flex justify-end space-x-4">
          <button 
           onClick={()=>setModalOpen(!modalOpen)}
       
            className="px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300 transition duration-200"
          >
            Cancel
          </button>
          <button 
          onClick={clearChat}

            className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition duration-200"
          >
            Clear All
          </button>
        </div>
      </div>
    </div>
  );
};

export default ClearMessagesModal;
