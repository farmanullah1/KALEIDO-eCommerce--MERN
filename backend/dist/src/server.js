import { createServer } from 'http';
import { Server } from 'socket.io';
import app from './app.js';
import { connectDB } from './config/db.js';
import { env } from './config/env.js';
const startServer = async () => {
    await connectDB();
    const PORT = env.PORT || 5000;
    const httpServer = createServer(app);
    const io = new Server(httpServer, {
        cors: {
            origin: env.CLIENT_URL || 'http://localhost:5173',
            credentials: true
        }
    });
    // Socket.io logic
    io.on('connection', (socket) => {
        console.log('🔌 New client connected:', socket.id);
        socket.on('join-room', (userId) => {
            socket.join(userId);
            console.log(`👤 User ${userId} joined their personal room`);
        });
        socket.on('disconnect', () => {
            console.log('🔌 Client disconnected');
        });
    });
    // Make io accessible in controllers
    app.set('io', io);
    httpServer.listen(PORT, () => {
        console.log(`🚀 Server running in ${env.NODE_ENV} mode on port ${PORT}`);
    });
};
startServer();
//# sourceMappingURL=server.js.map