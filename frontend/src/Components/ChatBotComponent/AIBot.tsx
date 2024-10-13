// ChatBot.js
import React, { useContext, useState } from "react";
import axios from "axios";
import { AnyIfEmpty, useSelector } from "react-redux";
import { RootState } from "../../app/store";
import { chatBot1, noUserImage,chatBot2 } from "../../Utils/utils";
import { colorContext } from "../../Context/colorContext";
import { ThemeInterface } from "../ThemeHandler/Themes";

const ChatBot = () => {
    const [messages, setMessages] = useState<any[]>([]);
    const [input, setInput] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<any>(null);
    const user = useSelector((data: RootState) => data.auth.userData);
    const theme: ThemeInterface = useContext(colorContext);
    const handleSubmit = async (e: any) => {
        e.preventDefault();
        if (!input.trim()) return;

        // Add user message to chat
        setMessages((prevMessages) => [...prevMessages, { sender: "user", text: input }]);
        setInput("");
        setLoading(true);
        setError(null);

        try {
            // Send request to AI service
            const res = await axios({
                url: import.meta.env.VITE_CHATBOT_URL,
                method: "post",
                data: { contents: [{ parts: [{ text: input }] }] },
            });

            const aiResponse = res.data.candidates[0].content.parts[0].text;

            // Add chatbot response to chat
            setMessages((prevMessages: any) => [...prevMessages, { sender: "bot", text: aiResponse }]);
        } catch (err) {
            setError("Something went wrong. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="mt-2 mb-2 flex flex-col md:w-[80%] border border-gray-300 w-[95%] rounded-lg overflow-hidden bg-white shadow-lg">
            <header className="text-white text-lg p-4 text-center font-bold" style={{ backgroundColor: `${theme.themeColor.backgroundColor}` }}>
                AI Chatbot
            </header>

            {/* Chat Area */}
              {messages.length==0&& 
              <div className="w-full h-full flex justify-center items-center" >

              <img className="w-[50%] h-[50%]" src={chatBot2} alt="" />
              </div>}
            {messages.length>0&&<div className="flex-1 p-4 overflow-y-auto space-y-2 w-full">
                {messages.map((msg, index) => (
                    <div key={index} className={`flex items-start`}>
                        {msg.sender === "user" ? (
                            <>
                                <img src={`${user?.image ? user.image : noUserImage}`} alt="User avatar" className="w-8 h-8 rounded-full mr-2" />
                                <div className="bg-blue-100 p-2 rounded-lg text-left">{msg.text}</div>
                            </>
                        ) : (
                            <>
                                <div className="bg-gray-100 p-2 rounded-lg text-left">{msg.text}</div>
                                <img
                                    src={chatBot1}
                                    alt="Bot avatar"
                                    className="w-8 h-8 rounded-full ml-2"
                                />
                            </>
                        )}
                    </div>
                ))}

                {error && <div className="text-red-500 text-center">{error}</div>}
            </div>}
            

            {/* Input Area */}
            <form onSubmit={handleSubmit} className="flex border-t border-gray-300 p-2">
                <input
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="Type a message..."
                    className="flex-1 p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200"
                />
                <button
                    style={{ backgroundColor: `${theme.themeColor.backgroundColor}` }}
                    type="submit"
                    className=" text-white p-2 rounded-lg hover:bg-blue-600 transition duration-200 ml-2"
                >
                    {loading ? (
                        <div className="text-center text-gray-500">
                            <div className="loader"></div>
                        </div>
                    ) : (
                        "Send"
                    )}
                </button>
            </form>
        </div>
    );
};

export default ChatBot;
