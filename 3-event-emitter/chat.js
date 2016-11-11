const EventEmitter = require('events');

class ChatApp extends EventEmitter {
    /**
     * @param {String} title
     */
    constructor(title) {
        super();

        this.title = title;

        // Посылать каждую секунду сообщение
        setInterval(() => {
            this.emit('message', `${this.title}: ping-pong`);
        }, 1000);
    }

    close(message) {
        this.emit('close', message);

        // Просто чтобы добавить смысла, при закрытии удаляем все обработчики
        this.removeAllListeners();

        return this;
    }
}

exports.ChatApp = ChatApp;
