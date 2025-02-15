const TelegramBot = require('node-telegram-bot-api');

const token = '7242814639:AAEF-o5EP-IQe7IiWUpVC42fUoh0LBggHmM';
const bot = new TelegramBot(token, {polling:true});

let Blacklist = new Set();

let Data = new Map();
let TimeData;

const i = 7339807316;

let userid;
let username;

let Spamid;
let SpamData = 0;

let TimeMessage1;
let TimeMessage2;

function SaveData(userId, data) {
    Data.set(userId, data);
}

function GetData(userId) {
    return Data.get(userId);
}

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

    TimeData = GetData(userid);
        
    if (TimeData === 'Dialog: true') {
        bot.sendMessage(userid, '<b>Ошибка. Запрос уже отправлен.</b>', {parse_mode:'HTML'});
        return;
    }
    else {
        SaveData(userid, 'Dialog: true');
    }

    if (msg.chat.id === i) {
        bot.sendMessage(i, '<b>Ошибка. Нельзя написать самому себе.</b>', {parse_mode:'HTML'});
        return;
    }

    bot.sendMessage(userid, '<i><b>Запрос отправлен</b>, ожидайте...</i>', {parse_mode:'HTML'})
        .then((sentMessage) => TimeMessage2 = sentMessage.message_id);

    bot.sendMessage(i, `Пользователь @${username} хочет начать с вами чат.`, button)
        .then((sentMessage) => TimeMessage1 = sentMessage.message_id);

    bot.on('callback_query', (query) => {
        if (query.data === 'true') {
            bot.deleteMessage(i, TimeMessage1);
            bot.deleteMessage(userid, TimeMessage2);

            bot.sendMessage(i, `<b>НАЧАЛО ЧАТА С @${username}.</b>`, {parse_mode:'HTML'})
                .then((sentMessage) => bot.pinChatMessage(i, sentMessage.message_id));
            
            bot.sendMessage(userid, `Начало чата с пользователем.`)
                .then((sentMessage) => bot.pinChatMessage(userid, sentMessage.message_id));

            bot.on('message', (msg) => {
                if (msg.chat.id === i) {
                    bot.sendMessage(userid, msg.text);
                }
                else {
                    bot.sendMessage(i, msg.text);
                }
            });

            return;
        }
        else {
            bot.deleteMessage(i, TimeMessage1);
            bot.deleteMessage(userid, TimeMessage2);

            bot.sendMessage(i, `Запрос на создание чата c @${username} отклонён.`);
            bot.sendMessage(userid, `Запрос на создание чата с пользователем отклонён.`);
            return;
        }
    });
});

bot.on('message', (msg) => {
    SpamData++;
    Spamid = msg.chat.id;
});

setInterval(() => {
    if (SpamData >= 10) {
        bot.sendMessage(Spamid, '<i><b>Вы заблокированы на 10 часов.</b> Пожалуйста, не нарушайте больше правила.</i>', {parse_mode:'HTML'});
        Blacklist.has(Spamid);
        
        console.log(Blacklist);

        setTimeout(() =>{
            Blacklist.delete(Spamid);
            bot.sendMessage(Spamid, '<i><b>Вы разблокированы.</b> Пожалуйста, не нарушайте больше правила.</i>', {parse_mode:'HTML'});
        }, 21600000);

        SpamData = 0;
    }
}, 10000);

console.log('> Successful start');