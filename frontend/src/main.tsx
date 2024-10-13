import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import ThemeHandler from "./Components/ThemeHandler/ThemeHandler.tsx";
import { Provider } from "react-redux";
import { store } from "./app/store.ts";
import { SocketProvider } from "./Context/SocketProvider.tsx";


createRoot(document.getElementById("root")!).render(
    <StrictMode>
        <ThemeHandler>
            <Provider store={store}>
               <SocketProvider>

                    <App />
               </SocketProvider>
       
            </Provider>
        </ThemeHandler>
    </StrictMode>
);
