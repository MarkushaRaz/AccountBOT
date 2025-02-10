const TelegramBot = require('node-telegram-bot-api');

const token = '7242814639:AAEF-o5EP-IQe7IiWUpVC42fUoh0LBggHmM';
const bot = new TelegramBot(token, {polling:true});

const i = 7339807316;
let userid;
let username;

let TimeMessage1;
let TimeMessage2;

bot.onText(/\/start/, (msg) => {
    bot.sendMessage(msg.chat.id, `Привет, ${msg.from.first_name} ${msg.from.last_name} (@${msg.from.username}).\nЧтобы начать чат со мной, отправь команду /dialog.\n`);
});

bot.onText(/\/dialog/, (msg) => {
    const button = {
        reply_markup: {
            inline_keyboard: [
                [{text: '✅ Начать', callback_data: 'true' }],
                [{text: '❌ Отклонить', callback_data: 'false' }]
            ]
        }
    };

    userid = msg.chat.id;
    username = msg.from.username;

    if (msg.chat.id === i) {
        bot.sendMessage(i, '<b>Ошибка</b>', {parse_mode:'HTML'});
        return;
    }

    bot.sendMessage(userid, '<i><b>Запрос отправлен</b>, ожидайте...</i>', {parse_mode:'HTML'})
        .then((sentMessage) => TimeMessage2 = sentMessage.message_id);

    bot.sendMessage(i, `Пользователь @${username} хочет начать с вами чат.`, button)
        .then((sentMessage) => TimeMessage1 = sentMessage.message_id);

    bot.on('callback_query', (query) => {
        if (query.data === 'true') {
            bot.sendMessage(i, `Начало чата с @${username}.`);
            bot.sendMessage(userid, `Начало чата с пользователем.`);

            bot.deleteMessage(i, TimeMessage1);
            bot.deleteMessage(userid, TimeMessage2);
        }
        else {
            bot.sendMessage(i, `Запрос на создание чата c @${username} отклонён.`);
            bot.sendMessage(userid, `Запрос на создание чата с пользователем отклонён.`);

            bot.deleteMessage(i, TimeMessage1);
            bot.deleteMessage(userid, TimeMessage2);
        }
    });

    bot.on('message', (msg) => {
        if (msg.chat.id === i) {
            bot.sendMessage(userid, msg.text);
        }
        else {
            bot.sendMessage(i, msg.text);
        }
    });
});

bot.on('message', (msg) => {
    if (!msg.text.startsWith('/')) {
        bot.sendMessage(userid, '<b>Ошибка. Неизвестная команда</b>', {parse_mode:'HTML'});
    }
});

console.log('> Successful start');

// Test Function

// bot.onText(/\/request/)

// bot.onText(/\/echo (.+)/, (msg, match) => {
//     const resp = match[1];
//     bot.sendMessage(msg.chat.id, resp);
// });