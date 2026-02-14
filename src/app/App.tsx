import "./App.css";
import { AppRouter } from "./router";
import { AppProvider } from "./AppProvider";
import { useEffect } from "react";
import socket from "./socket";
import useSocketStore, { type SocketStoreState } from "@stores/socketStore";
import useMock from "@stores/globalStore";
function App() {
  const updateBlock = useMock((state) => state.updateBlock);
  const setSocketId = useSocketStore((state : SocketStoreState) => state.setSocketId);
  useEffect(() => {
    socket.on("connect", () => {
      console.log("✅ WebSocket connected:", socket.id);
      setSocketId(socket.id||"");
    });
    socket.on("reconnect", () => {
      setSocketId(socket.id||"");
    });
    socket.on("disconnect", () => {
      console.log("❌ Disconnected");
    });
    socket.on("codeExecutionResult", (data) => {
      updateBlock(data.id, { output: data.response.output || data.response.error });
      console.log("Received code execution result:", data);
    });
    return () => {
      socket.off("connect");
      socket.off("reconnect");
      socket.off("disconnect");
    };
  }, [setSocketId]);

  return (
    <AppProvider>
      <AppRouter />
    </AppProvider>
  );
}

export default App;
