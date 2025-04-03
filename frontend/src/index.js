import React from "react";
import App from "./App";
import { createRoot } from 'react-dom/client'; 
import { BrowserRouter } from 'react-router-dom'; // Import BrowserRouter

const root = createRoot(document.getElementById('root'));
root.render(
    <React.StrictMode>
        <BrowserRouter> {/* Wrap App with BrowserRouter here */}
            <App />
        </BrowserRouter>
    </React.StrictMode>
);


