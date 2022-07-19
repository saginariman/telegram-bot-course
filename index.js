const TelegramApi = require('node-telegram-bot-api') 
const {gameOptions, againOptions} = require('./options')
const sequelize = require('./db');
const UserModel = require('./models');

const token = '5561020410:AAFrVZsKoFEb-Nx6BYDjVP7NtTkcaXe4ReU';

const bot = new TelegramApi(token, {polling: true})

const chats = {};


const startGame = async (chatId) => {
    await bot.sendMessage(chatId, `Сейчас я загадаю цифру от 0 до 9, а ты должен ее угадать!`)
    const randomNumber = Math.floor(Math.random() * 10)
    chats[chatId] = randomNumber;
    await bot.sendMessage(chatId, 'Отгадывай', gameOptions)
}
const start = async () => {  
    try {
        await sequelize.authenticate()
        await sequelize.sync();
    } catch (e) {
        console.log('Подключение к бд сломалось '+e);
    }
    bot.setMyCommands([
        {command: '/start', description: 'Начать'},
        {command: '/info', description: 'Информация'},
        {command: '/game', description: 'Играть'}
    ])
    
    bot.on('message', async msg => {
        const text = msg.text;
        const chatId = msg.chat.id;

        try {
            if(text === '/start'){
                // await UserModel.create({chatId})
                await UserModel.findOrCreate({
                    where: {
                        chatId: toString(chatId)
                    }, 
                    defaults: {
                        chatId: toString(chatId),
                        right: 0,
                        wrong: 0
                    }
                })
                await bot.sendSticker(chatId, 'https://chpic.su/_data/stickers/t/terenty_vk/terenty_vk_026.webp')
                return bot.sendMessage(chatId, `Добро пожаловать в телеграм бот Наримана :)`)
            }
            if(text === '/info'){
                const user = await UserModel.findOne({chatId})
                return bot.sendMessage(chatId, `Тебя зовут ${msg.from.first_name}, ответы в игре: правильные - ${user.right}, неправильные - ${user.wrong}  :)`)
            }
            if(text === '/game'){
                return startGame(chatId)
            }
            return bot.sendMessage(chatId, `Я тебя не понимаю, попробуй еще раз!`)
        } catch (e) {
            return bot.sendMessage(chatId, 'Произошла какая-та ошибочка!' + e);
        }
    
    })

    bot.on('callback_query', async msg => {
        const data = msg.data;
        const chatId = msg.message.chat.id;
        if(data === '/again'){
            return startGame(chatId)
        }
        const user = await UserModel.findOne({chatId})

        if(data == chats[chatId]){
            user.right += 1;
            await bot.sendMessage(chatId, `Поздравляю, ты отгадал цифру ${chats[chatId]}`, againOptions)
        }else{
            user.wrong += 1;
            await bot.sendMessage(chatId, `Неправильно, цифра была: ${chats[chatId]}`, againOptions)
        }
        await user.save();
    })
}

start()