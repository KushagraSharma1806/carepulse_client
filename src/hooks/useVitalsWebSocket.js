import { useEffect, useRef } from 'react';

export function useVitalsWebSocket(userId, token, onMessage) {
  const wsRef = useRef(null);
  const reconnectAttempts = useRef(0);

  const connect = () => {
    if (wsRef.current) return;

    const ws = new WebSocket(`ws://localhost:8000/ws/vitals?token=${token}`);
    
    ws.onopen = () => {
      console.log('WebSocket connected');
      reconnectAttempts.current = 0;
      // Start heartbeat
      const heartbeat = setInterval(() => {
        if (ws.readyState === WebSocket.OPEN) {
          ws.send('ping');
        }
      }, 30000);
    };

    ws.onmessage = (e) => {
      if (e.data === 'pong') return;
      try {
        const data = JSON.parse(e.data);
        onMessage(data);
      } catch (err) {
        console.error('WebSocket message error:', err);
      }
    };

    ws.onclose = (e) => {
      console.log('WebSocket disconnected');
      // Exponential backoff reconnect
      const delay = Math.min(1000 * Math.pow(2, reconnectAttempts.current), 30000);
      setTimeout(connect, delay);
      reconnectAttempts.current += 1;
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
    };
  }, [userId, token]);

  return { disconnect: () => wsRef.current?.close() };
}

export default useVitalsWebSocket;