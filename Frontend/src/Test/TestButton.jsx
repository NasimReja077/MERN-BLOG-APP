import { useState } from "react";
import axiosInstance from "../api/axios";

export const TestButton =()=> {
  const [msg, setMsg] = useState("");

  const checkConnection = async () => {
    try {
      const res = await axiosInstance.get("/test");
      setMsg("Frontend → Backend Connected: " + res.data);
    } catch (err) {
      setMsg("❌ Connection Failed: " + err.message);
      console.error("Axios Error:", err);
    }
  };

  return (
    <div>
      <button onClick={checkConnection}>Check API Connection</button>
      <p>{msg}</p>
    </div>
  );
}
