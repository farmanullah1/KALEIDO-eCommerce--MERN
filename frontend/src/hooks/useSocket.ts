import { useEffect, useState } from 'react';
import { io, Socket } from 'socket.io-client';
import { useAuthStore } from '../store/authStore.js';
import toast from 'react-hot-toast';

const SOCKET_URL = import.meta.env.VITE_API_URL?.replace('/api', '') || 'http://localhost:5000';

export const useSocket = () => {
  const { user, isAuthenticated } = useAuthStore();
  const [socket, setSocket] = useState<Socket | null>(null);

  useEffect(() => {
    if (isAuthenticated && user) {
      const socketInstance = io(SOCKET_URL, {
        withCredentials: true,
      });

      socketInstance.on('connect', () => {
        console.log('🔌 Connected to websocket');
        socketInstance.emit('join-room', user._id);
      });

      socketInstance.on('notification', (data) => {
        console.log('🔔 Notification received:', data);
        toast.custom((t) => (
          <div className={`${t.visible ? 'animate-enter' : 'animate-leave'} glass-card p-4 max-w-md w-full flex gap-4 border-l-4 border-primary`}>
            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
              <span className="text-xl">🛡️</span>
            </div>
            <div>
              <p className="text-xs font-mono text-white/40 uppercase mb-1">System Notification</p>
              <p className="text-sm font-medium">{data.message}</p>
            </div>
          </div>
        ), { duration: 5000 });
      });

      setSocket(socketInstance);

      return () => {
        socketInstance.disconnect();
      };
    }
  }, [isAuthenticated, user]);

  return socket;
};
