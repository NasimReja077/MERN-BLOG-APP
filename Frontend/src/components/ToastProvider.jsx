import { Toaster } from "react-hot-toast";

const ToastProvider = () => {
  return (
    <Toaster
      position="top-right"
      toastOptions={{
        duration: 3500,

        style: {
          background: "rgba(17, 17, 17, 0.75)",
          color: "#fff",
          backdropFilter: "blur(12px)",
          borderRadius: "12px",
          padding: "14px 18px",
          border: "1px solid rgba(255, 255, 255, 0.1)",
          boxShadow: "0 6px 25px rgba(0, 0, 0, 0.45)",
          fontSize: "15px",
        },

        success: {
          duration: 2500,
          iconTheme: {
            primary: "#00ff9d",
            secondary: "#0f0f0f",
          },
          style: {
            background: "rgba(0, 255, 157, 0.15)",
            border: "1px solid rgba(0, 255, 157, 0.4)",
            boxShadow: "0 6px 20px rgba(0, 255, 157, 0.25)",
          },
        },

        error: {
          duration: 4000,
          iconTheme: {
            primary: "#ff4b4b",
            secondary: "#0f0f0f",
          },
          style: {
            background: "rgba(255, 75, 75, 0.15)",
            border: "1px solid rgba(255, 75, 75, 0.4)",
            boxShadow: "0 6px 20px rgba(255, 75, 75, 0.25)",
          },
        },
      }}

      containerStyle={{
        top: 15,
        right: 15,
      }}

      gutter={12}

    />
  );
};

export default ToastProvider;