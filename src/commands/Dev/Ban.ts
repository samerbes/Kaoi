import MessageHandler from '../../Handlers/MessageHandler'
import BaseCommand from '../../lib/BaseCommand'
import WAClient from '../../lib/WAClient'
import { ISimplifiedMessage } from '../../typings'

export default class Command extends BaseCommand {
    constructor(client: WAClient, handler: MessageHandler) {
        super(client, handler, {
            command: 'ban',
            description: 'يمنع شخص من استعمال البوت',
            category: 'dev',
            usage: `${client.config.prefix}ban [@tag]`
        })
    }

    run = async (M: ISimplifiedMessage): Promise<void> => {
        if (!this.client.config.mods?.includes(M.sender.jid)) return void M.reply('❌ الامر مسموح فقط للاونرز')
        const immortals = [M.sender, this.client.user.jid]
        if (M.quoted?.sender) M.mentioned.push(M.quoted.sender)
        if (!M.mentioned.length || !M.mentioned[0]) return void M.reply('منشن الي تبيه ينمنع')
        let text = '*STATE*\n\n'
        for (const user of M.mentioned) {
            if (immortals.includes(user)) continue
            const data = await this.client.getUser(user)
            const info = this.client.getContact(user)
            const username = info.notify || info.vname || info.name || user.split('@')[0]
            if (data?.ban) {
                text += `🟨 ${username}: اصلا مبند\n`
                continue
            }
            await this.client.banUser(user)
            text += `🟥 ${username}: تم التبنيد\n`
        }
        M.reply(text)
    }
}
