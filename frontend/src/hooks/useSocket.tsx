import { useEffect, useState } from 'react';
import { io, Socket } from 'socket.io-client';
import { useAuthStore } from '../store/authStore';
import toast from 'react-hot-toast';
import HolographicToast from '../components/HolographicToast';

const SOCKET_URL = (import.meta as any).env.VITE_API_URL?.replace('/api', '') || 'http://localhost:5000';

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
        socketInstance.emit('join-room', user._id || user.id);
      });

      socketInstance.on('notification', (data) => {
        console.log('🔔 Notification received:', data);
        toast.custom((t) => <HolographicToast t={t} data={data} />, { 
          duration: 6000,
          position: 'top-right'
        });
      });

      setSocket(socketInstance);

      return () => {
        socketInstance.disconnect();
      };
    }
  }, [isAuthenticated, user]);

  return socket;
};
