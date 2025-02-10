const TelegramBot = require('node-telegram-bot-api');

const token = '7242814639:AAEF-o5EP-IQe7IiWUpVC42fUoh0LBggHmM';
const bot = new TelegramBot(token, {polling:true});

// start
bot.onText(/\/start/, (msg) => {
    bot.sendMessage(msg.chat.id, `Привет, ${msg.from.first_name}! Я твой бот. Используй /help для списка команд.`);
});

// help
bot.onText(/\/help/, (msg) => {
    const helpText = `Доступные команды:\n/start - Запустить бота\n/help - Показать справку\n/echo <текст> - Повторить ваш текст`;
    bot.sendMessage(msg.chat.id, helpText);
});

// echo
bot.onText(/\/echo (.+)/, (msg, match) => {
    const resp = match[1];
    bot.sendMessage(msg.chat.id, resp);
});

bot.on('message', (msg) => {
    const chatId = msg.chat.id;
    if (!msg.text.startsWith('/')) {
        bot.sendMessage(chatId, `Я не понимаю, попробуйте /help.`);
    }
});

console.log('Бот запущен...');