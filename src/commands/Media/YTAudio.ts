import { MessageType } from '@adiwajshing/baileys'
import MessageHandler from '../../Handlers/MessageHandler'
import BaseCommand from '../../lib/BaseCommand'
import WAClient from '../../lib/WAClient'
import YT from '../../lib/YT'
import { ISimplifiedMessage } from '../../typings'

export default class Command extends BaseCommand {
    constructor(client: WAClient, handler: MessageHandler) {
        super(client, handler, {
            command: 'yta',
            description: 'يحمل فديو من اليوتيوب ويرسله صوتية',
            category: 'media',
            aliases: ['ytaudio'],
            usage: `${client.config.prefix}ytv [URL]`,
            baseXp: 20
        })
    }

    run = async (M: ISimplifiedMessage): Promise<void> => {
        if (!M.urls.length) return void M.reply('🔎 هات اسم الفديو/الرابط')
        const audio = new YT(M.urls[0], 'audio')
        if (!audio.validateURL()) return void M.reply(`⚓ هات اسم الفديو/الرابط`)
        M.reply('👾 ارسال....')
        M.reply(await audio.getBuffer(), MessageType.audio).catch((reason: Error) =>
            M.reply(`❌ an error occupered, Reason: ${reason}`)
        )
    }
}
