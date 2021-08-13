import { MessageType } from '@adiwajshing/baileys'
import MessageHandler from '../../Handlers/MessageHandler'
import BaseCommand from '../../lib/BaseCommand'
import WAClient from '../../lib/WAClient'
import { IParsedArgs, ISimplifiedMessage } from '../../typings'
import yts from 'yt-search'
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
// import Lyrics from 'lyrics-monarch-api'
import { getSong, getLyrics } from 'ultra-lyrics'


export default class Command extends BaseCommand {
    constructor(client: WAClient, handler: MessageHandler) {
        super(client, handler, {
            command: 'lyrics',
            description: 'يعطيك كلمات الاغنية',
            category: 'media',
            aliases: ['ly'],
            usage: `${client.config.prefix}yts [term]`,
            dm: true,
            baseXp: 20
        })
    }
    run = async (M: ISimplifiedMessage, { joined }: IParsedArgs): Promise<void> => {
        if (!joined) return void M.reply('🔎 اكتب اسم الاغنية')
        const term = joined.trim()       
        // get song from yts
        const { videos } = await yts(term + ' lyrics song')
        if (!videos || videos.length <= 0) return void M.reply(`⚓ مافي فديو/اغنية كذا *${term}*`)

        const video = videos[0]
        const song = await getSong(term)
        if (song.error || !song.data) return void M.reply(`❌ مافي فديو/اغنية كذا: *${term}*`)
        const { error, data } = await getLyrics(song.data)
        if (error || !data) return void M.reply(`❌ Could Not find any Matching Lyrics: *${song.data.title}*`)
        this.client.sendMessage(M.from, `*Lyrics of: ${term}*\n\n ${data}`, MessageType.text, {
            contextInfo: {
                externalAdReply: {
                    title: `${song.data.artist.name} - ${song.data.title}`,
                    body: video.url,
                    mediaType: 2,
                    thumbnailUrl: video.thumbnail,
                    mediaUrl: video.url
                },
                mentionedJid: [M.sender.jid]
            }
        }).catch((reason: Error) => M.reply(`❌ an error occupered, Reason: ${reason}`))
    }
}
