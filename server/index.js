const http = require('http');
const express = require('express');
const cors = require('cors');
const socketio = require('socket.io');

const users = [{}];

const app = express();
const router = require('./router');
const PORT = 5000;

app.use(cors());
const server = http.createServer(app);

const io = socketio(server);

io.on('connection', (socket) => {
    console.log("New connection");

    socket.on("joined", ({ user }) => {
        users[socket.id] = user;
        console.log(`${user} has joined`)
        socket.broadcast.emit(`userJoined`, { user: "Admin", message: `${users[socket.id]}has joined` });//gives message to rest people other than himself
        socket.emit('welcome', { user: "Admin", message: `welcome to the chat,  ${users[socket.id]}` });
    })

    socket.on('message', ({ message, id }) => {
        io.emit('sendMessage', { user: users[id], message, id });
    })
    socket.on('disconnect', () => {
        socket.broadcast.emit('leave', { user: "Admin", message: `${users[socket.id]} has left` })
        console.log(`${users[socket.id]} has Left`)
    })
})

app.use(router);



server.listen(PORT, () => {
    console.log(`Server has started on port ${PORT}`);
})