import MessageHandler from '../../Handlers/MessageHandler'
import BaseCommand from '../../lib/BaseCommand'
import WAClient from '../../lib/WAClient'
import { ISimplifiedMessage } from '../../typings'

export default class Command extends BaseCommand {
    constructor(client: WAClient, handler: MessageHandler) {
        super(client, handler, {
            adminOnly: true,
            command: 'promote',
            description: 'يعطي شخص اشراف',
            category: 'moderation',
            usage: `${client.config.prefix}promote [@mention | tag]`,
            baseXp: 10
        })
    }

    run = async (M: ISimplifiedMessage): Promise<void> => {
        if (!M.groupMetadata?.admins?.includes(this.client.user.jid))
            return void M.reply(`❌ مقدر ${this.config.command} aلان ما معي اشراف`)
        if (M.quoted?.sender) M.mentioned.push(M.quoted.sender)
        if (!M.mentioned.length) return void M.reply(`منشن الي تبي يصير مشرف ${this.config.command}`)
        M.mentioned.forEach(async (user) => {
            const usr = this.client.contacts[user]
            const username = usr.notify || usr.vname || usr.name || user.split('@')[0]
            if (M.groupMetadata?.admins?.includes(user)) M.reply(`❌ سكب *${username}* لانه اصلا مشرف`)
            else {
                await this.client.groupMakeAdmin(M.from, [user])
                M.reply(`👑 تم إعطاء الاشراف *${username}*`)
            }
        })
    }
}
