import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { Toaster } from "react-hot-toast";
import { Provider } from "react-redux";
import { store } from "./store";
import { PersistGate } from "redux-persist/integration/react";
import { persistor } from "./store";
createRoot(document.getElementById("root")).render(
  <StrictMode>
    <Provider store={store}>
      <PersistGate persistor={persistor} loading={<div>Loading...</div>}>
        <App />
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 1000,
            style: {
              borderRadius: "10px",
              background: "#fff",
              color: "#333",
              fontWeight: "500",
            },
          }}
        />
      </PersistGate>
    </Provider>
  </StrictMode>
);
