const TelegramAPI = require('node-telegram-bot-api')
const {gameOptions, agineOptions} = require('./options')

const token = '6555942061:AAHzpxiUdDu61YkGykJ1YogXIegAWKTfIZ0'

const bot = new TelegramAPI(token, {polling: true})

bot.setMyCommands([
    {command: `/start`, description: "Начальное приветсвтиве"},
    {command: `/info`, description: "Узнай свой юзер"},
    {command: `/game`, description: "Игра отгодай число"},
])

const chats = {}

const startGame = async (chatID) => {
    await bot.sendMessage(chatID, 'Я загадаю число от 1 до 9 попробуй отгадать')
    const randomNumber = Math.floor(Math.random() * 10)
    chats[chatID] = randomNumber
    await bot.sendMessage(chatID, 'Отгадывй', gameOptions)
}

const start = () => {

    bot.on('message', async msg => {
        const text = msg.text
        const chatID = msg.chat.id
    
        if(text === '/start'){
            await bot.sendSticker(chatID, 'https://cdn.dribbble.com/users/2185491/screenshots/4764138/51.png')
            return await bot.sendMessage(chatID, 'Добро пожаловать!')
        }
    
        if(text === '/info'){
            return await bot.sendMessage(chatID, `Тебя зовут ${msg.chat.username}`)
        }

        if(text === '/game'){
            return startGame(chatID)
        }

        return await bot.sendMessage(chatID, "Я тебя не понмаю")
        
    })
    
    bot.on('callback_query', async msg => {
        const data = msg.data

        const chatID = msg.message.chat.id

        if(data === `/agine`){
            return startGame(chatID)
        }

        if(data == chats[chatID]){
            return await bot.sendMessage(chatID, `Молодец ты угадал!`, agineOptions )
        }
        else{
            return await bot.sendMessage(chatID, `Не угадал, бот загадал ${chats[chatID]}`, agineOptions )
        }

    })

}

start()