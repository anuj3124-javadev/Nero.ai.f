import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { BrowserRouter } from "react-router-dom";
import { ClerkProvider } from "@clerk/clerk-react";
import { ThemeProvider } from "./context/ThemeContext";

const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;

if (!PUBLISHABLE_KEY || PUBLISHABLE_KEY === "pk_test_your_clerk_publishable_key_here") {
  createRoot(document.getElementById("root")).render(
    <div style={{ textAlign: "center", marginTop: "20%", fontFamily: "sans-serif" }}>
      <h1>⚠️ Configuration Required</h1>
      <p>You must add a valid <b>VITE_CLERK_PUBLISHABLE_KEY</b> in your <code>client/.env</code> file.</p>
      <p>The app cannot safely boot without a Clerk authentication provider.</p>
    </div>
  );
} else {
  createRoot(document.getElementById("root")).render(
    <ClerkProvider publishableKey={PUBLISHABLE_KEY}>
      <ThemeProvider>
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </ThemeProvider>
    </ClerkProvider>
  );
}
