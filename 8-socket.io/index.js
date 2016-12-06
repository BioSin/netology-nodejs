const PORT = process.env.PORT || 3000;

const path = require('path');
const express = require('express');
const app = express();
const server = require('http').Server(app);

const io = require('socket.io')(server);

server.listen(PORT);

app.use('/static', express.static(path.join(__dirname, 'public')));

const TYPE_LOGIN = 'login failed';
const TYPE_LOGIN_FAILED = 'login failed';
const TYPE_LOGIN_SUCCESS = 'login success';

const TYPE_LOGOUT = 'logout';

const TYPE_MESSAGE = 'message';

const TYPE_USER_JOINED = 'user joined';
const TYPE_USER_LEAVED = 'user leaved';

class ChatApp {
    constructor(ioInstance) {
        this.io = ioInstance;
        this.userCount = 0;
        this.users = new Set();
    }

    login(socket, { username, room }) {
        if(socket.user) {
            return socket.emit(TYPE_LOGIN_FAILED, {message: 'You are already logged in!'})
        }

        if(this.users.has(username)) {
            return socket.emit(TYPE_LOGIN_FAILED, {message: 'Username already taken'})
        }

        if (!User.validate({ username })) {
            return socket.emit(TYPE_LOGIN_FAILED, {message: 'Invalid username'})
        }

        socket.user = new User({ username });
        this.users.add(username);
        socket.join(room);
        socket.to(room).emit(TYPE_USER_JOINED, { username, room });

        this.userCount++;

        return socket.emit(TYPE_LOGIN_SUCCESS, { username, room });
    }

    logout(socket) {
        this.userCount--;
        Object.keys(socket.rooms).forEach(room => {
            socket.to(room).emit(TYPE_USER_LEAVED, { username: socket.user.username });
        })
    }

    disconnect(socket) {
        if(socket.user){
            this.users.delete(socket.user.username);
        }
    }

    message(socket, { room, message }) {
        this.io.to(room).emit(TYPE_MESSAGE, { username: socket.user.valueOf(), message });
    }
}
const chat = new ChatApp(io);

class User {
    constructor({username}) {
        this.username = username;
    }

    valueOf() {
        return this.username;
    }

    static validate({username}) {
        return (typeof username !== 'undefined' && username.length > 1);
    }
}

io.on('connection', function (socket) {
    socket.on('login', (data) => chat.login(socket, data));
    socket.on('message', (data) => chat.message(socket, data));
    socket.on('disconnecting', (data) => chat.logout(socket));
    socket.on('disconnect', (data) => chat.disconnect(socket));
});
