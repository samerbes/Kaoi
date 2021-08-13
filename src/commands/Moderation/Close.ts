import { GroupSettingChange } from '@adiwajshing/baileys'
import MessageHandler from '../../Handlers/MessageHandler'
import BaseCommand from '../../lib/BaseCommand'
import WAClient from '../../lib/WAClient'
import { ISimplifiedMessage } from '../../typings'

export default class Command extends BaseCommand {
    constructor(client: WAClient, handler: MessageHandler) {
        super(client, handler, {
            adminOnly: true,
            command: 'close',
            description: 'يقفل القروب',
            category: 'moderation',
            usage: `${client.config.prefix}close`
        })
    }

    run = async (M: ISimplifiedMessage): Promise<void> => {
        if (!M.groupMetadata?.admins?.includes(this.client.user.jid))
            return void M.reply("كيف اسكر القروب وما عطيتوني اشراف؟")
        if (M.groupMetadata.announce === "true")
          return void M.reply("القروب اصلا مسكر يا ذكي زمانك")
        this.client.groupSettingChange(M.groupMetadata.id, GroupSettingChange.messageSend, true)
        return
    }
}
