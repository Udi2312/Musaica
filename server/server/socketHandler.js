// socketHandler.js
let onlineUsers = [];

const setupSocket = (io) => {
  io.use((socket, next) => {
    const token = socket.handshake.auth.token;
    if (!token) return next(new Error('Authentication error'));
    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
      if (err) return next(new Error('Invalid token'));
      socket.user = decoded;
      next();
    });
  });

  io.on('connection', (socket) => {
    console.log(`User connected: ${socket.user.username}`);

    // Add to online users
    onlineUsers.push({
      userId: socket.user.id,
      username: socket.user.username,
      socketId: socket.id
    });
    io.emit('online-users', onlineUsers);

    // Direct messaging
    socket.on('direct-message', ({ receiverUsername, message }) => {
      const receiver = onlineUsers.find(u => u.username === receiverUsername);
      if (receiver) {
        io.to(receiver.socketId).emit('new-message', {
          sender: socket.user.username,
          message
        });
      }
    });

    // Disconnect handler
    socket.on('disconnect', () => {
      onlineUsers = onlineUsers.filter(u => u.socketId !== socket.id);
      io.emit('online-users', onlineUsers);
      console.log(`User disconnected: ${socket.user.username}`);
    });
  });
};

module.exports = { setupSocket };