import axios from "axios";
import React from "react";

function ChatBotComponent() {
    const handleSubmit = async () => {
        const res = await axios({
            url: import.meta.env.VITE_CHATBOT_URL,
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
