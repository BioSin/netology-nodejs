const { ChatApp } = require('./chat');

let webinarChat =  new ChatApp('webinar');
let facebookChat = new ChatApp('=========facebook');
let vkChat =       new ChatApp('---------vk');

let chatOnMessage = (message) => {
    console.log(message);
};

const preparingForMessage = (message) => {
    console.log('Готовлюсь к ответу', message);
};

webinarChat
    .on('message', preparingForMessage)
    .on('message', chatOnMessage);

facebookChat.on('message', chatOnMessage);

vkChat
    .setMaxListeners(2)
    .on('message', preparingForMessage)
    .on('message', chatOnMessage)
    .on('close', console.log)
    .close('Чат ВКонтакте закрылся');


// Закрыть вконтакте
setTimeout( ()=> {
    console.log('Закрываю вконтакте...');
    vkChat.removeListener('message', chatOnMessage);
}, 10000 );


// Закрыть фейсбук
setTimeout( ()=> {
    console.log('Закрываю фейсбук, все внимание — вебинару!');
    facebookChat.removeListener('message', chatOnMessage);
}, 15000 );

setTimeout(() => {
    webinarChat.removeListener('message', chatOnMessage);
}, 30000);