import { useEffect, useRef } from "react";

export function useVitalsWebSocket(userId, token, onMessage) {
  const wsRef = useRef(null);
  const reconnectAttempts = useRef(0);
  const heartbeatRef = useRef(null);

  const connect = () => {
    if (wsRef.current) return;

    const wsUrl =
      import.meta.env.VITE_WS_URL || "ws://localhost:8000/ws/vitals";

    const ws = new WebSocket(`${wsUrl}?token=${token}`);

    ws.onopen = () => {
      console.log("✅ WebSocket connected");
      reconnectAttempts.current = 0;

      // Start heartbeat
      heartbeatRef.current = setInterval(() => {
        if (ws.readyState === WebSocket.OPEN) {
          ws.send("ping");
        }
      }, 30000);
    };

    ws.onmessage = (e) => {
      if (e.data === "pong") return;
      try {
        const data = JSON.parse(e.data);
        onMessage(data);
      } catch (err) {
        console.error("WebSocket message error:", err);
      }
    };

    ws.onclose = () => {
      console.log("❌ WebSocket disconnected");

      // Cleanup heartbeat
      if (heartbeatRef.current) {
        clearInterval(heartbeatRef.current);
        heartbeatRef.current = null;
      }

      // Reconnect with exponential backoff
      const delay = Math.min(1000 * Math.pow(2, reconnectAttempts.current), 30000);
      setTimeout(connect, delay);
      reconnectAttempts.current += 1;
    };

    ws.onerror = (e) => {
      console.error("WebSocket error:", e);
    };

    wsRef.current = ws;
  };

  useEffect(() => {
    if (!userId || !token) return;

    connect();

    return () => {
      if (wsRef.current) {
        wsRef.current.close();
        wsRef.current = null;
      }
      if (heartbeatRef.current) {
        clearInterval(heartbeatRef.current);
        heartbeatRef.current = null;
      }
    };
  }, [userId, token]);

  return {
    disconnect: () => {
      if (wsRef.current) {
        wsRef.current.close();
        wsRef.current = null;
      }
    },
  };
}

export default useVitalsWebSocket;
