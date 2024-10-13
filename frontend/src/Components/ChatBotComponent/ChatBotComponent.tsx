import axios from "axios";
import React from "react";

function ChatBotComponent() {
    const handleSubmit = async () => {
        const res = await axios({
            url: "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=AIzaSyAuJMphw7SDPT8S90yG2lSYgMCFs0vK_-c",
            method: "post",
            data: { contents: [{ parts: [{ text: "Explain how AI works" }] }] },
        });
        console.log(res["data"]["candidates"][0]["content"]["parts"][0]["text"]);
    };

    return (
        <div>
            <button onClick={handleSubmit}>Click</button>
        </div>
    );
}

export default ChatBotComponent;
